/* eslint-disable */
import {Product} from "@prisma/client";
import { PrismaService } from '../../../database/prisma.service';

//the number of recommended products
const RECOMMENDED_PRODUCTS_LENGTH = 15;

//number of products considered for each parameter
const VISITED_PRODUCTS_LENGTH = 10;
const ORDERED_PRODUCTS_LENGTH = 10;
const SEARCH_PRODUCTS_LENGTH = 10;

//setting wights for scoring system
const RECENCY_WEIGHT = 0.2;
const SIMILARITY_WEIGHT = 0.2;
const RATING_COUNT_WEIGHT = 0.1
const SUBCATEGORY_WEIGHT = 0.25;
const SEARCH_TERM_WEIGHT = 0.25;

// Main function to get user recommendations
export async function getUserRecommendations(userId: string, prisma: PrismaService): Promise<Product[]> {
    const { visitedProducts, orders, searchTerms } = await fetchUserHistory(userId, prisma);

    if (!visitedProducts.length && !orders.length) {
        return getTopRatedProducts(RECOMMENDED_PRODUCTS_LENGTH, prisma);
    }

    const interactedProductIds = await combineInteractedProductIds(visitedProducts, orders, prisma);
    const avgPrice = await calculateAveragePrice(interactedProductIds, prisma);
    const mostFrequentCategories = await getMostFrequentCategories(interactedProductIds, prisma);

    const primaryProducts = await fetchPrimaryProducts(mostFrequentCategories, interactedProductIds, avgPrice, prisma);
    const searchBasedProducts = await fetchSearchBasedProducts(searchTerms, interactedProductIds, prisma);
    let scoredProducts = await scoreAndSortProducts(primaryProducts, searchBasedProducts, interactedProductIds, avgPrice, mostFrequentCategories, searchTerms);

    // If scoredProducts length is less than the recommended length, add top-rated products with score 0
    if (scoredProducts.length < RECOMMENDED_PRODUCTS_LENGTH) {
        const additionalProducts = await getTopRatedProducts(RECOMMENDED_PRODUCTS_LENGTH - scoredProducts.length, prisma);

        const additionalProductsWithZeroScore = additionalProducts.map(product => ({ ...product, score: 0 }));

        scoredProducts = scoredProducts.concat(additionalProductsWithZeroScore);
    }

    return scoredProducts.slice(0, RECOMMENDED_PRODUCTS_LENGTH);
}

// Function to fetch user history
async function fetchUserHistory(userId: string, prisma: PrismaService) {
    const [viewedProducts, orders, searchTerms] = await Promise.all([
        prisma.visitedProduct.findMany({
            where: { userId },
            select: { productId: true, createdAt: true },
            orderBy: { createdAt: 'desc' },
            take: VISITED_PRODUCTS_LENGTH,
        }),
        prisma.order.findMany({
            where: { userId },
            select: { id: true },
            orderBy: { createdAt: 'desc' },
            take: ORDERED_PRODUCTS_LENGTH,
        }),
        prisma.searchTerm.findMany({
            where: { userId },
            select: { term: true },
            orderBy: { createdAt: 'desc' },
            take: SEARCH_PRODUCTS_LENGTH
        }),
    ]);

    return { visitedProducts: viewedProducts, orders, searchTerms };
}

// Function to combine interacted product IDs
async function combineInteractedProductIds(visitedProducts, orders, prisma: PrismaService): Promise<string[]> {
    const visitedProductsIds = visitedProducts.map(item => item.productId);
    const ordersIds = orders.map(order => order.id);

    const orderedProducts = ordersIds.length
        ? await prisma.orderItem.findMany({
            where: { orderId: { in: ordersIds } },
            select: { productId: true },
            orderBy: { createdAt: 'desc' },
            take: VISITED_PRODUCTS_LENGTH + ORDERED_PRODUCTS_LENGTH,
        })
        : [];

    const orderedProductsIds = orderedProducts.map(item => item.productId);
    return [...new Set([...visitedProductsIds, ...orderedProductsIds])];
}

// Function to calculate the average price of interacted products
async function calculateAveragePrice(interactedProductsIds, prisma: PrismaService) {
    const orderedProducts = await prisma.orderItem.findMany({
        where: { productId: { in: interactedProductsIds } },
        select: { price: true },
    });

    return orderedProducts.reduce((sum, { price }) => sum + price, 0) / (orderedProducts.length || 1);
}

// Function to get the most frequent categories based on interacted products
async function getMostFrequentCategories(interactedProductIds, prisma) {
    const interactedProductDetails = await prisma.product.findMany({
        where: { id: { in: interactedProductIds } },
        include: { subCategory: true, brand: true, brandCategory: true },
    });

    const categoryCountMap = new Map();
    interactedProductDetails.forEach(({ subCategory }) => {
        categoryCountMap.set(subCategory.id, (categoryCountMap.get(subCategory.id) || 0) + 1);
    });

    return [...categoryCountMap.entries()]
        .sort((a, b) => b[1] - a[1]) // Sort by frequency
        .slice(0, 3) // Choose top 3 categories
        .map(([id]) => id);
}

// Function to fetch primary products
async function fetchPrimaryProducts(mostFrequentCategories, interactedProductIds, avgPrice, prisma) {
    return await prisma.product.findMany({
        where: {
            subCategoryId: { in: mostFrequentCategories },
            id: { notIn: interactedProductIds },
            price: { gte: avgPrice * 0.7, lte: avgPrice * 1.3 },
        },
        include: {
            subCategory: true,
            brand: true,
            brandCategory: true},
        orderBy: { ratingValue: 'desc' },
        take: 50,
    });
}

// Function to fetch products based on search terms
async function fetchSearchBasedProducts(searchTerms, interactedProductIds, prisma) {
    return await prisma.product.findMany({
        where: {
            OR: searchTerms.map(({ term }) => ({ name: { contains: term, mode: 'insensitive' } })),
            id: { notIn: interactedProductIds },
        },
        include: {
            subCategory: true,
            brand: true,
            brandCategory: true },
        take: SEARCH_PRODUCTS_LENGTH,
    });
}

// Function to score and sort products
async function scoreAndSortProducts(primaryProducts, searchBasedProducts, interactedProductIds, avgPrice, mostFrequentCategories, searchTerms) {
    const uniqueProducts = [
        ...new Map(
            [...primaryProducts, ...searchBasedProducts].map(product => [product.id, product]),
        ).values(),
    ];

    let scoredProducts = await Promise.all(
        uniqueProducts.map(async product => ({
            ...product,
            score: calculateProductFinalScore(product, interactedProductIds, avgPrice, mostFrequentCategories, searchTerms),
        })),
    );

    return scoredProducts.sort((a, b) => b.score - a.score);
}

function calculateProductFinalScore(
    product: Product,
    interactedProducts: { productId: string; createdAt: Date }[],
    avgPrice: number,
    mostFrequentCategories: string[],
    searchTerms: { term: string }[],
): number {

    const avgInteractedProduct = {
        price: avgPrice,
        ratingValue: 5,
    };

    // Calculate cosine similarity
    const cosineSimilarity = calculateCosineSimilarity(product, avgInteractedProduct);

    // Calculate recency score based on last interaction time
    const mostRecentView = interactedProducts.find(vp => vp.productId === product.id)?.createdAt;
    const recencyScore = mostRecentView
        ? Math.max(0, 1 - (Date.now() - new Date(mostRecentView).getTime()) / (1000 * 60 * 60 * 24 * 30))
        : 0;

    // Determine if the product belongs to a frequently interacted subcategory
    const subCategoryScore = mostFrequentCategories.includes(product.subCategoryId) ? 1 : 0;

    // Check if the product name contains any of the user's search terms
    const searchTermMatch = searchTerms.some(({ term }) => product.name.toLowerCase().includes(term.toLowerCase()));
    const searchTermScore = searchTermMatch ? 1 : 0; // 1 if there's a match, 0 otherwise

    // Incorporate the searchTermScore in the final score calculation
    return (
        RECENCY_WEIGHT * recencyScore +
        SIMILARITY_WEIGHT * cosineSimilarity +
        RATING_COUNT_WEIGHT * product.ratingCount +
        SUBCATEGORY_WEIGHT * subCategoryScore +
        SEARCH_TERM_WEIGHT * searchTermScore
    );
}

function calculateCosineSimilarity(
    productA: Product,
    productB: { price: number; ratingValue: number },
): number {
    const featureVectorA = [
        productA.price || 0,
        productA.ratingValue || 0,
    ]

    const featureVectorB = [
        productB.price || 0,
        productB.ratingValue || 0,
    ]

    const dotProduct = featureVectorA.reduce((sum, a, index) => sum + a * featureVectorB[index], 0)

    const magnitudeA = Math.hypot(...featureVectorA)
    const magnitudeB = Math.hypot(...featureVectorB)

    return magnitudeA && magnitudeB ? dotProduct / (magnitudeA * magnitudeB) : 0
}

async function getTopRatedProducts(numberOfProducts: number, prisma: PrismaService) {
    let topRatedProducts = await prisma.product.findMany({
        orderBy: {ratingValue: 'desc'},
        include: {
            subCategory: true,
            brand: true,
            brandCategory: true,
        },
        take: numberOfProducts,
    })
    return topRatedProducts
}

#!/bin/bash

handle_error() {
    echo "Error on line $1"
    exit 1
}

trap 'handle_error $LINENO' ERR

echo "Pulling latest changes from git..."
cd ~/ggnet-market
git pull origin main

echo "Navigating to backend and installing dependencies..."
cd ~/ggnet-market/backend
npm ci

echo "Generating Prisma client..."
npx prisma db push --accept-data-loss

echo "Running/reloading backend with PM2..."
pm2 reload backend || pm2 start dist/main.js --name backend

echo "Navigating to frontend and installing dependencies..."
cd ~/ggnet-market/frontend
npm ci

echo "Building the frontend..."
npm run build

echo "Running/reloading frontend with PM2..."
pm2 reload frontend || pm2 start npm --name frontend -- start

echo "Saving PM2 process list..."
pm2 save

echo "Deployment completed successfully!"

/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: true,
	productionBrowserSourceMaps: true,
	images: {
		remotePatterns: [
			{
				protocol: 'https',
				hostname: '**'
			},
			{
				protocol: 'http',
				hostname: '**'
			}
		]
	},
	transpilePackages: ['lucide-react'],
	distDir: 'build'
}

export default nextConfig

import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
	// Modern compression
	compress: true,

	// Image configuration for external domains
	images: {
		remotePatterns: [
			{
				protocol: 'https',
				hostname: 'i.ytimg.com',
				port: '',
				pathname: '/**',
			},
			{
				protocol: 'https',
				hostname: 'img.youtube.com',
				port: '',
				pathname: '/**',
			},
		],
	},

	// Modern experimental features (2025)
	experimental: {
		// Modern package optimization
		optimizePackageImports: ['react-i18next', 'i18next'],
		// Modern CSS optimization
		optimizeCss: true,
	},

	// Modern headers with better caching
	async headers() {
		return [
			{
				source: '/locales/:path*',
				headers: [
					{
						key: 'Cache-Control',
						value: 'public, max-age=31536000, immutable',
					},
					{
						key: 'Content-Type',
						value: 'application/json',
					},
				],
			},
			{
				source: '/(.*)',
				headers: [
					{
						key: 'X-Content-Type-Options',
						value: 'nosniff',
					},
					{
						key: 'X-Frame-Options',
						value: 'DENY',
					},
					{
						key: 'X-XSS-Protection',
						value: '1; mode=block',
					},
				],
			},
		]
	},
}

export default nextConfig

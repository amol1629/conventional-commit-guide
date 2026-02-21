import { ErrorBoundary } from '@/components/ErrorBoundary'
// import { ModernTranslationProvider } from '@/components/providers/ModernTranslationProvider'
import ClientProviders from '@/components/providers/ClientProviders'
import { ModernTranslationProvider } from '@/components/providers/ModernTranslationProvider'
import { ThemeProvider } from '@/components/theme-provider'
import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Toaster } from 'react-hot-toast'
import './globals.css'

const geistSans = Geist({
	variable: '--font-geist-sans',
	subsets: ['latin'],
})

const geistMono = Geist_Mono({
	variable: '--font-geist-mono',
	subsets: ['latin'],
})

export const metadata: Metadata = {
	title: 'Git Conventional Commits Practice',
	description:
		'Master the art of writing meaningful commit messages with our comprehensive guide to conventional commits, Git workflows, and GitHub best practices. Learn from examples, practice with our tools, and improve your development workflow.',
	keywords: [
		'conventional commits',
		'git',
		'github',
		'commit messages',
		'version control',
		'development workflow',
		'best practices',
		'changelog',
		'git workflow',
		'commit guide',
		'git best practices',
		'commit message generator',
		'git tutorial',
		'version control best practices',
	],
	authors: [{ name: 'Amol Rathod', url: 'https://github.com/amolrathod' }],
	creator: 'Amol Rathod',
	applicationName: 'Git Conventional Commits Practice',
	category: 'Developer Tools',
	classification: 'Developer Tools',
	openGraph: {
		title: 'Git Conventional Commits Practice',
		description:
			'Master the art of writing meaningful commit messages with our comprehensive guide to conventional commits, Git workflows, and GitHub best practices.',
		type: 'website',
		locale: 'en_US',
		siteName: 'Git Conventional Commits Practice',
		url: 'https://git-commits-practice.vercel.app',
	},
	twitter: {
		card: 'summary_large_image',
		title: 'Git Conventional Commits Practice',
		description:
			'Master the art of writing meaningful commit messages with our comprehensive guide to conventional commits, Git workflows, and GitHub best practices.',
		creator: '@amoldev',
		site: '@amoldev',
	},
	robots: {
		index: true,
		follow: true,
		googleBot: {
			index: true,
			follow: true,
			'max-video-preview': -1,
			'max-image-preview': 'large',
			'max-snippet': -1,
		},
	},
	verification: {
		google: 'your-google-verification-code',
	},
}

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode
}>) {
	return (
		<html lang="en" suppressHydrationWarning className="light">
			<head>
				{/* Force light theme - prevent dark theme flash */}
				<script
					dangerouslySetInnerHTML={{
						__html: `
							(function() {
								try {
									document.documentElement.classList.remove('dark');
									document.documentElement.classList.add('light');
								} catch (e) {}
							})();
						`,
					}}
				/>
				{/* Preload only the most critical resources */}
				<link
					rel="preload"
					href="/locales/en/common.json"
					as="fetch"
					crossOrigin="anonymous"
				/>
			</head>
			<body
				className={`${geistSans.variable} ${geistMono.variable} antialiased`}
				suppressHydrationWarning
			>
				<ErrorBoundary>
					<ThemeProvider
						attribute="class"
						forcedTheme="light"
						enableSystem={false}
						disableTransitionOnChange
					>
						<ClientProviders>
							<ModernTranslationProvider>{children}</ModernTranslationProvider>
						</ClientProviders>
					</ThemeProvider>
					<Toaster
						position="top-right"
						reverseOrder={false}
						gutter={8}
						containerClassName=""
						containerStyle={{}}
						toastOptions={{
							duration: 4000,
							style: {
								background: 'hsl(var(--background))',
								color: 'hsl(var(--foreground))',
								border: '1px solid hsl(var(--border))',
								borderRadius: '8px',
								boxShadow:
									'0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
							},
							success: {
								style: {
									background: 'hsl(142, 76%, 36%)',
									color: 'white',
								},
								iconTheme: {
									primary: 'white',
									secondary: 'hsl(142, 76%, 36%)',
								},
							},
							error: {
								style: {
									background: 'hsl(0, 84%, 60%)',
									color: 'white',
								},
								iconTheme: {
									primary: 'white',
									secondary: 'hsl(0, 84%, 60%)',
								},
							},
						}}
					/>
				</ErrorBoundary>
			</body>
		</html>
	)
}

'use client'

import { ModernSidebar } from '@/components/navigation/ModernSidebar'

interface LayoutProps {
	children: React.ReactNode
}

const Layout = ({ children }: LayoutProps) => {
	return (
		<div className="flex h-screen">
			{/* Modern Sidebar */}
			<ModernSidebar />

			{/* Main content */}
			<main className="flex-1 overflow-auto">
				<div className="h-full">{children}</div>
			</main>
		</div>
	)
}

export default Layout

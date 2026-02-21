'use client'

interface AnimatedBackgroundProps {
	children: React.ReactNode
	className?: string
}

export default function AnimatedBackground({
	children,
	className = '',
}: AnimatedBackgroundProps) {
	return (
		<div className={`min-h-screen w-full relative ${className}`}>
			{/* Light Theme Background */}
			<div
				className="absolute inset-0 z-0 block"
				style={{
					backgroundColor: 'hsl(var(--background))',
				}}
			/>

			{/* Content with proper z-index */}
			<div className="relative z-10">{children}</div>
		</div>
	)
}

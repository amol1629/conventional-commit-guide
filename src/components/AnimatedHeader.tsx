interface AnimatedHeaderProps {
	badge?: string
	title: string
	description: string
	className?: string
}

export default function AnimatedHeader({
	badge,
	title,
	description,
	className = '',
}: AnimatedHeaderProps) {
	return (
		<div className={`mb-8 text-center ${className}`}>
			{badge && (
				<div className="inline-flex items-center gap-2 px-4 py-2 mb-4 text-sm font-medium text-indigo-700 bg-indigo-100 rounded-full animate-fade-in dark:text-indigo-300 dark:bg-indigo-900/30">
					<div className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse"></div>
					{badge}
				</div>
			)}
			<h1 className="mb-4 text-4xl font-bold leading-tight tracking-tight
	bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500
	bg-clip-text text-transparent
	drop-shadow-sm
	animate-slide-up">
				{title}
			</h1>
			<p className="max-w-3xl mx-auto text-lg leading-relaxed text-slate-600 dark:text-slate-400 animate-slide-up">
				{description}
			</p>
		</div>
	)
}

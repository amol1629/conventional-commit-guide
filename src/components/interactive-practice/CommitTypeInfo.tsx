import { CommitTypeInfo } from '@/data/practice-scenarios'
import { getFontAwesomeIcon } from '@/utils/fontawesome-mapping'

interface CommitTypeInfoProps {
	showCommitTypeInfo: boolean
	commitTypeInfo: CommitTypeInfo
}

export default function CommitTypeInfoComponent({
	showCommitTypeInfo,
	commitTypeInfo,
}: CommitTypeInfoProps) {
	if (!showCommitTypeInfo) return null

	return (
		<div className="p-6 mt-6 border-2 border-green-200 bg-green-50 dark:bg-green-900/20 rounded-xl dark:border-green-800 animate-slide-up">
			<div className="flex items-center gap-2 mb-4">
				{getFontAwesomeIcon('BookOpen', 'w-5 h-5 text-green-600')}
				<h4 className="text-lg font-semibold text-green-900 dark:text-green-100">
					{commitTypeInfo.title}
				</h4>
			</div>
			<p className="mb-4 text-green-800 dark:text-green-200">
				{commitTypeInfo.description}
			</p>
			<div className="mb-4">
				<h5 className="mb-2 font-semibold text-green-900 dark:text-green-100">
					Examples:
				</h5>
				<div className="space-y-1">
					{commitTypeInfo.examples.map((example, index) => (
						<code
							key={index}
							className="block p-2 text-sm bg-green-100 rounded dark:bg-green-900/30"
						>
							{example}
						</code>
					))}
				</div>
			</div>
			<div>
				<h5 className="mb-2 font-semibold text-green-900 dark:text-green-100">
					Best Practices:
				</h5>
				<ul className="space-y-1">
					{commitTypeInfo.bestPractices.map((practice, index) => (
						<li
							key={index}
							className="flex items-start gap-2 text-sm text-green-800 dark:text-green-200"
						>
							<span className="text-green-600">•</span>
							<span>{practice}</span>
						</li>
					))}
				</ul>
			</div>
		</div>
	)
}

'use client'

import { getFontAwesomeIcon } from '@/utils/fontawesome-mapping'
import { useState } from 'react'

export function WhatIsSection() {
	const [copied, setCopied] = useState(false)

	const copyToClipboard = async () => {
		const text = `<type>[optional scope]: <description>

[optional body]

[optional footer(s)]

feat(api): add user authentication endpoint

- Implement JWT token validation
- Add rate limiting middleware
- Update API documentation

BREAKING CHANGE: authentication now required
Closes #456`

		try {
			await navigator.clipboard.writeText(text)
			setCopied(true)
			setTimeout(() => setCopied(false), 2000)
		} catch (err) {
			console.error('Failed to copy text: ', err)
		}
	}

	return (
		<section
			className="px-4 py-20 bg-white sm:px-6 lg:px-8 xl:px-12 2xl:px-16 dark:bg-slate-900"
			aria-labelledby="whatis-title"
		>
			<div className="mx-auto max-w-7xl">
				<div className="mb-8 text-center sm:mb-12 lg:mb-16">
					<h2
						id="whatis-title"
						className="mb-4 text-2xl font-bold text-gray-900 sm:mb-6 sm:text-3xl md:text-4xl lg:text-5xl dark:text-white"
					>
						<span className="text-transparent bg-gradient-to-r from-blue-600 via-purple-600 to-emerald-600 dark:from-blue-400 dark:via-purple-400 dark:to-emerald-400 bg-clip-text">
							What is Conventional Commits?
						</span>
					</h2>
					<p className="max-w-4xl px-4 mx-auto text-base text-gray-600 sm:text-lg lg:text-xl dark:text-gray-200 dark:text-opacity-90">
						Conventional Commits is a specification for adding human and machine
						readable meaning to commit messages. It provides a simple set of
						rules for creating an explicit commit history, which makes it easier
						to write automated tools on top of.
					</p>
				</div>

				<div className="grid items-center gap-6 sm:gap-8 lg:gap-12 md:grid-cols-2">
					<div className="space-y-4 sm:space-y-6">
						<h3 className="text-xl font-bold text-gray-900 sm:text-2xl lg:text-3xl dark:text-white dark:bg-gradient-to-r dark:from-blue-400 dark:to-purple-400 dark:bg-clip-text dark:text-transparent">
							Industry Benefits
						</h3>
						<div className="space-y-3 text-gray-600 sm:space-y-4 dark:text-gray-200 dark:text-opacity-90">
							<p className="text-sm sm:text-base lg:text-lg">
								Conventional Commits have become the industry standard for
								modern software development. They provide a uniform structure
								that enables better automation, clearer communication, and
								improved project management across development teams.
							</p>
							<ul className="space-y-3">
								<li className="flex items-start">
									{getFontAwesomeIcon(
										'CheckCircle',
										'w-5 h-5 text-green-500 dark:text-green-400 mr-3 mt-1',
									)}
									<span>
										Automated semantic versioning and release management
									</span>
								</li>
								<li className="flex items-start">
									{getFontAwesomeIcon(
										'CheckCircle',
										'w-5 h-5 text-green-500 dark:text-green-400 mr-3 mt-1',
									)}
									<span>Enhanced CI/CD pipeline integration</span>
								</li>
								<li className="flex items-start">
									{getFontAwesomeIcon(
										'CheckCircle',
										'w-5 h-5 text-green-500 dark:text-green-400 mr-3 mt-1',
									)}
									<span>Improved code review and audit trails</span>
								</li>
								<li className="flex items-start">
									{getFontAwesomeIcon(
										'CheckCircle',
										'w-5 h-5 text-green-500 dark:text-green-400 mr-3 mt-1',
									)}
									<span>Better compliance with enterprise standards</span>
								</li>
							</ul>
						</div>
					</div>
					<div className="p-8 rounded-lg shadow-lg bg-gray-50 dark:bg-slate-800 dark:border dark:border-slate-700 dark:shadow-slate-900/20">
						<div className="flex items-center justify-between mb-4">
							<h4 className="text-xl font-semibold text-gray-900 dark:text-white dark:bg-gradient-to-r dark:from-blue-400 dark:to-purple-400 dark:bg-clip-text dark:text-transparent">
								Standard Format
							</h4>
							<button
								onClick={copyToClipboard}
								className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 transition-all duration-300 bg-white border border-gray-300 rounded-lg dark:text-gray-200 dark:bg-slate-700 dark:border-slate-600 hover:bg-gray-50 dark:hover:bg-slate-600 dark:hover:border-slate-500 dark:shadow-lg dark:shadow-slate-700/20 focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-400"
								aria-label={
									copied ? 'Code copied to clipboard' : 'Copy code to clipboard'
								}
								aria-describedby="code-example"
							>
								{copied ? (
									<>
										{getFontAwesomeIcon('Check', 'w-4 h-4 text-green-500')}
										<span>Copied!</span>
									</>
								) : (
									<>
										{getFontAwesomeIcon('Copy', 'w-4 h-4')}
										<span>Copy</span>
									</>
								)}
							</button>
						</div>
						<div
							id="code-example"
							className="p-4 font-mono text-sm text-green-400 bg-gray-900 rounded-lg shadow-inner dark:text-green-300 dark:bg-slate-900 dark:border dark:border-slate-700 dark:shadow-slate-900/50"
							role="region"
							aria-label="Conventional commit format example"
						>
							<code>
								&lt;type&gt;[optional scope]: &lt;description&gt;
								<br />
								<br />
								[optional body]
								<br />
								<br />
								[optional footer(s)]
								<br />
								<br />
								feat(api): add user authentication endpoint
								<br />
								<br />
								- Implement JWT token validation
								<br />
								- Add rate limiting middleware
								<br />
								- Update API documentation
								<br />
								<br />
								BREAKING CHANGE: authentication now required
								<br />
								Closes #456
							</code>
						</div>
					</div>
				</div>
			</div>
		</section>
	)
}

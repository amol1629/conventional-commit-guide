'use client'

import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from '@/components/ui/accordion'
import { COMMIT_GUIDE_CONTENT } from '@/content/commit-guide-content'

export function ExamplesSection() {
	const { examples } = COMMIT_GUIDE_CONTENT

	return (
		<Accordion type="single" collapsible className="w-full">
			<AccordionItem value="simple">
				<AccordionTrigger className="text-lg font-semibold">
					{examples.simple.title}
				</AccordionTrigger>
				<AccordionContent>
					<div className="space-y-4">
						<p className="mb-4 text-sm text-muted-foreground">
							{examples.simple.description}
						</p>
						<div className="grid gap-3">
							{examples.simple.examples.map((example, index) => (
								<div key={index} className="p-4 border rounded-lg bg-muted">
									<code className="font-mono text-sm">{example.message}</code>
									<p className="mt-1 text-xs text-muted-foreground">
										{example.description}
									</p>
								</div>
							))}
						</div>
					</div>
				</AccordionContent>
			</AccordionItem>

			<AccordionItem value="with-scope">
				<AccordionTrigger className="text-lg font-semibold">
					{examples.withScope.title}
				</AccordionTrigger>
				<AccordionContent>
					<div className="space-y-4">
						<p className="mb-4 text-sm text-muted-foreground">
							{examples.withScope.description}
						</p>
						<div className="grid gap-3">
							{examples.withScope.examples.map((example, index) => (
								<div key={index} className="p-4 border rounded-lg bg-muted">
									<code className="font-mono text-sm">{example.message}</code>
									<p className="mt-1 text-xs text-muted-foreground">
										{example.description}
									</p>
								</div>
							))}
						</div>
					</div>
				</AccordionContent>
			</AccordionItem>

			<AccordionItem value="breaking">
				<AccordionTrigger className="text-lg font-semibold">
					{examples.breaking.title}
				</AccordionTrigger>
				<AccordionContent>
					<div className="space-y-4">
						<p className="mb-4 text-sm text-muted-foreground">
							{examples.breaking.description}
						</p>
						<div className="grid gap-3">
							{examples.breaking.examples.map((example, index) => (
								<div
									key={index}
									className="p-4 border border-red-200 rounded-lg bg-red-50 dark:bg-red-900/20 dark:border-red-800"
								>
									<code className="font-mono text-sm text-red-700 whitespace-pre-wrap dark:text-red-300">
										{example.message}
									</code>
									<p className="mt-1 text-xs text-red-600 dark:text-red-400">
										{example.description}
									</p>
								</div>
							))}
						</div>
					</div>
				</AccordionContent>
			</AccordionItem>

			<AccordionItem value="detailed">
				<AccordionTrigger className="text-lg font-semibold">
					{examples.detailed.title}
				</AccordionTrigger>
				<AccordionContent>
					<div className="space-y-4">
						<p className="mb-4 text-sm text-muted-foreground">
							{examples.detailed.description}
						</p>
						<div className="grid gap-4">
							{examples.detailed.examples.map((example, index) => (
								<div key={index} className="p-4 border rounded-lg bg-muted">
									<code className="font-mono text-sm whitespace-pre-wrap">
										{example.message}
									</code>
									<p className="mt-2 text-xs text-muted-foreground">
										{example.description}
									</p>
								</div>
							))}
						</div>
					</div>
				</AccordionContent>
			</AccordionItem>

			<AccordionItem value="real-world">
				<AccordionTrigger className="text-lg font-semibold">
					{examples.realWorld.title}
				</AccordionTrigger>
				<AccordionContent>
					<div className="space-y-4">
						<p className="mb-4 text-sm text-muted-foreground">
							{examples.realWorld.description}
						</p>
						<div className="grid gap-4">
							{examples.realWorld.scenarios.map((scenario, index) => (
								<div
									key={index}
									className="p-4 border border-blue-200 rounded-lg bg-blue-50 dark:bg-blue-900/20 dark:border-blue-800"
								>
									<h4 className="mb-2 font-semibold text-blue-700 dark:text-blue-300">
										{scenario.title}
									</h4>
									<code className="font-mono text-sm whitespace-pre-wrap">
										{scenario.message}
									</code>
								</div>
							))}
						</div>
					</div>
				</AccordionContent>
			</AccordionItem>
		</Accordion>
	)
}

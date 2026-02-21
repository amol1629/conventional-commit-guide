export interface ValidationResult {
	isValid: boolean
	errors: string[]
	warnings: string[]
}

export const validateCommitMessage = (message: string): ValidationResult => {
	const errors: string[] = []
	const warnings: string[] = []

	// Check if message is empty
	if (!message.trim()) {
		errors.push('Commit message cannot be empty')
		return { isValid: false, errors, warnings }
	}

	// Check conventional commit format
	const conventionalCommitRegex =
		/^(feat|fix|docs|style|refactor|perf|test|build|ci|chore|revert)(\(.+\))?(!)?: .+/

	if (!conventionalCommitRegex.test(message)) {
		errors.push(
			'Commit message must follow conventional commit format: type(scope): description',
		)
		return { isValid: false, errors, warnings }
	}

	// Parse the subject line to get description
	const subjectLine = message.split('\n')[0]
	const match = subjectLine.match(/^[^:]+:\s*(.+)$/)
	const description = match ? match[1].trim() : ''

	// Check subject line length
	if (subjectLine.length > 50) {
		warnings.push(
			'Subject line should be under 50 characters for better readability',
		)
	}

	// Validate description exists and is not empty
	if (!description || description.length === 0) {
		errors.push('Description is required and cannot be empty')
		return { isValid: false, errors, warnings }
	}

	// Check description starts with lowercase (conventional commit standard)
	if (description[0] === description[0].toUpperCase()) {
		errors.push('Description should start with a lowercase letter (conventional commit standard)')
	}

	// Check for period at end of subject line
	if (subjectLine.endsWith('.')) {
		errors.push('Subject line should not end with a period')
	}

	// Enhanced imperative mood checking
	if (description) {
		const firstWord = description.trim().split(' ')[0].toLowerCase()

		// Common past tense endings that should be avoided
		const pastTenseEndings = ['ed', 'ied', 'd']
		const pastTenseWords = [
			'added', 'fixed', 'updated', 'changed', 'removed', 'deleted',
			'created', 'modified', 'improved', 'refactored', 'started',
			'stopped', 'completed', 'finished', 'implemented', 'resolved'
		]

		// Check if first word is in past tense
		if (pastTenseWords.includes(firstWord)) {
			const imperativeForm = firstWord
				.replace(/ed$/, '')
				.replace(/ied$/, 'y')
				.replace(/d$/, '')
			errors.push(
				`Use imperative mood: "${firstWord}" should be "${imperativeForm}" (e.g., "add" instead of "added", "start" instead of "started")`
			)
		} else if (pastTenseEndings.some(ending => firstWord.endsWith(ending)) && firstWord.length > 3) {
			warnings.push(
				'Consider using imperative mood (e.g., "add" instead of "added")'
			)
		}
	}

	return {
		isValid: errors.length === 0,
		errors,
		warnings,
	}
}

export const getCommitTypeFromMessage = (message: string): string | null => {
	const match = message.match(
		/^(feat|fix|docs|style|refactor|perf|test|build|ci|chore|revert)(\(.+\))?(!)?:/,
	)
	return match ? match[1] : null
}

export const getScopeFromMessage = (message: string): string | null => {
	const match = message.match(
		/^(feat|fix|docs|style|refactor|perf|test|build|ci|chore|revert)\((.+)\)(!)?:/,
	)
	return match ? match[2] : null
}

export const isBreakingChange = (message: string): boolean => {
	return (
		message.includes('!') || message.toLowerCase().includes('breaking change')
	)
}

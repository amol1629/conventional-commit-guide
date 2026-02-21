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
		/^(feat|fix|docs|style|refactor|perf|test|build|ci|chore)(\(.+\))?(!)?: .+/

	if (!conventionalCommitRegex.test(message)) {
		errors.push(
			'Commit message must follow conventional commit format: type(scope): description',
		)
	}

	// Check subject line length
	const subjectLine = message.split('\n')[0]
	if (subjectLine.length > 50) {
		warnings.push(
			'Subject line should be under 50 characters for better readability',
		)
	}

	// Check for imperative mood (basic check)
	const firstWord = subjectLine.split(':')[1]?.trim().split(' ')[0]
	if (firstWord && firstWord.endsWith('ed')) {
		warnings.push(
			'Consider using imperative mood (e.g., "add" instead of "added")',
		)
	}

	// Check for period at end of subject line
	if (subjectLine.endsWith('.')) {
		warnings.push('Subject line should not end with a period')
	}

	// Check for capitalization
	if (
		subjectLine.length > 0 &&
		subjectLine[0] !== subjectLine[0].toUpperCase()
	) {
		warnings.push('Subject line should start with a capital letter')
	}

	return {
		isValid: errors.length === 0,
		errors,
		warnings,
	}
}

export const getCommitTypeFromMessage = (message: string): string | null => {
	const match = message.match(
		/^(feat|fix|docs|style|refactor|perf|test|build|ci|chore)(\(.+\))?(!)?:/,
	)
	return match ? match[1] : null
}

export const getScopeFromMessage = (message: string): string | null => {
	const match = message.match(
		/^(feat|fix|docs|style|refactor|perf|test|build|ci|chore)\((.+)\)(!)?:/,
	)
	return match ? match[2] : null
}

export const isBreakingChange = (message: string): boolean => {
	return (
		message.includes('!') || message.toLowerCase().includes('breaking change')
	)
}

export const copyToClipboard = async (text: string): Promise<void> => {
	try {
		await navigator.clipboard.writeText(text)
	} catch {
		// Fallback for older browsers
		const textArea = document.createElement('textarea')
		textArea.value = text
		document.body.appendChild(textArea)
		textArea.focus()
		textArea.select()
		try {
			document.execCommand('copy')
		} catch (fallbackErr) {
			console.error('Failed to copy text: ', fallbackErr)
		}
		document.body.removeChild(textArea)
	}
}

export const downloadFile = (
	content: string,
	filename: string,
	type: string = 'text/markdown',
): void => {
	const blob = new Blob([content], { type })
	const url = URL.createObjectURL(blob)
	const a = document.createElement('a')
	a.href = url
	a.download = filename
	document.body.appendChild(a)
	a.click()
	document.body.removeChild(a)
	URL.revokeObjectURL(url)
}

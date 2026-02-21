interface ToastNotificationProps {
	showToast: boolean
	toastMessage: string
	toastType: 'success' | 'warning' | 'error'
}

export default function ToastNotification({
	showToast,
	toastMessage,
	toastType,
}: ToastNotificationProps) {
	if (!showToast) return null

	const getToastStyles = (type: 'success' | 'warning' | 'error') => {
		switch (type) {
			case 'success':
				return 'bg-green-50 border-green-200 text-green-800 dark:bg-green-900/20 dark:border-green-800 dark:text-green-200'
			case 'warning':
				return 'bg-yellow-50 border-yellow-200 text-yellow-800 dark:bg-yellow-900/20 dark:border-yellow-800 dark:text-yellow-200'
			case 'error':
				return 'bg-red-50 border-red-200 text-red-800 dark:bg-red-900/20 dark:border-red-800 dark:text-red-200'
			default:
				return 'bg-gray-50 border-gray-200 text-gray-800 dark:bg-gray-900/20 dark:border-gray-800 dark:text-gray-200'
		}
	}

	const getToastIcon = (type: 'success' | 'warning' | 'error') => {
		switch (type) {
			case 'success':
				return '✅'
			case 'warning':
				return '⚠️'
			case 'error':
				return '❌'
			default:
				return 'ℹ️'
		}
	}

	return (
		<div
			className={`fixed top-4 right-4 z-50 p-4 rounded-xl shadow-2xl border-2 animate-slide-in ${getToastStyles(
				toastType,
			)}`}
		>
			<div className="flex items-center gap-3">
				<div className="text-xl">{getToastIcon(toastType)}</div>
				<p className="font-medium">{toastMessage}</p>
			</div>
		</div>
	)
}

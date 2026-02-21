'use client'

import { LoadingSpinner } from '@/components/LoadingSpinner'
import Image from 'next/image'
import { useRef, useState } from 'react'
import toast from 'react-hot-toast'

interface ProfilePhotoUploadProps {
	userId: string
	currentAvatar?: string
	onPhotoUpdate: (newAvatar: string) => void
	className?: string
}

export function ProfilePhotoUpload({
	userId,
	currentAvatar,
	onPhotoUpdate,
	className = '',
}: ProfilePhotoUploadProps) {
	const [isUploading, setIsUploading] = useState(false)
	const [preview, setPreview] = useState<string | null>(null)
	const fileInputRef = useRef<HTMLInputElement>(null)

	const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0]
		if (file) {
			// Create preview
			const reader = new FileReader()
			reader.onload = (e) => {
				setPreview(e.target?.result as string)
				// Auto-upload when file is selected
				handleUpload(file)
			}
			reader.readAsDataURL(file)
		}
	}

	const handleUpload = async (file?: File) => {
		const uploadFile = file || fileInputRef.current?.files?.[0]
		if (!uploadFile) return

		setIsUploading(true)
		try {
			const formData = new FormData()
			formData.append('userId', userId)
			formData.append('photo', uploadFile)

			const response = await fetch('/api/user/upload-photo', {
				method: 'POST',
				body: formData,
			})

			const data = await response.json()

			if (data.success) {
				onPhotoUpdate(data.data.avatar)
				setPreview(null)
				// Reset file input
				if (fileInputRef.current) {
					fileInputRef.current.value = ''
				}
				toast.success('Profile photo updated successfully! 📸')
			} else {
				console.error('Error uploading photo:', data.error)
				toast.error(data.error || 'Failed to upload photo')
			}
		} catch (error) {
			console.error('Error uploading photo:', error)
			toast.error('Failed to upload photo. Please try again.')
		} finally {
			setIsUploading(false)
		}
	}

	const handleRemovePhoto = async () => {
		setIsUploading(true)
		try {
			// Reset to default avatar
			const defaultAvatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(
				'User',
			)}&background=random`
			onPhotoUpdate(defaultAvatar)
			toast.success('Profile photo removed! 🗑️')
		} catch (error) {
			console.error('Error removing photo:', error)
			toast.error('Failed to remove photo. Please try again.')
		} finally {
			setIsUploading(false)
		}
	}

	const displayAvatar = preview || currentAvatar

	return (
		<div className={`space-y-4 ${className}`}>
			{/* Avatar Display */}
			<div className="flex items-center gap-6">
				<div
					className="relative group cursor-pointer"
					onClick={() => fileInputRef.current?.click()}
				>
					<div className="w-20 h-20 rounded-full overflow-hidden bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center transition-transform duration-200 group-hover:scale-105 group-hover:shadow-lg">
						{displayAvatar && displayAvatar.startsWith('data:') ? (
							<Image
								src={displayAvatar}
								alt="Profile"
								width={80}
								height={80}
								className="w-full h-full object-cover"
							/>
						) : displayAvatar &&
						  !displayAvatar.startsWith('https://ui-avatars.com') ? (
							<Image
								src={displayAvatar}
								alt="Profile"
								width={80}
								height={80}
								className="w-full h-full object-cover"
							/>
						) : (
							<span className="text-2xl font-bold text-white">
								{displayAvatar?.charAt(0) || 'U'}
							</span>
						)}
					</div>

					{/* Upload Overlay - Edit Icon */}
					<div className="absolute inset-0 bg-black bg-opacity-60 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
						<div className="bg-white/30 hover:bg-white/40 rounded-full p-3 transition-colors duration-200 shadow-lg">
							<svg
								className="w-6 h-6 text-white"
								fill="currentColor"
								viewBox="0 0 20 20"
							>
								<path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
							</svg>
						</div>
					</div>

					{/* Remove Icon - Only show if user has uploaded a photo */}
					{currentAvatar &&
						!currentAvatar.startsWith('https://ui-avatars.com') && (
							<div
								className="absolute -top-1 -right-1 bg-red-500 hover:bg-red-600 rounded-full p-2 cursor-pointer opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-lg"
								onClick={(e) => {
									e.stopPropagation()
									handleRemovePhoto()
								}}
							>
								<svg
									className="w-4 h-4 text-white"
									fill="currentColor"
									viewBox="0 0 20 20"
								>
									<path
										fillRule="evenodd"
										d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
										clipRule="evenodd"
									/>
								</svg>
							</div>
						)}
				</div>

				<div className="flex-1">
					<h3 className="text-lg font-semibold text-gray-900 dark:text-white">
						Profile Photo
					</h3>
					<p className="text-sm text-gray-600 dark:text-gray-400">
						Click to upload a photo to personalize your profile
					</p>
				</div>
			</div>

			{/* File Input (Hidden) */}
			<input
				ref={fileInputRef}
				type="file"
				accept="image/jpeg,image/jpg,image/png,image/webp"
				onChange={handleFileSelect}
				className="hidden"
			/>

			{/* Auto-upload when file is selected */}
			{preview && (
				<div className="mt-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
					<div className="flex items-center gap-3">
						<div className="w-12 h-12 rounded-full overflow-hidden">
							<Image
								src={preview}
								alt="Preview"
								width={48}
								height={48}
								className="w-full h-full object-cover"
							/>
						</div>
						<div className="flex-1">
							<p className="text-sm text-gray-600 dark:text-gray-400">
								Uploading your new profile photo...
							</p>
							{isUploading && (
								<div className="mt-2">
									<LoadingSpinner size="sm" variant="dots" />
								</div>
							)}
						</div>
					</div>
				</div>
			)}
		</div>
	)
}

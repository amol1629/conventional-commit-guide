'use client'

import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { isAuthRequired } from '@/config/auth.config'

export default function Home() {
	const router = useRouter()

	useEffect(() => {
		// Immediate redirect - no loading state needed for static app
		if (isAuthRequired()) {
			router.push('/auth/login')
		} else {
			router.push('/home')
		}
	}, [router])

	// Return null to avoid any flash - redirect happens immediately
	return null
}

'use client'

import { AuthProvider } from '@/contexts/AuthContext'
import { SessionProvider } from 'next-auth/react'
import { ReactNode } from 'react'

interface ClientProvidersProps {
	children: ReactNode
}

export default function ClientProviders({ children }: ClientProvidersProps) {
	return (
		<SessionProvider>
			<AuthProvider>{children}</AuthProvider>
		</SessionProvider>
	)
}

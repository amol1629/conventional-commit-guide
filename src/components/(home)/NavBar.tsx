'use client'

/**
 * NavBar Component - Clean Architecture Implementation
 * Follows SOLID principles, WCAG accessibility, and UI/UX best practices
 */

import { Sidebar } from '@/components/navigation/Sidebar'

/**
 * Main navigation component
 * Delegates to Sidebar component following Single Responsibility Principle
 */
const SideBar = () => {
	return <Sidebar />
}

export default SideBar

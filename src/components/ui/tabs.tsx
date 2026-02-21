'use client'

import * as TabsPrimitive from '@radix-ui/react-tabs'
import * as React from 'react'

import { cn } from '@/lib/utils'

const Tabs = TabsPrimitive.Root

const TabsList = React.forwardRef<
	React.ElementRef<typeof TabsPrimitive.List>,
	React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>
>(({ className, children, ...props }, ref) => {
	const [sliderStyle, setSliderStyle] = React.useState<React.CSSProperties>({})
	const tabsListRef = React.useRef<HTMLDivElement>(null)

	const updateSlider = React.useCallback(() => {
		if (!tabsListRef.current) return

		const activeTabElement = tabsListRef.current.querySelector(
			'[data-state="active"]',
		) as HTMLElement
		if (activeTabElement) {
			const { offsetLeft, offsetWidth } = activeTabElement
			setSliderStyle({
				left: `${offsetLeft}px`,
				width: `${offsetWidth}px`,
			})
		}
	}, [])

	React.useEffect(() => {
		// Initial update
		updateSlider()

		// Update slider position on window resize
		const handleResize = () => updateSlider()
		window.addEventListener('resize', handleResize)

		return () => window.removeEventListener('resize', handleResize)
	}, [updateSlider])

	// Use MutationObserver to watch for tab state changes
	React.useEffect(() => {
		if (!tabsListRef.current) return

		const observer = new MutationObserver(() => {
			updateSlider()
		})

		observer.observe(tabsListRef.current, {
			attributes: true,
			attributeFilter: ['data-state'],
			subtree: true,
		})

		return () => observer.disconnect()
	}, [updateSlider])

	return (
		<TabsPrimitive.List
			ref={(node) => {
				if (typeof ref === 'function') ref(node)
				else if (ref) ref.current = node
				tabsListRef.current = node
			}}
			className={cn(
				'relative inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground',
				'focus:outline-none focus-visible:outline-none focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0',
				className,
			)}
			style={{
				outline: 'none !important',
				boxShadow: 'none !important',
				...props.style,
			}}
			{...props}
		>
			{/* Sliding background */}
			<div
				className="absolute top-1 bottom-1 bg-gradient-to-t from-[#fad8d4] to-[#fde9fd] rounded-full transition-all duration-300 ease-in-out"
				style={sliderStyle}
			/>
			{children}
		</TabsPrimitive.List>
	)
})
TabsList.displayName = TabsPrimitive.List.displayName

const TabsTrigger = React.forwardRef<
	React.ElementRef<typeof TabsPrimitive.Trigger>,
	React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>
>(({ className, onFocus, ...props }, ref) => (
	<TabsPrimitive.Trigger
		ref={ref}
		className={cn(
			'relative z-10 inline-flex items-center justify-center whitespace-nowrap rounded-lg px-3 py-1.5 text-sm font-medium',
			'focus:outline-none focus-visible:outline-none focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0',
			'disabled:pointer-events-none disabled:opacity-50',
			// Base styles with smooth transitions
			'bg-transparent text-muted-foreground shadow-none',
			'transition-all duration-500 ease-out',
			// Active state
			'data-[state=active]:text-foreground',
			// Hover styles only for inactive tabs with smooth transitions
			'data-[state=inactive]:hover:text-purple-600 data-[state=inactive]:hover:bg-pink-100/80 data-[state=inactive]:hover:shadow-md data-[state=inactive]:hover:shadow-pink-200/50',
			// Active tabs have no hover background change
			'data-[state=active]:hover:bg-transparent data-[state=active]:hover:text-foreground',
			className,
		)}
		style={{
			outline: 'none !important',
			boxShadow: 'none !important',
			...props.style,
		}}
		onFocus={(e) => {
			e.currentTarget.blur()
			onFocus?.(e)
		}}
		{...props}
	/>
))
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName

const TabsContent = React.forwardRef<
	React.ElementRef<typeof TabsPrimitive.Content>,
	React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => (
	<TabsPrimitive.Content
		ref={ref}
		className={cn(
			'mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
			// Alberto Hartzet's vertical slide animation style
			'data-[state=active]:animate-in data-[state=active]:fade-in-0 data-[state=active]:slide-in-from-bottom-4 data-[state=active]:duration-800 data-[state=active]:ease-[cubic-bezier(0.25,0.46,0.45,0.94)]',
			'data-[state=inactive]:animate-out data-[state=inactive]:fade-out-0 data-[state=inactive]:slide-out-to-top-4 data-[state=inactive]:duration-600 data-[state=inactive]:ease-[cubic-bezier(0.55,0.06,0.68,0.19)]',
			// Smooth vertical transitions with custom easing
			'transition-all duration-700 ease-[cubic-bezier(0.25,0.46,0.45,0.94)]',
			className,
		)}
		{...props}
	/>
))
TabsContent.displayName = TabsPrimitive.Content.displayName

export { Tabs, TabsContent, TabsList, TabsTrigger }

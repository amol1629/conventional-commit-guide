'use client'

import { Button } from '@/components/ui/button'
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card'
import { getFontAwesomeIcon } from '@/utils/fontawesome-mapping'
import { Cylinder, OrbitControls, Sphere, Text } from '@react-three/drei'
import { Canvas } from '@react-three/fiber'
import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'

interface CommitStep {
	id: string
	title: string
	description: string
	code: string
	explanation: string
	position: [number, number, number]
	color: string
	icon: string
}

const COMMIT_TUTORIALS = {
	feat: {
		title: 'Writing a Feature Commit',
		steps: [
			{
				id: '1',
				title: 'Choose Type',
				description: 'Start with "feat:" for new features',
				code: 'feat:',
				explanation:
					'The "feat" type indicates a new feature that adds functionality',
				position: [0, 2, 0] as [number, number, number],
				color: '#3b82f6',
				icon: '✨',
			},
			{
				id: '2',
				title: 'Add Scope',
				description: 'Specify the area of code affected',
				code: 'feat(auth):',
				explanation:
					'Scope helps identify which part of the codebase is affected',
				position: [2, 1, 0] as [number, number, number],
				color: '#10b981',
				icon: '🎯',
			},
			{
				id: '3',
				title: 'Write Subject',
				description: 'Describe what the feature does',
				code: 'feat(auth): add OAuth2 login support',
				explanation: 'Use imperative mood and be specific about the feature',
				position: [4, 0, 0] as [number, number, number],
				color: '#f59e0b',
				icon: '📝',
			},
			{
				id: '4',
				title: 'Add Body',
				description: 'Explain the implementation details',
				code: `feat(auth): add OAuth2 login support

- Implement OAuth2 flow with Google and GitHub
- Add user authentication middleware
- Update user model with OAuth fields`,
				explanation:
					'The body provides detailed information about the implementation',
				position: [6, -1, 0] as [number, number, number],
				color: '#8b5cf6',
				icon: '📋',
			},
		],
	},
	fix: {
		title: 'Writing a Bug Fix Commit',
		steps: [
			{
				id: '1',
				title: 'Choose Type',
				description: 'Start with "fix:" for bug fixes',
				code: 'fix:',
				explanation:
					'The "fix" type indicates a bug fix that resolves an issue',
				position: [0, 2, 0] as [number, number, number],
				color: '#ef4444',
				icon: '🐛',
			},
			{
				id: '2',
				title: 'Add Scope',
				description: 'Specify the component with the bug',
				code: 'fix(ui):',
				explanation: 'Scope helps identify which component had the bug',
				position: [2, 1, 0] as [number, number, number],
				color: '#10b981',
				icon: '🎯',
			},
			{
				id: '3',
				title: 'Write Subject',
				description: 'Describe what was fixed',
				code: 'fix(ui): resolve button alignment issue',
				explanation: 'Use imperative mood and describe the fix clearly',
				position: [4, 0, 0] as [number, number, number],
				color: '#f59e0b',
				icon: '📝',
			},
			{
				id: '4',
				title: 'Add Body',
				description: 'Explain the root cause and solution',
				code: `fix(ui): resolve button alignment issue

- Fix CSS flexbox properties causing misalignment
- Add proper responsive breakpoints
- Test across different screen sizes`,
				explanation: 'The body explains what was wrong and how it was fixed',
				position: [6, -1, 0] as [number, number, number],
				color: '#8b5cf6',
				icon: '📋',
			},
		],
	},
	docs: {
		title: 'Writing a Documentation Commit',
		steps: [
			{
				id: '1',
				title: 'Choose Type',
				description: 'Start with "docs:" for documentation',
				code: 'docs:',
				explanation: 'The "docs" type indicates documentation-only changes',
				position: [0, 2, 0] as [number, number, number],
				color: '#06b6d4',
				icon: '📚',
			},
			{
				id: '2',
				title: 'Add Scope',
				description: 'Specify the documentation area',
				code: 'docs(api):',
				explanation: 'Scope helps identify which documentation was updated',
				position: [2, 1, 0] as [number, number, number],
				color: '#10b981',
				icon: '🎯',
			},
			{
				id: '3',
				title: 'Write Subject',
				description: 'Describe the documentation change',
				code: 'docs(api): update authentication endpoints',
				explanation: 'Use imperative mood and describe what was documented',
				position: [4, 0, 0] as [number, number, number],
				color: '#f59e0b',
				icon: '📝',
			},
			{
				id: '4',
				title: 'Add Body',
				description: 'Explain the documentation updates',
				code: `docs(api): update authentication endpoints

- Add OAuth2 flow documentation
- Include request/response examples
- Update authentication error codes`,
				explanation:
					'The body explains what documentation was added or updated',
				position: [6, -1, 0] as [number, number, number],
				color: '#8b5cf6',
				icon: '📋',
			},
		],
	},
}

function TutorialStep({
	step,
	isActive,
	isCompleted,
	onClick,
	animationFrame,
}: {
	step: CommitStep
	isActive: boolean
	isCompleted: boolean
	onClick: () => void
	animationFrame: number
}) {
	const meshRef = useRef<THREE.Mesh>(null)
	const [hovered, setHovered] = useState(false)
	const [scale, setScale] = useState(1)

	useEffect(() => {
		if (meshRef.current) {
			meshRef.current.rotation.x = 0
			meshRef.current.rotation.y = 0
		}
	}, [])

	useEffect(() => {
		if (hovered) {
			setScale(1.3)
		} else if (isActive) {
			setScale(1.2)
		} else {
			setScale(1)
		}
	}, [hovered, isActive])

	// Floating animation
	const floatY = Math.sin(animationFrame * 0.02) * 0.1

	return (
		<group
			position={[step.position[0], step.position[1] + floatY, step.position[2]]}
			scale={[scale, scale, scale]}
		>
			<Sphere
				ref={meshRef}
				args={[0.6, 32, 32]}
				onClick={(e) => {
					e.stopPropagation()
					onClick()
				}}
				onPointerOver={(e) => {
					e.stopPropagation()
					setHovered(true)
				}}
				onPointerOut={(e) => {
					e.stopPropagation()
					setHovered(false)
				}}
			>
				<meshStandardMaterial
					color={isActive ? '#ffffff' : step.color}
					emissive={isActive ? step.color : isCompleted ? '#10b981' : '#000000'}
					emissiveIntensity={
						isActive ? 0.6 : isCompleted ? 0.4 : hovered ? 0.3 : 0
					}
					transparent
					opacity={hovered ? 0.9 : 1}
				/>
			</Sphere>

			{/* Step number */}
			<Text
				position={[0, 0, 0.7]}
				fontSize={0.3}
				color={isActive ? step.color : '#ffffff'}
				anchorX="center"
				anchorY="middle"
				fontWeight="bold"
			>
				{step.id}
			</Text>

			{/* Icon */}
			<Text
				position={[0, -1.2, 0]}
				fontSize={0.4}
				color={isActive ? '#ffffff' : step.color}
				anchorX="center"
				anchorY="middle"
			>
				{step.icon}
			</Text>

			{/* Title */}
			<Text
				position={[0, -1.8, 0]}
				fontSize={0.15}
				color={isActive ? '#ffffff' : '#000000'}
				anchorX="center"
				anchorY="middle"
				maxWidth={3}
			>
				{step.title}
			</Text>

			{/* Completion checkmark */}
			{isCompleted && (
				<Text
					position={[0, 0, 0.7]}
					fontSize={0.4}
					color="#10b981"
					anchorX="center"
					anchorY="middle"
				>
					✓
				</Text>
			)}
		</group>
	)
}

function TutorialScene({
	tutorial,
	onStepSelect,
	animationFrame,
}: {
	tutorial: typeof COMMIT_TUTORIALS.feat
	onStepSelect: (step: CommitStep) => void
	animationFrame: number
}) {
	const [activeStep, setActiveStep] = useState<string | null>(null)
	const [completedSteps, setCompletedSteps] = useState<Set<string>>(new Set())

	const handleStepClick = (step: CommitStep) => {
		setActiveStep(step.id)
		onStepSelect(step)

		// Mark previous steps as completed
		const stepIndex = tutorial.steps.findIndex((s) => s.id === step.id)
		const newCompleted = new Set<string>()
		for (let i = 0; i < stepIndex; i++) {
			newCompleted.add(tutorial.steps[i].id)
		}
		setCompletedSteps(newCompleted)
	}

	return (
		<>
			<ambientLight intensity={0.8} />
			<directionalLight position={[10, 10, 5]} intensity={1.2} />
			<pointLight position={[-10, -10, -10]} intensity={0.6} />

			{/* Tutorial steps */}
			{tutorial.steps.map((step) => (
				<TutorialStep
					key={step.id}
					step={step}
					isActive={activeStep === step.id}
					isCompleted={completedSteps.has(step.id)}
					onClick={() => handleStepClick(step)}
					animationFrame={animationFrame}
				/>
			))}

			{/* Connection lines with animation */}
			{tutorial.steps.slice(0, -1).map((step, index) => {
				const nextStep = tutorial.steps[index + 1]
				const midPoint: [number, number, number] = [
					(step.position[0] + nextStep.position[0]) / 2,
					(step.position[1] + nextStep.position[1]) / 2,
					(step.position[2] + nextStep.position[2]) / 2,
				]

				const distance = Math.sqrt(
					Math.pow(nextStep.position[0] - step.position[0], 2) +
						Math.pow(nextStep.position[1] - step.position[1], 2) +
						Math.pow(nextStep.position[2] - step.position[2], 2),
				)

				return (
					<group key={`line-${index}`}>
						<Cylinder
							position={midPoint}
							args={[0.08, 0.08, distance]}
							rotation={[
								Math.atan2(
									nextStep.position[2] - step.position[2],
									nextStep.position[1] - step.position[1],
								),
								Math.atan2(
									nextStep.position[0] - step.position[0],
									nextStep.position[2] - step.position[2],
								),
								0,
							]}
						>
							<meshStandardMaterial
								color={completedSteps.has(step.id) ? '#10b981' : '#64748b'}
								emissive={completedSteps.has(step.id) ? '#10b981' : '#000000'}
								emissiveIntensity={completedSteps.has(step.id) ? 0.4 : 0}
							/>
						</Cylinder>
					</group>
				)
			})}

			{/* Animated particles showing progress */}
			{tutorial.steps.slice(0, -1).map((step, index) => {
				const nextStep = tutorial.steps[index + 1]
				const progress = (animationFrame / 100) % 1
				const currentPos: [number, number, number] = [
					step.position[0] +
						(nextStep.position[0] - step.position[0]) * progress,
					step.position[1] +
						(nextStep.position[1] - step.position[1]) * progress,
					step.position[2] +
						(nextStep.position[2] - step.position[2]) * progress,
				]

				return (
					<group key={`particle-${index}`} position={currentPos}>
						<Sphere args={[0.15, 16, 16]}>
							<meshStandardMaterial
								color="#3b82f6"
								emissive="#3b82f6"
								emissiveIntensity={0.8}
							/>
						</Sphere>
					</group>
				)
			})}

			<OrbitControls enablePan={true} enableZoom={true} enableRotate={true} />
		</>
	)
}

export function CommitTutorial3D() {
	const [selectedTutorial, setSelectedTutorial] =
		useState<keyof typeof COMMIT_TUTORIALS>('feat')
	const [selectedStep, setSelectedStep] = useState<CommitStep | null>(null)
	const [mounted, setMounted] = useState(false)
	const [animationFrame, setAnimationFrame] = useState(0)

	useEffect(() => {
		setMounted(true)
	}, [])

	useEffect(() => {
		const interval = setInterval(() => {
			setAnimationFrame((prev) => (prev + 1) % 100)
		}, 50)
		return () => clearInterval(interval)
	}, [])

	const handleStepSelect = (step: CommitStep) => {
		setSelectedStep(step)
	}

	const getCommitIcon = (type: string) => {
		switch (type) {
			case 'feat':
				return getFontAwesomeIcon('GitCommit', 'w-4 h-4')
			case 'fix':
				return getFontAwesomeIcon('GitBranch', 'w-4 h-4')
			case 'docs':
				return getFontAwesomeIcon('GitMerge', 'w-4 h-4')
			default:
				return getFontAwesomeIcon('GitCommit', 'w-4 h-4')
		}
	}

	if (!mounted) {
		return (
			<div className="w-full h-[700px] space-y-4">
				<div className="grid lg:grid-cols-2 gap-6 h-full">
					<Card className="overflow-hidden">
						<CardHeader>
							<CardTitle className="flex items-center gap-2">
								<span>🎓</span>
								3D Commit Tutorial
							</CardTitle>
							<CardDescription>Loading tutorial...</CardDescription>
						</CardHeader>
						<CardContent className="p-0 h-[500px] flex items-center justify-center">
							<div className="animate-pulse text-muted-foreground">
								Loading 3D tutorial...
							</div>
						</CardContent>
					</Card>
					<Card>
						<CardHeader>
							<CardTitle className="flex items-center gap-2">
								<span>📋</span>
								Step Details
							</CardTitle>
							<CardDescription>Loading...</CardDescription>
						</CardHeader>
						<CardContent>
							<div className="animate-pulse space-y-4">
								<div className="h-4 bg-muted rounded w-3/4"></div>
								<div className="h-4 bg-muted rounded w-1/2"></div>
								<div className="h-20 bg-muted rounded"></div>
							</div>
						</CardContent>
					</Card>
				</div>
			</div>
		)
	}

	return (
		<div className="w-full h-[700px] space-y-4">
			{/* Tutorial Selection */}
			<div className="flex gap-4 justify-center mb-6">
				{Object.entries(COMMIT_TUTORIALS).map(([key, tutorial]) => (
					<Button
						key={key}
						variant={selectedTutorial === key ? 'default' : 'outline'}
						onClick={() => {
							setSelectedTutorial(key as keyof typeof COMMIT_TUTORIALS)
							setSelectedStep(null)
						}}
						className="flex items-center gap-2"
					>
						{getCommitIcon(key)}
						{tutorial.title}
					</Button>
				))}
			</div>

			<div className="grid lg:grid-cols-2 gap-6 h-full">
				{/* 3D Tutorial Scene */}
				<Card className="overflow-hidden">
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<span>🎓</span>
							{COMMIT_TUTORIALS[selectedTutorial].title}
						</CardTitle>
						<CardDescription>
							Click on the spheres to learn each step
						</CardDescription>
					</CardHeader>
					<CardContent className="p-0 h-[500px]">
						<Canvas camera={{ position: [3, 1, 8], fov: 60 }}>
							<TutorialScene
								tutorial={COMMIT_TUTORIALS[selectedTutorial]}
								onStepSelect={handleStepSelect}
								animationFrame={animationFrame}
							/>
						</Canvas>
					</CardContent>
				</Card>

				{/* Step Details */}
				<Card>
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<span>📋</span>
							{selectedStep
								? `Step ${selectedStep.id}: ${selectedStep.title}`
								: 'Step Details'}
						</CardTitle>
						<CardDescription>
							{selectedStep
								? 'Learn how to write this part of the commit'
								: 'Click a sphere to see step details'}
						</CardDescription>
					</CardHeader>
					<CardContent className="space-y-4">
						{selectedStep ? (
							<>
								<div className="flex items-center gap-3">
									<div
										className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold"
										style={{ backgroundColor: selectedStep.color }}
									>
										{selectedStep.id}
									</div>
									<div>
										<h3 className="font-semibold">{selectedStep.title}</h3>
										<p className="text-sm text-muted-foreground">
											{selectedStep.description}
										</p>
									</div>
								</div>

								<div className="bg-muted p-4 rounded-lg">
									<pre className="text-sm font-mono whitespace-pre-wrap">
										{selectedStep.code}
									</pre>
								</div>

								<div className="space-y-2">
									<h4 className="font-semibold">Explanation:</h4>
									<p className="text-sm text-muted-foreground">
										{selectedStep.explanation}
									</p>
								</div>

								<div className="pt-4 border-t">
									<h4 className="font-semibold mb-2">Tips:</h4>
									<ul className="text-sm text-muted-foreground space-y-1">
										<li>• Use imperative mood (add, fix, update)</li>
										<li>• Keep subject line under 50 characters</li>
										<li>• Be specific and descriptive</li>
										<li>• Use body for complex changes</li>
									</ul>
								</div>
							</>
						) : (
							<div className="text-center py-8 text-muted-foreground">
								{getFontAwesomeIcon(
									'Code',
									'w-12 h-12 mx-auto mb-4 opacity-50',
								)}
								<p>Click on any sphere in the 3D scene to learn that step</p>
								<p className="text-sm mt-2">
									Each sphere represents a part of writing the commit message
								</p>
							</div>
						)}
					</CardContent>
				</Card>
			</div>

			{/* Instructions */}
			<Card className="bg-gradient-to-r from-blue-50 to-emerald-50 dark:from-blue-900/20 dark:to-emerald-900/20 border-blue-200 dark:border-blue-800">
				<CardContent className="p-6">
					<h3 className="font-semibold mb-2">How to Use the 3D Tutorial</h3>
					<div className="grid md:grid-cols-4 gap-4 text-sm">
						<div className="flex items-center gap-2">
							<div className="w-2 h-2 bg-blue-500 rounded-full"></div>
							<span>
								<strong>Select Tutorial:</strong> Choose feat, fix, or docs
							</span>
						</div>
						<div className="flex items-center gap-2">
							<div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
							<span>
								<strong>Click Spheres:</strong> Learn each step
							</span>
						</div>
						<div className="flex items-center gap-2">
							<div className="w-2 h-2 bg-orange-500 rounded-full"></div>
							<span>
								<strong>Follow Order:</strong> Steps build on each other
							</span>
						</div>
						<div className="flex items-center gap-2">
							<div className="w-2 h-2 bg-purple-500 rounded-full"></div>
							<span>
								<strong>Interactive:</strong> Rotate and zoom the scene
							</span>
						</div>
					</div>
				</CardContent>
			</Card>
		</div>
	)
}

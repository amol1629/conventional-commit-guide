'use client'

import { Badge } from '@/components/ui/badge'
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

interface CommitNode {
	id: string
	position: [number, number, number]
	type: 'feat' | 'fix' | 'docs' | 'refactor' | 'merge'
	message: string
	color: string
}

const COMMIT_NODES: CommitNode[] = [
	{
		id: '1',
		position: [-4, 0, 0],
		type: 'feat',
		message: 'feat: add user authentication',
		color: '#3b82f6',
	},
	{
		id: '2',
		position: [-2, 1, 0],
		type: 'fix',
		message: 'fix: resolve login bug',
		color: '#ef4444',
	},
	{
		id: '3',
		position: [0, 0, 0],
		type: 'docs',
		message: 'docs: update API documentation',
		color: '#10b981',
	},
	{
		id: '4',
		position: [2, 1, 0],
		type: 'refactor',
		message: 'refactor: optimize database queries',
		color: '#f59e0b',
	},
	{
		id: '5',
		position: [4, 0, 0],
		type: 'merge',
		message: 'merge: integrate feature branch',
		color: '#8b5cf6',
	},
]

function CommitSphere({
	node,
	isActive,
	onClick,
}: {
	node: CommitNode
	isActive: boolean
	onClick: () => void
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
			setScale(1.2)
		} else {
			setScale(1)
		}
	}, [hovered])

	return (
		<group position={node.position} scale={[scale, scale, scale]}>
			<Sphere
				ref={meshRef}
				args={[0.5, 32, 32]}
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
					color={isActive ? '#ffffff' : node.color}
					emissive={isActive ? node.color : '#000000'}
					emissiveIntensity={isActive ? 0.5 : hovered ? 0.2 : 0}
					transparent
					opacity={hovered ? 0.9 : 1}
				/>
			</Sphere>
			<Text
				position={[0, -1, 0]}
				fontSize={0.2}
				color={isActive ? '#ffffff' : hovered ? '#ffffff' : '#000000'}
				anchorX="center"
				anchorY="middle"
			>
				{node.type}
			</Text>
		</group>
	)
}

function CommitWorkflowScene({
	onCommitSelect,
}: {
	onCommitSelect: (commit: CommitNode) => void
}) {
	const [activeNode, setActiveNode] = useState<string | null>(null)
	const [animationFrame, setAnimationFrame] = useState(0)

	useEffect(() => {
		const interval = setInterval(() => {
			setAnimationFrame((prev) => (prev + 1) % 100)
		}, 50)
		return () => clearInterval(interval)
	}, [])

	const handleCommitClick = (node: CommitNode) => {
		setActiveNode(activeNode === node.id ? null : node.id)
		onCommitSelect(node)
	}

	return (
		<>
			<ambientLight intensity={0.6} />
			<directionalLight position={[10, 10, 5]} intensity={1} />
			<pointLight position={[-10, -10, -10]} intensity={0.5} />

			{COMMIT_NODES.map((node) => (
				<CommitSphere
					key={node.id}
					node={node}
					isActive={activeNode === node.id}
					onClick={() => handleCommitClick(node)}
				/>
			))}

			{/* Connection lines with animation */}
			{COMMIT_NODES.slice(0, -1).map((node, index) => {
				const nextNode = COMMIT_NODES[index + 1]
				const midPoint: [number, number, number] = [
					(node.position[0] + nextNode.position[0]) / 2,
					(node.position[1] + nextNode.position[1]) / 2,
					(node.position[2] + nextNode.position[2]) / 2,
				]

				const distance = Math.sqrt(
					Math.pow(nextNode.position[0] - node.position[0], 2) +
						Math.pow(nextNode.position[1] - node.position[1], 2) +
						Math.pow(nextNode.position[2] - node.position[2], 2),
				)

				return (
					<group key={`line-${index}`}>
						<Cylinder
							position={midPoint}
							args={[0.05, 0.05, distance]}
							rotation={[
								Math.atan2(
									nextNode.position[2] - node.position[2],
									nextNode.position[1] - node.position[1],
								),
								Math.atan2(
									nextNode.position[0] - node.position[0],
									nextNode.position[2] - node.position[2],
								),
								0,
							]}
						>
							<meshStandardMaterial
								color={
									activeNode === node.id || activeNode === nextNode.id
										? '#3b82f6'
										: '#64748b'
								}
								emissive={
									activeNode === node.id || activeNode === nextNode.id
										? '#3b82f6'
										: '#000000'
								}
								emissiveIntensity={
									activeNode === node.id || activeNode === nextNode.id ? 0.3 : 0
								}
							/>
						</Cylinder>
					</group>
				)
			})}

			{/* Animated particles showing commit flow */}
			{COMMIT_NODES.slice(0, -1).map((node, index) => {
				const nextNode = COMMIT_NODES[index + 1]
				const progress = (animationFrame / 100) % 1
				const currentPos: [number, number, number] = [
					node.position[0] +
						(nextNode.position[0] - node.position[0]) * progress,
					node.position[1] +
						(nextNode.position[1] - node.position[1]) * progress,
					node.position[2] +
						(nextNode.position[2] - node.position[2]) * progress,
				]

				return (
					<group key={`particle-${index}`} position={currentPos}>
						<Sphere args={[0.1, 16, 16]}>
							<meshStandardMaterial
								color="#3b82f6"
								emissive="#3b82f6"
								emissiveIntensity={0.5}
							/>
						</Sphere>
					</group>
				)
			})}

			<OrbitControls enablePan={true} enableZoom={true} enableRotate={true} />
		</>
	)
}

export function CommitWorkflow3D() {
	const [selectedCommit, setSelectedCommit] = useState<CommitNode | null>(null)
	const [mounted, setMounted] = useState(false)

	useEffect(() => {
		setMounted(true)
	}, [])

	const handleCommitSelect = (commit: CommitNode) => {
		setSelectedCommit(commit)
	}

	const getCommitIcon = (type: string) => {
		switch (type) {
			case 'feat':
				return getFontAwesomeIcon('GitCommit', 'w-4 h-4')
			case 'fix':
				return getFontAwesomeIcon('GitBranch', 'w-4 h-4')
			case 'docs':
				return getFontAwesomeIcon('GitMerge', 'w-4 h-4')
			case 'refactor':
				return getFontAwesomeIcon('GitPullRequest', 'w-4 h-4')
			case 'merge':
				return getFontAwesomeIcon('GitMerge', 'w-4 h-4')
			default:
				return getFontAwesomeIcon('GitCommit', 'w-4 h-4')
		}
	}

	if (!mounted) {
		return (
			<div className="w-full h-[600px] space-y-4">
				<div className="grid h-full gap-6 lg:grid-cols-2">
					<Card className="overflow-hidden">
						<CardHeader>
							<CardTitle className="flex items-center gap-2">
								<span>🌐</span>
								Interactive 3D Commit Workflow
							</CardTitle>
							<CardDescription>Loading 3D scene...</CardDescription>
						</CardHeader>
						<CardContent className="p-0 h-[500px] flex items-center justify-center">
							<div className="animate-pulse text-muted-foreground">
								Loading 3D visualization...
							</div>
						</CardContent>
					</Card>
					<Card>
						<CardHeader>
							<CardTitle className="flex items-center gap-2">
								<span>📋</span>
								Commit Details
							</CardTitle>
							<CardDescription>Loading...</CardDescription>
						</CardHeader>
						<CardContent>
							<div className="space-y-4 animate-pulse">
								<div className="w-3/4 h-4 rounded bg-muted"></div>
								<div className="w-1/2 h-4 rounded bg-muted"></div>
								<div className="h-20 rounded bg-muted"></div>
							</div>
						</CardContent>
					</Card>
				</div>
			</div>
		)
	}

	return (
		<div className="w-full h-[600px] space-y-4">
			<div className="grid h-full gap-6 lg:grid-cols-2">
				{/* 3D Scene */}
				<Card className="overflow-hidden">
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<span>🌐</span>
							Interactive 3D Commit Workflow
						</CardTitle>
						<CardDescription>
							Click on commit nodes to explore the workflow
						</CardDescription>
					</CardHeader>
					<CardContent className="p-0 h-[500px]">
						<Canvas camera={{ position: [0, 0, 8], fov: 60 }}>
							<CommitWorkflowScene onCommitSelect={handleCommitSelect} />
						</Canvas>
					</CardContent>
				</Card>

				{/* Commit Details */}
				<Card>
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<span>📋</span>
							Commit Details
						</CardTitle>
						<CardDescription>
							{selectedCommit
								? 'Selected commit information'
								: 'Click a commit node to view details'}
						</CardDescription>
					</CardHeader>
					<CardContent className="space-y-4">
						{selectedCommit ? (
							<>
								<div className="flex items-center gap-3">
									<div
										className="w-4 h-4 rounded-full"
										style={{ backgroundColor: selectedCommit.color }}
									/>
									<Badge
										variant="secondary"
										className="flex items-center gap-1"
									>
										{getCommitIcon(selectedCommit.type)}
										{selectedCommit.type}
									</Badge>
								</div>

								<div className="p-4 rounded-lg bg-muted">
									<code className="font-mono text-sm">
										{selectedCommit.message}
									</code>
								</div>

								<div className="space-y-2">
									<h4 className="font-semibold">
										Commit Type: {selectedCommit.type}
									</h4>
									<p className="text-sm text-muted-foreground">
										{selectedCommit.type === 'feat' &&
											'A new feature for users'}
										{selectedCommit.type === 'fix' &&
											'A bug fix that resolves an issue'}
										{selectedCommit.type === 'docs' &&
											'Documentation changes only'}
										{selectedCommit.type === 'refactor' &&
											'Code restructuring without changing functionality'}
										{selectedCommit.type === 'merge' &&
											'Merging branches together'}
									</p>
								</div>

								<div className="pt-4 border-t">
									<h4 className="mb-2 font-semibold">Workflow Position</h4>
									<div className="grid grid-cols-3 gap-2 text-sm">
										<div className="p-2 text-center rounded bg-muted">
											<div className="font-medium">X</div>
											<div className="text-muted-foreground">
												{selectedCommit.position[0]}
											</div>
										</div>
										<div className="p-2 text-center rounded bg-muted">
											<div className="font-medium">Y</div>
											<div className="text-muted-foreground">
												{selectedCommit.position[1]}
											</div>
										</div>
										<div className="p-2 text-center rounded bg-muted">
											<div className="font-medium">Z</div>
											<div className="text-muted-foreground">
												{selectedCommit.position[2]}
											</div>
										</div>
									</div>
								</div>
							</>
						) : (
							<div className="py-8 text-center text-muted-foreground">
								{getFontAwesomeIcon(
									'GitCommit',
									'w-12 h-12 mx-auto mb-4 opacity-50',
								)}
								<p>
									Click on any commit node in the 3D scene to view its details
								</p>
							</div>
						)}
					</CardContent>
				</Card>
			</div>

			{/* Instructions */}
			<Card className="border-blue-200 bg-gradient-to-r from-blue-50 to-emerald-50 dark:from-blue-900/20 dark:to-emerald-900/20 dark:border-blue-800">
				<CardContent className="p-6">
					<h3 className="mb-2 font-semibold">How to Use the 3D Workflow</h3>
					<div className="grid gap-4 text-sm md:grid-cols-3">
						<div className="flex items-center gap-2">
							<div className="w-2 h-2 bg-blue-500 rounded-full"></div>
							<span>
								<strong>Rotate:</strong> Click and drag to rotate the view
							</span>
						</div>
						<div className="flex items-center gap-2">
							<div className="w-2 h-2 rounded-full bg-emerald-500"></div>
							<span>
								<strong>Zoom:</strong> Scroll to zoom in/out
							</span>
						</div>
						<div className="flex items-center gap-2">
							<div className="w-2 h-2 bg-orange-500 rounded-full"></div>
							<span>
								<strong>Select:</strong> Click on spheres to view details
							</span>
						</div>
					</div>
				</CardContent>
			</Card>
		</div>
	)
}

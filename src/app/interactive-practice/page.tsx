'use client'

import AnimatedBackground from '@/components/AnimatedBackground'
import AnimatedHeader from '@/components/AnimatedHeader'
import CommitTypeInfo from '@/components/interactive-practice/CommitTypeInfo'
import FeedbackSection from '@/components/interactive-practice/FeedbackSection'
import NavigationButtons from '@/components/interactive-practice/NavigationButtons'
import ProgressSection from '@/components/interactive-practice/ProgressSection'
import ScenarioCard from '@/components/interactive-practice/ScenarioCard'
import Layout from '@/components/Layout'
import ProtectedRoute from '@/components/ProtectedRoute'
import { useAuth } from '@/contexts/AuthContext'
import { practiceScenarios } from '@/data/practice-scenarios'
import { useLearningTracker } from '@/hooks/useLearningTracker'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'

interface QuestionState {
	userCommit: string
	showResult: boolean
	feedback: string[]
	isPerfect: boolean
	showCommitTypeInfo: boolean
}

export default function InteractivePractice() {
	const { authState } = useAuth()
	const { trackModuleStart, trackCommitPractice, trackPracticeSession } =
		useLearningTracker()
	const [currentScenario, setCurrentScenario] = useState(0)
	const [score, setScore] = useState(0)
	const [attempts, setAttempts] = useState(0)
	const [answeredQuestions, setAnsweredQuestions] = useState<Set<number>>(
		new Set(),
	)
	const [questionAttempts, setQuestionAttempts] = useState<Map<number, number>>(
		new Map(),
	)
	const [questionStates, setQuestionStates] = useState<
		Map<number, QuestionState>
	>(new Map())
	const MAX_ATTEMPTS = 20

	const scenario = practiceScenarios[currentScenario]

	// Track module start when component mounts
	useEffect(() => {
		if (authState.user?.id) {
			trackModuleStart('interactive-practice', 'Interactive Practice', {
				scenarios: practiceScenarios.length,
				startedAt: new Date().toISOString(),
			})
		}
	}, [authState.user?.id, trackModuleStart])

	// Helper functions to get and set current question state
	const getCurrentQuestionState = (): QuestionState => {
		return (
			questionStates.get(currentScenario) || {
				userCommit: '',
				showResult: false,
				feedback: [],
				isPerfect: false,
				showCommitTypeInfo: false,
			}
		)
	}

	const setCurrentQuestionState = (updates: Partial<QuestionState>) => {
		setQuestionStates((prev) => {
			const newMap = new Map(prev)
			const currentState = newMap.get(currentScenario) || {
				userCommit: '',
				showResult: false,
				feedback: [],
				isPerfect: false,
				showCommitTypeInfo: false,
			}
			newMap.set(currentScenario, { ...currentState, ...updates })
			return newMap
		})
	}

	const checkCommit = async () => {
		const currentState = getCurrentQuestionState()

		// Check if this question has already been answered correctly
		if (answeredQuestions.has(currentScenario)) {
			toast('This question has already been answered correctly!', {
				icon: '⚠️',
				style: {
					background: '#fbbf24',
					color: '#92400e',
				},
			})
			return
		}

		// Check if user has exceeded attempt limit for current question
		const currentAttempts = questionAttempts.get(currentScenario) || 0
		if (currentAttempts >= MAX_ATTEMPTS) {
			toast.error(
				'Maximum attempts reached for this question!\nPlease try a new scenario.',
			)
			return
		}

		// Check if commit message is empty
		if (!currentState.userCommit.trim()) {
			toast('Please enter a commit message!', {
				icon: '⚠️',
				style: {
					background: '#fbbf24',
					color: '#92400e',
				},
			})
			return
		}

		const commit = currentState.userCommit.toLowerCase().trim()
		let points = 0
		const feedback = []
		let perfect = true

		// Check if commit follows conventional commit format
		const conventionalCommitRegex = /^(\w+)(?:\(([^)]+)\))?(!)?:\s*(.+)$/
		const match = commit.match(conventionalCommitRegex)

		if (!match) {
			feedback.push('❌ Invalid format - should be: type(scope): description')
			feedback.push('❌ Missing type')
			feedback.push('❌ Missing scope')
			feedback.push('❌ Missing description')
			perfect = false
		} else {
			const [, userType, userScope, userBreaking, userDescription] = match

			// Check type - must be exact match
			if (userType === scenario.expectedType) {
				points += 2
				feedback.push('✅ Correct type')
			} else {
				feedback.push(
					`❌ Wrong type - expected "${scenario.expectedType}", got "${userType}"`,
				)
				perfect = false
			}

			// Check scope - must be exact match
			if (userScope === scenario.expectedScope) {
				points += 2
				feedback.push('✅ Correct scope')
			} else {
				feedback.push(
					`❌ Wrong scope - expected "${scenario.expectedScope}", got "${
						userScope || 'none'
					}"`,
				)
				perfect = false
			}

			// Check description - must contain key words from expected description
			const expectedWords = scenario.expectedDescription
				.toLowerCase()
				.split(' ')
			const userWords = userDescription.toLowerCase().split(' ')
			const matchingWords = expectedWords.filter(
				(word) =>
					word.length > 2 &&
					userWords.some((userWord) => userWord.includes(word)),
			)

			if (matchingWords.length >= Math.ceil(expectedWords.length * 0.6)) {
				points += 3
				feedback.push('✅ Good description')
			} else {
				feedback.push(
					`❌ Description could be better - expected something like "${scenario.expectedDescription}"`,
				)
				perfect = false
			}

			// Check breaking change
			if (scenario.breakingChange) {
				if (userBreaking === '!') {
					points += 1
					feedback.push('✅ Breaking change indicator')
				} else {
					feedback.push('⚠️ Missing breaking change indicator (!)')
					perfect = false
				}
			} else {
				if (userBreaking === '!') {
					feedback.push('⚠️ Unnecessary breaking change indicator')
					perfect = false
				} else {
					feedback.push('✅ No breaking change needed')
				}
			}
		}

		// Only add points and attempts if this is the first time answering this question
		if (!answeredQuestions.has(currentScenario)) {
			setScore(score + points)
			setAttempts(attempts + 1)
		}

		// Always increment current question attempts
		setQuestionAttempts((prev) => {
			const newMap = new Map(prev)
			newMap.set(currentScenario, (newMap.get(currentScenario) || 0) + 1)
			return newMap
		})

		// Update the current question state
		setCurrentQuestionState({
			feedback,
			isPerfect: perfect,
			showResult: true,
			showCommitTypeInfo: perfect,
		})

		// If perfect answer, mark this question as answered
		if (perfect) {
			setAnsweredQuestions((prev) => new Set([...prev, currentScenario]))
			toast.success('🎉 Perfect! All checks passed!')

			// Track practice activities
			try {
				// Track in learning history
				await trackCommitPractice(
					'interactive-practice',
					'Interactive Practice',
					true,
					{
						scenario: currentScenario,
						scenarioTitle: scenario.title,
						attempts: questionAttempts.get(currentScenario) || 0,
					},
				)

				// Track in commits practice collection
				await fetch('/api/commits-practice', {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({
						userId: authState.user?.id,
						moduleId: 'interactive-practice',
						moduleTitle: 'Interactive Practice',
						commitMessage: currentState.userCommit,
						expectedType: scenario.expectedType,
						actualType: scenario.expectedType, // Perfect match
						success: true,
						timeSpent: Math.round((Date.now() - Date.now()) / 1000 / 60), // Calculate time spent
						attempts: questionAttempts.get(currentScenario) || 0,
						metadata: {
							scenario: currentScenario,
							scenarioTitle: scenario.title,
							perfect: true,
							points: points,
							timestamp: new Date().toISOString(),
						},
					}),
				})

				await trackPracticeSession(
					'interactive-practice',
					'Interactive Practice',
					score + points,
					{
						scenario: currentScenario,
						scenarioTitle: scenario.title,
						perfect: true,
					},
				)
			} catch (error) {
				console.error('Error tracking practice activity:', error)
			}
		}
	}

	const nextScenario = () => {
		setCurrentScenario((prev) => (prev + 1) % practiceScenarios.length)
	}

	const prevScenario = () => {
		setCurrentScenario(
			(prev) =>
				(prev - 1 + practiceScenarios.length) % practiceScenarios.length,
		)
	}

	const resetPractice = () => {
		setCurrentScenario(0)
		setScore(0)
		setAttempts(0)
		setAnsweredQuestions(new Set())
		setQuestionAttempts(new Map())
		setQuestionStates(new Map())
	}

	return (
		<ProtectedRoute>
			<Layout>
				<AnimatedBackground>
					<div className="container relative max-w-6xl px-4 py-6 mx-auto">
						{/* Modern Header with Animation */}
						<AnimatedHeader
							badge="Interactive Practice"
							title="Master Conventional Commits"
							description="Practice with real-world scenarios from top tech companies"
						/>

						{/* Progress Section */}
						<ProgressSection
							currentScenario={currentScenario}
							totalScenarios={practiceScenarios.length}
							scenario={scenario}
							score={score}
							attempts={attempts}
							maxAttempts={MAX_ATTEMPTS}
						/>

						{/* Main Question Card */}
						<div className="max-w-4xl mx-auto">
							<ScenarioCard
								scenario={scenario}
								userCommit={getCurrentQuestionState().userCommit}
								setUserCommit={(value) =>
									setCurrentQuestionState({ userCommit: value })
								}
								onCheckCommit={checkCommit}
								attempts={questionAttempts.get(currentScenario) || 0}
								maxAttempts={MAX_ATTEMPTS}
							/>

							{/* Feedback Section */}
							<FeedbackSection
								showResult={getCurrentQuestionState().showResult}
								feedback={getCurrentQuestionState().feedback}
								isPerfect={getCurrentQuestionState().isPerfect}
								scenario={scenario}
							/>

							{/* Commit Type Info */}
							<CommitTypeInfo
								showCommitTypeInfo={getCurrentQuestionState().showCommitTypeInfo}
								commitTypeInfo={scenario.commitTypeInfo}
							/>

							{/* Navigation Buttons */}
							<NavigationButtons
								onReset={resetPractice}
								onPrev={prevScenario}
								onNext={nextScenario}
								currentScenario={currentScenario}
								totalScenarios={practiceScenarios.length}
							/>
						</div>
					</div>
				</AnimatedBackground>
			</Layout>
		</ProtectedRoute>
	)
}

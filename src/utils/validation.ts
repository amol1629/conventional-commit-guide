// ─────────────────────────────────────────────────────────────────────────────
// Conventional Commits v1.0.0 — Hybrid Validator
// Layer 1: Rule-based (instant, client-side)
// Layer 2: Claude AI semantic analysis (async, catches what rules can't)
// ─────────────────────────────────────────────────────────────────────────────

export interface ValidationResult {
	isValid: boolean
	errors: string[]
	warnings: string[]
	infos: string[]
	suggestions: string[]
	score: number    // 0–100
}

export interface AIAnalysis {
	loading: boolean
	issues: AIIssue[]
	corrected: string | null    // AI best-fixed version
	alternatives: string[] | null  // shown when commit is already perfect
	isPerfect: boolean          // true when AI thinks commit is great
	scopeSuggestion: string | null    // AI-suggested scope if none given
	bodyHint: string | null    // when/what to put in the body
	footerHint: string | null    // relevant footer tokens to add
	error: string | null
}

export interface AIIssue {
	severity: 'error' | 'warning' | 'info'
	message: string
}

// ─── CONSTANTS ────────────────────────────────────────────────────────────────

const VALID_TYPES = ['feat', 'fix', 'docs', 'style', 'refactor', 'perf', 'test', 'build', 'ci', 'chore', 'revert'] as const
type CommitType = typeof VALID_TYPES[number]

const TYPE_META: Record<CommitType, { label: string; example: string; triggerVerbs: string[] }> = {
	feat: { label: 'New feature', example: 'feat(auth): add OAuth2 Google login', triggerVerbs: ['add', 'introduce', 'implement', 'create', 'support', 'allow', 'enable', 'expose', 'provide', 'build', 'scaffold', 'integrate', 'register', 'generate'] },
	fix: { label: 'Bug fix', example: 'fix(api): handle null response from /users', triggerVerbs: ['fix', 'resolve', 'correct', 'handle', 'prevent', 'patch', 'repair', 'address', 'close', 'recover', 'guard', 'catch', 'stop'] },
	docs: { label: 'Documentation only', example: 'docs(readme): add setup instructions', triggerVerbs: ['document', 'describe', 'explain', 'clarify', 'expand', 'update', 'add', 'rewrite', 'fix', 'remove'] },
	style: { label: 'Formatting / whitespace only', example: 'style(button): fix indentation and spacing', triggerVerbs: ['format', 'indent', 'align', 'clean', 'trim', 'reorder', 'sort', 'rename', 'fix'] },
	refactor: { label: 'Code restructure (no feat/fix)', example: 'refactor(user): extract validation into service', triggerVerbs: ['extract', 'move', 'rename', 'restructure', 'reorganize', 'simplify', 'clean', 'split', 'merge', 'inline', 'replace', 'convert', 'refactor'] },
	perf: { label: 'Performance improvement', example: 'perf(db): add index on user_id column', triggerVerbs: ['optimize', 'reduce', 'improve', 'cache', 'memoize', 'batch', 'debounce', 'throttle', 'index', 'speed', 'lazy'] },
	test: { label: 'Tests only', example: 'test(auth): add unit tests for login handler', triggerVerbs: ['add', 'fix', 'update', 'remove', 'cover', 'write', 'improve', 'mock', 'stub'] },
	build: { label: 'Build system / dependencies', example: 'build(deps): upgrade react to v19', triggerVerbs: ['upgrade', 'add', 'remove', 'update', 'bump', 'downgrade', 'replace', 'migrate', 'configure', 'install', 'uninstall'] },
	ci: { label: 'CI/CD configuration', example: 'ci(github): add node 20 to test matrix', triggerVerbs: ['add', 'update', 'fix', 'configure', 'remove', 'enable', 'disable', 'migrate', 'set'] },
	chore: { label: 'Maintenance (no src/test changes)', example: 'chore: update .gitignore entries', triggerVerbs: ['update', 'add', 'remove', 'clean', 'configure', 'set', 'bump', 'release'] },
	revert: { label: 'Revert a previous commit', example: 'revert: revert feat(auth): add OAuth2 login', triggerVerbs: ['revert', 'undo', 'rollback'] },
}

const TYPE_ALIASES: Record<string, CommitType> = {
	feature: 'feat', features: 'feat',
	bugfix: 'fix', bug: 'fix', hotfix: 'fix', patch: 'fix', issue: 'fix',
	document: 'docs', doc: 'docs', documentation: 'docs', readme: 'docs',
	styling: 'style', styles: 'style', css: 'style', format: 'style', lint: 'style',
	refact: 'refactor', ref: 'refactor', restructure: 'refactor',
	optimize: 'perf', optimise: 'perf', performance: 'perf',
	tests: 'test', testing: 'test', spec: 'test', specs: 'test',
	deps: 'build', dep: 'build', dependency: 'build', dependencies: 'build',
	release: 'chore', config: 'chore', misc: 'chore', wip: 'chore', temp: 'chore',
	rollback: 'revert', undo: 'revert',
	pipeline: 'ci', workflow: 'ci', action: 'ci', actions: 'ci',
}

// ─── EXHAUSTIVE VERB MAP ───────────────────────────────────────────────────────
// Both past-tense AND gerund → imperative in one flat map.
// No brittle suffix-stripping — every entry is explicit and correct.

const VERB_TO_IMPERATIVE: Record<string, string> = {
	// Past tense
	added: 'add', fixed: 'fix', updated: 'update', changed: 'change', removed: 'remove',
	created: 'create', deleted: 'delete', modified: 'modify', refactored: 'refactor',
	improved: 'improve', implemented: 'implement', resolved: 'resolve', addressed: 'address',
	handled: 'handle', moved: 'move', renamed: 'rename', replaced: 'replace', reverted: 'revert',
	rewrote: 'rewrite', simplified: 'simplify', cleaned: 'clean', bumped: 'bump',
	upgraded: 'upgrade', downgraded: 'downgrade', enabled: 'enable', disabled: 'disable',
	configured: 'configure', migrated: 'migrate', extracted: 'extract', merged: 'merge',
	introduced: 'introduce', switched: 'switch', converted: 'convert', dropped: 'drop',
	deprecated: 'deprecate', adjusted: 'adjust', corrected: 'correct', formatted: 'format',
	initialized: 'initialize', exported: 'export', imported: 'import', wrapped: 'wrap',
	optimized: 'optimize', optimised: 'optimise', reorganized: 'reorganize',
	restructured: 'restructure', separated: 'separate', combined: 'combine',
	extended: 'extend', reduced: 'reduce', increased: 'increase', prevented: 'prevent',
	protected: 'protect', secured: 'secure', validated: 'validate', sanitized: 'sanitize',
	normalized: 'normalize', parsed: 'parse', transformed: 'transform', mapped: 'map',
	filtered: 'filter', sorted: 'sort', cached: 'cache', seeded: 'seed',
	scaffolded: 'scaffold', bootstrapped: 'bootstrap', deployed: 'deploy',
	released: 'release', published: 'publish', installed: 'install', uninstalled: 'uninstall',
	committed: 'commit', pushed: 'push', pulled: 'pull', fetched: 'fetch', cloned: 'clone',
	branched: 'branch', tagged: 'tag', rebased: 'rebase', squashed: 'squash',
	stashed: 'stash', patched: 'patch', applied: 'apply',
	registered: 'register', unregistered: 'unregister', subscribed: 'subscribe',
	unsubscribed: 'unsubscribe', connected: 'connect', disconnected: 'disconnect',
	authenticated: 'authenticate', authorized: 'authorize', logged: 'log',
	tracked: 'track', monitored: 'monitor', profiled: 'profile', benchmarked: 'benchmark',
	tested: 'test', mocked: 'mock', stubbed: 'stub', asserted: 'assert',
	documented: 'document', commented: 'comment', annotated: 'annotate', typed: 'type',
	linted: 'lint', minified: 'minify', bundled: 'bundle', compiled: 'compile',
	transpiled: 'transpile', built: 'build', generated: 'generate',
	copied: 'copy', duplicated: 'duplicate', linked: 'link', unlinked: 'unlink',
	synced: 'sync', split: 'split', paginated: 'paginate', serialized: 'serialize',
	encoded: 'encode', decoded: 'decode', encrypted: 'encrypt', decrypted: 'decrypt',
	hashed: 'hash', masked: 'mask', exposed: 'expose', closed: 'close', opened: 'open',
	toggled: 'toggle', fired: 'fire', emitted: 'emit', dispatched: 'dispatch',
	consumed: 'consume', processed: 'process', injected: 'inject', triggered: 'trigger',
	scheduled: 'schedule', queued: 'queue', retried: 'retry', elevated: 'elevate',
	abstracted: 'abstract', encapsulated: 'encapsulate', delegated: 'delegate',
	// Irregular past
	// built: 'build', broke: 'break', brought: 'bring', caught: 'catch', chose: 'choose',
	came: 'come', dealt: 'deal', drew: 'draw', drove: 'drive', ate: 'eat', fell: 'fall',
	felt: 'feel', found: 'find', flew: 'fly', forgot: 'forget', got: 'get', gave: 'give',
	went: 'go', grew: 'grow', had: 'have', heard: 'hear', held: 'hold', kept: 'keep',
	knew: 'know', led: 'lead', left: 'leave', let: 'let', lost: 'lose', made: 'make',
	meant: 'mean', met: 'meet', paid: 'pay', put: 'put', ran: 'run', read: 'read',
	rode: 'ride', rose: 'rise', said: 'say', saw: 'see', sold: 'sell', sent: 'send',
	set: 'set', shook: 'shake', shut: 'shut', sat: 'sit', slept: 'sleep', spoke: 'speak',
	spent: 'spend', stood: 'stand', stole: 'steal', stuck: 'stick', took: 'take',
	taught: 'teach', told: 'tell', thought: 'think', threw: 'throw', understood: 'understand',
	wore: 'wear', won: 'win', wrote: 'write',
	undid: 'undo', redid: 'redo', rebuilt: 'rebuild', overrode: 'override', hid: 'hide',
	// Gerunds
	adding: 'add', fixing: 'fix', updating: 'update', changing: 'change', removing: 'remove',
	creating: 'create', deleting: 'delete', modifying: 'modify', refactoring: 'refactor',
	improving: 'improve', implementing: 'implement', resolving: 'resolve',
	addressing: 'address', handling: 'handle', moving: 'move', renaming: 'rename',
	replacing: 'replace', reverting: 'revert', rewriting: 'rewrite',
	simplifying: 'simplify', cleaning: 'clean', bumping: 'bump', upgrading: 'upgrade',
	downgrading: 'downgrade', enabling: 'enable', disabling: 'disable',
	configuring: 'configure', migrating: 'migrate', extracting: 'extract',
	merging: 'merge', introducing: 'introduce', switching: 'switch', converting: 'convert',
	dropping: 'drop', deprecating: 'deprecate', adjusting: 'adjust', correcting: 'correct',
	formatting: 'format', initializing: 'initialize', exporting: 'export',
	importing: 'import', wrapping: 'wrap', optimizing: 'optimize', optimising: 'optimise',
	reorganizing: 'reorganize', restructuring: 'restructure', separating: 'separate',
	combining: 'combine', extending: 'extend', reducing: 'reduce', increasing: 'increase',
	preventing: 'prevent', protecting: 'protect', securing: 'secure',
	validating: 'validate', sanitizing: 'sanitize', normalizing: 'normalize',
	parsing: 'parse', transforming: 'transform', mapping: 'map', filtering: 'filter',
	sorting: 'sort', caching: 'cache', seeding: 'seed', scaffolding: 'scaffold',
	bootstrapping: 'bootstrap', deploying: 'deploy', releasing: 'release',
	publishing: 'publish', installing: 'install', uninstalling: 'uninstall',
	committing: 'commit', pushing: 'push', pulling: 'pull', fetching: 'fetch',
	cloning: 'clone', branching: 'branch', tagging: 'tag', rebasing: 'rebase',
	squashing: 'squash', stashing: 'stash', patching: 'patch', applying: 'apply',
	registering: 'register', subscribing: 'subscribe', connecting: 'connect',
	disconnecting: 'disconnect', authenticating: 'authenticate', authorizing: 'authorize',
	logging: 'log', tracking: 'track', monitoring: 'monitor', profiling: 'profile',
	testing: 'test', mocking: 'mock', documenting: 'document', typing: 'type',
	linting: 'lint', minifying: 'minify', bundling: 'bundle', compiling: 'compile',
	transpiling: 'transpile', building: 'build', generating: 'generate',
	copying: 'copy', duplicating: 'duplicate', linking: 'link', unlinking: 'unlink',
	syncing: 'sync', splitting: 'split', encoding: 'encode', decoding: 'decode',
	encrypting: 'encrypt', decrypting: 'decrypt', hashing: 'hash', masking: 'mask',
	exposing: 'expose', closing: 'close', opening: 'open', toggling: 'toggle',
	firing: 'fire', emitting: 'emit', dispatching: 'dispatch', consuming: 'consume',
	processing: 'process', injecting: 'inject', triggering: 'trigger',
	scheduling: 'schedule', queueing: 'queue', retrying: 'retry',
	abstracting: 'abstract', encapsulating: 'encapsulate', delegating: 'delegate',
}

const VAGUE_WORDS = new Set([
	'fix', 'fixes', 'update', 'updates', 'change', 'changes', 'modify', 'edit', 'tweak',
	'stuff', 'things', 'misc', 'various', 'wip', 'temp', 'tmp', 'todo', 'test', 'debug',
	'patch', 'work', 'code', 'minor', 'cleanup', 'clean', 'refactor', 'commit',
	'improvement', 'improvements', 'enhancement', 'issue', 'feature', 'task',
])

const VALID_FOOTER_RE = /^(BREAKING CHANGE|BREAKING-CHANGE|Closes?|Fixes?|Resolves?|Refs?|See|Co-authored-by|Reviewed-by|Signed-off-by|Acked-by|Cc|Related-to|Part-of|Reverts?)\s*[:#]/i
const ISSUE_REF_RE = /^(closes?|fixes?|resolves?)\s+(#\d+|[A-Z]+-\d+)/im
const CO_AUTHOR_RE = /^Co-authored-by:\s*.+\s+<.+@.+>/im

// ─── HELPERS ──────────────────────────────────────────────────────────────────

function levenshtein(a: string, b: string): number {
	const dp = Array.from({ length: a.length + 1 }, (_, i) =>
		Array.from({ length: b.length + 1 }, (_, j) => i === 0 ? j : j === 0 ? i : 0))
	for (let i = 1; i <= a.length; i++)
		for (let j = 1; j <= b.length; j++)
			dp[i][j] = a[i - 1] === b[j - 1] ? dp[i - 1][j - 1] : 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1])
	return dp[a.length][b.length]
}

function closestValidType(input: string): CommitType | null {
	let best: CommitType | null = null, bestDist = Infinity
	for (const t of VALID_TYPES) {
		const d = levenshtein(input.toLowerCase(), t)
		if (d < bestDist) { bestDist = d; best = t }
	}
	return bestDist <= 2 ? best : null
}

function toImperative(word: string): string | null {
	return VERB_TO_IMPERATIVE[word.toLowerCase()] ?? null
}

function fixImperativeMood(desc: string): { fixed: string; changed: boolean; badWord: string; goodWord: string; type: 'past' | 'gerund' | 'none' } {
	const firstWord = desc.trim().split(/\s+/)[0]
	const imp = toImperative(firstWord)
	if (imp) {
		return {
			fixed: desc.trim().replace(new RegExp(`^${firstWord}`, 'i'), imp),
			changed: true,
			badWord: firstWord,
			goodWord: imp,
			type: firstWord.toLowerCase().endsWith('ing') ? 'gerund' : 'past',
		}
	}
	return { fixed: desc, changed: false, badWord: '', goodWord: '', type: 'none' }
}

function inferType(desc: string): CommitType | null {
	const lower = desc.toLowerCase()
	const verb = lower.split(/\s+/)[0]
	const baseVerb = toImperative(verb) ?? verb
	for (const [type, meta] of Object.entries(TYPE_META) as [CommitType, typeof TYPE_META[CommitType]][]) {
		if (meta.triggerVerbs.includes(baseVerb)) return type
	}
	if (/^(fix|resolve|correct|handle|repair|patch|prevent)\b/.test(lower)) return 'fix'
	if (/^(add|create|implement|introduce|build|scaffold|support|enable)\b/.test(lower)) return 'feat'
	if (/^(revert|undo|rollback)\b/.test(lower)) return 'revert'
	if (/^(bump|upgrade|downgrade|install|uninstall)\b/.test(lower)) return 'build'
	if (/^(optimize|optimise|cache|memoize)\b/.test(lower)) return 'perf'
	if (/test|spec|mock|stub/i.test(lower)) return 'test'
	if (/doc|readme|comment/i.test(lower)) return 'docs'
	return null
}

/** Always produces a clean, correct commit subject */
function buildCommit(type: string, scope: string | null, bang: boolean, desc: string): string {
	const cleanScope = scope ? scope.trim().toLowerCase().replace(/\s+/g, '-') : null
	const { fixed } = fixImperativeMood(desc)
	const cleanedDesc = (fixed.charAt(0).toLowerCase() + fixed.slice(1)).replace(/\.$/, '').trim()
	let s = type
	if (cleanScope) s += `(${cleanScope})`
	if (bang) s += '!'
	s += `: ${cleanedDesc}`
	return s
}

// ─── LAYER 1: RULE-BASED VALIDATION (instant) ─────────────────────────────────

export function validateCommitMessage(raw: string): ValidationResult {
	const errors: string[] = []
	const warnings: string[] = []
	const infos: string[] = []
	const suggestions: string[] = []
	let score = 100

	if (!raw || raw.trim().length === 0) {
		return { isValid: false, errors: ['Commit message cannot be empty.'], warnings: [], infos: [], suggestions: [], score: 0 }
	}

	const lines = raw.split('\n')
	const rawSubject = lines[0]
	const subject = rawSubject.trim()
	const hasBody = lines.length > 2
	const bodyLines = lines.slice(2)
	const bodyText = bodyLines.join('\n')
	const hasColon = subject.includes(':')

	// Parse — tolerant: works with or without colon
	const colonMatch = subject.match(/^([a-zA-Z]+)(\([^)]*\))?(!)?\s*:\s*(.*)/)
	let rawType = ''
	let rawScope: string | null = null
	let rawBang = false
	let rawDesc = ''

	if (colonMatch) {
		rawType = colonMatch[1] ?? ''
		rawScope = colonMatch[2] ? colonMatch[2].slice(1, -1) : null
		rawBang = colonMatch[3] === '!'
		rawDesc = colonMatch[4]?.trim() ?? ''
	} else {
		// No colon — ENTIRE subject is the description (fixes the core bug)
		rawDesc = subject
	}

	const resolvedType: CommitType =
		VALID_TYPES.includes(rawType as CommitType) ? rawType as CommitType :
			TYPE_ALIASES[rawType.toLowerCase()] ? TYPE_ALIASES[rawType.toLowerCase()] :
				inferType(rawDesc) ?? 'feat'

	// ── Format shape ─────────────────────────────────────────────────────────
	const validShape = /^[a-zA-Z]+(\([^)]*\))?(!)?: .+/.test(subject)

	if (!validShape) {
		if (!hasColon) {
			errors.push('Missing type prefix. Format: type(scope): description')
			score -= 40
			if (rawDesc.length > 0) {
				const inf = inferType(rawDesc) ?? 'feat'
				suggestions.push(`→ ${buildCommit(inf, null, false, rawDesc)}`)
				if (inf !== 'feat') suggestions.push(`→ ${buildCommit('feat', null, false, rawDesc)}`)
				if (inf !== 'fix') suggestions.push(`→ ${buildCommit('fix', null, false, rawDesc)}`)
			} else {
				suggestions.push('→ feat: add <what you added>')
				suggestions.push('→ fix(scope): resolve <what you fixed>')
			}
		} else if (/^[A-Z]/.test(subject)) {
			errors.push('Type must be lowercase: "feat:" not "Feat:"')
			suggestions.push(`→ ${subject[0].toLowerCase() + subject.slice(1)}`)
			score -= 20
		} else {
			errors.push('Subject must follow: type(scope): description — e.g. feat(auth): add login page')
			suggestions.push(`→ ${buildCommit(resolvedType, rawScope, rawBang, rawDesc || '<description>')}`)
			score -= 30
		}
	}

	// ── Type ─────────────────────────────────────────────────────────────────
	if (rawType && !VALID_TYPES.includes(rawType as CommitType)) {
		const corrected = TYPE_ALIASES[rawType.toLowerCase()] ?? closestValidType(rawType)
		if (corrected) {
			errors.push(`"${rawType}" is not a valid type. Did you mean "${corrected}"? — ${TYPE_META[corrected].label}`)
			suggestions.push(`→ ${buildCommit(corrected, rawScope, rawBang, rawDesc)}`)
		} else {
			errors.push(`"${rawType}" is not a valid type. Valid: ${VALID_TYPES.join(', ')}`)
		}
		score -= 30
	}

	// ── Scope ─────────────────────────────────────────────────────────────────
	if (/^[a-zA-Z]+\(\s*\)/.test(subject)) {
		errors.push('Scope cannot be empty — remove "()" or add a name: feat(auth): …')
		suggestions.push(`→ ${buildCommit(resolvedType, null, rawBang, rawDesc)}`)
		score -= 15
	}
	if (rawScope) {
		if (/[A-Z]/.test(rawScope)) {
			errors.push(`Scope must be lowercase: "${rawScope.toLowerCase()}" not "${rawScope}"`)
			suggestions.push(`→ ${buildCommit(resolvedType, rawScope, rawBang, rawDesc)}`)
			score -= 10
		}
		if (/\s/.test(rawScope)) {
			const kebab = rawScope.trim().replace(/\s+/g, '-').toLowerCase()
			errors.push(`Scope must not contain spaces — use kebab-case: "${kebab}"`)
			suggestions.push(`→ ${buildCommit(resolvedType, kebab, rawBang, rawDesc)}`)
			score -= 10
		}
		if (rawScope.length > 25) { warnings.push(`Scope "${rawScope}" is long — keep it short: "auth", "api"`); score -= 5 }
		if (/[^a-zA-Z0-9\-\/]/.test(rawScope)) { warnings.push(`Scope has unusual characters — use letters, numbers, hyphens only`); score -= 5 }
	}

	// ── Separator ─────────────────────────────────────────────────────────────
	if (hasColon) {
		if (/^[^:]+: {2,}/.test(subject)) {
			errors.push('Only one space after the colon.')
			suggestions.push(`→ ${subject.replace(/^([^:]+): {2,}/, '$1: ')}`)
			score -= 5
		}
		if (/^[a-zA-Z]+(\([^)]*\))?(!)?\S*:[^\s]/.test(subject)) {
			errors.push('A space is required after the colon: "feat: …" not "feat:…"')
			suggestions.push(`→ ${subject.replace(/^([^:]+):([^\s])/, '$1: $2')}`)
			score -= 15
		}
	}

	// ── Description ───────────────────────────────────────────────────────────
	if (hasColon && rawDesc.length === 0) {
		errors.push('Description cannot be empty after the colon.')
		suggestions.push(`→ ${resolvedType}${rawScope ? `(${rawScope})` : ''}: <describe what this commit does>`)
		score -= 25
	} else if (rawDesc.length > 0) {

		// Imperative mood — uses exhaustive verb map
		const moodFix = fixImperativeMood(rawDesc)
		if (moodFix.changed) {
			const label = moodFix.type === 'gerund' ? '-ing gerund' : 'past tense'
			warnings.push(`Use imperative mood — write "${moodFix.goodWord}", not "${moodFix.badWord}" (${label}). A commit subject says what it does, not what was done.`)
			suggestions.push(`→ ${buildCommit(resolvedType, rawScope, rawBang, moodFix.fixed)}`)
			score -= 8
		}

		if (/^[A-Z]/.test(rawDesc)) {
			errors.push(`Description must start lowercase: "${rawDesc[0].toLowerCase() + rawDesc.slice(1)}"`)
			suggestions.push(`→ ${buildCommit(resolvedType, rawScope, rawBang, rawDesc)}`)
			score -= 10
		}
		if (rawDesc.endsWith('.')) {
			errors.push('Description must not end with a period.')
			suggestions.push(`→ ${buildCommit(resolvedType, rawScope, rawBang, rawDesc.slice(0, -1))}`)
			score -= 5
		}
		if (/[!?]$/.test(rawDesc)) {
			warnings.push('Description should not end with "!" or "?".')
			suggestions.push(`→ ${buildCommit(resolvedType, rawScope, rawBang, rawDesc.replace(/[!?]+$/, ''))}`)
			score -= 3
		}

		const descWords = rawDesc.trim().toLowerCase().split(/\s+/)
		if (descWords.length === 1 && VAGUE_WORDS.has(descWords[0])) {
			errors.push(`"${rawDesc}" is too vague — e.g. "${TYPE_META[resolvedType].example}"`)
			suggestions.push(`→ ${resolvedType}${rawScope ? `(${rawScope})` : ''}: <specific description>`)
			score -= 20
		}
		if (rawDesc.length < 10) { warnings.push(`Description is only ${rawDesc.length} chars — add more context.`); score -= 10 }
		if (descWords.length > 12) { warnings.push(`${descWords.length} words is too many — aim for 5–9. Move detail to the body.`); score -= 5 }
		if (rawDesc === rawDesc.toUpperCase() && /[A-Z]{3,}/.test(rawDesc)) {
			errors.push('Description must not be ALL CAPS.')
			suggestions.push(`→ ${buildCommit(resolvedType, rawScope, rawBang, rawDesc.toLowerCase())}`)
			score -= 10
		}
		if (/^this commit\b/i.test(rawDesc)) {
			const s = rawDesc.replace(/^this commit\s*(will\s*)?/i, '')
			warnings.push('"This commit …" is redundant.')
			suggestions.push(`→ ${buildCommit(resolvedType, rawScope, rawBang, s)}`)
			score -= 5
		}
		if (/^I\s/i.test(rawDesc)) {
			warnings.push('Avoid first-person ("I …") — use imperative mood.')
			suggestions.push(`→ ${buildCommit(resolvedType, rawScope, rawBang, rawDesc.replace(/^I\s+/i, ''))}`)
			score -= 5
		}
		const inlineIssue = rawDesc.match(/\b(#\d+|[A-Z]+-\d+)\b/)
		if (inlineIssue) {
			warnings.push(`Issue reference "${inlineIssue[0]}" belongs in the footer, not the subject.`)
			suggestions.push(`→ Footer: Closes ${inlineIssue[0]}`)
			score -= 5
		}
		for (let i = 0; i < descWords.length - 1; i++) {
			if (descWords[i] === descWords[i + 1] && descWords[i].length > 1) {
				const deduped = rawDesc.replace(new RegExp(`\\b${descWords[i]}\\s+${descWords[i]}\\b`, 'i'), descWords[i])
				warnings.push(`Duplicate word "${descWords[i]}" in description.`)
				suggestions.push(`→ ${buildCommit(resolvedType, rawScope, rawBang, deduped)}`)
				score -= 3; break
			}
		}
		if (/^(a |an |the )/i.test(rawDesc)) {
			infos.push('Starting with "a/an/the" is unnecessary — "add login page" not "add a login page".')
			suggestions.push(`→ ${buildCommit(resolvedType, rawScope, rawBang, rawDesc.replace(/^(a |an |the )/i, ''))}`)
		}
		if (/\b(is|was|were|has been|have been)\s+\w+(ed|en)\b/i.test(rawDesc)) {
			warnings.push('Passive voice detected — use active imperative: "fix crash" not "crash was fixed".')
			score -= 4
		}
		const inferredFromDesc = inferType(rawDesc)
		if (inferredFromDesc && inferredFromDesc !== resolvedType && VALID_TYPES.includes(rawType as CommitType)) {
			infos.push(`Description suggests "${inferredFromDesc}" (${TYPE_META[inferredFromDesc].label}) — is "${rawType}" the right type?`)
			suggestions.push(`→ ${buildCommit(inferredFromDesc, rawScope, rawBang, rawDesc)}`)
		}
	}

	// ── Length ────────────────────────────────────────────────────────────────
	if (subject.length > 72) { errors.push(`Subject is ${subject.length} chars — hard limit is 72.`); score -= 20 }
	else if (subject.length > 50) { warnings.push(`Subject is ${subject.length} chars — aim for ≤50.`); score -= 3 }
	else if (subject.length < 10 && subject.length > 0) { warnings.push(`Subject is very short (${subject.length} chars).`); score -= 5 }

	// ── Whitespace ────────────────────────────────────────────────────────────
	if (rawSubject !== rawSubject.trim()) { errors.push('No leading/trailing whitespace in subject.'); score -= 5 }
	if (rawSubject.includes('\t')) { errors.push('No tab characters in subject.'); score -= 5 }

	// ── Blank line separator ──────────────────────────────────────────────────
	if (lines.length > 1 && lines[1].trim() !== '') {
		errors.push('A blank line is required between subject and body.')
		suggestions.push('→ Add an empty line after the subject.')
		score -= 10
	}

	// ── Body ──────────────────────────────────────────────────────────────────
	if (hasBody) {
		bodyLines.forEach((line, i) => {
			if (line.length > 100) { errors.push(`Body line ${i + 3} is ${line.length} chars — wrap at 100.`); score -= 5 }
			else if (line.length > 72) infos.push(`Body line ${i + 3} is ${line.length} chars — consider wrapping at 72.`)
		})
		if (bodyText.trim().toLowerCase() === rawDesc.toLowerCase()) {
			warnings.push('Body is identical to the subject — explain the "why" instead.')
			suggestions.push('→ Body: Why was this needed? What problem does it solve?')
			score -= 10
		}
		if (/^this commit\b/i.test(bodyText.trim())) { warnings.push('Body should not start with "This commit …"'); score -= 5 }
		if (bodyText.trim().length === 0) infos.push('Body is empty — add content or remove the extra blank lines.')
	}

	// ── Footer ────────────────────────────────────────────────────────────────
	if (hasBody) {
		bodyLines.filter(l => l.trim()).forEach(line => {
			if (/^[A-Z][a-zA-Z\-]+:/.test(line) && !VALID_FOOTER_RE.test(line)) {
				warnings.push(`Footer token "${line.split(':')[0]}" may not be recognised. Use: Closes, Fixes, Co-authored-by, BREAKING CHANGE.`)
				score -= 3
			}
		})
		const breakingLine = lines.find(l => /^BREAKING[- ]CHANGE:/.test(l))
		if (breakingLine) {
			const bd = breakingLine.replace(/^BREAKING[- ]CHANGE:\s*/i, '').trim()
			if (bd.length < 10) {
				errors.push('BREAKING CHANGE must describe what changed and how to migrate.')
				suggestions.push('→ BREAKING CHANGE: `getUser()` now returns a Promise — await it or use .then()')
				score -= 15
			}
		}
		if (subject.includes('!') && !breakingLine) {
			warnings.push('"!" marks a breaking change but no BREAKING CHANGE footer found.')
			suggestions.push('→ Add: BREAKING CHANGE: <what broke> — <migration steps>')
			score -= 8
		}
		if (!subject.includes('!') && breakingLine) {
			infos.push('You have a BREAKING CHANGE footer — add "!" to subject: feat(api)!: …')
			if (rawType && rawDesc) suggestions.push(`→ ${buildCommit(rawType, rawScope, true, rawDesc)}`)
		}
		lines.filter(l => /^Co-authored-by:/i.test(l)).forEach(line => {
			if (!CO_AUTHOR_RE.test(line)) {
				warnings.push('Co-authored-by: must be "Name <email@example.com>"')
				suggestions.push('→ Co-authored-by: Jane Doe <jane@example.com>')
				score -= 5
			}
		})
		if (!ISSUE_REF_RE.test(bodyText) && bodyText.trim().length > 0) {
			infos.push('Tip: Reference issues in the footer to auto-close on merge.')
			suggestions.push('→ Closes #<number>  or  Fixes PROJ-<id>')
		}
	}

	// ── Type-specific hints ───────────────────────────────────────────────────
	const eff = (VALID_TYPES.includes(rawType as CommitType) ? rawType : resolvedType) as CommitType
	if (eff === 'feat' && !rawScope && rawDesc) { infos.push('Consider adding a scope: "feat(auth): …"'); suggestions.push(`→ feat(<module>): ${rawDesc}`) }
	if (eff === 'revert' && !bodyText.toLowerCase().includes('this reverts commit')) { infos.push('Include the original hash in the body.'); suggestions.push('→ Body: This reverts commit <full-sha>.') }
	if (eff === 'test' && rawDesc && !/\b(test|spec|coverage|mock|stub|assert|unit|integration|e2e)\b/i.test(rawDesc)) { warnings.push('Type is "test" but description has no testing terms — check the type.'); score -= 3 }
	if (eff === 'perf' && rawDesc && rawDesc.length < 20) infos.push('Name what improved: "perf(db): add index on user_id to cut query time"')
	if (eff === 'style' && rawDesc && !/\b(format|indent|whitespace|spacing|align|lint|trailing|semi|quote|prettier)\b/i.test(rawDesc)) infos.push('"style" is for formatting only — if logic changed, use "refactor" or "fix".')
	if (['chore', 'style', 'docs'].includes(eff) && /\b(feature|implement|new|introduce)\b/i.test(rawDesc)) {
		infos.push(`Sounds like a new feature — consider "feat" instead of "${eff}".`)
		if (rawDesc) suggestions.push(`→ ${buildCommit('feat', rawScope, rawBang, rawDesc)}`)
	}
	if (subject.length > 60 && !hasBody) infos.push('Long subject — add a body with the "why". Keep subject ≤50 chars.')

	// Deduplicate
	const seen = new Set<string>()
	score = Math.max(0, Math.min(100, score))

	return {
		isValid: errors.length === 0,
		errors, warnings, infos, score,
		suggestions: suggestions.filter(s => !seen.has(s) && !!seen.add(s)),
	}
}

// ─── LAYER 2: AI SEMANTIC ANALYSIS ────────────────────────────────────────────
// Catches things rules can never catch:
// - Nonsensical descriptions ("loved home page by adding payment")
// - Wrong type for the actual change
// - Unclear or ambiguous wording
// - Missing context that makes the commit hard to understand
// - Tone / professionalism issues

// ─── LAYER 2: AI SEMANTIC ANALYSIS (via Next.js API route) ──────────────────
// Calls /api/analyze-commit which holds the API key server-side.
// Catches semantic issues rules can never catch:
//   - Nonsensical descriptions ("loved home page by adding payment")
//   - Type/description mismatches ("feat: remove login page")
//   - Ambiguous or meaningless descriptions
//   - Missing critical context

export async function analyzeWithAI(
	commitMessage: string,
	context: { type: string; scope: string; description: string; isBreaking?: boolean } = { type: '', scope: '', description: '', isBreaking: false }
): Promise<AIAnalysis> {
	if (!commitMessage || commitMessage.trim().length === 0) {
		return { loading: false, issues: [], corrected: null, alternatives: null, isPerfect: false, scopeSuggestion: null, bodyHint: null, footerHint: null, error: null }
	}

	try {
		const response = await fetch('/api/analyze-commit', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				commitMessage,
				type: context.type,
				scope: context.scope,
				description: context.description,
				isBreaking: context.isBreaking ?? false,
			}),
		})

		if (!response.ok) {
			const errBody = await response.text().catch(() => '')
			throw new Error(`Route ${response.status}: ${errBody}`)
		}

		const parsed = await response.json()
		if (parsed.error) throw new Error(parsed.error)

		return {
			loading: false,
			issues: Array.isArray(parsed.issues) ? parsed.issues : [],
			corrected: parsed.corrected ?? null,
			alternatives: Array.isArray(parsed.alternatives) ? parsed.alternatives : null,
			isPerfect: parsed.isPerfect ?? false,
			scopeSuggestion: parsed.scopeSuggestion ?? null,
			bodyHint: parsed.bodyHint ?? null,
			footerHint: parsed.footerHint ?? null,
			error: null,
		}
	} catch (err) {
		return {
			loading: false,
			issues: [],
			corrected: null,
			alternatives: null,
			isPerfect: false,
			scopeSuggestion: null,
			bodyHint: null,
			footerHint: null,
			error: err instanceof Error ? err.message : 'AI analysis failed',
		}
	}
}

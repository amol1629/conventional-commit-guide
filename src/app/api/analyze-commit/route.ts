// app/api/analyze-commit/route.ts
//
// Multi-provider AI with persistent caching via Vercel KV or in-memory fallback.
// Cached responses are reused for identical commits — saves tokens on every repeat.
//
// .env.local:
//   OPENROUTER_API_KEY=sk-or-...   ← free, no daily token cap  → openrouter.ai
//   GROQ_API_KEY=gsk_...           ← 14,400 req/day free        → console.groq.com
//   GEMINI_API_KEY=AIza...         ← 1500 req/day free          → aistudio.google.com/apikey
//   KV_REST_API_URL=...            ← optional: Vercel KV for persistent cache
//   KV_REST_API_TOKEN=...          ← optional: Vercel KV token

import { NextRequest, NextResponse } from 'next/server'

// ── Minimal prompt — every token costs quota ──────────────────────────────────
// Rule engine handles format/syntax. AI only handles semantics.
const SYSTEM = `You are a Conventional Commits expert. Validate semantics. Format/syntax already checked by rule engine.

TYPES: feat=new feature|fix=bug fix|docs=docs only|style=formatting no logic|refactor=restructure no feat/fix|perf=perf gain|test=tests only|build=build/deps|ci=CI config|chore=maintenance|revert=undo commit
MOOD: imperative only — "add" not "added/adding/adds"
TYPE MATCH: feat+dep-update→build, feat+bugfix→fix, fix+new-feature→feat

isPerfect=true ONLY when ALL: imperative verb + correct type + specific description + subject≤50 chars

WHEN isPerfect=true — you MUST return exactly 3 alternatives in the "alternatives" array.
Each alternative is a COMPLETE real-world commit based on the user's description.
Make them genuinely different and useful — vary scope, specificity, and add body/footer where it helps.

Example: if commit is "feat: add login page" → alternatives should be:
["feat(auth): add login page with email and password form\n\nImplements the initial login UI. Connects to the /auth/login endpoint and handles validation errors inline.","feat(ui): add login page component\n\nCreates the LoginPage component using the existing Form and Input primitives. Redirects to /dashboard on success.","feat(auth): add user login page\n\nBasic login page with email/password fields. Error states and loading spinner included. Follows the design system tokens."]

Each alternative must:
- Be a valid conventional commit (type(scope): description)
- Have a body explaining WHY or WHAT in more detail (2-3 sentences)
- Have a footer when relevant (Closes #n for fixes, BREAKING CHANGE: for breaking)
- Be specific to what the user actually typed — not generic

bodyHint: suggest what to write in body based on the commit (null if truly not needed)
footerHint: "Add 'Closes #<issue-number>' if this fixes a tracked issue" for fixes, BREAKING CHANGE hint for breaking, null otherwise

MODE A: {"isPerfect":false,"issues":[{"severity":"error"|"warning"|"info","message":"max 2 sentences"}],"corrected":"subject\n\nbody\n\nfooter","alternatives":null,"isNonsense":false,"scopeSuggestion":"or null","bodyHint":"or null","footerHint":"or null"}
MODE B: {"isPerfect":true,"issues":[],"corrected":null,"alternatives":["complete commit 1 with body","complete commit 2 with body","complete commit 3 with body"],"isNonsense":false,"scopeSuggestion":null,"bodyHint":"or null","footerHint":"or null"}
JSON only. No markdown. No backticks outside string values.`

// ── In-memory cache (process lifetime) + optional Vercel KV ──────────────────
// Cache key = normalized commit message. TTL = 24h.
// This means: same commit typed by any user → instant response, zero tokens.

const memCache = new Map<string, { data: Record<string, unknown>; exp: number }>()
const CACHE_TTL = 24 * 60 * 60 * 1000 // 24 hours

function cacheKey(msg: string, type: string, scope: string): string {
  // Normalize: lowercase, trim, collapse whitespace
  return `${type}|${scope}|${msg.toLowerCase().trim().replace(/\s+/g, ' ')}`
}

async function getCache(key: string): Promise<Record<string, unknown> | null> {
  // 1. Check memory cache first
  const mem = memCache.get(key)
  if (mem && mem.exp > Date.now()) return mem.data
  if (mem) memCache.delete(key)

  // 2. Try Vercel KV if configured
  if (process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN) {
    try {
      const res = await fetch(`${process.env.KV_REST_API_URL}/get/${encodeURIComponent(key)}`, {
        headers: { Authorization: `Bearer ${process.env.KV_REST_API_TOKEN}` },
      })
      if (res.ok) {
        const { result } = await res.json()
        if (result) {
          const data = JSON.parse(result)
          memCache.set(key, { data, exp: Date.now() + CACHE_TTL })
          return data
        }
      }
    } catch { /* KV unavailable — continue */ }
  }
  return null
}

async function setCache(key: string, data: Record<string, unknown>): Promise<void> {
  memCache.set(key, { data, exp: Date.now() + CACHE_TTL })

  if (process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN) {
    try {
      await fetch(`${process.env.KV_REST_API_URL}/set/${encodeURIComponent(key)}`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${process.env.KV_REST_API_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ value: JSON.stringify(data), ex: 86400 }), // 24h TTL
      })
    } catch { /* KV unavailable — memory cache still works */ }
  }
}

// ── Response parser + safety nets ────────────────────────────────────────────

function parseAIResponse(
  text: string,
  firstWord: string,
  commitMessage: string,
  subjectOnly: string,
  detectedTypeMismatch: boolean,
  wrongType: string,
  rightType: string,
): Record<string, unknown> {
  const clean = text.replace(/```json|```/g, '').trim()
  let parsed: Record<string, unknown>
  try { parsed = JSON.parse(clean) }
  catch {
    return {
      issues: [{ severity: 'info', message: 'AI returned an unexpected format. Please try again.' }],
      corrected: null, alternatives: null, isPerfect: false,
      isNonsense: false, scopeSuggestion: null, bodyHint: null, footerHint: null,
    }
  }

  // Hard safety: never isPerfect if mood is wrong
  const badMood = (firstWord.endsWith('ed') && firstWord.length > 3) ||
    (firstWord.endsWith('ing') && firstWord.length > 4)
  if (badMood && parsed.isPerfect) {
    const imp = firstWord.endsWith('ed')
      ? firstWord.replace(/ied$/, 'y').replace(/ed$/, '')
      : firstWord.replace(/ing$/, '')
    parsed.isPerfect = false
    if (!Array.isArray(parsed.issues) || !(parsed.issues as []).length) {
      parsed.issues = [{ severity: 'error', message: `Use imperative mood — write "${imp}" not "${firstWord}"` }]
    }
    if (!parsed.corrected) {
      parsed.corrected = subjectOnly.replace(new RegExp(`(:\\s*)${firstWord}\\b`, 'i'), `$1${imp}`)
    }
  }

  // Hard safety: if server detected type mismatch, enforce the correction
  if (detectedTypeMismatch && parsed.corrected) {
    // Replace the wrong type in the corrected field with the right one
    parsed.corrected = (parsed.corrected as string).replace(
      new RegExp(`^(${wrongType})([(!(:)])`, 'i'),
      `${rightType}$2`
    )
    // Ensure issue is present
    if (!Array.isArray(parsed.issues) || !(parsed.issues as { severity: string; message: string }[]).some(i => i.message.includes('type'))) {
      const issues = Array.isArray(parsed.issues) ? [...parsed.issues as unknown[]] : []
      issues.unshift({ severity: 'error', message: `Type mismatch: "${wrongType}" is wrong for this change. Use "${rightType}" instead.` })
      parsed.issues = issues
    }
    parsed.isPerfect = false
  }

  return {
    issues: Array.isArray(parsed.issues) ? parsed.issues : [],
    corrected: (parsed.corrected as string) ?? null,
    alternatives: Array.isArray(parsed.alternatives) ? parsed.alternatives as string[] : null,
    isPerfect: (parsed.isPerfect as boolean) ?? false,
    isNonsense: (parsed.isNonsense as boolean) ?? false,
    scopeSuggestion: (parsed.scopeSuggestion as string) ?? null,
    bodyHint: (parsed.bodyHint as string) ?? null,
    footerHint: (parsed.footerHint as string) ?? null,
    _cached: false,
  }
}

// ── Provider functions ────────────────────────────────────────────────────────

async function callOpenRouter(
  apiKey: string, userPrompt: string, firstWord: string, commitMessage: string,
  subjectOnly: string, hasMismatch: boolean, wrongType: string, rightType: string,
): Promise<{ ok: boolean; data?: Record<string, unknown>; error?: string }> {
  // Verified working free model IDs as of 2025
  const models = [
    'google/gemma-2-9b-it:free',
    'meta-llama/llama-3.2-3b-instruct:free',
    'mistralai/mistral-7b-instruct:free',
  ]
  for (const model of models) {
    try {
      const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
          'HTTP-Referer': 'https://commitcraft.app',
          'X-Title': 'CommitCraft',
        },
        body: JSON.stringify({
          model,
          max_tokens: 400,
          temperature: 0.1,
          messages: [{ role: 'system', content: SYSTEM }, { role: 'user', content: userPrompt }],
        }),
      })
      if (res.status === 429 || res.status === 404) continue
      if (!res.ok) return { ok: false, error: `OpenRouter ${res.status}` }
      const d = await res.json()
      const text = d.choices?.[0]?.message?.content ?? ''
      if (!text) continue
      return { ok: true, data: parseAIResponse(text, firstWord, commitMessage, subjectOnly, hasMismatch, wrongType, rightType) }
    } catch { continue }
  }
  return { ok: false, error: 'OpenRouter: all free models unavailable' }
}

async function callGroq(
  apiKey: string, userPrompt: string, firstWord: string, commitMessage: string,
  subjectOnly: string, hasMismatch: boolean, wrongType: string, rightType: string,
): Promise<{ ok: boolean; data?: Record<string, unknown>; error?: string }> {
  try {
    const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${apiKey}` },
      body: JSON.stringify({
        model: 'llama-3.1-8b-instant',
        max_tokens: 400,
        temperature: 0.1,
        messages: [{ role: 'system', content: SYSTEM }, { role: 'user', content: userPrompt }],
      }),
    })
    if (res.status === 429) return { ok: false, error: 'Groq: daily limit reached' }
    if (!res.ok) return { ok: false, error: `Groq ${res.status}: ${await res.text().catch(() => '')}` }
    const d = await res.json()
    const text = d.choices?.[0]?.message?.content ?? ''
    return { ok: true, data: parseAIResponse(text, firstWord, commitMessage, subjectOnly, hasMismatch, wrongType, rightType) }
  } catch (e) { return { ok: false, error: String(e) } }
}

async function callGemini(
  apiKey: string, userPrompt: string, firstWord: string, commitMessage: string,
  subjectOnly: string, hasMismatch: boolean, wrongType: string, rightType: string,
): Promise<{ ok: boolean; data?: Record<string, unknown>; error?: string }> {
  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          system_instruction: { parts: [{ text: SYSTEM }] },
          contents: [{ parts: [{ text: userPrompt }] }],
          generationConfig: { maxOutputTokens: 400, temperature: 0.1 },
        }),
      }
    )
    if (res.status === 429) return { ok: false, error: 'Gemini: daily limit reached' }
    if (!res.ok) return { ok: false, error: `Gemini ${res.status}: ${await res.text().catch(() => '')}` }
    const d = await res.json()
    const text = d.candidates?.[0]?.content?.parts?.[0]?.text ?? ''
    return { ok: true, data: parseAIResponse(text, firstWord, commitMessage, subjectOnly, hasMismatch, wrongType, rightType) }
  } catch (e) { return { ok: false, error: String(e) } }
}

// ── Main handler ──────────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  let body: {
    commitMessage: string
    type?: string
    scope?: string
    description?: string
    isBreaking?: boolean
  }
  try {
    body = await req.json()
    if (!body.commitMessage?.trim()) {
      return NextResponse.json({ error: 'commitMessage is required' }, { status: 400 })
    }
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
  }

  const {
    commitMessage,
    type = '',
    scope = '',
    description = '',
    isBreaking = false,
  } = body

  // ── Check cache first — key uses subject line only (body/footer don't change the analysis)
  const subjectForCache = commitMessage.split('\n')[0].trim()
  const key = cacheKey(subjectForCache, type, scope)
  const cached = await getCache(key)
  if (cached) {
    return NextResponse.json({ ...cached, _cached: true })
  }

  // ── Server pre-computation — model never has to count/guess these ─────────
  const firstWord = description.trim().split(/\s+/)[0]?.toLowerCase() ?? ''
  const endsInEd = firstWord.endsWith('ed') && firstWord.length > 3
  const endsInIng = firstWord.endsWith('ing') && firstWord.length > 4
  const subjectLen = type.length + (scope ? scope.length + 2 : 0) + (isBreaking ? 1 : 0) + 2 + description.length

  const lengthNote =
    subjectLen > 72 ? `LENGTH_ERROR:${subjectLen}chars(${subjectLen - 72}over72limit)`
      : subjectLen > 50 ? `LENGTH_WARN:${subjectLen}chars(${subjectLen - 50}over50ideal)`
        : `LENGTH_OK:${subjectLen}chars`

  const moodNote = endsInEd || endsInIng ? `MOOD_ERROR:"${firstWord}"is${endsInEd ? 'past' : 'gerund'}` : 'MOOD_OK'
  const typeNote =
    (type === 'feat' && /^(update|upgrade|bump|install|downgrade)\b/i.test(description) ? 'TYPE_MISMATCH:feat+depupdate→build/chore' : '') ||
    (type === 'feat' && /^(fix|resolve|patch)\b/i.test(description) ? 'TYPE_MISMATCH:feat+fix→fix' : '') ||
    (type === 'fix' && /^(add|create|implement)\b/i.test(description) ? 'TYPE_MISMATCH:fix+new→feat' : '') ||
    'TYPE_OK'

  // Pass only the subject line to AI — body/footer from user input causes the AI
  // to echo them back unchanged in "corrected" rather than generating a better version
  const subjectOnly = commitMessage.split('\n')[0].trim()

  // Compute which type is correct for server-side enforcement
  const correctType =
    typeNote.includes('feat+depupdate') ? 'build' :
      typeNote.includes('feat+fix') ? 'fix' :
        typeNote.includes('fix+new') ? 'feat' : type

  const userPrompt = `SUBJECT: ${subjectOnly}
TYPE:${type || '?'} SCOPE:${scope || '?'} DESC:${description || '?'}
${lengthNote} | ${moodNote} | ${typeNote}

${typeNote !== 'TYPE_OK' ? `⚠ TYPE IS WRONG. The corrected commit MUST use "${correctType}" not "${type}". Fix this in "corrected".` : ''}

If isPerfect=true: generate 3 complete alternatives for "${description}" using type "${type}".
Each alternative: type(scope): short-description\n\nbody explaining WHY (2-3 sentences)\n\nfooter if relevant.
Be specific to "${description}" — not generic.
Respond JSON.`

  // ── Try providers in order ────────────────────────────────────────────────
  const errors: string[] = []
  const hasMismatch = typeNote !== 'TYPE_OK'
  const args = [userPrompt, firstWord, commitMessage, subjectOnly, hasMismatch, type, correctType] as const

  if (process.env.OPENROUTER_API_KEY) {
    const r = await callOpenRouter(process.env.OPENROUTER_API_KEY, ...args)
    if (r.ok && r.data) {
      await setCache(key, r.data)
      return NextResponse.json(r.data)
    }
    errors.push(r.error ?? 'OpenRouter failed')
  }

  if (process.env.GEMINI_API_KEY) {
    const r = await callGemini(process.env.GEMINI_API_KEY, ...args)
    if (r.ok && r.data) {
      await setCache(key, r.data)
      return NextResponse.json(r.data)
    }
    errors.push(r.error ?? 'Gemini failed')
  }

  if (process.env.GROQ_API_KEY) {
    const r = await callGroq(process.env.GROQ_API_KEY, ...args)
    if (r.ok && r.data) {
      await setCache(key, r.data)
      return NextResponse.json(r.data)
    }
    errors.push(r.error ?? 'Groq failed')
  }

  if (errors.length === 0) {
    return NextResponse.json(
      { error: 'No AI provider configured. Add OPENROUTER_API_KEY, GEMINI_API_KEY, or GROQ_API_KEY to .env.local' },
      { status: 500 }
    )
  }

  return NextResponse.json(
    { error: `All providers unavailable. Try again in a few minutes.\n${errors.join('\n')}` },
    { status: 503 }
  )
}

// app/api/analyze-commit/route.ts
// Uses Groq free API — sign up at https://console.groq.com → API Keys
// Add to .env.local: GROQ_API_KEY=gsk_...

import { NextRequest, NextResponse } from 'next/server'

const AI_SYSTEM_PROMPT = `You are a Conventional Commits v1.0.0 validator. Analyze commits accurately — not too strict, not too lenient.

TYPES: feat(new feature/SemVer MINOR) | fix(bug fix/PATCH) | docs(docs only) | style(formatting/no logic) | refactor(restructure/no feat or fix) | perf(measurable perf gain) | test(tests only) | build(build system/deps) | ci(CI config only) | chore(maintenance/no src) | revert(undo commit)

SUBJECT RULES:
- Imperative mood ONLY: "add" not "added"/"adding"/"adds"
- Lowercase start, no trailing period
- ≤50 chars ideal, ≤72 hard max (server gives you the exact length — trust it)
- Type must match the change: feat+dep update=ERROR, feat+doc change=ERROR, fix+new feature=ERROR

BODY (suggest when): subject >60 chars, complex/non-obvious change, breaking change, non-obvious fix
FOOTER (suggest when): fix commits → "Closes #n", breaking changes → "BREAKING CHANGE: ...", co-authors → "Co-authored-by: Name <email>"

isPerfect=true ONLY when ALL pass: imperative verb + correct type + specific description + subject ≤50 chars
isPerfect=false when ANY fail: wrong mood, wrong type, vague description, subject >50 chars

MODE A (issues exist):
{"isPerfect":false,"issues":[{"severity":"error"|"warning"|"info","message":"1-2 sentences"}],"corrected":"best fixed commit","alternatives":null,"isNonsense":false,"scopeSuggestion":"scope or null","bodyHint":"what to write in body or null","footerHint":"footer tokens to add or null"}

MODE B (genuinely perfect):
{"isPerfect":true,"issues":[],"corrected":null,"alternatives":["variant1","variant2","variant3"],"isNonsense":false,"scopeSuggestion":null,"bodyHint":null,"footerHint":null}

Severity: error=must fix | warning=should fix | info=optional. Never flag format/spacing issues.
JSON ONLY — no markdown, no backticks outside JSON values.`

export async function POST(req: NextRequest) {
  const apiKey = process.env.GROQ_API_KEY

  if (!apiKey) {
    return NextResponse.json(
      { error: 'GROQ_API_KEY not configured. Get a free key at https://console.groq.com' },
      { status: 500 }
    )
  }

  let commitMessage: string
  let type: string
  let scope: string
  let description: string
  let isBreaking: boolean

  try {
    const body = await req.json()
    commitMessage = body.commitMessage?.trim()
    type = body.type ?? ''
    scope = body.scope ?? ''
    description = body.description ?? ''
    isBreaking = body.isBreaking ?? false

    if (!commitMessage) {
      return NextResponse.json({ error: 'commitMessage is required' }, { status: 400 })
    }
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
  }

  // Extract first word of description explicitly so the model doesn't have to parse it
  const firstWord = description.trim().split(/\s+/)[0]?.toLowerCase() ?? ''
  const endsInEd = firstWord.endsWith('ed')
  const endsInIng = firstWord.endsWith('ing')
  const endsInS = firstWord.endsWith('s') && firstWord.length > 3

  // Compute full subject length server-side so AI gets the exact number
  const subjectLength =
    type.length +
    (scope ? scope.length + 2 : 0) +  // "(scope)"
    (isBreaking ? 1 : 0) +             // "!"
    2 +                                // ": "
    description.length

  const lengthViolation =
    subjectLength > 72
      ? `ERROR: Subject is ${subjectLength} chars — ${subjectLength - 72} over the 72-char HARD LIMIT. isPerfect MUST be false. The corrected commit must shorten the subject to ≤50 chars.`
      : subjectLength > 50
        ? `WARNING: Subject is ${subjectLength} chars — ${subjectLength - 50} over the ideal 50-char limit. isPerfect MUST be false.`
        : `OK: Subject is ${subjectLength} chars — within ideal ≤50 char limit.`

  // Server-side type mismatch hints to guide the model
  const depKeywords = /^(update|upgrade|bump|install|uninstall|downgrade)\b/i.test(description)
  const docsKeywords = /^(update|fix|add|improve)\b.*(readme|doc|comment|changelog|guide)/i.test(description)
  const bugKeywords = /^(fix|resolve|correct|handle|patch)\b/i.test(description)
  const newFeatWords = /^(add|create|implement|introduce|build|support)\b/i.test(description)
  const typeMismatch =
    (type === 'feat' && depKeywords ? 'feat used for dep/version update — should be build or chore' : '') ||
    (type === 'feat' && docsKeywords ? 'feat used for documentation — should be docs' : '') ||
    (type === 'feat' && bugKeywords ? 'feat used for bug fix — should be fix' : '') ||
    (type === 'fix' && newFeatWords ? 'fix used for new addition — should be feat' : '') ||
    ''

  const userPrompt = `Analyze this commit strictly using your step-by-step rules:

COMMIT: ${commitMessage}
TYPE SELECTED: "${type || 'not set'}"
SCOPE: "${scope || 'not set'}"
DESCRIPTION: "${description || 'not set'}"

=== STEP 0: SUBJECT LINE LENGTH (COMPUTED SERVER-SIDE — DO NOT IGNORE) ===
${lengthViolation}

=== STEP 1: IMPERATIVE MOOD ===
First word: "${firstWord}"
Ends in -ed (past tense): ${endsInEd}
Ends in -ing (gerund): ${endsInIng}
Ends in -s (3rd person): ${endsInS}
${(endsInEd || endsInIng) ? '⚠ MOOD VIOLATION DETECTED — isPerfect MUST be false, MUST be severity error' : 'Mood ok — proceed to step 2.'}

=== STEP 2: TYPE CORRECTNESS ===
${typeMismatch ? '⚠ TYPE MISMATCH DETECTED: ' + typeMismatch : 'No obvious type mismatch.'}

=== STEP 3: SPECIFICITY ===
Is the description specific enough? Can a reviewer understand exactly what changed without reading the code?
- "update to latest version" → FAIL: what is being updated? too vague
- "update dependencies" → FAIL: which dependencies? borderline vague
- "upgrade react from v18 to v19" → PASS: specific

Respond with valid JSON following MODE A or MODE B.
Remember: isPerfect=true is RARE. When in doubt, use MODE A with helpful suggestions.`

  try {
    const groqRes = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'llama-3.1-8b-instant',  // 4x fewer tokens than 70b — stays within free tier
        max_tokens: 600,
        temperature: 0.1, // very low — we want rule-following, not creativity
        messages: [
          { role: 'system', content: AI_SYSTEM_PROMPT },
          { role: 'user', content: userPrompt },
        ],
      }),
    })

    if (!groqRes.ok) {
      const errText = await groqRes.text().catch(() => '')
      return NextResponse.json(
        { error: `Groq API error ${groqRes.status}: ${errText}` },
        { status: 502 }
      )
    }

    const data = await groqRes.json()
    const text = data.choices?.[0]?.message?.content ?? ''
    const clean = text.replace(/```json|```/g, '').trim()

    let parsed: {
      issues: { severity: string; message: string }[]
      corrected: string | null
      alternatives: string[] | null
      isPerfect: boolean
      isNonsense: boolean
      scopeSuggestion: string | null
      bodyHint: string | null
      footerHint: string | null
    }

    try {
      parsed = JSON.parse(clean)
    } catch {
      return NextResponse.json({
        issues: [{ severity: 'info', message: clean.slice(0, 200) }],
        corrected: null,
        alternatives: null,
        isPerfect: false,
        isNonsense: false,
        scopeSuggestion: null,
        bodyHint: null,
        footerHint: null,
      })
    }

    // Server-side safety net: if first word ends in -ed or -ing, never allow isPerfect
    if ((endsInEd || endsInIng) && parsed.isPerfect) {
      const imperative = endsInEd
        ? firstWord.replace(/ed$/, '').replace(/ied$/, 'y') || firstWord
        : firstWord.replace(/ing$/, '') || firstWord
      parsed.isPerfect = false
      if (!parsed.issues?.length) {
        parsed.issues = [{
          severity: 'error',
          message: `Use imperative mood — write "${imperative}" not "${firstWord}". Commit subjects must start with a bare present-tense verb.`,
        }]
      }
      if (!parsed.corrected && commitMessage) {
        parsed.corrected = commitMessage.replace(new RegExp(`(:\\s*)${firstWord}\\b`, 'i'), `$1${imperative}`)
      }
    }

    return NextResponse.json({
      issues: Array.isArray(parsed.issues) ? parsed.issues : [],
      corrected: parsed.corrected ?? null,
      alternatives: Array.isArray(parsed.alternatives) ? parsed.alternatives : null,
      isPerfect: parsed.isPerfect ?? false,
      isNonsense: parsed.isNonsense ?? false,
      scopeSuggestion: parsed.scopeSuggestion ?? null,
      bodyHint: parsed.bodyHint ?? null,
      footerHint: parsed.footerHint ?? null,
    })
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Internal error' },
      { status: 500 }
    )
  }
}

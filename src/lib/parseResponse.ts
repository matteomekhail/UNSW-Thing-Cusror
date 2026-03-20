import type { Summary } from '../types'

function escapeRegExp(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

function extractMarkdownSection(raw: string, heading: string): string {
  const re = new RegExp(
    `^##\\s*${escapeRegExp(heading)}\\s*\\n([\\s\\S]*?)(?=\\n##\\s|$)`,
    'im',
  )
  const m = raw.match(re)
  return m ? m[1].trim() : ''
}

function parseBulletLines(body: string): string[] {
  const out: string[] = []
  for (const line of body.split('\n')) {
    const m = line.match(/^\s*[-*•]\s+(.+)$/)
    if (m) out.push(m[1].trim())
  }
  return out
}

function parseConceptsBody(body: string): string[] {
  const lines = body
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean)
  const bullets = lines
    .filter((l) => /^[-*•]\s/.test(l))
    .map((l) => l.replace(/^[-*•]\s+/, '').trim())
  if (bullets.length) return bullets

  const joined = lines.join(' ').trim()
  if (!joined) return []
  if (joined.includes(',')) return joined.split(',').map((s) => s.trim()).filter(Boolean)
  return [joined]
}

/** Parse partial markdown during streaming — tolerates incomplete text. */
export function parsePartialSummary(raw: string): Summary {
  return {
    bulletPoints: parseBulletLines(extractMarkdownSection(raw, 'Key Points')),
    keyConcepts: parseConceptsBody(extractMarkdownSection(raw, 'Key Concepts')),
    connections: parseBulletLines(extractMarkdownSection(raw, 'Connections')),
  }
}

/** Prefer markdown sections from streamed output; fall back to JSON. */
export function parseSummaryFromStream(raw: string): Summary {
  const bulletPoints = parseBulletLines(extractMarkdownSection(raw, 'Key Points'))
  const keyConcepts = parseConceptsBody(extractMarkdownSection(raw, 'Key Concepts'))
  const connections = parseBulletLines(extractMarkdownSection(raw, 'Connections'))

  const hasMarkdown =
    bulletPoints.length > 0 || keyConcepts.length > 0 || connections.length > 0

  if (hasMarkdown) {
    return { bulletPoints, keyConcepts, connections }
  }

  return parseJSON<Summary>(raw)
}

export function parseJSON<T>(raw: string): T {
  // Strategy 1: direct parse
  try {
    return JSON.parse(raw) as T
  } catch {
    // continue
  }

  // Strategy 2: extract from code fence
  const fenceMatch = raw.match(/```(?:json)?\s*\n?([\s\S]*?)```/)
  if (fenceMatch) {
    try {
      return JSON.parse(fenceMatch[1].trim()) as T
    } catch {
      // continue
    }
  }

  // Strategy 3: find first [ or {
  const arrStart = raw.indexOf('[')
  const objStart = raw.indexOf('{')

  let start = -1
  if (arrStart >= 0 && objStart >= 0) {
    start = Math.min(arrStart, objStart)
  } else if (arrStart >= 0) {
    start = arrStart
  } else if (objStart >= 0) {
    start = objStart
  }

  if (start >= 0) {
    const openChar = raw[start]
    const closeChar = openChar === '[' ? ']' : '}'
    let depth = 0
    let end = start

    for (let i = start; i < raw.length; i++) {
      if (raw[i] === openChar) depth++
      if (raw[i] === closeChar) depth--
      if (depth === 0) {
        end = i + 1
        break
      }
    }

    try {
      return JSON.parse(raw.slice(start, end)) as T
    } catch {
      // continue
    }
  }

  throw new Error('Could not parse AI response as JSON. The model returned an unexpected format.')
}

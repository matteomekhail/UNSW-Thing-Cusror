export function flashcardPrompt(notes: string, count: number): string {
  return `You are a study assistant. Based on the notes below, generate exactly ${count} flashcards for studying.

Return ONLY a valid JSON array with objects containing "front" (question/term) and "back" (answer/definition).
Do NOT include any other text, markdown, or explanation — ONLY the JSON array.

Example format:
[{"front":"What is X?","back":"X is ..."},{"front":"Define Y","back":"Y means ..."}]

Notes:
${notes}`
}

export function quizPrompt(notes: string, count: number): string {
  return `You are a study assistant. Based on the notes below, generate exactly ${count} multiple-choice quiz questions.

Return ONLY a valid JSON array with objects containing:
- "question": the question text
- "options": array of exactly 4 answer choices
- "correctIndex": index (0-3) of the correct answer
- "explanation": brief explanation of why the correct answer is right

Do NOT include any other text, markdown, or explanation — ONLY the JSON array.

Example format:
[{"question":"What is X?","options":["A","B","C","D"],"correctIndex":0,"explanation":"A is correct because ..."}]

Notes:
${notes}`
}

export function summaryPrompt(notes: string): string {
  return `You are a study assistant. Based on the notes below, create a comprehensive study summary.

Return ONLY a valid JSON object with:
- "bulletPoints": array of key takeaway strings (5-10 items)
- "keyConcepts": array of important concept/term strings (3-8 items)
- "connections": array of strings describing relationships between concepts (2-5 items)

Do NOT include any other text, markdown, or explanation — ONLY the JSON object.

Example format:
{"bulletPoints":["Point 1","Point 2"],"keyConcepts":["Concept A","Concept B"],"connections":["A relates to B because ..."]}

Notes:
${notes}`
}

/** Markdown layout so streamed output stays readable before JSON-style parsing at the end. */
export function summaryStreamPrompt(notes: string): string {
  return `You are a study assistant. Based on the notes below, write a study summary using EXACTLY this markdown structure and these three section headings (in this order):

## Key Points
- First takeaway (5-10 bullet lines total, each starting with "- ")

## Key Concepts
- List 3-8 important terms as comma-separated on one line, OR one concept per "- " line

## Connections
- 2-5 bullet lines; each starts with "- " and explains how ideas relate

Rules: Use only these three ## sections. No preamble or closing text outside the sections. Be concise.

Notes:
${notes}`
}

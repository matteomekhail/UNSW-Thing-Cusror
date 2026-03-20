# AI Study Buddy — Piano di Implementazione

## Context
Progetto per un evento UNSW per studenti. L'obiettivo è creare un'app web bella e d'impatto che aiuti gli studenti a studiare usando l'AI. L'utente vuole usare i propri crediti API di Cursor (OpenAI-compatible).

---

## Stack Tecnologico
- **React + Vite + TypeScript**
- **Tailwind CSS v4** (plugin Vite, zero config)
- **Motion** (ex Framer Motion) per animazioni
- **Lucide React** per icone
- **API OpenAI-compatible** via raw `fetch` (nessun SDK)

## Features
1. **Flashcard Generator** — incolla appunti → AI genera flashcard interattive con flip 3D
2. **Quiz Generator** — AI genera quiz a scelta multipla con punteggio e feedback
3. **Smart Summaries** — riassunti in bullet points + concetti chiave + connessioni

---

## Struttura File

```
src/
├── main.tsx
├── App.tsx                        # Layout + tab state + AnimatePresence
├── index.css                      # @import "tailwindcss" + tema custom
├── types/index.ts                 # Flashcard, QuizQuestion, Summary, AISettings, TabId
├── lib/
│   ├── ai.ts                      # fetch wrapper per OpenAI Chat Completions
│   ├── prompts.ts                 # Template prompt per flashcard/quiz/summary
│   ├── parseResponse.ts           # Estrazione JSON robusta dalle risposte AI
│   └── storage.ts                 # Helper localStorage
├── hooks/
│   ├── useAI.ts                   # Hook: settings + API + parsing + loading/error
│   ├── useSettings.ts             # Hook: AISettings da localStorage
│   └── useLocalStorage.ts         # Hook generico localStorage
├── components/
│   ├── layout/
│   │   ├── Header.tsx             # Titolo gradiente + icona settings
│   │   ├── TabBar.tsx             # 3 tab con indicatore animato (layoutId)
│   │   └── Footer.tsx
│   ├── shared/
│   │   ├── TextInput.tsx          # Textarea con contatore caratteri
│   │   ├── GenerateButton.tsx     # Bottone con loading spinner
│   │   ├── ErrorBanner.tsx
│   │   └── EmptyState.tsx
│   ├── settings/
│   │   └── SettingsModal.tsx      # API URL + Key + Model + Test Connection
│   ├── flashcards/
│   │   ├── FlashcardView.tsx      # Container: input + deck
│   │   ├── FlashcardCard.tsx      # Flip card 3D (rotateY + perspective)
│   │   └── FlashcardDeck.tsx      # Navigazione prev/next + keyboard
│   ├── quiz/
│   │   ├── QuizView.tsx           # State machine: input → inProgress → results
│   │   ├── QuizQuestion.tsx       # Domanda + 4 opzioni con feedback colore
│   │   ├── QuizProgress.tsx       # Barra progresso animata
│   │   └── QuizResults.tsx        # Score + review risposte
│   └── summary/
│       ├── SummaryView.tsx
│       └── SummaryDisplay.tsx     # Bullet points + concept chips + connections
```

---

## AI Integration

- **Client**: raw `fetch` a `{baseUrl}/chat/completions` — funziona con Cursor API, OpenAI, qualsiasi provider compatibile
- **Prompts**: istruiscono il modello a restituire SOLO JSON valido
- **Parsing**: `parseResponse.ts` con 3 strategie fallback (parse diretto → estrai da code fence → trova primo `[`/`{`)
- **Nessun `response_format`** per massima compatibilità

## Design

- **Dark mode** di default (impatto visivo su proiettori)
- **Palette**: sfondo navy/slate, accento indigo/viola gradiente
- **Animazioni**: flip 3D flashcard, slide tab indicator, stagger entrata card, feedback colore quiz, count-up score
- **Responsive**: mobile-first, grid adattivo

---

## Ordine di Implementazione (6 fasi)

### Fase 1: Foundation (~1h)
1. Scaffold Vite + React + TS
2. Install deps: `motion`, `lucide-react`, `@tailwindcss/vite`
3. Config `vite.config.ts` con plugin Tailwind
4. Tema custom in `index.css`
5. Layout: `App.tsx`, `Header`, `TabBar`, `Footer`
6. Tab switching con AnimatePresence
→ **Checkpoint**: shell dark-mode con tab animati

### Fase 2: Settings + AI Layer (~1h)
1. `useLocalStorage` + `useSettings` hooks
2. `SettingsModal` (URL, key, model, test connection)
3. `ai.ts` — fetch wrapper
4. `prompts.ts` — template per tutti e 3 i features
5. `parseResponse.ts` — estrazione JSON robusta
6. `useAI` hook
7. `TextInput` + `GenerateButton` condivisi
→ **Checkpoint**: settings funzionanti, AI chiamabile

### Fase 3: Flashcards (~1.5h)
1. `FlashcardView` — wire up input + AI + deck
2. `FlashcardCard` — flip 3D con Motion (hero component!)
3. `FlashcardDeck` — navigazione + keyboard (←→ + spazio)
4. `ErrorBanner` per errori API
→ **Checkpoint**: genera e sfoglia flashcard reali

### Fase 4: Quiz (~1.5h)
1. `QuizView` con state machine
2. `QuizQuestion` — opzioni con feedback verde/rosso
3. `QuizProgress` — barra animata
4. `QuizResults` — score + review
→ **Checkpoint**: quiz completo e funzionante

### Fase 5: Summary (~1h)
1. `SummaryView` + `SummaryDisplay`
2. Bullet points staggerati + concept chips
3. Copy-to-clipboard
→ **Checkpoint**: riassunti funzionanti

### Fase 6: Polish (~1-2h)
1. `EmptyState` per ogni tab
2. Loading skeletons
3. Refine animazioni
4. Selettore numero items (5/10/15/20)
5. Edge cases: input vuoto, errori API, JSON malformato
6. Favicon + page title

---

## Verifica
1. `npm run dev` — app si avvia senza errori
2. Configura API settings → "Test Connection" funziona
3. Incolla appunti reali → genera flashcard → flip funziona → navigazione prev/next
4. Genera quiz → rispondi alle domande → vedi score e review
5. Genera summary → bullet points + concepts visibili → copy funziona
6. Test responsive su mobile viewport
7. Test con API key mancante → errore gestito gracefully

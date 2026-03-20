import { useLocation, matchPath } from 'react-router'
import { useSettings } from './hooks/useSettings'
import { useTheme } from './hooks/useTheme'
import { Sidebar } from './components/layout/Sidebar'
import { MobileNav } from './components/layout/MobileNav'
import { FlashcardView } from './components/flashcards/FlashcardView'
import { QuizView } from './components/quiz/QuizView'
import { SummaryView } from './components/summary/SummaryView'

const tabs = [
  { path: '/', element: (s: ReturnType<typeof useSettings>) => <FlashcardView settings={s} /> },
  { path: '/quiz', element: (s: ReturnType<typeof useSettings>) => <QuizView settings={s} /> },
  { path: '/summary', element: (s: ReturnType<typeof useSettings>) => <SummaryView settings={s} /> },
]

function App() {
  const settings = useSettings()
  const { theme, toggle } = useTheme()
  const location = useLocation()

  return (
    <div className="relative h-dvh overflow-hidden w-full">
      <Sidebar theme={theme} onToggleTheme={toggle} />
      <MobileNav theme={theme} onToggleTheme={toggle} />

      <div className="relative z-10 md:ml-[220px] h-dvh flex flex-col">
        {tabs.map((tab) => {
          const active = !!matchPath(tab.path, location.pathname)
          return (
            <div
              key={tab.path}
              className={`flex-1 flex flex-col min-h-0 h-full w-full ${active ? '' : 'hidden'}`}
            >
              {tab.element(settings)}
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default App

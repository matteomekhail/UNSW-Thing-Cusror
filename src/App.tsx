import { Routes, Route, useLocation } from 'react-router'
import { AnimatePresence, motion } from 'motion/react'
import { useSettings } from './hooks/useSettings'
import { useTheme } from './hooks/useTheme'
import { Sidebar } from './components/layout/Sidebar'
import { MobileNav } from './components/layout/MobileNav'
import { FlashcardView } from './components/flashcards/FlashcardView'
import { QuizView } from './components/quiz/QuizView'
import { SummaryView } from './components/summary/SummaryView'

function App() {
  const settings = useSettings()
  const { theme, toggle } = useTheme()
  const location = useLocation()

  return (
    <div className="relative h-dvh overflow-hidden w-full">
      <Sidebar theme={theme} onToggleTheme={toggle} />
      <MobileNav theme={theme} onToggleTheme={toggle} />

      <div className="relative z-10 md:ml-[220px] h-dvh flex flex-col">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="flex-1 flex flex-col min-h-0 h-full w-full"
          >
            <Routes location={location}>
              <Route path="/" element={<FlashcardView settings={settings} />} />
              <Route path="/quiz" element={<QuizView settings={settings} />} />
              <Route path="/summary" element={<SummaryView settings={settings} />} />
            </Routes>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}

export default App

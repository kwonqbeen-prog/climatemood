import { useState } from 'react'
import StartScreen from './components/StartScreen'
import ChatScreen from './components/ChatScreen'
import DashboardScreen from './components/DashboardScreen'
import NavBar from './components/NavBar'
import { useConversation } from './hooks/useConversation'

function App() {
  const [view, setView] = useState('start')
  const conv = useConversation()

  if (view === 'start') {
    return <StartScreen onStart={() => setView('chat')} />
  }

  return (
    <div className="flex min-h-svh flex-col">
      <div className="flex-1">
        {view === 'chat' && <ChatScreen conv={conv} />}
        {view === 'dashboard' && <DashboardScreen />}
      </div>
      <NavBar active={view} onChange={setView} />
    </div>
  )
}

export default App

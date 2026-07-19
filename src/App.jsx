import { useState } from 'react'
import StartScreen from './components/StartScreen'
import ChatScreen from './components/ChatScreen'
import DashboardScreen from './components/DashboardScreen'
import NavBar from './components/NavBar'
import AuthScreen from './components/AuthScreen'
import NicknameScreen from './components/NicknameScreen'
import { useConversation } from './hooks/useConversation'
import { useAuth } from './hooks/useAuth'

function App() {
  const [view, setView] = useState('start')
  const auth = useAuth()
  const displayName = auth.user?.user_metadata?.display_name ?? null
  const conv = useConversation({ displayName })

  if (auth.loading) {
    return (
      <div className="flex min-h-svh items-center justify-center bg-leaf-50">
        <div className="text-2xl">🌱</div>
      </div>
    )
  }

  if (!auth.user) {
    return <AuthScreen auth={auth} />
  }

  if (!displayName) {
    return <NicknameScreen auth={auth} />
  }

  if (view === 'start') {
    return <StartScreen onStart={() => setView('chat')} />
  }

  return (
    <div className="flex min-h-svh flex-col">
      <div className="flex-1">
        {view === 'chat' && <ChatScreen conv={conv} />}
        {view === 'dashboard' && <DashboardScreen onSignOut={auth.signOut} />}
      </div>
      <NavBar active={view} onChange={setView} />
    </div>
  )
}

export default App

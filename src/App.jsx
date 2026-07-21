import { useState } from 'react'
import StartScreen from './components/StartScreen'
import Icon from './components/Icon'
import ChatScreen from './components/ChatScreen'
import DashboardScreen from './components/DashboardScreen'
import NavBar from './components/NavBar'
import AuthScreen from './components/AuthScreen'
import NicknameScreen from './components/NicknameScreen'
import ThemeOnboardingScreen from './components/ThemeOnboardingScreen'
import SettingsScreen from './components/SettingsScreen'
import { useConversation } from './hooks/useConversation'
import { useAuth } from './hooks/useAuth'
import { ThemeProvider, useTheme } from './contexts/ThemeContext'

function AppShell({ auth }) {
  const [view, setView] = useState('start')
  const { settings, markThemeOnboardingSeen } = useTheme()
  const displayName = auth.user?.user_metadata?.display_name ?? null
  const conv = useConversation({ displayName })

  if (!displayName) {
    return <NicknameScreen auth={auth} />
  }

  if (!settings.themeOnboardingSeen) {
    return <ThemeOnboardingScreen onDone={markThemeOnboardingSeen} />
  }

  if (view === 'start') {
    return <StartScreen onStart={() => setView('chat')} />
  }

  if (view === 'settings') {
    return (
      <div className="flex min-h-svh flex-col">
        <div className="flex-1">
          <SettingsScreen onBack={() => setView('dashboard')} />
        </div>
        <NavBar active="dashboard" onChange={setView} />
      </div>
    )
  }

  return (
    <div className="flex min-h-svh flex-col">
      <div className="flex-1">
        {view === 'chat' && <ChatScreen conv={conv} />}
        {view === 'dashboard' && (
          <DashboardScreen
            onSignOut={auth.signOut}
            onOpenSettings={() => setView('settings')}
            onViewMissions={() => setView('chat')}
          />
        )}
      </div>
      <NavBar active={view} onChange={setView} />
    </div>
  )
}

function App() {
  const auth = useAuth()

  if (auth.loading) {
    return (
      <div className="flex min-h-svh items-center justify-center bg-surface">
        <Icon name="progress_activity" className="animate-spin text-3xl text-ink-faint" />
      </div>
    )
  }

  return (
    <ThemeProvider auth={auth}>
      {!auth.user ? <AuthScreen auth={auth} /> : <AppShell auth={auth} />}
    </ThemeProvider>
  )
}

export default App

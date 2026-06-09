import { useState } from 'react'
import ReactDOM from 'react-dom/client'
import LandingPage from './LandingPage'
import Dashboard from './Dashboard'
import './index.css'

function Root() {
  const [view, setView] = useState<'landing' | 'app'>('landing')

  return view === 'landing'
    ? <LandingPage onLaunchApp={() => setView('app')} />
    : <Dashboard onBack={() => setView('landing')} />
}

ReactDOM.createRoot(document.getElementById('root')!).render(<Root />)

import { useState } from 'react'
import ReactDOM from 'react-dom/client'
import LandingPage from './LandingPage'
import Dashboard from './Dashboard'
import './index.css'

function Root() {
  const [view, setView] = useState<'landing' | 'app'>('landing')
  const [connectedWallet, setConnectedWallet] = useState<any>(null)

  return view === 'landing'
    ? <LandingPage 
        onLaunchApp={() => setView('app')} 
        connectedWallet={connectedWallet}
        setConnectedWallet={setConnectedWallet}
      />
    : <Dashboard 
        onBack={() => setView('landing')} 
        connectedWallet={connectedWallet}
        setConnectedWallet={setConnectedWallet}
      />
}

ReactDOM.createRoot(document.getElementById('root')!).render(<Root />)

import { useState } from 'react'
import { Cpu, HelpCircle } from 'lucide-react'

export default function AiToolkitTab() {
  const [activeSubSection, setActiveSubSection] = useState<'x402' | 'mcp' | 'odra'>('x402')

  return (
    <div className="ai-toolkit-tab-container" style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.1)', paddingBottom: '1rem' }}>
        <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#fff', fontSize: '1.25rem' }}>
          <Cpu style={{ color: 'var(--color-primary)' }} />
          <span>Casper AI Toolkit & Autonomous Agent Hub</span>
        </h2>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
          Integrate HTTP-native x402 micropayments, run Model Context Protocol (MCP) servers, and discover Odra framework assets.
        </p>
      </div>

      <div style={{ display: 'flex', gap: '0.5rem' }}>
        {['x402', 'mcp', 'odra'].map((section) => (
          <button
            key={section}
            onClick={() => setActiveSubSection(section as any)}
            style={{
              padding: '0.5rem 1rem',
              borderRadius: '6px',
              border: '1px solid rgba(255,255,255,0.1)',
              background: activeSubSection === section ? 'var(--color-primary)' : 'rgba(0,0,0,0.2)',
              color: '#fff',
              cursor: 'pointer',
              fontSize: '0.85rem',
              fontWeight: 600,
              textTransform: 'uppercase'
            }}
          >
            {section === 'x402' && 'x402 Micropayments'}
            {section === 'mcp' && 'MCP Tool Console'}
            {section === 'odra' && 'Odra llms.txt Framework'}
          </button>
        ))}
      </div>

      <div style={{ minHeight: '300px', background: 'rgba(0,0,0,0.15)', border: '1px solid var(--border-glass)', borderRadius: '12px', padding: '1.25rem' }}>
        {activeSubSection === 'x402' && (
          <div>
            <h3 style={{ color: '#fff', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <HelpCircle size={16} /> x402 Micropayment Client-Server Exchange
            </h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Simulate pay-per-request API authentication on Casper.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

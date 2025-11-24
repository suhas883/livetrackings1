import { useState } from 'react'

interface AffiliateLink {
  id: string
  name: string
  url: string
  category: string
  clicks: number
}

export default function App() {
  const [affiliateLinks, setAffiliateLinks] = useState<AffiliateLink[]>([
    {
      id: 'aff_1',
      name: 'Cloudflare Pages',
      url: 'https://pages.cloudflare.com/?utm_source=livetrackings&utm_medium=referral&utm_campaign=deployment',
      category: 'Hosting',
      clicks: 0
    },
    {
      id: 'aff_2',
      name: 'React Documentation',
      url: 'https://react.dev/?utm_source=livetrackings&utm_medium=referral&utm_campaign=framework',
      category: 'Framework',
      clicks: 0
    },
    {
      id: 'aff_3',
      name: 'Vite Build Tool',
      url: 'https://vitejs.dev/?utm_source=livetrackings&utm_medium=referral&utm_campaign=build',
      category: 'Build Tool',
      clicks: 0
    },
    {
      id: 'aff_4',
      name: 'TypeScript',
      url: 'https://www.typescriptlang.org/?utm_source=livetrackings&utm_medium=referral&utm_campaign=language',
      category: 'Language',
      clicks: 0
    }
  ])

  const handleAffiliateClick = (linkId: string) => {
    setAffiliateLinks(links =>
      links.map(link =>
        link.id === linkId ? { ...link, clicks: link.clicks + 1 } : link
      )
    )
    // Log to console for tracking
    console.log(`[TRACKING] Affiliate link clicked: ${linkId}`, new Date().toISOString())
  }

  const totalClicks = affiliateLinks.reduce((sum, link) => sum + link.clicks, 0)
  const topLink = affiliateLinks.reduce((prev, current) =>
    current.clicks > prev.clicks ? current : prev
  )

  return (
    <div className="container">
      <h1>LiveTrackings</h1>
      <p>Welcome to LiveTrackings - Your independent tracking solution</p>
      <p>This site is deployed on Cloudflare Pages without Supabase!</p>

      <div style={{ marginTop: '2rem', borderTop: '1px solid #666', paddingTop: '2rem' }}>
        <h2>Affiliate Link Tracker</h2>
        <p>Test our affiliate link tracking system:</p>

        <div style={{ display: 'grid', gap: '1rem' }}>
          {affiliateLinks.map(link => (
            <div
              key={link.id}
              style={{
                padding: '1rem',
                border: '1px solid #444',
                borderRadius: '4px',
                background: '#1a1a1a'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h3 style={{ margin: '0 0 0.5rem 0' }}>{link.name}</h3>
                  <p style={{ margin: '0.25rem 0', fontSize: '0.9rem', color: '#999' }}>
                    Category: {link.category}
                  </p>
                  <p style={{ margin: '0.25rem 0', fontSize: '0.9rem', color: '#666' }}>
                    Clicks: <strong>{link.clicks}</strong>
                  </p>
                </div>
                <button
                  onClick={() => handleAffiliateClick(link.id)}
                  onClickCapture={() => {
                    const event = new CustomEvent('affiliateClick', {
                      detail: { linkId: link.id, linkName: link.name, timestamp: new Date().toISOString() }
                    })
                    window.dispatchEvent(event)
                  }}
                  style={{
                    padding: '0.75rem 1.5rem',
                    background: '#646cff',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '0.9rem',
                    whiteSpace: 'nowrap'
                  }}
                >
                  Visit →
                </button>
              </div>
            </div>
          ))}
        </div>

        <div style={{ marginTop: '2rem', padding: '1rem', background: '#0a0a0a', borderRadius: '4px' }}>
          <h3>📊 Tracking Stats</h3>
          <p>Total Clicks: <strong>{totalClicks}</strong></p>
          <p>Most Clicked: <strong>{topLink.name}</strong> ({topLink.clicks} clicks)</p>
          <p style={{ fontSize: '0.85rem', color: '#999', marginTop: '1rem' }}>
            💡 Open DevTools (F12) → Console to see click tracking logs
          </p>
        </div>
      </div>
    </div>
  )
}

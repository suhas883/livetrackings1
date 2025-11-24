import { useState, useEffect } from 'react'

interface AffiliateLink {
  id: string
  name: string
  url: string
  category: string
  clicks: number
  trackingStatus?: 'pending' | 'success' | 'error'
}

interface TrackingResponse {
  success: boolean
  message: string
  timestamp: string
  apiUsed?: 'perplexity' | 'router' | 'offline'
}

// Perplexity API Tracking (Main)
const trackWithPerplexity = async (linkId: string, linkName: string): Promise<TrackingResponse> => {
  try {
    const response = await fetch('https://api.perplexity.ai/track', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'LiveTrackings/1.0'
      },
      body: JSON.stringify({
        event: 'affiliate_click',
        linkId,
        linkName,
        source: 'livetrackings1.pages.dev',
        timestamp: new Date().toISOString(),
        utm: {
          source: 'livetrackings',
          medium: 'referral',
          campaign: 'tracking_system'
        }
      })
    })
    
    if (!response.ok) throw new Error(`Perplexity API error: ${response.status}`)
    
    const data = await response.json()
    console.log('[TRACKING] Perplexity API Success:', data)
    
    return {
      success: true,
      message: 'Tracked via Perplexity API',
      timestamp: new Date().toISOString(),
      apiUsed: 'perplexity'
    }
  } catch (error) {
    console.error('[TRACKING] Perplexity API Error:', error)
    throw error
  }
}

// Router API Tracking (Backup)
const trackWithRouter = async (linkId: string, linkName: string): Promise<TrackingResponse> => {
  try {
    const response = await fetch('https://api.livetrackings-router.net/track', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer router-token'
      },
      body: JSON.stringify({
        eventType: 'affiliate_click',
        linkId,
        linkName,
        domain: 'livetrackings1.pages.dev',
        timestamp: new Date().toISOString(),
        metadata: {
          source: 'livetrackings',
          campaignType: 'affiliate'
        }
      })
    })
    
    if (!response.ok) throw new Error(`Router API error: ${response.status}`)
    
    const data = await response.json()
    console.log('[TRACKING] Router API Success:', data)
    
    return {
      success: true,
      message: 'Tracked via Router API (Backup)',
      timestamp: new Date().toISOString(),
      apiUsed: 'router'
    }
  } catch (error) {
    console.error('[TRACKING] Router API Error:', error)
    throw error
  }
}

// Hybrid tracking function: Try Perplexity first, fallback to Router
const trackAffiliateClick = async (linkId: string, linkName: string): Promise<TrackingResponse> => {
  console.log(`[TRACKING SYSTEM] Starting tracking for: ${linkName} (${linkId})`)
  
  try {
    // Try Perplexity API (Main)
    const result = await trackWithPerplexity(linkId, linkName)
    console.log('[TRACKING SYSTEM] Successfully tracked via Perplexity API')
    return result
  } catch (perplexityError) {
    console.warn('[TRACKING SYSTEM] Perplexity API failed, attempting Router API backup...')
    
    try {
      // Fallback to Router API
      const result = await trackWithRouter(linkId, linkName)
      console.log('[TRACKING SYSTEM] Successfully tracked via Router API (Backup)')
      return result
    } catch (routerError) {
      console.error('[TRACKING SYSTEM] Both APIs failed:', {
        perplexityError,
        routerError
      })
      
      return {
        success: false,
        message: 'Tracking failed - both APIs unavailable',
        timestamp: new Date().toISOString(),
        apiUsed: 'offline'
      }
    }
  }
}

export default function App() {
  const [affiliateLinks, setAffiliateLinks] = useState<AffiliateLink[]>([
    {
      id: 'aff_1',
      name: 'Cloudflare Pages',
      url: 'https://pages.cloudflare.com/?utm_source=livetrackings&utm_medium=referral&utm_campaign=deployment',
      category: 'Hosting',
      clicks: 0,
      trackingStatus: 'pending'
    },
    {
      id: 'aff_2',
      name: 'React Documentation',
      url: 'https://react.dev/?utm_source=livetrackings&utm_medium=referral&utm_campaign=framework',
      category: 'Framework',
      clicks: 0,
      trackingStatus: 'pending'
    },
    {
      id: 'aff_3',
      name: 'Vite Build Tool',
      url: 'https://vitejs.dev/?utm_source=livetrackings&utm_medium=referral&utm_campaign=build',
      category: 'Build Tool',
      clicks: 0,
      trackingStatus: 'pending'
    },
    {
      id: 'aff_4',
      name: 'TypeScript',
      url: 'https://www.typescriptlang.org/?utm_source=livetrackings&utm_medium=referral&utm_campaign=language',
      category: 'Language',
      clicks: 0,
      trackingStatus: 'pending'
    }
  ])
  const [trackingLog, setTrackingLog] = useState<TrackingResponse[]>([])

  const handleAffiliateClick = async (linkId: string, linkName: string) => {
    // Update UI immediately for local feedback
    setAffiliateLinks(links =>
      links.map(link =>
        link.id === linkId ? { ...link, clicks: link.clicks + 1, trackingStatus: 'pending' } : link
      )
    )

    // Send tracking data to APIs
    const trackingResult = await trackAffiliateClick(linkId, linkName)
    
    // Update tracking status in UI
    setAffiliateLinks(links =>
      links.map(link =>
        link.id === linkId 
          ? { 
              ...link, 
              trackingStatus: trackingResult.success ? 'success' : 'error'
            } 
          : link
      )
    )

    // Log the tracking response
    setTrackingLog(prev => [trackingResult, ...prev])
  }

  const totalClicks = affiliateLinks.reduce((sum, link) => sum + link.clicks, 0)
  const topLink = affiliateLinks.reduce((prev, current) =>
    current.clicks > prev.clicks ? current : prev
  )
  
  const successfulTracks = trackingLog.filter(log => log.success).length
  const failedTracks = trackingLog.filter(log => !log.success).length
  const perplexityTracks = trackingLog.filter(log => log.apiUsed === 'perplexity').length
  const routerTracks = trackingLog.filter(log => log.apiUsed === 'router').length

  return (
    <div className="container">
      <h1>LiveTrackings</h1>
      <p>Welcome to LiveTrackings - Your independent tracking solution</p>
      <p>This site is deployed on Cloudflare Pages without Supabase!</p>

      <div style={{ marginTop: '2rem', borderTop: '1px solid #666', paddingTop: '2rem' }}>
        <h2>Affiliate Link Tracker</h2>
        <p><strong>🔴 REAL API TRACKING ENABLED</strong> - Perplexity API (Main) + Router API (Backup)</p>
        <p style={{fontSize: '0.9rem', color: '#999'}}>Clicks are tracked in real-time to multiple APIs for verification</p>

        <div style={{ display: 'grid', gap: '1rem' }}>
          {affiliateLinks.map(link => (
            <div
              key={link.id}
              style={{
                padding: '1rem',
                border: link.trackingStatus === 'success' ? '2px solid #22c55e' : link.trackingStatus === 'error' ? '2px solid #ef4444' : '1px solid #444',
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
                  <p style={{ margin: '0.25rem 0', fontSize: '0.8rem', color: link.trackingStatus === 'success' ? '#22c55e' : link.trackingStatus === 'error' ? '#ef4444' : '#999' }}>
                    {link.trackingStatus === 'success' ? '✓ Tracked' : link.trackingStatus === 'error' ? '✗ Track Failed' : '○ Pending'}
                  </p>
                </div>
                <button
                  onClick={() => handleAffiliateClick(link.id, link.name)}
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
          <p style={{marginTop: '1rem', fontSize: '0.9rem', color: '#999'}}>Real API Tracking:</p>
          <p style={{fontSize: '0.85rem', color: '#666'}}>✓ Perplexity API: <strong>{perplexityTracks}</strong> | ✓ Router API: <strong>{routerTracks}</strong> | ✗ Failed: <strong>{failedTracks}</strong></p>
        </div>

        <div style={{ marginTop: '2rem', padding: '1rem', background: '#1a1a1a', borderRadius: '4px', border: '1px solid #333' }}>
          <h3>🔍 Tracking Log (Latest 5)</h3>
          {trackingLog.slice(0, 5).map((log, idx) => (
            <div key={idx} style={{fontSize: '0.8rem', color: log.success ? '#22c55e' : '#ef4444', marginBottom: '0.5rem', fontFamily: 'monospace'}}>
              {log.timestamp} - {log.message} [{log.apiUsed?.toUpperCase()}]
            </div>
          ))}
          <p style={{fontSize: '0.75rem', color: '#666', marginTop: '1rem'}}>
            💡 Open DevTools (F12) → Console to see detailed API calls and responses
          </p>
        </div>
      </div>
    </div>
  )
}

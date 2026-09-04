import { StrictMode, useEffect, useRef, useState } from 'react'
import { createRoot } from 'react-dom/client'
import {
  Activity, AlertTriangle, ArrowUpRight, BarChart3, Bell, Box, CheckCircle2,
  ChevronDown, CircleHelp, Clock3, Crosshair, FileText, Filter, Flame, Gauge,
  Headphones, Layers3, Map, Menu, MoreHorizontal, Navigation, Radio, Route,
  Search, Settings, ShieldCheck, Siren, SlidersHorizontal, Sparkles, Users,
  Video, Wifi, X, Zap
} from 'lucide-react'
import './styles.css'
import './controls.css'
import './layout-fixes.css'
import './live-map.css'
import './drone-feed.css'
import './feed-visibility.css'
import './real-video.css'
import './video-state.css'
import './video-performance.css'
import './map-realism.css'
import './map-movement.css'
import './incident-command.css'
import './analytics-command.css'
import './analytics-fixes.css'
import './notifications.css'
import './team-command.css'
import './team-enhancements.css'

const incidents = [
  { id: 'INC-2048', name: 'North Valley Flood', location: 'Kangra, HP', status: 'Active', severity: 'Critical', people: 18, updated: '2 min ago', color: 'coral' },
  { id: 'INC-2047', name: 'East Ridge Landslide', location: 'Wayanad, KL', status: 'Monitoring', severity: 'High', people: 6, updated: '14 min ago', color: 'amber' },
  { id: 'INC-2042', name: 'Riverbend Evacuation', location: 'Chamoli, UK', status: 'Resolved', severity: 'Medium', people: 31, updated: '1 hr ago', color: 'mint' },
]

const zones = [
  { label: 'Flood water', count: 12, tone: 'water', icon: '◆' },
  { label: 'Structural debris', count: 8, tone: 'debris', icon: '▲' },
  { label: 'Unstable terrain', count: 5, tone: 'unstable', icon: '●' },
  { label: 'Survivor signal', count: 3, tone: 'survivor', icon: '✦' },
]

const snapshots = {
  'Last 6 hours': { incidents: '02', people: '11', routes: '42', devices: '07', confidence: '97% confidence score', period: 'last 6 hours', processed: '486 frames' },
  'Last 24 hours': { incidents: '03', people: '24', routes: '128', devices: '07', confidence: '94% confidence score', period: 'last 24 hours', processed: '1,428 frames' },
  'Last 7 days': { incidents: '08', people: '67', routes: '642', devices: '09', confidence: '91% confidence score', period: 'last 7 days', processed: '8,904 frames' },
  'All time': { incidents: '14', people: '193', routes: '2,418', devices: '12', confidence: '89% confidence score', period: 'all recorded time', processed: '31,204 frames' },
}

const initialNotifications = [
  { id: 1, title: 'New survivor signal detected', detail: '18 people near Sector 04', time: '2 min ago', tone: 'critical', unread: true },
  { id: 2, title: 'Route 03 recalculated', detail: 'Team Alpha has a safer path', time: '8 min ago', tone: 'route', unread: true },
  { id: 3, title: 'Drone battery below 25%', detail: 'DRONE-07 · 22% remaining', time: '16 min ago', tone: 'warning', unread: true },
  { id: 4, title: 'Terrain scan complete', detail: '1,428 frames processed', time: '34 min ago', tone: 'success', unread: false },
]

function App() {
  const [activeNav, setActiveNav] = useState('Overview')
  const [selectedIncident, setSelectedIncident] = useState(incidents[0])
  const [showAlert, setShowAlert] = useState(true)
  const [layerOpen, setLayerOpen] = useState(false)
  const [isScanning, setIsScanning] = useState(false)
  const [scanComplete, setScanComplete] = useState(false)
  const [timeRange, setTimeRange] = useState('Last 24 hours')
  const [timeOpen, setTimeOpen] = useState(false)
  const [activity, setActivity] = useState(82)
  const [mapZoom, setMapZoom] = useState(1)
  const [mapLayersOpen, setMapLayersOpen] = useState(false)
  const [visibleLayers, setVisibleLayers] = useState({ hazards: true, route: true, survivors: true })
  const [selectedMarker, setSelectedMarker] = useState('survivor')
  const [routeMode, setRouteMode] = useState('Safest route')
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const [notifications, setNotifications] = useState(initialNotifications)
  const snapshot = snapshots[timeRange]
  const unreadCount = notifications.filter((notification) => notification.unread).length

  const markNotificationRead = (id) => setNotifications((items) => items.map((item) => item.id === id ? { ...item, unread: false } : item))
  const markAllNotificationsRead = () => setNotifications((items) => items.map((item) => ({ ...item, unread: false })))

  const navItems = [
    { label: 'Overview', icon: Gauge }, { label: 'Live map', icon: Map },
    { label: 'Incidents', icon: Siren, badge: 3 }, { label: 'Analytics', icon: BarChart3 },
  ]

  const scanNow = () => {
    setIsScanning(true); setScanComplete(false); setActivity(100)
    setTimeout(() => { setIsScanning(false); setScanComplete(true); setActivity(86) }, 1500)
  }

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand"><div className="brand-mark"><Crosshair size={21} /></div><span>Rescue<span className="brand-accent">Map</span></span><small>AI</small></div>
        <div className="workspace-switch"><div className="workspace-avatar">N</div><div><strong>National Response</strong><span>Mission workspace</span></div><ChevronDown size={15} /></div>
        <div className="nav-label">Mission control</div>
        <nav>{navItems.map(({ label, icon: Icon, badge }) => <button key={label} className={`nav-item ${activeNav === label ? 'active' : ''}`} onClick={() => setActiveNav(label)}><Icon size={18} /><span>{label}</span>{badge && <em>{badge}</em>}</button>)}</nav>
        <div className="nav-label second">Workspace</div>
        <nav><button className="nav-item" onClick={() => setActiveNav('Video feeds')}><Video size={18} /><span>Video feeds</span><span className="live-dot" /></button><button className="nav-item" onClick={() => setActiveNav('Reports')}><FileText size={18} /><span>Reports</span></button><button className="nav-item" onClick={() => setActiveNav('Team')}><Users size={18} /><span>Response team</span></button></nav>
        <div className="sidebar-bottom"><div className="sync-box"><div className="sync-icon"><Wifi size={15} /></div><div><strong>Edge node online</strong><span>Last sync 00:42 ago</span></div><span className="status-dot" /></div><button className="nav-item" onClick={() => setActiveNav('Settings')}><Settings size={18} /><span>Settings</span></button><button className="profile"><div className="profile-avatar">AS</div><div><strong>Arjun Sharma</strong><span>Field commander</span></div><MoreHorizontal size={18} /></button></div>
      </aside>

      <main className="main-content">
        <header className="topbar"><div className="mobile-brand"><Menu size={21} /><span>Rescue<span className="brand-accent">Map</span></span></div><div className="breadcrumb"><span>Mission control</span><span>/</span><strong>{activeNav}</strong></div><div className="top-actions"><div className="global-search"><Search size={17} /><span>Search anything</span><kbd>⌘ K</kbd></div><button className="icon-btn"><CircleHelp size={19} /></button><div className="notification-wrap"><button className={`icon-btn notification ${notificationsOpen ? 'open' : ''}`} onClick={() => setNotificationsOpen(!notificationsOpen)} aria-label="Notifications"><Bell size={19} />{unreadCount > 0 && <i>{unreadCount}</i>}</button>{notificationsOpen && <div className="notification-panel"><div className="notification-head"><div><strong>Notifications</strong><span>{unreadCount ? `${unreadCount} unread alerts` : 'All caught up'}</span></div>{unreadCount > 0 && <button onClick={markAllNotificationsRead}>Mark all read</button>}</div><div className="notification-list">{notifications.map((notification) => <button className={`notification-item ${notification.unread ? 'unread' : ''}`} key={notification.id} onClick={() => markNotificationRead(notification.id)}><span className={`notification-tone ${notification.tone}`}><Bell size={13} /></span><span className="notification-copy"><strong>{notification.title}</strong><span>{notification.detail}</span><small>{notification.time}</small></span>{notification.unread && <b />}</button>)}</div></div>}</div><div className="top-avatar">AS</div></div></header>
        <div className="page-content">
          <div className="page-heading"><div><div className="eyebrow"><span className="pulse" /> SYSTEMS NOMINAL <span className="eyebrow-time">· 09:41 IST</span></div><h1>{activeNav === 'Overview' ? 'Good morning, Arjun' : activeNav}</h1><p>Here is what is happening across your active response operations.</p></div><div className="heading-actions"><div className="range-picker"><button className="button secondary" onClick={() => setTimeOpen(!timeOpen)}><Clock3 size={16} /> {timeRange} <ChevronDown size={15} /></button>{timeOpen && <div className="range-menu">{['Last 6 hours','Last 24 hours','Last 7 days','All time'].map((range) => <button key={range} className={timeRange === range ? 'chosen' : ''} onClick={() => { setTimeRange(range); setTimeOpen(false) }}>{range}{timeRange === range && <CheckCircle2 size={14} />}</button>)}</div>}</div><button className={`button primary ${isScanning ? 'scanning' : ''}`} onClick={scanNow}><Sparkles size={16} /> {isScanning ? 'Scanning terrain...' : scanComplete ? 'Scan complete' : 'Run new scan'}</button></div></div>
          {activeNav === 'Overview' ? <>
          <div className="notice"><div className="notice-symbol"><Zap size={17} /></div><div><strong>AI terrain scan completed</strong><span>North Valley Flood was updated with 4 new hazard markers. Showing {snapshot.period} of simulated activity.</span></div><button onClick={() => setShowAlert(false)}><X size={17} /></button></div>
          <section className="stat-grid"><StatCard icon={Siren} label="Active incidents" value={snapshot.incidents} meta="+1 since yesterday" trend="up" accent="coral" /><StatCard icon={Users} label="People at risk" value={snapshot.people} meta="8 need immediate aid" trend="warn" accent="amber" /><StatCard icon={Route} label="Routes calculated" value={snapshot.routes} meta={snapshot.confidence} trend="up" accent="mint" /><StatCard icon={Radio} label="Connected devices" value={snapshot.devices} meta="All nodes responding" trend="stable" accent="blue" /></section>
          <div className="section-header"><div><h2>Active operations</h2><span className="muted">Live overview of {snapshot.period} of response efforts</span></div><button className="text-button" onClick={() => setActiveNav('Incidents')}>View all incidents <ArrowUpRight size={15} /></button></div>
          <section className="operations-grid"><div className="panel incident-panel"><div className="panel-head"><div><span className="panel-kicker">Priority queue</span><h3>Incidents requiring attention</h3></div><button className="icon-btn small"><Filter size={16} /></button></div><div className="incident-list">{incidents.map((incident) => <button className={`incident-row ${selectedIncident.id === incident.id ? 'selected' : ''}`} key={incident.id} onClick={() => setSelectedIncident(incident)}><div className={`incident-icon ${incident.color}`}><Siren size={17} /></div><div className="incident-main"><div><strong>{incident.name}</strong><span className={`status-pill ${incident.status.toLowerCase()}`}>{incident.status}</span></div><span>{incident.id} · {incident.location}</span></div><div className="incident-detail"><strong>{incident.people}</strong><span>people at risk</span></div><ChevronDown className="row-arrow" size={17} /></button>)}</div><button className="panel-footer" onClick={() => setActiveNav('Incidents')}>Open incident manager <ArrowUpRight size={15} /></button></div>
          <div className="panel map-panel"><div className="panel-head map-head"><div><span className="panel-kicker">Live geospatial view</span><h3>{selectedIncident.name}</h3></div><div className="map-actions"><div className="layers-picker"><button className="map-control" onClick={() => setMapLayersOpen(!mapLayersOpen)}><Layers3 size={15} /> Layers <ChevronDown size={13} /></button>{mapLayersOpen && <div className="layers-menu">{[['hazards','Hazards'],['route','Safest route'],['survivors','Survivor signals']].map(([key,label]) => <label key={key}><input type="checkbox" checked={visibleLayers[key]} onChange={() => setVisibleLayers({...visibleLayers,[key]:!visibleLayers[key]})} /> {label}</label>)}</div>}</div><button className="icon-btn small"><MoreHorizontal size={17} /></button></div></div><div className="map-canvas" style={{'--map-scale': mapZoom}}><div className="map-stage"><div className="map-grid" /><div className="map-river" /><div className="map-road road-a" /><div className="map-road road-b" /><div className="map-road road-c" /><div className="map-label label-a">NORTH VALLEY</div><div className="map-label label-b">SECTOR 04</div>{visibleLayers.hazards && <><button className={`map-marker hazard-marker ${selectedMarker === 'hazard' ? 'selected' : ''}`} onClick={() => setSelectedMarker('hazard')} style={{top:'32%',left:'43%'}}><AlertTriangle size={13} /></button><button className="map-marker hazard-marker" style={{top:'63%',left:'68%'}} onClick={() => setSelectedMarker('hazard')}><AlertTriangle size={13} /></button></>}{visibleLayers.survivors && <button className={`map-marker survivor-marker ${selectedMarker === 'survivor' ? 'selected' : ''}`} onClick={() => setSelectedMarker('survivor')} style={{top:'52%',left:'74%'}}><Users size={13} /></button>}{visibleLayers.route && <div className="map-route"><div className="route-start">HQ</div><div className="route-line" /><div className="route-end"><span><Users size={14} /></span> 18</div></div>}</div><div className="map-legend"><button onClick={() => setRouteMode(routeMode === 'Safest route' ? 'Fastest route' : 'Safest route')}><i className="legend-route" /> {routeMode}</button><span><i className="legend-hazard" /> hazard zone</span></div><div className="map-zoom"><button onClick={() => setMapZoom(Math.min(mapZoom + .1, 1.4))}>+</button><button onClick={() => setMapZoom(Math.max(mapZoom - .1, .8))}>−</button><button onClick={() => setMapZoom(1)}>⌂</button></div>{selectedMarker && <div className="marker-detail"><strong>{selectedMarker === 'survivor' ? 'Survivor signal' : 'Unstable terrain'}</strong><span>{selectedMarker === 'survivor' ? '18 people detected · 96% confidence' : 'High risk cell · reroute advised'}</span></div>}</div><div className="map-footer"><span><span className="live-dot" /> Live analysis · 42 sec ago</span><button className="text-button" onClick={() => setActiveNav('Live map')}>Open full map <ArrowUpRight size={15} /></button></div></div></section>
          <div className="section-header lower"><div><h2>Terrain intelligence</h2><span className="muted">Computer vision analysis from connected feeds</span></div><button className="filter-button" onClick={() => setLayerOpen(!layerOpen)}><SlidersHorizontal size={15} /> Configure view</button></div>
          <section className="bottom-grid"><div className="panel terrain-panel"><div className="panel-head"><div><span className="panel-kicker">Detection layer</span><h3>Hazards detected</h3></div><span className="confidence"><ShieldCheck size={15} /> 96.4% confidence</span></div><div className="zone-list">{zones.map((zone) => <div className="zone-row" key={zone.label}><div className={`zone-icon ${zone.tone}`}>{zone.icon}</div><span>{zone.label}</span><div className="zone-bar"><i style={{ width: `${zone.count * 6 + 22}%` }} /></div><strong>{zone.count}</strong><ArrowUpRight size={14} /></div>)}</div><div className="terrain-foot"><span><span className="camera-icon"><Video size={13} /></span> Feed: DRONE-07</span><span>Processed {snapshot.processed}</span></div></div><div className="panel readiness-panel"><div className="panel-head"><div><span className="panel-kicker">Response readiness</span><h3>Team & device health</h3></div><button className="icon-btn small"><MoreHorizontal size={17} /></button></div><div className="readiness-score"><div className="score-ring" style={{'--score': `${activity * 3.6}deg`}}><div><strong>{activity}%</strong><span>ready</span></div></div><div className="readiness-copy"><strong>All systems operational</strong><span>Last diagnostic run 6 min ago</span><div className="mini-bars"><i /><i /><i /><i /><i /></div></div></div><div className="health-items"><span><i className="green-dot" /> 04 team units</span><span><i className="green-dot" /> 07 sensors</span><span><i className="yellow-dot" /> 01 low battery</span></div></div></section>
          <section className="overview-feed-row"><div><span className="panel-kicker">Live camera feed</span><h2>Drone-07 aerial capture</h2><p>Simulated footage from the active North Valley response zone.</p></div><DroneFeed /><button className="text-button" onClick={() => setActiveNav('Live map')}>Open map context <ArrowUpRight size={15} /></button></section>
          </> : <SecondaryPage activeNav={activeNav} incidents={incidents} zones={zones} mapZoom={mapZoom} setMapZoom={setMapZoom} visibleLayers={visibleLayers} setVisibleLayers={setVisibleLayers} selectedMarker={selectedMarker} setSelectedMarker={setSelectedMarker} routeMode={routeMode} setRouteMode={setRouteMode} />}
        </div>
      </main>
      {showAlert && <div className="toast"><div className="toast-icon"><CheckCircle2 size={17} /></div><div><strong>Route recalculated</strong><span>Team Alpha has a safer path to Sector 04.</span></div><button onClick={() => setShowAlert(false)}><X size={15} /></button></div>}
    </div>
  )
}

function LiveMapPage({ mapZoom, setMapZoom, visibleLayers, setVisibleLayers, selectedMarker, setSelectedMarker, routeMode, setRouteMode }) {
  const panRef = useRef({ x: 0, y: 0, startX: 0, startY: 0, dragging: false })
  useEffect(() => {
    const canvas = document.querySelector('.expanded-canvas')
    const stage = canvas?.querySelector('.expanded-stage')
    if (!canvas || !stage) return undefined
    const onDown = (event) => {
      if (event.target.closest('button')) return
      panRef.current = { ...panRef.current, startX: event.clientX - panRef.current.x, startY: event.clientY - panRef.current.y, dragging: true }
      canvas.classList.add('is-panning')
      canvas.setPointerCapture?.(event.pointerId)
    }
    const onMove = (event) => {
      if (!panRef.current.dragging) return
      const x = Math.max(-260, Math.min(260, event.clientX - panRef.current.startX))
      const y = Math.max(-220, Math.min(220, event.clientY - panRef.current.startY))
      panRef.current = { ...panRef.current, x, y }
      stage.style.setProperty('--map-x', `${x}px`)
      stage.style.setProperty('--map-y', `${y}px`)
    }
    const onUp = () => { panRef.current.dragging = false; canvas.classList.remove('is-panning') }
    canvas.addEventListener('pointerdown', onDown)
    canvas.addEventListener('pointermove', onMove)
    canvas.addEventListener('pointerup', onUp)
    canvas.addEventListener('pointercancel', onUp)
    return () => { canvas.removeEventListener('pointerdown', onDown); canvas.removeEventListener('pointermove', onMove); canvas.removeEventListener('pointerup', onUp); canvas.removeEventListener('pointercancel', onUp) }
  }, [])
  const recenterMap = () => {
    panRef.current = { x: 0, y: 0, startX: 0, startY: 0, dragging: false }
    const stage = document.querySelector('.expanded-stage')
    stage?.style.setProperty('--map-x', '0px')
    stage?.style.setProperty('--map-y', '0px')
    setMapZoom(1)
  }
  return <div className="live-map-page"><div className="live-map-toolbar"><div><span className="panel-kicker">Live geospatial command</span><h2>North Valley operational picture</h2><p>Sector 04 · Kangra, Himachal Pradesh · Simulated edge feed</p></div><div className="live-map-actions"><span className="map-live-status"><span className="live-dot" /> LIVE · 42 sec ago</span><button className="button secondary" onClick={recenterMap}><Crosshair size={15} /> Recenter</button></div></div><div className="live-map-layout"><div className="panel expanded-map"><div className="expanded-canvas" style={{'--map-scale': mapZoom}}><div className="expanded-stage"><div className="contour contour-one" /><div className="contour contour-two" /><div className="contour contour-three" /><div className="expanded-grid" /><div className="expanded-river" /><div className="expanded-road exp-road-a" /><div className="expanded-road exp-road-b" /><div className="expanded-road exp-road-c" /><div className="expanded-road exp-road-d" /><span className="sector-label sector-one">SECTOR 01 / FLOODPLAIN</span><span className="sector-label sector-two">SECTOR 04 / NORTH VALLEY</span><span className="sector-label sector-three">SECTOR 07 / RIDGE</span>{visibleLayers.hazards && <><button className={`map-marker large hazard-marker ${selectedMarker === 'hazard' ? 'selected' : ''}`} onClick={() => setSelectedMarker('hazard')} style={{top:'33%',left:'42%'}}><AlertTriangle size={15} /></button><button className="map-marker large hazard-marker" onClick={() => setSelectedMarker('hazard')} style={{top:'62%',left:'69%'}}><AlertTriangle size={15} /></button><button className="map-marker large hazard-marker" onClick={() => setSelectedMarker('hazard')} style={{top:'22%',left:'79%'}}><AlertTriangle size={15} /></button></>}{visibleLayers.survivors && <><button className={`map-marker large survivor-marker ${selectedMarker === 'survivor' ? 'selected' : ''}`} onClick={() => setSelectedMarker('survivor')} style={{top:'52%',left:'75%'}}><Users size={15} /></button><button className="map-marker large survivor-marker" onClick={() => setSelectedMarker('survivor')} style={{top:'71%',left:'57%'}}><Users size={15} /></button></>}{visibleLayers.route && <div className="expanded-route"><span className="route-pin">HQ</span><i /><i /><i /><i /><span className="route-target"><Users size={14} /> 18</span></div>}<div className="unit unit-alpha"><span>A</span><b>Alpha</b></div><div className="unit unit-bravo"><span>B</span><b>Bravo</b></div><div className="map-north">N</div></div><div className="expanded-map-key"><span><i className="key-route" /> {routeMode}</span><span><i className="key-hazard" /> hazard cell</span><span><i className="key-survivor" /> survivor</span></div><div className="expanded-zoom"><button onClick={() => setMapZoom(Math.min(mapZoom + .1, 1.5))}>+</button><button onClick={() => setMapZoom(Math.max(mapZoom - .1, .8))}>−</button></div></div><div className="map-readout"><span><strong>Map scale</strong> 1:{Math.round(24000 / mapZoom).toLocaleString()}</span><span><strong>Coverage</strong> 4.8 km²</span><span><strong>Grid</strong> 12 m resolution</span></div></div><aside className="map-intel"><DroneFeed /><div className="intel-card"><span className="panel-kicker">Selected signal</span><div className="intel-title"><div className={`intel-signal ${selectedMarker}`}><span>{selectedMarker === 'survivor' ? <Users size={17} /> : <AlertTriangle size={17} />}</span></div><div><h3>{selectedMarker === 'survivor' ? 'Survivor cluster' : 'Unstable terrain'}</h3><p>{selectedMarker === 'survivor' ? 'Signal detected 00:42 ago' : 'High-risk cell · updated 01:18 ago'}</p></div></div><div className="intel-stats"><span><strong>{selectedMarker === 'survivor' ? '96%' : '88%'}</strong> confidence</span><span><strong>{selectedMarker === 'survivor' ? '18' : '2'}</strong> {selectedMarker === 'survivor' ? 'people' : 'blocked cells'}</span></div><button className="intel-button">Open signal report <ArrowUpRight size={14} /></button></div><div className="intel-card layers-card"><div className="panel-head"><div><span className="panel-kicker">Map controls</span><h3>Visible layers</h3></div><SlidersHorizontal size={16} /></div>{[['hazards','Hazard cells',12],['route','Recommended route',1],['survivors','Survivor signals',3]].map(([key,label,count]) => <label className="layer-toggle" key={key}><input type="checkbox" checked={visibleLayers[key]} onChange={() => setVisibleLayers({...visibleLayers,[key]:!visibleLayers[key]})} /><span>{label}</span><em>{count}</em></label>)}<button className="route-mode" onClick={() => setRouteMode(routeMode === 'Safest route' ? 'Fastest route' : 'Safest route')}><Route size={14} /> Switch to {routeMode === 'Safest route' ? 'fastest' : 'safest'} route</button></div><div className="intel-card route-card"><span className="panel-kicker">Route recommendation</span><h3>{routeMode} to survivor cluster</h3><div className="route-metrics"><span><strong>11 min</strong> ETA</span><span><strong>1.8 km</strong> distance</span><span><strong>Low</strong> exposure</span></div><div className="route-progress"><span style={{width:'72%'}} /></div><small>Team Alpha · 72% route complete</small></div></aside></div></div>
}

function DroneFeed() {
  const canvasRef = useRef(null)
  const videoRef = useRef(null)
  const [sourceRequested, setSourceRequested] = useState(true)
  const [videoLoading, setVideoLoading] = useState(true)
  const [videoFailed, setVideoFailed] = useState(false)
  const [videoTimedOut, setVideoTimedOut] = useState(false)
  const [frame, setFrame] = useState(18420)
  useEffect(() => {
    const video = videoRef.current
    const startPlayback = () => video?.play().catch(() => {})
    startPlayback()
    video?.addEventListener('loadedmetadata', startPlayback)
    video?.addEventListener('canplay', startPlayback)
    return () => {
      video?.removeEventListener('loadedmetadata', startPlayback)
      video?.removeEventListener('canplay', startPlayback)
    }
  }, [])
  useEffect(() => {
    let animationFrame
    let started = performance.now()
    const draw = (now) => {
      const canvas = canvasRef.current
      const context = canvas?.getContext('2d')
      if (!context) return
      const width = canvas.width
      const height = canvas.height
      const drift = ((now - started) / 1000) % 20
      context.fillStyle = '#789b86'
      context.fillRect(0, 0, width, height)
      context.fillStyle = '#91ad8d'
      context.fillRect(0, 0, width, height * .42)
      context.fillStyle = '#6a9eaa'
      context.beginPath(); context.moveTo(-20, height * .65); context.bezierCurveTo(width * .2, height * .35, width * .42, height * .9, width + 20, height * .47); context.lineTo(width + 20, height + 20); context.lineTo(-20, height + 20); context.fill()
      context.strokeStyle = '#d6d3bb'; context.lineWidth = 5; context.beginPath(); context.moveTo(-20, height * .8); context.lineTo(width * .35, height * .58); context.lineTo(width + 20, height * .25); context.stroke()
      context.strokeStyle = '#b9c6a5'; context.lineWidth = 2; for (let index = -2; index < 8; index += 1) { const x = index * 75 + (drift * 7) % 75; context.beginPath(); context.moveTo(x, 0); context.lineTo(x - 90, height); context.stroke() }
      context.fillStyle = '#5b7860'; for (let index = 0; index < 10; index += 1) { const x = (index * 67 + drift * 4) % (width + 50) - 25; const y = 30 + (index * 29) % (height - 40); context.beginPath(); context.arc(x, y, 13, 0, Math.PI * 2); context.fill() }
      context.fillStyle = '#ed603e'; [[width * .58,height * .38],[width * .72,height * .67]].forEach(([x,y]) => { context.beginPath(); context.arc(x,y,7,0,Math.PI*2); context.fill() })
      context.fillStyle = '#f7f4ed'; context.fillRect(12, 12, 112, 20); context.fillStyle = '#17201d'; context.font = '11px monospace'; context.fillText('DRONE-07 / 4K', 19, 26)
      context.strokeStyle = '#f7f4edaa'; context.lineWidth = 1; context.strokeRect(15, 45, width - 30, height - 60)
      animationFrame = requestAnimationFrame(draw)
    }
    animationFrame = requestAnimationFrame(draw)
    const frameTimer = setInterval(() => setFrame((value) => value + 30), 1000)
    const loadTimer = setTimeout(() => {}, 7000)
    return () => { cancelAnimationFrame(animationFrame); clearInterval(frameTimer); clearTimeout(loadTimer) }
  }, [])
  return <div className="drone-feed"><div className="drone-feed-head"><span><i /> DRONE-07 · AERIAL FEED</span><span>{frame.toLocaleString()} FR</span></div>{sourceRequested && !videoFailed && !videoTimedOut ? <video ref={videoRef} className="drone-video" src="/video/drone-flood.mp4" autoPlay loop muted playsInline preload="auto" controls onLoadedData={() => { setVideoLoading(false); setVideoTimedOut(false) }} onCanPlay={() => { setVideoLoading(false); setVideoTimedOut(false) }} onError={() => { setVideoLoading(false); setVideoFailed(true) }} /> : <canvas ref={canvasRef} width="520" height="270" />}{!sourceRequested && <div className="video-preview"><div><strong>Simulated aerial preview ready</strong><span>Source footage is 19 MB and loads on demand.</span></div><button onClick={() => { setSourceRequested(true); setVideoLoading(true); setVideoTimedOut(false) }}><Video size={14} /> Load source video</button></div>}{sourceRequested && !videoFailed && !videoTimedOut && <div className="video-overlay"><span><i /> LIVE SOURCE VIDEO</span><strong>NEPAL FLOOD AFTERMATH</strong></div>}{sourceRequested && videoLoading && !videoFailed && !videoTimedOut && <div className="video-loading"><span className="loading-spinner" /> Connecting to drone footage...</div>}{(videoFailed || videoTimedOut) && <div className="video-error"><strong>{videoTimedOut ? 'Video is taking too long to load' : 'Source video unavailable'}</strong><span>Showing simulated aerial fallback</span></div>}<div className="drone-feed-meta"><span><Video size={12} /> {!sourceRequested || videoFailed || videoTimedOut ? 'SIMULATED · 24 FPS' : videoLoading ? 'CONNECTING TO SOURCE' : 'SOURCE MP4 · AUDIO MUTED'}</span><span>ALT 184 m</span><span>09:41:28 IST</span></div></div>
}

function SecondaryPage({ activeNav, incidents, zones, mapZoom, setMapZoom, visibleLayers, setVisibleLayers, selectedMarker, setSelectedMarker, routeMode, setRouteMode }) {
  const titles = { 'Live map': 'Operational map', Incidents: 'Incident manager', Analytics: 'Response analytics', 'Video feeds': 'Video feed monitor', Reports: 'Mission reports', Team: 'Response team', Settings: 'Workspace settings' }
  const descriptions = { 'Live map': 'A synchronized view of routes, hazards, and responder positions.', Incidents: 'Review every active operation and its latest intelligence.', Analytics: 'Measure detection quality, route performance, and response time.', 'Video feeds': 'Monitor connected drone and rover feeds at the edge.', Reports: 'Exportable summaries from your simulated mission archive.', Team: 'Coordinate field units and confirm their readiness.', Settings: 'Configure the local mission workspace and analysis layers.' }
  if (activeNav === 'Incidents') return <IncidentCommandPage incidents={incidents} />
  if (activeNav === 'Analytics') return <AnalyticsCommandPage />
  if (activeNav === 'Team') return <ResponseTeamPage />
  return activeNav === 'Live map' ? <LiveMapPage mapZoom={mapZoom} setMapZoom={setMapZoom} visibleLayers={visibleLayers} setVisibleLayers={setVisibleLayers} selectedMarker={selectedMarker} setSelectedMarker={setSelectedMarker} routeMode={routeMode} setRouteMode={setRouteMode} /> : activeNav === 'Video feeds' ? <div className="video-page"><div className="subpage-intro"><div><span className="panel-kicker">Workspace / Video feeds</span><h2>Camera feed monitor</h2><p>All simulated aerial feeds currently available to the response team.</p></div><span className="map-live-status"><span className="live-dot" /> 1 FEED ONLINE</span></div><div className="video-page-grid"><DroneFeed /><div className="panel video-status"><div className="panel-head"><div><span className="panel-kicker">Feed diagnostics</span><h3>DRONE-07 status</h3></div><CheckCircle2 color="var(--green)" size={17} /></div><div className="video-stat"><span>Signal strength</span><strong>Excellent</strong></div><div className="video-stat"><span>Stream latency</span><strong>42 ms</strong></div><div className="video-stat"><span>Storage buffer</span><strong>18 min</strong></div><button className="button primary"><Video size={15} /> Enter full screen</button></div></div></div> : <div className="subpage"><div className="subpage-intro"><div><span className="panel-kicker">Mission workspace</span><h2>{titles[activeNav]}</h2><p>{descriptions[activeNav]}</p></div><button className="button primary"><Sparkles size={16} /> Generate insight</button></div><div className="subpage-grid"><div className="panel subpage-main"><div className="panel-head"><div><span className="panel-kicker">Simulated live data</span><h3>Latest workspace activity</h3></div><span className="confidence"><CheckCircle2 size={14} /> Synced</span></div><div className="subpage-list">{(activeNav === 'Incidents' ? incidents : zones).map((item, index) => <div className="subpage-row" key={item.id || item.label}><div className={`subpage-number ${index === 0 ? 'hot' : ''}`}>{String(index + 1).padStart(2, '0')}</div><div><strong>{item.name || item.label}</strong><span>{item.location || `${item.count} detected signals · Updated moments ago`}</span></div><span className="subpage-value">{item.people || item.count || `${92 - index * 8}%`}<small>{item.people ? 'at risk' : 'confidence'}</small></span><ArrowUpRight size={15} /></div>)}</div></div><div className="panel insight-panel"><div className="panel-head"><div><span className="panel-kicker">AI recommendation</span><h3>Next best action</h3></div><Sparkles size={17} className="spark" /></div><div className="insight-body"><div className="insight-icon"><Route size={21} /></div><strong>Deploy Team Alpha via Route 03</strong><p>Current route avoids two unstable terrain cells and reduces estimated travel time by 11 minutes.</p><button className="text-button">Review recommendation <ArrowUpRight size={15} /></button></div></div></div></div>
}

function AnalyticsCommandPage() {
  const [metric, setMetric] = useState('Response time')
  const [focus, setFocus] = useState('All sectors')
  const metrics = { 'Response time': { value: '18m 42s', change: '-12.8%', label: 'average time to route', color: 'orange' }, 'Detection accuracy': { value: '96.4%', change: '+4.6%', label: 'model confidence score', color: 'green' }, 'People located': { value: '87', change: '+22.1%', label: 'signals resolved', color: 'blue' } }
  const activeMetric = metrics[metric]
  return <div className="analytics-command"><div className="analytics-head"><div><div className="eyebrow"><span className="pulse" /> INTELLIGENCE LAB <span className="eyebrow-time">· SIMULATED DATA</span></div><h2>Response analytics</h2><p>Turn every scan into a clearer decision for the field team.</p></div><div className="analytics-actions"><select value={focus} onChange={(event) => setFocus(event.target.value)}><option>All sectors</option><option>North Valley</option><option>East Ridge</option><option>Riverbend</option></select><button className="button primary"><FileText size={15} /> Export analysis</button></div></div><div className="analytics-hero"><div className="analytics-hero-copy"><span className="panel-kicker">Mission performance / {focus}</span><h3>Faster routes. Earlier signals. Safer decisions.</h3><p>RescueMap processed 8,904 simulated frames this week and helped response teams identify high-risk cells before deployment.</p><div className="analytics-hero-meta"><span><strong>08</strong> operations</span><span><strong>94%</strong> route success</span><span><strong>3.2h</strong> saved</span></div></div><div className="pulse-chart"><div className="chart-y"><span>40m</span><span>30m</span><span>20m</span><span>10m</span></div><div className="chart-lines"><i /><i /><i /><i /><i /><i /><i /><div className="chart-area" /><div className="chart-line" /><span className="chart-point point-one" /><span className="chart-point point-two" /><span className="chart-point point-three" /><span className="chart-point point-four" /></div><div className="chart-x"><span>MON</span><span>TUE</span><span>WED</span><span>THU</span><span>FRI</span><span>SAT</span><span>SUN</span></div><div className="chart-caption"><span><i /> Avg. response time</span><strong>↓ 12.8% this week</strong></div></div></div><div className="analytics-metric-tabs">{Object.keys(metrics).map((item) => <button key={item} className={metric === item ? 'active' : ''} onClick={() => setMetric(item)}><span>{item}</span><strong>{metrics[item].value}</strong><small>{metrics[item].change} vs previous period</small></button>)}</div><div className="analytics-grid"><div className="analytics-panel panel"><div className="panel-head"><div><span className="panel-kicker">Computer vision output</span><h3>Detection confidence by class</h3></div><span className="confidence"><ShieldCheck size={14} /> Live model</span></div><div className="confidence-list">{[['Survivors','98.2%','survivor'],['Flood water','96.7%','water'],['Structural debris','93.8%','debris'],['Unstable terrain','91.4%','terrain']].map(([label,value,tone],index) => <div className="confidence-row" key={label}><div className={`confidence-symbol ${tone}`}>{index + 1}</div><span>{label}</span><div className="confidence-track"><i className={tone} style={{width:value}} /></div><strong>{value}</strong><ArrowUpRight size={14} /></div>)}</div><div className="analytics-panel-footer"><span>1,428 frames analyzed</span><button className="text-button">View detections <ArrowUpRight size={14} /></button></div></div><div className="analytics-panel panel"><div className="panel-head"><div><span className="panel-kicker">Route intelligence</span><h3>Path efficiency</h3></div><Route size={16} color="var(--orange)" /></div><div className="route-rank"><div className="route-rank-head"><span>Route</span><span>Time</span><span>Exposure</span></div>{[['03','11 min','LOW','best'],['01','18 min','MEDIUM',''],['02','26 min','HIGH','']].map(([id,time,exposure,tone]) => <div className={`route-rank-row ${tone}`} key={id}><b>0{id}</b><div><strong>{time}</strong><span>{id === '03' ? 'Safest approach' : 'Alternate approach'}</span></div><em className={exposure.toLowerCase()}>{exposure}</em></div>)}</div><div className="analytics-panel-footer"><span>Computed against 42 terrain cells</span><button className="text-button">Compare routes <ArrowUpRight size={14} /></button></div></div><div className="analytics-panel panel insights-panel"><div className="panel-head"><div><span className="panel-kicker">AI findings</span><h3>What changed this period</h3></div><Sparkles size={16} color="var(--orange)" /></div><div className="finding"><div className="finding-icon orange"><TrendingUpIcon /></div><div><strong>Flood boundary expanded</strong><span>8% since the previous scan in Sector 01.</span></div></div><div className="finding"><div className="finding-icon green"><ShieldCheck size={15} /></div><div><strong>Route 03 remains viable</strong><span>No new obstruction across the safe corridor.</span></div></div><div className="finding"><div className="finding-icon blue"><Users size={15} /></div><div><strong>3 signals need review</strong><span>Low-confidence survivor signals detected.</span></div></div></div></div></div>
}

function TrendingUpIcon() { return <ArrowUpRight size={15} /> }

function ResponseTeamPage() {
  const [filter, setFilter] = useState('All units')
  const [dispatched, setDispatched] = useState(false)
  const [selectedUnit, setSelectedUnit] = useState('A-04')
  const [commsOpen, setCommsOpen] = useState(false)
  const units = [
    { id: 'A-04', name: 'Team Alpha', role: 'Rapid response unit', status: 'Deployed', location: 'Sector 04 · North Valley', battery: 87, color: 'orange', skills: ['Medical', 'Rope rescue'], task: 'Route 03 · Survivor cluster' },
    { id: 'B-02', name: 'Team Bravo', role: 'Search & assessment', status: 'Standby', location: 'Command post · East Ridge', battery: 94, color: 'blue', skills: ['Search', 'Terrain scan'], task: 'Awaiting assignment' },
    { id: 'C-11', name: 'Medical Unit 11', role: 'Emergency medical support', status: 'Ready', location: 'Staging area · North Valley', battery: 76, color: 'green', skills: ['Trauma care', 'Evacuation'], task: 'Available for dispatch' },
    { id: 'D-07', name: 'Drone Operations', role: 'Aerial intelligence', status: 'Active', location: 'Above Sector 04 · 184 m', battery: 22, color: 'yellow', skills: ['Aerial feed', 'Live scan'], task: 'Mapping flood boundary' },
  ]
  const visibleUnits = filter === 'All units' ? units : units.filter((unit) => unit.status === filter)
  const selected = units.find((unit) => unit.id === selectedUnit) || units[0]
  return <div className="team-command"><div className="team-head"><div><div className="eyebrow"><span className="pulse" /> FIELD OPERATIONS <span className="eyebrow-time">· 4 UNITS ONLINE</span></div><h2>Response team</h2><p>Know who is ready, who is moving, and where help is needed next.</p></div><div className="team-actions"><button className="button secondary" onClick={() => setCommsOpen(!commsOpen)}><Radio size={15} /> {commsOpen ? 'Close comms' : 'Open comms'}</button><button className="button primary" onClick={() => setDispatched(!dispatched)}><Navigation size={15} /> {dispatched ? 'Dispatch queued' : 'Dispatch unit'}</button></div></div>{commsOpen && <div className="comms-strip"><span className="comms-live"><i /> CHANNEL 04 LIVE</span><strong>“North Valley route is clear. Alpha approaching survivor cluster.”</strong><span>Team Alpha · 09:42:16</span></div>}<div className="team-health"><div className="team-health-lead"><div className="readiness-orbit"><Users size={23} /></div><div><span className="panel-kicker">Overall readiness</span><strong>86%</strong><p>Teams can respond now</p></div></div><div className="health-stat"><span>Deployed</span><strong>01</strong><i className="orange-line" /></div><div className="health-stat"><span>Ready</span><strong>02</strong><i className="green-line" /></div><div className="health-stat"><span>Standby</span><strong>01</strong><i className="blue-line" /></div><div className="health-stat"><span>Needs attention</span><strong>01</strong><i className="yellow-line" /></div></div><div className="team-layout"><div className="team-roster panel"><div className="team-roster-head"><div><span className="panel-kicker">Live roster</span><h3>Field units</h3></div><span className="map-live-status"><span className="live-dot" /> SYNCED</span></div><div className="team-filters">{['All units','Deployed','Ready','Standby'].map((item) => <button className={filter === item ? 'active' : ''} onClick={() => setFilter(item)} key={item}>{item}</button>)}</div><div className="unit-list">{visibleUnits.map((unit) => <button className={`unit-card ${selectedUnit === unit.id ? 'selected' : ''}`} key={unit.id} onClick={() => setSelectedUnit(unit.id)}><div className={`unit-avatar ${unit.color}`}>{unit.id.slice(0,1)}</div><div className="unit-copy"><div className="unit-title"><strong>{unit.name}</strong><span className={`unit-status ${unit.status.toLowerCase()}`}><i /> {unit.status}</span></div><span>{unit.role}</span><small><Map size={11} /> {unit.location}</small><div className="skill-tags">{unit.skills.map((skill) => <em key={skill}>{skill}</em>)}</div></div><div className="unit-health"><span>Battery</span><strong className={unit.battery < 30 ? 'low' : ''}>{unit.battery}%</strong><div><i style={{width:`${unit.battery}%`}} /></div><small>{unit.task}</small></div><span className="unit-more"><MoreHorizontal size={17} /></span></button>)}</div></div><aside className="team-side"><div className="team-card panel"><div className="panel-head"><div><span className="panel-kicker">Selected assignment</span><h3>{selected.name} · {selected.id}</h3></div><span className={`route-live ${selected.status.toLowerCase()}`}>{selected.status.toUpperCase()}</span></div><div className="assignment-map"><div className="assignment-grid" /><div className="assignment-line" /><span className="assignment-start">HQ</span><span className="assignment-team">{selected.id.slice(0,1)}</span><span className="assignment-target"><Users size={13} /></span></div><div className="assignment-stats"><span><strong>{selected.status === 'Deployed' ? '72%' : '--'}</strong> complete</span><span><strong>{selected.status === 'Deployed' ? '11 min' : 'Ready'}</strong> ETA</span><span><strong>{selected.battery}%</strong> battery</span></div><button className="team-card-action"><Map size={14} /> Track on live map <ArrowUpRight size={14} /></button></div><div className="team-card panel checklist"><div className="panel-head"><div><span className="panel-kicker">Readiness checklist</span><h3>Before next dispatch</h3></div><CheckCircle2 color="var(--green)" size={17} /></div>{[['Radio network','All channels clear',true],['Medical kits','4 kits verified',true],['Drone battery','Replace after mission',false]].map(([label,value,ok]) => <div className="check-row" key={label}><span className={ok ? 'check-ok' : 'check-warn'}>{ok ? <CheckCircle2 size={14} /> : <AlertTriangle size={14} />}</span><div><strong>{label}</strong><small>{value}</small></div></div>)}</div></aside></div></div>
}

function IncidentCommandPage({ incidents }) {
  const [selected, setSelected] = useState(incidents[0])
  const [acknowledged, setAcknowledged] = useState(false)
  const [filter, setFilter] = useState('All incidents')
  const visible = filter === 'All incidents' ? incidents : incidents.filter((incident) => incident.status === filter)
  return <div className="incident-command"><div className="incident-command-head"><div><div className="eyebrow"><span className="pulse danger-pulse" /> INCIDENT COMMAND <span className="eyebrow-time">· UTC+05:30</span></div><h2>Response desk</h2><p>Prioritize risk, coordinate teams, and keep every operation moving.</p></div><div className="command-actions"><span className="incident-counter"><strong>03</strong> active incidents</span><button className="button secondary"><FileText size={15} /> Export brief</button><button className="button primary" onClick={() => setAcknowledged(true)}>{acknowledged ? <CheckCircle2 size={15} /> : <Siren size={15} />} {acknowledged ? 'Brief acknowledged' : 'Acknowledge brief'}</button></div></div><div className="incident-alert-strip"><div className="alert-pip"><AlertTriangle size={17} /></div><div><strong>Priority alert · {selected.name}</strong><span>{selected.people} people at risk in {selected.location}. AI route confidence is 94%.</span></div><span className="alert-time">UPDATED 02 MIN AGO</span></div><div className="incident-workspace"><div className="incident-queue panel"><div className="queue-head"><div><span className="panel-kicker">Operations queue</span><h3>Incidents</h3></div><button className="icon-btn small"><Filter size={15} /></button></div><div className="queue-tabs">{['All incidents','Active','Monitoring','Resolved'].map((item) => <button className={filter === item ? 'active' : ''} key={item} onClick={() => setFilter(item)}>{item}<em>{item === 'All incidents' ? incidents.length : incidents.filter((incident) => incident.status === item).length}</em></button>)}</div><div className="command-list">{visible.map((incident, index) => <button className={`command-row ${selected.id === incident.id ? 'selected' : ''}`} key={incident.id} onClick={() => setSelected(incident)}><div className={`severity-mark ${incident.severity.toLowerCase()}`}><span>{index + 1}</span></div><div className="command-row-copy"><strong>{incident.name}</strong><span>{incident.id} · {incident.location}</span><small><i className={`status-dot ${incident.status.toLowerCase()}`} /> {incident.status} · Updated {incident.updated}</small></div><div className="row-risk"><strong>{incident.people}</strong><span>at risk</span></div><ArrowUpRight size={14} /></button>)}</div><button className="queue-add"><span>+</span> Register simulated incident</button></div><div className="incident-dossier"><div className="dossier-top"><div><span className="panel-kicker">Incident dossier / {selected.id}</span><h3>{selected.name}</h3><p><Map size={13} /> {selected.location} <span>·</span> Opened today at 07:14 IST</p></div><span className={`big-severity ${selected.severity.toLowerCase()}`}><i /> {selected.severity} priority</span></div><div className="dossier-stats"><div><span>People at risk</span><strong>{selected.people}</strong><small>4 critical signals</small></div><div><span>Response ETA</span><strong>11 min</strong><small className="good"><CheckCircle2 size={12} /> Route verified</small></div><div><span>Terrain confidence</span><strong>94%</strong><small className="good">+6.2% after scan</small></div><div><span>Assigned units</span><strong>04</strong><small>2 en route</small></div></div><div className="dossier-main"><div className="timeline"><div className="dossier-section-head"><div><span className="panel-kicker">Response timeline</span><h4>What is happening now</h4></div><span className="live-badge"><i /> LIVE</span></div>{[['09:41','AI scan updated','4 new hazard cells classified in Sector 04.','ai'],['09:37','Team Alpha deployed','Unit A-04 is 72% through the recommended route.','team'],['09:28','Survivor signal confirmed','Cluster of 18 people detected near the school grounds.','alert'],['09:14','Incident escalated','Priority changed from High to Critical.','critical']].map(([time,title,copy,tone]) => <div className="timeline-item" key={time}><span className={`timeline-dot ${tone}`} /><time>{time}</time><div><strong>{title}</strong><p>{copy}</p></div></div>)}</div><div className="dossier-action"><div className="action-illustration"><Route size={25} /><span>ROUTE 03</span></div><span className="panel-kicker">Recommended next action</span><h4>Reach the survivor cluster</h4><p>Fastest safe approach avoids the flooded underpass and two unstable cells.</p><div className="action-meta"><span><strong>1.8 km</strong> distance</span><span><strong>11 min</strong> arrival</span></div><button className="button primary" onClick={() => setAcknowledged(true)}><Navigation size={15} /> Dispatch Team Alpha</button></div></div></div></div><div className="incident-bottom"><div className="mini-insight"><Activity size={17} /><div><strong>Risk is trending upward</strong><span>Waterline expanded 8% since the last scan.</span></div><ArrowUpRight size={15} /></div><div className="mini-insight"><ShieldCheck size={17} /><div><strong>Route remains viable</strong><span>No new obstruction detected on Route 03.</span></div><CheckCircle2 size={15} /></div></div></div>
}

function StatCard({ icon: Icon, label, value, meta, trend, accent }) { return <div className="stat-card"><div className={`stat-icon ${accent}`}><Icon size={18} /></div><div className="stat-info"><span>{label}</span><strong>{value}</strong><small className={trend}><ArrowUpRight size={13} /> {meta}</small></div><MoreHorizontal className="stat-more" size={17} /></div> }

createRoot(document.getElementById('root')).render(<StrictMode><App /></StrictMode>)

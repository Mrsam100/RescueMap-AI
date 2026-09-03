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
  const snapshot = snapshots[timeRange]

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
        <header className="topbar"><div className="mobile-brand"><Menu size={21} /><span>Rescue<span className="brand-accent">Map</span></span></div><div className="breadcrumb"><span>Mission control</span><span>/</span><strong>{activeNav}</strong></div><div className="top-actions"><div className="global-search"><Search size={17} /><span>Search anything</span><kbd>⌘ K</kbd></div><button className="icon-btn"><CircleHelp size={19} /></button><button className="icon-btn notification"><Bell size={19} /><i /></button><div className="top-avatar">AS</div></div></header>
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
  return <div className="live-map-page"><div className="live-map-toolbar"><div><span className="panel-kicker">Live geospatial command</span><h2>North Valley operational picture</h2><p>Sector 04 · Kangra, Himachal Pradesh · Simulated edge feed</p></div><div className="live-map-actions"><span className="map-live-status"><span className="live-dot" /> LIVE · 42 sec ago</span><button className="button secondary" onClick={() => setMapZoom(1)}><Crosshair size={15} /> Recenter</button></div></div><div className="live-map-layout"><div className="panel expanded-map"><div className="expanded-canvas" style={{'--map-scale': mapZoom}}><div className="expanded-stage"><div className="contour contour-one" /><div className="contour contour-two" /><div className="contour contour-three" /><div className="expanded-grid" /><div className="expanded-river" /><div className="expanded-road exp-road-a" /><div className="expanded-road exp-road-b" /><div className="expanded-road exp-road-c" /><div className="expanded-road exp-road-d" /><span className="sector-label sector-one">SECTOR 01 / FLOODPLAIN</span><span className="sector-label sector-two">SECTOR 04 / NORTH VALLEY</span><span className="sector-label sector-three">SECTOR 07 / RIDGE</span>{visibleLayers.hazards && <><button className={`map-marker large hazard-marker ${selectedMarker === 'hazard' ? 'selected' : ''}`} onClick={() => setSelectedMarker('hazard')} style={{top:'33%',left:'42%'}}><AlertTriangle size={15} /></button><button className="map-marker large hazard-marker" onClick={() => setSelectedMarker('hazard')} style={{top:'62%',left:'69%'}}><AlertTriangle size={15} /></button><button className="map-marker large hazard-marker" onClick={() => setSelectedMarker('hazard')} style={{top:'22%',left:'79%'}}><AlertTriangle size={15} /></button></>}{visibleLayers.survivors && <><button className={`map-marker large survivor-marker ${selectedMarker === 'survivor' ? 'selected' : ''}`} onClick={() => setSelectedMarker('survivor')} style={{top:'52%',left:'75%'}}><Users size={15} /></button><button className="map-marker large survivor-marker" onClick={() => setSelectedMarker('survivor')} style={{top:'71%',left:'57%'}}><Users size={15} /></button></>}{visibleLayers.route && <div className="expanded-route"><span className="route-pin">HQ</span><i /><i /><i /><i /><span className="route-target"><Users size={14} /> 18</span></div>}<div className="unit unit-alpha"><span>A</span><b>Alpha</b></div><div className="unit unit-bravo"><span>B</span><b>Bravo</b></div><div className="map-north">N</div></div><div className="expanded-map-key"><span><i className="key-route" /> {routeMode}</span><span><i className="key-hazard" /> hazard cell</span><span><i className="key-survivor" /> survivor</span></div><div className="expanded-zoom"><button onClick={() => setMapZoom(Math.min(mapZoom + .1, 1.5))}>+</button><button onClick={() => setMapZoom(Math.max(mapZoom - .1, .8))}>−</button></div></div><div className="map-readout"><span><strong>Map scale</strong> 1:{Math.round(24000 / mapZoom).toLocaleString()}</span><span><strong>Coverage</strong> 4.8 km²</span><span><strong>Grid</strong> 12 m resolution</span></div></div><aside className="map-intel"><DroneFeed /><div className="intel-card"><span className="panel-kicker">Selected signal</span><div className="intel-title"><div className={`intel-signal ${selectedMarker}`}><span>{selectedMarker === 'survivor' ? <Users size={17} /> : <AlertTriangle size={17} />}</span></div><div><h3>{selectedMarker === 'survivor' ? 'Survivor cluster' : 'Unstable terrain'}</h3><p>{selectedMarker === 'survivor' ? 'Signal detected 00:42 ago' : 'High-risk cell · updated 01:18 ago'}</p></div></div><div className="intel-stats"><span><strong>{selectedMarker === 'survivor' ? '96%' : '88%'}</strong> confidence</span><span><strong>{selectedMarker === 'survivor' ? '18' : '2'}</strong> {selectedMarker === 'survivor' ? 'people' : 'blocked cells'}</span></div><button className="intel-button">Open signal report <ArrowUpRight size={14} /></button></div><div className="intel-card layers-card"><div className="panel-head"><div><span className="panel-kicker">Map controls</span><h3>Visible layers</h3></div><SlidersHorizontal size={16} /></div>{[['hazards','Hazard cells',12],['route','Recommended route',1],['survivors','Survivor signals',3]].map(([key,label,count]) => <label className="layer-toggle" key={key}><input type="checkbox" checked={visibleLayers[key]} onChange={() => setVisibleLayers({...visibleLayers,[key]:!visibleLayers[key]})} /><span>{label}</span><em>{count}</em></label>)}<button className="route-mode" onClick={() => setRouteMode(routeMode === 'Safest route' ? 'Fastest route' : 'Safest route')}><Route size={14} /> Switch to {routeMode === 'Safest route' ? 'fastest' : 'safest'} route</button></div><div className="intel-card route-card"><span className="panel-kicker">Route recommendation</span><h3>{routeMode} to survivor cluster</h3><div className="route-metrics"><span><strong>11 min</strong> ETA</span><span><strong>1.8 km</strong> distance</span><span><strong>Low</strong> exposure</span></div><div className="route-progress"><span style={{width:'72%'}} /></div><small>Team Alpha · 72% route complete</small></div></aside></div></div>
}

function DroneFeed() {
  const canvasRef = useRef(null)
  const [videoLoading, setVideoLoading] = useState(true)
  const [videoFailed, setVideoFailed] = useState(false)
  const [videoTimedOut, setVideoTimedOut] = useState(false)
  const [frame, setFrame] = useState(18420)
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
    const loadTimer = setTimeout(() => setVideoTimedOut(true), 7000)
    return () => { cancelAnimationFrame(animationFrame); clearInterval(frameTimer); clearTimeout(loadTimer) }
  }, [])
  return <div className="drone-feed"><div className="drone-feed-head"><span><i /> DRONE-07 · AERIAL FEED</span><span>{frame.toLocaleString()} FR</span></div>{videoFailed || videoTimedOut ? <canvas ref={canvasRef} width="520" height="270" /> : <video className="drone-video" src="/video/drone-flood.mp4" autoPlay loop muted playsInline preload="metadata" controls onLoadedData={() => { setVideoLoading(false); setVideoTimedOut(false) }} onCanPlay={() => { setVideoLoading(false); setVideoTimedOut(false) }} onError={() => { setVideoLoading(false); setVideoFailed(true) }} />}{!videoFailed && !videoTimedOut && <div className="video-overlay"><span><i /> LIVE SOURCE VIDEO</span><strong>NEPAL FLOOD AFTERMATH</strong></div>}{videoLoading && !videoFailed && !videoTimedOut && <div className="video-loading"><span className="loading-spinner" /> Connecting to drone footage...</div>}{(videoFailed || videoTimedOut) && <div className="video-error"><strong>{videoTimedOut ? 'Video is taking too long to load' : 'Source video unavailable'}</strong><span>Showing simulated aerial fallback</span></div>}<div className="drone-feed-meta"><span><Video size={12} /> {videoFailed || videoTimedOut ? 'SIMULATED · 24 FPS' : videoLoading ? 'CONNECTING TO SOURCE' : 'SOURCE MP4 · AUDIO MUTED'}</span><span>ALT 184 m</span><span>09:41:28 IST</span></div></div>
}

function SecondaryPage({ activeNav, incidents, zones, mapZoom, setMapZoom, visibleLayers, setVisibleLayers, selectedMarker, setSelectedMarker, routeMode, setRouteMode }) {
  const titles = { 'Live map': 'Operational map', Incidents: 'Incident manager', Analytics: 'Response analytics', 'Video feeds': 'Video feed monitor', Reports: 'Mission reports', Team: 'Response team', Settings: 'Workspace settings' }
  const descriptions = { 'Live map': 'A synchronized view of routes, hazards, and responder positions.', Incidents: 'Review every active operation and its latest intelligence.', Analytics: 'Measure detection quality, route performance, and response time.', 'Video feeds': 'Monitor connected drone and rover feeds at the edge.', Reports: 'Exportable summaries from your simulated mission archive.', Team: 'Coordinate field units and confirm their readiness.', Settings: 'Configure the local mission workspace and analysis layers.' }
  return activeNav === 'Live map' ? <LiveMapPage mapZoom={mapZoom} setMapZoom={setMapZoom} visibleLayers={visibleLayers} setVisibleLayers={setVisibleLayers} selectedMarker={selectedMarker} setSelectedMarker={setSelectedMarker} routeMode={routeMode} setRouteMode={setRouteMode} /> : activeNav === 'Video feeds' ? <div className="video-page"><div className="subpage-intro"><div><span className="panel-kicker">Workspace / Video feeds</span><h2>Camera feed monitor</h2><p>All simulated aerial feeds currently available to the response team.</p></div><span className="map-live-status"><span className="live-dot" /> 1 FEED ONLINE</span></div><div className="video-page-grid"><DroneFeed /><div className="panel video-status"><div className="panel-head"><div><span className="panel-kicker">Feed diagnostics</span><h3>DRONE-07 status</h3></div><CheckCircle2 color="var(--green)" size={17} /></div><div className="video-stat"><span>Signal strength</span><strong>Excellent</strong></div><div className="video-stat"><span>Stream latency</span><strong>42 ms</strong></div><div className="video-stat"><span>Storage buffer</span><strong>18 min</strong></div><button className="button primary"><Video size={15} /> Enter full screen</button></div></div></div> : <div className="subpage"><div className="subpage-intro"><div><span className="panel-kicker">Mission workspace</span><h2>{titles[activeNav]}</h2><p>{descriptions[activeNav]}</p></div><button className="button primary"><Sparkles size={16} /> Generate insight</button></div><div className="subpage-grid"><div className="panel subpage-main"><div className="panel-head"><div><span className="panel-kicker">Simulated live data</span><h3>Latest workspace activity</h3></div><span className="confidence"><CheckCircle2 size={14} /> Synced</span></div><div className="subpage-list">{(activeNav === 'Incidents' ? incidents : zones).map((item, index) => <div className="subpage-row" key={item.id || item.label}><div className={`subpage-number ${index === 0 ? 'hot' : ''}`}>{String(index + 1).padStart(2, '0')}</div><div><strong>{item.name || item.label}</strong><span>{item.location || `${item.count} detected signals · Updated moments ago`}</span></div><span className="subpage-value">{item.people || item.count || `${92 - index * 8}%`}<small>{item.people ? 'at risk' : 'confidence'}</small></span><ArrowUpRight size={15} /></div>)}</div></div><div className="panel insight-panel"><div className="panel-head"><div><span className="panel-kicker">AI recommendation</span><h3>Next best action</h3></div><Sparkles size={17} className="spark" /></div><div className="insight-body"><div className="insight-icon"><Route size={21} /></div><strong>Deploy Team Alpha via Route 03</strong><p>Current route avoids two unstable terrain cells and reduces estimated travel time by 11 minutes.</p><button className="text-button">Review recommendation <ArrowUpRight size={15} /></button></div></div></div></div>
}

function StatCard({ icon: Icon, label, value, meta, trend, accent }) { return <div className="stat-card"><div className={`stat-icon ${accent}`}><Icon size={18} /></div><div className="stat-info"><span>{label}</span><strong>{value}</strong><small className={trend}><ArrowUpRight size={13} /> {meta}</small></div><MoreHorizontal className="stat-more" size={17} /></div> }

createRoot(document.getElementById('root')).render(<StrictMode><App /></StrictMode>)

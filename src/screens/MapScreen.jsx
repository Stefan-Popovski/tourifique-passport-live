import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useStore } from '../store/useStore'

// Demo cities for pin-drop without traveling
const DEMO_CITIES = [
  { name: 'Tokyo, Japan', lat: 35.6762, lng: 139.6503 },
  { name: 'Paris, France', lat: 48.8566, lng: 2.3522 },
  { name: 'New York, USA', lat: 40.7128, lng: -74.0060 },
  { name: 'Cape Town, SA', lat: -33.9249, lng: 18.4241 },
  { name: 'Sydney, Australia', lat: -33.8688, lng: 151.2093 },
  { name: 'Dubai, UAE', lat: 25.2048, lng: 55.2708 },
  { name: 'Nairobi, Kenya', lat: -1.2921, lng: 36.8219 },
  { name: 'Rio de Janeiro', lat: -22.9068, lng: -43.1729 },
  { name: 'London, UK', lat: 51.5074, lng: -0.1278 },
  { name: 'Bangkok, Thailand', lat: 13.7563, lng: 100.5018 },
  { name: 'Mexico City', lat: 19.4326, lng: -99.1332 },
  { name: 'Berlin, Germany', lat: 52.5200, lng: 13.4050 },
]

// deterministic colour per place index — visited spots light up the black map
const COLORS = ['#A78BFA', '#FACC15', '#EC4899', '#22D3EE', '#34D399', '#FB923C']
const ROUTE = '#C4B5FD'

const initialsOf = (name = 'You') => name.trim().split(/\s+/).map(w => w[0]).slice(0, 2).join('').toUpperCase() || 'You'

export default function MapScreen() {
  const { user, places, addPlace } = useStore()
  const mapRef = useRef(null)
  const leafletMap = useRef(null)
  const layersRef = useRef(null)
  const placesRef = useRef(places); placesRef.current = places
  const userRef = useRef(user); userRef.current = user

  const resizeRef = useRef(null)
  const [locStatus, setLocStatus] = useState('idle')
  const [demoSearch, setDemoSearch] = useState('')
  const [showPanel, setShowPanel] = useState(false)
  const [revealAnim, setRevealAnim] = useState(null)
  const [toast, setToast] = useState(null)

  const filteredCities = DEMO_CITIES.filter(c => c.name.toLowerCase().includes(demoSearch.toLowerCase()))

  function drawPlaces(L) {
    const map = leafletMap.current
    if (!map) return
    if (!layersRef.current) layersRef.current = L.layerGroup().addTo(map)
    const group = layersRef.current
    group.clearLayers()

    const pts = placesRef.current
    const latlngs = pts.map(p => [p.lat, p.lng])

    // travel route — dotted line from place to place, in order
    if (latlngs.length >= 2) {
      L.polyline(latlngs, { color: ROUTE, weight: 2, opacity: 0.85, dashArray: '1 9', lineCap: 'round' }).addTo(group)
    }

    pts.forEach((p, i) => {
      const color = COLORS[i % COLORS.length]
      const isCurrent = i === pts.length - 1

      if (isCurrent) {
        // "you are here" — avatar pin with a pulsing ring
        const photo = p.photos?.[0]?.url
        const head = photo
          ? `<defs><clipPath id="pc${i}"><circle cx="22" cy="19" r="13"/></clipPath></defs><image href="${photo}" x="9" y="6" width="26" height="26" clip-path="url(#pc${i})" preserveAspectRatio="xMidYMid slice"/>`
          : `<circle cx="22" cy="19" r="13" fill="#7C3AED"/><text x="22" y="23.5" text-anchor="middle" font-size="12.5" font-weight="700" fill="#fff" font-family="Space Grotesk, sans-serif">${initialsOf(userRef.current?.name)}</text>`
        const html = `<svg width="44" height="58" viewBox="0 0 44 58" style="overflow:visible;filter:drop-shadow(0 6px 10px rgba(0,0,0,0.55))">
          <path d="M22 57C22 57 41 33 41 19A19 19 0 1 0 3 19C3 33 22 57 22 57Z" fill="#7C3AED" stroke="#fff" stroke-width="2.5"/>
          ${head}
          <circle cx="22" cy="19" r="13" fill="none" stroke="#C4B5FD" stroke-width="2">
            <animate attributeName="r" values="13;23" dur="2s" repeatCount="indefinite"/>
            <animate attributeName="opacity" values="0.7;0" dur="2s" repeatCount="indefinite"/>
          </circle>
        </svg>`
        const icon = L.divIcon({ html, className: '', iconSize: [44, 58], iconAnchor: [22, 57] })
        L.marker([p.lat, p.lng], { icon, zIndexOffset: 1000 }).addTo(group).bindPopup(`<b>${p.name}</b><br/>You are here`)
      } else {
        // visited place — colour teardrop pin, tip on the spot
        const html = `<svg width="30" height="40" viewBox="0 0 30 40" style="overflow:visible;filter:drop-shadow(0 4px 6px rgba(0,0,0,0.5)) drop-shadow(0 0 8px ${color}aa)">
          <path d="M15 39C15 39 27.5 23 27.5 14A12.5 12.5 0 1 0 2.5 14C2.5 23 15 39 15 39Z" fill="${color}" stroke="#fff" stroke-width="2"/>
          <circle cx="15" cy="14" r="5" fill="#fff"/>
        </svg>`
        const icon = L.divIcon({ html, className: '', iconSize: [30, 40], iconAnchor: [15, 39] })
        L.marker([p.lat, p.lng], { icon }).addTo(group).bindPopup(`<b>${p.name}</b><br/>${p.date}`)
        L.circle([p.lat, p.lng], { radius: 200000, color, fillColor: color, fillOpacity: 0.07, weight: 1, opacity: 0.3 }).addTo(group)
      }
    })
  }

  // smallest zoom whose world tiles fully cover the viewport (no blank bands)
  function fillZoom() {
    const el = mapRef.current
    const side = el ? Math.max(el.clientWidth, el.clientHeight) : 800
    return Math.max(2, Math.ceil(Math.log2(side / 256)))
  }

  // centre on the trail at a zoom that BOTH frames the pins and fills the screen with tiles
  function fitToPlaces(map, L) {
    map.invalidateSize()
    const pts = placesRef.current.map(p => [p.lat, p.lng])
    const min = fillZoom()
    if (pts.length === 0) { map.setView([30, 10], min, { animate: false }); return }
    if (pts.length === 1) { map.setView(pts[0], Math.max(min, 4), { animate: false }); return }
    const bounds = L.latLngBounds(pts).pad(0.25)
    const fitZ = map.getBoundsZoom(bounds, false)
    map.setView(bounds.getCenter(), Math.max(fitZ, min), { animate: false })
  }

  // create map once
  useEffect(() => {
    if (leafletMap.current || !mapRef.current) return
    import('leaflet').then(L => {
      const map = L.map(mapRef.current, { center: [30, 10], zoom: fillZoom(), minZoom: 2, zoomControl: false, attributionControl: false, worldCopyJump: true })
      // pure-black basemap (no labels) so visited places are the only colour
      L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}{r}.png', { subdomains: 'abcd', maxZoom: 19 }).addTo(map)
      L.control.zoom({ position: 'bottomright' }).addTo(map)
      leafletMap.current = map
      drawPlaces(L)
      fitToPlaces(map, L)
      // re-run after layout settles (SPA containers size late) so tiles fill
      setTimeout(() => fitToPlaces(map, L), 250)

      const onResize = () => { map.invalidateSize(); if (map.getZoom() < fillZoom()) map.setZoom(fillZoom()) }
      resizeRef.current = onResize
      window.addEventListener('resize', onResize)
    })
    return () => {
      if (resizeRef.current) window.removeEventListener('resize', resizeRef.current)
      if (leafletMap.current) { leafletMap.current.remove(); leafletMap.current = null; layersRef.current = null }
    }
  }, [])

  // redraw when places change
  useEffect(() => {
    if (!leafletMap.current) return
    import('leaflet').then(L => drawPlaces(L))
  }, [places, user])

  function locateUser() {
    setLocStatus('loading')
    navigator.geolocation.getCurrentPosition(
      pos => {
        setLocStatus('success')
        if (leafletMap.current) leafletMap.current.flyTo([pos.coords.latitude, pos.coords.longitude], 8, { duration: 1.5 })
        showToast('Found you')
      },
      () => { setLocStatus('error'); showToast('Location blocked — try Demo mode') }
    )
  }

  function dropDemoPin(city) {
    setShowPanel(false)
    setDemoSearch('')
    setRevealAnim(city.name)
    if (leafletMap.current) leafletMap.current.flyTo([city.lat, city.lng], 8, { duration: 1.5 })
    addPlace({
      name: city.name, lat: city.lat, lng: city.lng,
      date: new Date().toLocaleDateString('en-GB', { month: 'short', year: 'numeric' }).toUpperCase(),
      stamp: '★', photos: [], videos: [],
    })
    showToast(`${city.name} added to your map`)
    setTimeout(() => setRevealAnim(null), 3000)
  }

  function showToast(msg) { setToast(msg); setTimeout(() => setToast(null), 2500) }

  const PinIcon = ({ c = '#fff' }) => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: 6, verticalAlign: '-2px' }}>
      <path d="M12 21s-6-5.3-6-10a6 6 0 0 1 12 0c0 4.7-6 10-6 10z" /><circle cx="12" cy="11" r="2" />
    </svg>
  )

  return (
    <div className="map-shell" style={{ position: 'relative', background: '#06060c', display: 'flex', flexDirection: 'column' }}>
      <style>{`
        .map-shell { height: 100dvh; }
        @media (min-width: 768px) { .map-shell { height: calc(100dvh - 64px); } }
        .leaflet-container { background: #06060c !important; }
        .leaflet-popup-content-wrapper { border-radius: 12px; }
        .leaflet-popup-content { font-family: 'Inter', sans-serif; }
      `}</style>

      {/* Map */}
      <div ref={mapRef} style={{ width: '100%', height: '100%' }} />

      {/* Header overlay */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, padding: '20px 16px 0', background: 'linear-gradient(to bottom, rgba(6,6,12,0.92) 0%, transparent 100%)', pointerEvents: 'none', zIndex: 10 }}>
        <div style={{ pointerEvents: 'all' }}>
          <p style={{ color: '#A78BFA', fontSize: 11, fontWeight: 700, margin: 0, letterSpacing: 2.5, fontFamily: 'Space Grotesk, sans-serif' }}>EXPLORED</p>
          <h2 style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: 22, color: 'white', margin: '2px 0 0', letterSpacing: -0.4 }}>World Map</h2>
        </div>
      </div>

      {/* Single floating button — fixed + above the nav/map panes so it's never hidden */}
      <motion.button whileHover={{ y: -2 }} whileTap={{ scale: 0.96 }} onClick={() => setShowPanel(true)}
        style={{
          position: 'fixed', bottom: 96, left: '50%', transform: 'translateX(-50%)', zIndex: 450,
          display: 'inline-flex', alignItems: 'center', gap: 8,
          background: 'linear-gradient(135deg, #6D28D9, #8B5CF6)', color: '#fff', border: 'none',
          borderRadius: 999, padding: '14px 24px', fontSize: 14.5, fontWeight: 700,
          fontFamily: 'Space Grotesk, sans-serif', cursor: 'pointer',
          boxShadow: '0 18px 40px -12px rgba(109,40,217,0.85)',
        }}>
        <PinIcon /> Add a place
      </motion.button>

      {/* Controls popup (bottom sheet) */}
      <AnimatePresence>
        {showPanel && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setShowPanel(false)}
            style={{ position: 'fixed', inset: 0, background: 'rgba(6,6,12,0.62)', backdropFilter: 'blur(6px)', zIndex: 500, display: 'flex', alignItems: 'flex-end', justifyContent: 'center', padding: 16 }}>
            <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 50, opacity: 0 }}
              transition={{ type: 'spring', damping: 28, stiffness: 320 }} onClick={e => e.stopPropagation()}
              style={{ background: '#fff', borderRadius: 24, padding: 20, width: '100%', maxWidth: 460, marginBottom: 'env(safe-area-inset-bottom, 0px)', boxShadow: '0 40px 90px -30px rgba(0,0,0,0.6)', fontFamily: 'Inter, sans-serif' }}>
              {/* header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
                <div>
                  <p style={{ color: '#6D28D9', fontSize: 11, fontWeight: 700, letterSpacing: 2, margin: 0, fontFamily: 'Space Grotesk, sans-serif' }}>YOUR MAP</p>
                  <h3 style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, color: '#14101F', fontSize: 21, margin: '3px 0 0', letterSpacing: -0.4 }}>Add a place</h3>
                  <p style={{ color: '#938CA8', fontSize: 12.5, margin: '3px 0 0' }}>
                    {places.length === 0 ? 'No places yet — drop your first pin' : `Your trail across ${places.length} place${places.length > 1 ? 's' : ''}`}
                  </p>
                </div>
                <button onClick={() => setShowPanel(false)} aria-label="Close"
                  style={{ background: '#F4EEFF', border: '1px solid #E4D7FB', borderRadius: '50%', width: 32, height: 32, cursor: 'pointer', color: '#6D28D9', fontSize: 18, lineHeight: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>×</button>
              </div>

              {/* use current location */}
              <motion.button whileTap={{ scale: 0.98 }} onClick={() => { setShowPanel(false); locateUser() }} disabled={locStatus === 'loading'}
                style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, background: 'linear-gradient(135deg, #6D28D9, #8B5CF6)', color: '#fff', border: 'none', borderRadius: 12, padding: '13px', fontSize: 14.5, fontWeight: 700, fontFamily: 'Space Grotesk, sans-serif', cursor: 'pointer', boxShadow: '0 12px 26px -12px rgba(109,40,217,0.6)' }}>
                <PinIcon />{locStatus === 'loading' ? 'Locating…' : 'Use my current location'}
              </motion.button>

              {/* divider */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, margin: '16px 0 12px' }}>
                <div style={{ flex: 1, height: 1, background: '#ECE8F3' }} />
                <span style={{ color: '#938CA8', fontSize: 11, fontWeight: 600, letterSpacing: 0.5 }}>OR PICK A CITY</span>
                <div style={{ flex: 1, height: 1, background: '#ECE8F3' }} />
              </div>

              {/* search */}
              <input placeholder="Search a city…" value={demoSearch} onChange={e => setDemoSearch(e.target.value)} autoFocus
                onFocus={e => e.target.style.borderColor = '#6D28D9'} onBlur={e => e.target.style.borderColor = '#ECE8F3'}
                style={{ width: '100%', background: '#fff', border: '1.5px solid #ECE8F3', borderRadius: 11, padding: '12px 14px', color: '#14101F', fontSize: 14, fontFamily: 'Inter, sans-serif', outline: 'none', transition: 'border-color 0.18s' }} />

              {/* list */}
              <div style={{ maxHeight: 220, overflowY: 'auto', marginTop: 10, display: 'flex', flexDirection: 'column', gap: 4 }}>
                {filteredCities.length === 0 && (
                  <p style={{ color: '#938CA8', fontSize: 13, textAlign: 'center', padding: '14px 0', margin: 0 }}>No matches</p>
                )}
                {filteredCities.map(city => (
                  <button key={city.name} onClick={() => dropDemoPin(city)}
                    style={{ display: 'flex', alignItems: 'center', gap: 10, width: '100%', textAlign: 'left', background: '#FAF8FD', border: '1px solid #ECE8F3', borderRadius: 12, color: '#14101F', padding: '11px 14px', fontSize: 14, fontWeight: 500, cursor: 'pointer', fontFamily: 'Inter, sans-serif' }}
                    onMouseEnter={e => e.currentTarget.style.background = '#F4EEFF'}
                    onMouseLeave={e => e.currentTarget.style.background = '#FAF8FD'}>
                    <PinIcon c="#6D28D9" />{city.name}
                  </button>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Reveal animation */}
      <AnimatePresence>
        {revealAnim && (
          <motion.div initial={{ opacity: 0, scale: 0.6 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }}
            style={{ position: 'absolute', top: '34%', left: '50%', transform: 'translateX(-50%)', background: 'rgba(12,10,24,0.92)', backdropFilter: 'blur(20px)', border: '1px solid rgba(250,204,21,0.35)', borderRadius: 20, padding: '20px 28px', textAlign: 'center', zIndex: 50 }}>
            <motion.div animate={{ scale: [1, 1.25, 1], rotate: [0, -8, 8, 0] }} transition={{ duration: 0.6 }} style={{ display: 'inline-block', marginBottom: 8 }}>
              <svg width="40" height="40" viewBox="0 0 24 24" fill="#FACC15" stroke="#9A7426" strokeWidth="1" strokeLinejoin="round"><path d="M12 2.5l2.9 6 6.6.6-5 4.4 1.5 6.5L12 17.8 5.5 20l1.5-6.5-5-4.4 6.6-.6z" /></svg>
            </motion.div>
            <p style={{ color: '#FACC15', fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: 16, margin: 0 }}>{revealAnim}</p>
            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 12, margin: '4px 0 0' }}>added to your map</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
            style={{ position: 'absolute', top: 76, left: '50%', transform: 'translateX(-50%)', background: 'rgba(12,10,24,0.95)', backdropFilter: 'blur(16px)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 999, padding: '10px 20px', color: 'white', fontSize: 13, fontWeight: 600, zIndex: 50, whiteSpace: 'nowrap' }}>
            {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, ArrowRight, Compass, Lock, MapPin, Phone, ShieldCheck } from 'lucide-react'
import { getCountries, getCountryCallingCode } from 'libphonenumber-js'
import { hasFlag } from 'country-flag-icons'
import * as FlagIcons from 'country-flag-icons/react/3x2'
import { useStore } from '../store/useStore'
import { assetUrl } from '../lib/assetUrl'

const INK = '#14101F'
const PURPLE = '#6D28D9'
const VIOLET = '#8B5CF6'
const YELLOW = '#FACC15'

const regionNames = new Intl.DisplayNames(['en'], { type: 'region' })
const COUNTRIES = getCountries()
  .map((id) => ({
    id,
    hasFlag: hasFlag(id),
    label: regionNames.of(id) || id,
    code: `+${getCountryCallingCode(id)}`,
  }))
  .sort((a, b) => a.label.localeCompare(b.label))

const DESTINATIONS = [
  'Paris, France',
  'Tokyo, Japan',
  'Bali, Indonesia',
  'New York, United States',
  'Barcelona, Spain',
  'Rome, Italy',
  'Lisbon, Portugal',
  'London, United Kingdom',
  'Dubai, United Arab Emirates',
  'Tulum, Mexico',
  'Cape Town, South Africa',
  'Reykjavik, Iceland',
]

const CSS = `
  .signup-shell {
    min-height: 100dvh;
    position: relative;
    overflow-x: hidden;
    color: #fff;
    font-family: Inter, sans-serif;
    background:
      linear-gradient(110deg, rgba(7,4,20,0.92) 0%, rgba(16,8,35,0.76) 42%, rgba(16,8,35,0.24) 100%),
      url('${assetUrl('P9300402-573af9506e43a__880.jpg')}') center 58% / cover no-repeat;
  }
  .signup-shell::after {
    content: '';
    position: absolute;
    inset: auto 0 0;
    height: 42%;
    background: linear-gradient(180deg, transparent, rgba(7,4,20,0.92));
    pointer-events: none;
  }
  .signup-panel *, .signup-panel *::before, .signup-panel *::after { box-sizing: border-box; }
  .signup-field::placeholder { color: rgba(255,255,255,0.48); }
  .signup-field:focus, .signup-country-button:focus {
    border-color: rgba(250,204,21,0.76) !important;
    box-shadow: 0 0 0 4px rgba(250,204,21,0.14);
    background: rgba(255,255,255,0.16) !important;
  }
  .signup-form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
  .signup-icon-label { display: inline-flex; align-items: center; gap: 7px; }
  .country-menu { scrollbar-width: none; -ms-overflow-style: none; }
  .country-menu::-webkit-scrollbar { display: none; }
  .signup-phone-control {
    position: relative;
    display: flex;
    align-items: center;
    width: 100%;
    max-width: 100%;
    border: 1px solid rgba(255,255,255,0.24);
    border-radius: 14px;
    background: rgba(255,255,255,0.11);
    transition: border 0.2s, box-shadow 0.2s, background 0.2s;
  }
  .signup-phone-control:focus-within {
    border-color: rgba(250,204,21,0.76);
    box-shadow: 0 0 0 4px rgba(250,204,21,0.14);
    background: rgba(255,255,255,0.16);
  }
  .signup-phone-country {
    height: 52px;
    width: 43%;
    min-width: 180px;
    max-width: 210px;
    padding: 0 14px 0 16px;
    border: 0;
    border-right: 1px solid rgba(255,255,255,0.2);
    background: transparent;
    color: #fff;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
    text-align: left;
    font: 700 15px Inter, sans-serif;
  }
  .signup-phone-prefix {
    padding: 0 7px 0 13px;
    color: rgba(255,255,255,0.86);
    font-weight: 900;
    white-space: nowrap;
  }
  .signup-phone-input {
    flex: 1;
    min-width: 0;
    height: 52px;
    padding: 0 12px 0 4px;
    border: 0;
    background: transparent;
    color: #fff;
    outline: none;
    font: 700 15px Inter, sans-serif;
  }
  .signup-phone-input::placeholder { color: rgba(255,255,255,0.48); font-weight: 600; }
  @media (max-width: 760px) {
    .signup-layout {
      flex-direction: column !important;
      align-items: stretch !important;
      justify-content: center !important;
      gap: 28px !important;
      padding: 88px 18px 28px !important;
    }
    .signup-panel { padding: 24px !important; }
    .signup-form-grid { grid-template-columns: 1fr !important; }
    .signup-phone-control { flex-wrap: wrap; }
    .signup-phone-country {
      width: 100%;
      max-width: none;
      border-right: 0;
      border-bottom: 1px solid rgba(255,255,255,0.18);
    }
    .signup-phone-prefix { padding-left: 16px; }
    .signup-title { font-size: clamp(34px, 13vw, 56px) !important; }
    .signup-copy { max-width: 100% !important; }
  }
`

function CountryFlag({ country, style }) {
  const Flag = country?.hasFlag ? FlagIcons[country.id] : null
  if (!Flag) {
    return <span style={{ width: 24, height: 16, borderRadius: 4, background: 'rgba(255,255,255,0.18)', display: 'inline-block', ...style }} />
  }
  return <Flag style={{ width: 24, height: 16, borderRadius: 4, boxShadow: '0 4px 10px rgba(0,0,0,0.22)', flex: '0 0 auto', ...style }} />
}

export default function SignUp() {
  const navigate = useNavigate()
  const { setUser } = useStore()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [countryId, setCountryId] = useState('US')
  const [countryOpen, setCountryOpen] = useState(false)
  const [countrySearch, setCountrySearch] = useState('')
  const [phone, setPhone] = useState('')
  const [lastPlace, setLastPlace] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const selectedCountry = COUNTRIES.find(country => country.id === countryId) || COUNTRIES[0]
  const filteredCountries = COUNTRIES.filter((country) => {
    const query = countrySearch.trim().toLowerCase()
    if (!query) return true
    return country.label.toLowerCase().includes(query) || country.code.includes(query) || country.id.toLowerCase().includes(query)
  })

  function handleSubmit(e) {
    e.preventDefault()
    if (!name.trim()) return setError('What do we call you?')
    if (!email.includes('@')) return setError('That email looks a bit off.')
    if (password.length < 8) return setError('Use at least 8 characters for your password.')
    if (password !== confirmPassword) return setError('Those passwords do not match.')
    if (phone.replace(/\D/g, '').length < 7) return setError('Add a valid phone number.')
    if (!lastPlace.trim()) return setError('Tell us the last place you have been.')
    setLoading(true)
    setTimeout(() => {
      setUser({
        name: name.trim(),
        email: email.trim(),
        phone: `${selectedCountry.code} ${phone.trim()}`,
        phoneCountry: selectedCountry.label,
        lastPlace: lastPlace.trim(),
        profile: null,
        quizAnswers: null,
      })
      navigate('/quiz')
    }, 600)
  }

  const fieldStyle = {
    width: '100%', padding: '15px 16px',
    border: '1px solid rgba(255,255,255,0.24)',
    borderRadius: 14, fontSize: 15,
    fontFamily: 'Inter, sans-serif',
    background: 'rgba(255,255,255,0.11)', color: '#fff',
    outline: 'none', transition: 'border 0.2s, box-shadow 0.2s, background 0.2s',
  }

  const labelTextStyle = {
    fontSize: 12, fontWeight: 800, color: 'rgba(255,255,255,0.76)',
    letterSpacing: 1.2, textTransform: 'uppercase',
  }

  return (
    <main className="signup-shell">
      <style>{CSS}</style>

      <button
        onClick={() => navigate('/')}
        style={{
          position: 'absolute', top: 24, left: 24, zIndex: 3,
          display: 'inline-flex', alignItems: 'center', gap: 8,
          background: 'rgba(255,255,255,0.12)', color: '#fff',
          border: '1px solid rgba(255,255,255,0.22)', borderRadius: 999,
          padding: '10px 15px', fontSize: 14, fontWeight: 700,
          fontFamily: 'Inter, sans-serif', cursor: 'pointer',
          backdropFilter: 'blur(14px)', boxShadow: '0 14px 36px -24px rgba(0,0,0,0.65)',
        }}
      >
        <ArrowLeft size={16} strokeWidth={2.4} />
        Back
      </button>

      <div className="signup-layout" style={{
        position: 'relative', zIndex: 1, minHeight: '100dvh',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        gap: 48, maxWidth: 1180, margin: '0 auto', padding: '96px 28px 48px',
      }}>
        <motion.section
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.58 }}
          className="signup-copy"
          style={{ maxWidth: 510 }}
        >
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 10,
            padding: '8px 14px', borderRadius: 999,
            background: 'rgba(255,255,255,0.14)', border: '1px solid rgba(255,255,255,0.2)',
            backdropFilter: 'blur(12px)', marginBottom: 22,
          }}>
            <Compass size={17} color={YELLOW} />
            <span style={{ fontSize: 12, fontWeight: 800, letterSpacing: 1.8, textTransform: 'uppercase' }}>Tourifique Passport</span>
          </div>

          <h1 className="signup-title" style={{
            fontFamily: 'Space Grotesk, sans-serif',
            fontWeight: 800,
            fontSize: 'clamp(48px,6vw,78px)',
            lineHeight: 0.95,
            letterSpacing: '-1px',
            margin: '0 0 24px',
            textShadow: '0 6px 46px rgba(0,0,0,0.46)',
          }}>
            Start the trip<br />
            brands remember.
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.82)', fontSize: 18, lineHeight: 1.65, maxWidth: 440, margin: 0, textShadow: '0 2px 16px rgba(0,0,0,0.38)' }}>
            Claim your creator Passport and unlock the quiz that turns your travel style into a brand-ready profile.
          </p>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 28, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.54, delay: 0.08 }}
          className="signup-panel"
          style={{
            width: 'min(100%, 520px)',
            padding: 30,
            borderRadius: 24,
            background: 'linear-gradient(180deg, rgba(255,255,255,0.18), rgba(255,255,255,0.1))',
            border: '1px solid rgba(255,255,255,0.24)',
            boxShadow: '0 34px 90px -38px rgba(0,0,0,0.85)',
            backdropFilter: 'blur(22px)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 18, marginBottom: 26 }}>
            <div>
              <p style={{ color: YELLOW, fontSize: 12, fontWeight: 800, letterSpacing: 1.7, textTransform: 'uppercase', margin: '0 0 9px' }}>Get started</p>
              <h2 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 34, lineHeight: 1.02, letterSpacing: '-0.4px', margin: 0 }}>
                Claim your <span style={{ color: YELLOW }}>Passport</span>
              </h2>
            </div>
            <span style={{
              width: 52, height: 52, borderRadius: 16,
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              background: `linear-gradient(135deg, ${PURPLE}, ${VIOLET})`,
              boxShadow: '0 18px 34px -18px rgba(139,92,246,0.9)',
              flex: '0 0 auto',
            }}>
              <ShieldCheck size={27} color="#fff" strokeWidth={2.2} />
            </span>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 15 }}>
            <div className="signup-form-grid">
              <label style={{ display: 'grid', gap: 7 }}>
                <span style={labelTextStyle}>Your name</span>
                <input
                  className="signup-field"
                  type="text"
                  placeholder="e.g. Sofia Montero"
                  value={name}
                  onChange={e => { setName(e.target.value); setError('') }}
                  style={fieldStyle}
                />
              </label>

              <label style={{ display: 'grid', gap: 7 }}>
                <span style={labelTextStyle}>Email address</span>
                <input
                  className="signup-field"
                  type="email"
                  placeholder="sofia@theworld.com"
                  value={email}
                  onChange={e => { setEmail(e.target.value); setError('') }}
                  style={fieldStyle}
                />
              </label>
            </div>

            <div className="signup-form-grid">
              <label style={{ display: 'grid', gap: 7 }}>
                <span className="signup-icon-label" style={labelTextStyle}><Lock size={13} /> Password</span>
                <input
                  className="signup-field"
                  type="password"
                  placeholder="At least 8 characters"
                  value={password}
                  onChange={e => { setPassword(e.target.value); setError('') }}
                  style={fieldStyle}
                />
              </label>

              <label style={{ display: 'grid', gap: 7 }}>
                <span className="signup-icon-label" style={labelTextStyle}><Lock size={13} /> Confirm password</span>
                <input
                  className="signup-field"
                  type="password"
                  placeholder="Type it again"
                  value={confirmPassword}
                  onChange={e => { setConfirmPassword(e.target.value); setError('') }}
                  style={fieldStyle}
                />
              </label>
            </div>

            <label style={{ display: 'grid', gap: 7 }}>
              <span className="signup-icon-label" style={labelTextStyle}><Phone size={13} /> Phone number</span>
              <div className="signup-phone-control">
                <div style={{ position: 'relative' }}>
                  <button
                    className="signup-phone-country"
                    type="button"
                    onClick={() => setCountryOpen(open => !open)}
                    aria-label="Choose country"
                  >
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 9, minWidth: 0 }}>
                      <CountryFlag country={selectedCountry} />
                      <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {selectedCountry.label}
                      </span>
                    </span>
                    <span style={{ color: YELLOW, fontSize: 12 }}>{countryOpen ? '▲' : '▼'}</span>
                  </button>

                  {countryOpen && (
                    <div style={{
                      position: 'absolute',
                      zIndex: 20,
                      top: 'calc(100% + 8px)',
                      left: 0,
                      width: 'min(380px, calc(100vw - 56px))',
                      padding: 10,
                      borderRadius: 16,
                      background: 'rgba(16,8,35,0.96)',
                      border: '1px solid rgba(255,255,255,0.22)',
                      boxShadow: '0 28px 70px -30px rgba(0,0,0,0.88)',
                      backdropFilter: 'blur(18px)',
                    }}>
                      <input
                        className="signup-field"
                        type="text"
                        value={countrySearch}
                        onChange={e => setCountrySearch(e.target.value)}
                        placeholder="Search country"
                        style={{ ...fieldStyle, padding: '11px 12px', marginBottom: 8 }}
                      />
                      <div className="country-menu" style={{ maxHeight: 230, overflowY: 'auto', display: 'grid', gap: 4 }}>
                        {filteredCountries.map((country) => (
                          <button
                            key={country.id}
                            type="button"
                            onClick={() => {
                              setCountryId(country.id)
                              setCountryOpen(false)
                              setCountrySearch('')
                              setError('')
                            }}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: 9,
                              width: '100%',
                              padding: '9px 10px',
                              border: 'none',
                              borderRadius: 10,
                              background: country.id === countryId ? 'rgba(250,204,21,0.18)' : 'transparent',
                              color: '#fff',
                              textAlign: 'left',
                              fontFamily: 'Inter, sans-serif',
                              fontSize: 13.5,
                              fontWeight: 700,
                              cursor: 'pointer',
                            }}
                          >
                            <CountryFlag country={country} />
                            <span style={{ flex: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{country.label}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <span className="signup-phone-prefix">{selectedCountry.code}</span>
                <input
                  className="signup-phone-input"
                  type="tel"
                  inputMode="tel"
                  placeholder="555 123 4567"
                  value={phone}
                  onChange={e => { setPhone(e.target.value); setError('') }}
                />
              </div>
            </label>

            <label style={{ display: 'grid', gap: 7 }}>
              <span className="signup-icon-label" style={labelTextStyle}><MapPin size={13} /> Last place you have been</span>
              <input
                className="signup-field"
                list="destination-list"
                type="text"
                placeholder="Start typing a city or destination"
                value={lastPlace}
                onChange={e => { setLastPlace(e.target.value); setError('') }}
                style={fieldStyle}
              />
              <datalist id="destination-list">
                {DESTINATIONS.map((place) => <option key={place} value={place} />)}
              </datalist>
            </label>

            {error && (
              <motion.p
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                style={{ color: '#FCA5A5', fontSize: 13, fontWeight: 700, margin: 0 }}
              >
                {error}
              </motion.p>
            )}

            <motion.button
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              style={{
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 9,
                background: loading ? 'rgba(167,139,250,0.78)' : `linear-gradient(135deg, ${YELLOW}, #F59E0B)`,
                color: INK, border: 'none', borderRadius: 999,
                padding: '16px 18px', fontSize: 16, fontWeight: 900,
                fontFamily: 'Space Grotesk, sans-serif', cursor: loading ? 'default' : 'pointer',
                marginTop: 4, boxShadow: '0 22px 36px -22px rgba(250,204,21,0.85)',
              }}
            >
              {loading ? 'Boarding...' : 'Continue'}
              {!loading && <ArrowRight size={18} strokeWidth={2.7} />}
            </motion.button>
          </form>

          <p style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7, color: 'rgba(255,255,255,0.56)', fontSize: 12.5, margin: '20px 0 0' }}>
            <ShieldCheck size={14} />
            No spam. No selling your data.
          </p>
        </motion.section>
      </div>
    </main>
  )
}

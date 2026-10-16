import React, { useState } from 'react';
import {
  Lock,
  User,
  Eye,
  EyeOff,
  ShieldCheck,
  AlertCircle,
  CheckCircle2,
  ArrowRight,
  Sun,
  Moon,
  Sparkles,
  Zap
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useEnergy } from '../context/EnergyContext';
import { WattVisionLogo } from '../assets/logo';
import InteractiveCat from '../components/auth/InteractiveCat';
import '../styles/login.css';

export default function LoginPage({ onLoginSuccess }) {
  const { login } = useAuth();
  const { themeMode, toggleThemeMode, setActivePage } = useEnergy();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [isCoveringEyes, setIsCoveringEyes] = useState(false);
  const [isUsernameFocused, setIsUsernameFocused] = useState(false);
  const [catReactionText, setCatReactionText] = useState('');
  const catReactionTimerRef = React.useRef(null);

  const handleCatInteraction = (type) => {
    if (catReactionTimerRef.current) {
      clearTimeout(catReactionTimerRef.current);
    }
    if (type === 'purr') {
      setCatReactionText('Purr... energy flow is optimal! ✨');
    } else {
      setCatReactionText('Meow! Monitoring grid telemetries...');
    }
    catReactionTimerRef.current = setTimeout(() => {
      setCatReactionText('');
    }, 2800);
  };

  // Button & Card States: 'idle' | 'loading' | 'success' | 'error'
  const [status, setStatus] = useState('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const getSpeechBubbleText = () => {
    if (status === 'loading') return 'Opening WattVision Demo Gateway... 🚀';
    if (status === 'success') return 'Access granted! Welcome, Syedaman! ✨';
    if (status === 'error') return 'Credentials mismatch detected';
    if (isCoveringEyes) return "I won't look at your password! 🙈";
    if (isUsernameFocused) return "Who's logging in? Syedaman?";
    if (catReactionText) return catReactionText;
    return 'Demo ready! Click Enter Demo or sign in';
  };

  const handleQuickDemoLogin = async () => {
    if (status === 'loading' || status === 'success') return;
    setStatus('loading');
    setErrorMessage('');
    setUsername('Syedaman');
    setPassword('demo-session');

    try {
      await login('Syedaman', 'demo-session', true);
      setStatus('success');

      setTimeout(() => {
        if (onLoginSuccess) {
          onLoginSuccess();
        } else {
          setActivePage('dashboard');
        }
      }, 750);
    } catch (err) {
      setStatus('error');
      setErrorMessage('Could not initialize demo session.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (status === 'loading' || status === 'success') return;

    const enteredUser = username.trim() || 'Syedaman';
    const enteredPass = password.trim() || 'demo';

    setStatus('loading');
    setErrorMessage('');

    try {
      await login(enteredUser, enteredPass, rememberMe);
      setStatus('success');

      // Brief transition delay to show success state and happy companion animation
      setTimeout(() => {
        if (onLoginSuccess) {
          onLoginSuccess();
        } else {
          setActivePage('dashboard');
        }
      }, 750);
    } catch (err) {
      setStatus('error');
      setErrorMessage(err.message || 'Invalid username or password.');
    }
  };

  return (
    <main className="wattvision-login-viewport">
      {/* Background Energy Lines & Subtle Ambience */}
      <div className="login-ambient-glow" aria-hidden="true" />
      <div className="login-grid-overlay" aria-hidden="true" />

      {/* Top Utility Actions: Keynote & Display Mode Switcher */}
      <nav className="login-top-actions" aria-label="System navigation">
        <button
          type="button"
          onClick={() => setActivePage('presentation')}
          className="login-action-btn keynote-btn"
          title="Open Public Keynote Presentation"
        >
          <Sparkles size={14} className="icon-gold" />
          <span>Keynote Launch</span>
          <span className="keynote-pill">14 SLIDES</span>
        </button>

        <button
          type="button"
          onClick={toggleThemeMode}
          className="login-action-btn theme-btn"
          title={themeMode === 'dark' ? "Switch to Refined Light Mode" : "Switch to Flagship Dark Mode"}
          aria-label="Toggle display mode"
        >
          {themeMode === 'dark' ? <Moon size={15} /> : <Sun size={15} />}
        </button>
      </nav>

      {/* Main Two-Zone Enterprise Stage */}
      <div className="login-stage-container">
        {/* Zone 1: Interactive 3D Cat Companion */}
        <aside className="login-companion-zone" aria-label="Interactive Companion">
          <div className="companion-speech-bubble">
            <span className="companion-speech-dot" />
            <span className="companion-speech-text">
              {getSpeechBubbleText()}
            </span>
          </div>

          <div className="companion-canvas-frame">
            <InteractiveCat
              isCoveringEyes={isCoveringEyes}
              isUsernameFocused={isUsernameFocused}
              authStatus={status}
              onCatInteraction={handleCatInteraction}
              size={320}
            />
          </div>

          <div className="companion-caption">
            <Sparkles size={13} className="text-gold" />
            <span>WattVision Energy Companion</span>
          </div>
        </aside>

        {/* Zone 2: Administrator Authentication Panel */}
        <section
          className={`login-card-panel ${status === 'error' ? 'has-error' : ''} ${status === 'success' ? 'is-success' : ''}`}
          aria-labelledby="login-heading"
        >
          {/* Card Header & Branding */}
          <header className="login-card-header">
            <div className="login-brand-row">
              <WattVisionLogo size={40} showText={true} />
              <div className="admin-access-badge">
                <span className="admin-status-pulse" />
                <span>ROOT ADMIN</span>
              </div>
            </div>

            <h1 id="login-heading" className="login-card-title">
              Welcome back, Administrator
            </h1>
            <p className="login-card-subtitle">
              Secure access to your intelligent energy control room.
            </p>
          </header>

          {/* Prominent 1-Click Demo Entry Card */}
          <div className="login-demo-entry-box">
            <div className="login-demo-entry-badge">
              <span className="demo-live-dot" />
              <span>COLLEGE DEMO MODE • SIMULATED DATA</span>
            </div>
            <button
              type="button"
              id="enter-demo-button"
              className="login-quick-demo-btn"
              onClick={handleQuickDemoLogin}
              disabled={status === 'loading' || status === 'success'}
            >
              <Sparkles size={16} className="text-gold" />
              <span>Enter Demo (1-Click Instant Access)</span>
              <ArrowRight size={16} className="btn-arrow-icon" />
            </button>
            <p className="login-demo-hint">
              Loads full energy dashboard with fixed simulated telemetries. No credentials required.
            </p>
          </div>

          <div className="login-or-divider">
            <span className="divider-line" />
            <span className="divider-text">OR TEST CREDENTIALS</span>
            <span className="divider-line" />
          </div>

          {/* Error Feedback Notice */}
          {status === 'error' && (
            <div className="login-error-alert" role="alert">
              <AlertCircle size={15} className="error-icon" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Secure Admin Form */}
          <form className="login-auth-form" onSubmit={handleSubmit} noValidate>
            {/* Username Field */}
            <div className="login-field-wrapper">
              <label className="login-field-label" htmlFor="username">
                <span>Username</span>
              </label>
              <div className="login-input-container">
                <User size={16} className="login-field-icon" />
                <input
                  id="username"
                  name="username"
                  type="text"
                  autoComplete="username"
                  required
                  className="login-text-input"
                  placeholder="Enter administrator username"
                  value={username}
                  onChange={(e) => {
                    setUsername(e.target.value);
                    if (status === 'error') setStatus('idle');
                  }}
                  onFocus={() => setIsUsernameFocused(true)}
                  onBlur={() => setIsUsernameFocused(false)}
                  disabled={status === 'loading' || status === 'success'}
                  autoFocus
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="login-field-wrapper">
              <label className="login-field-label" htmlFor="current-password">
                <span>Password</span>
              </label>
              <div className="login-input-container">
                <Lock size={16} className="login-field-icon" />
                <input
                  id="current-password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  className="login-text-input"
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (status === 'error') setStatus('idle');
                  }}
                  onFocus={() => setIsCoveringEyes(true)}
                  onBlur={() => setIsCoveringEyes(false)}
                  disabled={status === 'loading' || status === 'success'}
                />
                <button
                  type="button"
                  className="login-password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                  tabIndex={-1}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Keep Session Active */}
            <div className="login-meta-row">
              <label className="login-checkbox-label">
                <input
                  type="checkbox"
                  className="login-custom-checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  disabled={status === 'loading' || status === 'success'}
                />
                <span className="checkbox-text">Keep session active (7 days)</span>
              </label>
            </div>

            {/* Primary Action Button */}
            <button
              type="submit"
              id="login-submit-button"
              className={`login-primary-submit-btn ${status === 'success' ? 'is-success-state' : ''}`}
              disabled={status === 'loading' || status === 'success'}
            >
              {status === 'loading' ? (
                <>
                  <span className="login-button-spinner" />
                  <span>Authenticating Credentials...</span>
                </>
              ) : status === 'success' ? (
                <>
                  <CheckCircle2 size={18} className="success-icon" />
                  <span>Access Granted — Opening Gateway...</span>
                </>
              ) : (
                <>
                  <span>Access Control Room</span>
                  <ArrowRight size={16} className="btn-arrow-icon" />
                </>
              )}
            </button>
          </form>

          {/* Security Compliance Footer */}
          <footer className="login-panel-footer">
            <div className="login-trust-badges">
              <div className="trust-badge">
                <ShieldCheck size={13} className="text-success" />
                <span>TLS 1.3 Protected</span>
              </div>
              <span className="badge-sep">•</span>
              <div className="trust-badge">
                <span>HttpOnly Session</span>
              </div>
              <span className="badge-sep">•</span>
              <div className="trust-badge">
                <span>RBAC Enforced</span>
              </div>
            </div>
            <div className="login-copyright">
              WattVision Intelligent Energy Gateway • Node Security Architecture
            </div>
          </footer>
        </section>
      </div>
    </main>
  );
}

import React, { useState, useEffect } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Minimize2,
  Play,
  Pause,
  List,
  X,
  Zap,
  Home,
  LayoutDashboard
} from 'lucide-react';
import { WattVisionLogo } from '../../assets/logo';

export default function PresentationControls({
  currentSlide,
  totalSlides,
  onNext,
  onPrev,
  onJumpToSlide,
  onExit,
  slidesMeta = []
}) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isAutoplay, setIsAutoplay] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [autoplayProgress, setAutoplayProgress] = useState(0);

  // Fullscreen state listener
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch((err) => {
        console.warn('Fullscreen request failed:', err.message);
      });
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  // Autoplay timer logic (7 seconds per slide)
  useEffect(() => {
    if (!isAutoplay) {
      setAutoplayProgress(0);
      return;
    }

    const interval = 100; // update progress every 100ms
    const totalTime = 8000;
    const step = (interval / totalTime) * 100;

    const timer = setInterval(() => {
      setAutoplayProgress((prev) => {
        if (prev >= 100) {
          onNext();
          return 0;
        }
        return prev + step;
      });
    }, interval);

    return () => clearInterval(timer);
  }, [isAutoplay, currentSlide, onNext]);

  const progressPercent = ((currentSlide + 1) / totalSlides) * 100;

  return (
    <>
      {/* Top Progress Bar */}
      <div className="pres-progress-container">
        <div
          className="pres-progress-bar"
          style={{ width: `${progressPercent}%` }}
        />
        {isAutoplay && (
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              height: '3px',
              width: `${autoplayProgress}%`,
              background: '#f59e0b',
              boxShadow: '0 0 8px #f59e0b',
              zIndex: 70
            }}
          />
        )}
      </div>

      {/* Top Bar Branding & Navigation Action */}
      <header className="pres-topbar">
        <div className="pres-brand">
          <WattVisionLogo size={28} showText={false} />
          <span style={{ fontWeight: 800, letterSpacing: '-0.02em' }}>WATTVISION</span>
          <span style={{ color: 'rgba(255, 255, 255, 0.2)' }}>•</span>
          <span style={{ fontSize: '0.8rem', color: 'var(--pres-text-secondary)', fontWeight: 500 }} className="pres-hide-mobile">
            Intelligent Energy Monitoring & IoT Analytics
          </span>
        </div>

        <div className="pres-topbar-actions">
          {/* Slide index trigger */}
          <button
            onClick={() => setIsDrawerOpen(true)}
            className="pres-btn-icon"
            title="Open Slide Drawer (All Slides)"
            aria-label="All Slides"
          >
            <List size={18} />
          </button>

          {/* Autoplay toggle */}
          <button
            onClick={() => setIsAutoplay(!isAutoplay)}
            className="pres-btn-icon"
            style={{
              color: isAutoplay ? '#f59e0b' : '#f1f5f9',
              borderColor: isAutoplay ? 'rgba(245, 158, 11, 0.4)' : undefined
            }}
            title={isAutoplay ? 'Pause Autoplay' : 'Start Autoplay Keynote'}
            aria-label="Autoplay"
          >
            {isAutoplay ? <Pause size={17} /> : <Play size={17} />}
          </button>

          {/* Fullscreen toggle */}
          <button
            onClick={toggleFullscreen}
            className="pres-btn-icon"
            title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen Mode'}
            aria-label="Fullscreen"
          >
            {isFullscreen ? <Minimize2 size={17} /> : <Maximize2 size={17} />}
          </button>

          {/* Exit / Return to Dashboard */}
          <button
            onClick={onExit}
            className="pres-btn-nav"
            style={{
              background: 'rgba(6, 182, 212, 0.15)',
              borderColor: 'rgba(6, 182, 212, 0.4)',
              color: '#38bdf8'
            }}
            title="Exit Presentation"
          >
            <LayoutDashboard size={15} />
            <span className="pres-hide-mobile">Exit Keynote</span>
          </button>
        </div>
      </header>

      {/* Bottom Controls Floating Bar */}
      <footer className="pres-bottom-controls">
        {/* Left: Current Slide Counter */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span className="font-mono" style={{ fontSize: '0.9rem', fontWeight: 700, color: '#f8fafc' }}>
            {String(currentSlide + 1).padStart(2, '0')}
          </span>
          <span style={{ color: 'var(--pres-text-muted)', fontSize: '0.8rem' }}>/</span>
          <span className="font-mono" style={{ fontSize: '0.85rem', color: 'var(--pres-text-muted)' }}>
            {String(totalSlides).padStart(2, '0')}
          </span>
          <span style={{ fontSize: '0.75rem', color: 'var(--pres-cyan)', marginLeft: '6px' }} className="pres-hide-mobile">
            — {slidesMeta[currentSlide]?.title || ''}
          </span>
        </div>

        {/* Center/Right: Navigation Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button
            onClick={onPrev}
            disabled={currentSlide === 0}
            className="pres-btn-nav"
            title="Previous Slide (Arrow Left)"
            aria-label="Previous Slide"
          >
            <ChevronLeft size={16} />
            <span className="pres-hide-mobile">Back</span>
          </button>

          <button
            onClick={onNext}
            disabled={currentSlide === totalSlides - 1}
            className="pres-btn-nav"
            style={{
              background: currentSlide < totalSlides - 1 ? 'rgba(6, 182, 212, 0.25)' : undefined,
              borderColor: currentSlide < totalSlides - 1 ? '#06b6d4' : undefined,
              color: currentSlide < totalSlides - 1 ? '#ffffff' : undefined
            }}
            title="Next Slide (Space / Arrow Right)"
            aria-label="Next Slide"
          >
            <span>{currentSlide === totalSlides - 1 ? 'End' : 'Next'}</span>
            <ChevronRight size={16} />
          </button>
        </div>
      </footer>

      {/* Quick Slide Index Drawer Modal */}
      {isDrawerOpen && (
        <div className="pres-drawer-backdrop" onClick={() => setIsDrawerOpen(false)}>
          <div className="pres-drawer-modal" onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', borderBottom: '1px solid rgba(255, 255, 255, 0.1)', paddingBottom: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <List size={20} style={{ color: '#06b6d4' }} />
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#f8fafc', margin: 0 }}>
                  Presentation Index (15 Slides)
                </h3>
              </div>
              <button
                onClick={() => setIsDrawerOpen(false)}
                className="pres-btn-icon"
              >
                <X size={16} />
              </button>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
              gap: '0.85rem'
            }}>
              {slidesMeta.map((slide, idx) => (
                <div
                  key={idx}
                  onClick={() => {
                    onJumpToSlide(idx);
                    setIsDrawerOpen(false);
                  }}
                  style={{
                    padding: '0.85rem',
                    borderRadius: '10px',
                    background: currentSlide === idx ? 'rgba(6, 182, 212, 0.2)' : 'rgba(255, 255, 255, 0.04)',
                    border: `1px solid ${currentSlide === idx ? '#06b6d4' : 'rgba(255, 255, 255, 0.08)'}`,
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '10px'
                  }}
                >
                  <span className="font-mono" style={{
                    fontSize: '0.75rem',
                    fontWeight: 800,
                    color: currentSlide === idx ? '#38bdf8' : 'var(--pres-text-muted)',
                    background: 'rgba(255, 255, 255, 0.06)',
                    padding: '2px 6px',
                    borderRadius: '4px'
                  }}>
                    {String(idx + 1).padStart(2, '0')}
                  </span>
                  <div>
                    <div style={{ fontSize: '0.85rem', fontWeight: 700, color: currentSlide === idx ? '#ffffff' : '#e2e8f0' }}>
                      {slide.title}
                    </div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--pres-text-secondary)', marginTop: '2px' }}>
                      {slide.tag}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

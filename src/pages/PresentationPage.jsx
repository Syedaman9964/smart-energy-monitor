import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useEnergy } from '../context/EnergyContext';
import PresentationControls from '../components/presentation/PresentationControls';

// All 15 Specialized Keynote Slides
import Slide1Hero from '../components/presentation/slides/Slide1Hero';
import Slide2Problem from '../components/presentation/slides/Slide2Problem';
import Slide3Comparison from '../components/presentation/slides/Slide3Comparison';
import Slide4Solution from '../components/presentation/slides/Slide4Solution';
import Slide5Architecture from '../components/presentation/slides/Slide5Architecture';
import Slide6Hardware from '../components/presentation/slides/Slide6Hardware';
import Slide7LiveData from '../components/presentation/slides/Slide7LiveData';
import Slide8Dashboard from '../components/presentation/slides/Slide8Dashboard';
import Slide9Prediction from '../components/presentation/slides/Slide9Prediction';
import Slide10Billing from '../components/presentation/slides/Slide10Billing';
import Slide11Anomaly from '../components/presentation/slides/Slide11Anomaly';
import Slide12Carbon from '../components/presentation/slides/Slide12Carbon';
import Slide13Appliances from '../components/presentation/slides/Slide13Appliances';
import Slide14Roadmap from '../components/presentation/slides/Slide14Roadmap';
import Slide15Conclusion from '../components/presentation/slides/Slide15Conclusion';

import '../styles/presentation.css';

const slidesMeta = [
  { id: 1, title: 'WattVision Hero', tag: 'Product Overview' },
  { id: 2, title: 'The Energy Problem', tag: 'Market Context' },
  { id: 3, title: 'Traditional Meter Limits', tag: 'Tech Gap' },
  { id: 4, title: 'The WattVision Solution', tag: 'Core Platform' },
  { id: 5, title: 'System Architecture', tag: 'Pipeline Map' },
  { id: 6, title: 'Hardware Engineering', tag: 'Optically Isolated Edge' },
  { id: 7, title: 'Live Edge Telemetry', tag: 'Sub-Second Stream' },
  { id: 8, title: 'Dashboard Control Room', tag: 'Software Suite' },
  { id: 9, title: 'Load Prediction Engine', tag: 'Diurnal Regression' },
  { id: 10, title: 'Indian DISCOM Tariffs', tag: 'Multi-Slab Mathematics' },
  { id: 11, title: 'Grid Safety & Anomaly', tag: 'Sub-Second Alarms' },
  { id: 12, title: 'Carbon Footprint ESG', tag: 'CEA Grid Standard' },
  { id: 13, title: 'Appliance NILM', tag: 'Power Disaggregation' },
  { id: 14, title: 'Future Roadmap', tag: 'Microgrids & Solar' },
  { id: 15, title: 'Final Keynote Summary', tag: 'Conclusion' }
];

export default function PresentationPage() {
  const { setActivePage } = useEnergy();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [slideDirection, setSlideDirection] = useState(1); // 1 = forward, -1 = backward
  const lastWheelTimeRef = useRef(0);

  const totalSlides = slidesMeta.length;

  const nextSlide = useCallback(() => {
    if (currentSlide < totalSlides - 1) {
      setSlideDirection(1);
      setCurrentSlide((prev) => prev + 1);
    }
  }, [currentSlide, totalSlides]);

  const prevSlide = useCallback(() => {
    if (currentSlide > 0) {
      setSlideDirection(-1);
      setCurrentSlide((prev) => prev - 1);
    }
  }, [currentSlide]);

  const jumpToSlide = (idx) => {
    if (idx >= 0 && idx < totalSlides) {
      setSlideDirection(idx > currentSlide ? 1 : -1);
      setCurrentSlide(idx);
    }
  };

  const handleExit = () => {
    if (document.fullscreenElement) {
      document.exitFullscreen().catch(() => {});
    }
    setActivePage('dashboard');
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Don't intercept if user is typing in an input
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(e.target.tagName)) return;

      if (e.key === 'ArrowRight' || e.key === ' ' || e.key === 'PageDown') {
        e.preventDefault();
        nextSlide();
      } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        e.preventDefault();
        prevSlide();
      } else if (e.key === 'Escape') {
        e.preventDefault();
        handleExit();
      } else if (e.key === 'Home') {
        e.preventDefault();
        jumpToSlide(0);
      } else if (e.key === 'End') {
        e.preventDefault();
        jumpToSlide(totalSlides - 1);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [nextSlide, prevSlide, totalSlides]);

  // Mouse wheel navigation with debounce
  useEffect(() => {
    const handleWheel = (e) => {
      const now = Date.now();
      if (now - lastWheelTimeRef.current < 650) return;

      if (e.deltaY > 45) {
        lastWheelTimeRef.current = now;
        nextSlide();
      } else if (e.deltaY < -45) {
        lastWheelTimeRef.current = now;
        prevSlide();
      }
    };

    window.addEventListener('wheel', handleWheel, { passive: true });
    return () => window.removeEventListener('wheel', handleWheel);
  }, [nextSlide, prevSlide]);

  const renderSlide = () => {
    switch (currentSlide) {
      case 0:
        return <Slide1Hero onNext={nextSlide} />;
      case 1:
        return <Slide2Problem />;
      case 2:
        return <Slide3Comparison />;
      case 3:
        return <Slide4Solution />;
      case 4:
        return <Slide5Architecture />;
      case 5:
        return <Slide6Hardware />;
      case 6:
        return <Slide7LiveData />;
      case 7:
        return <Slide8Dashboard />;
      case 8:
        return <Slide9Prediction />;
      case 9:
        return <Slide10Billing />;
      case 10:
        return <Slide11Anomaly />;
      case 11:
        return <Slide12Carbon />;
      case 12:
        return <Slide13Appliances />;
      case 13:
        return <Slide14Roadmap />;
      case 14:
        return <Slide15Conclusion onJumpToSlide={jumpToSlide} />;
      default:
        return <Slide1Hero onNext={nextSlide} />;
    }
  };

  return (
    <div className="presentation-viewport">
      {/* Background Decorative Ambient Grid */}
      <div className="presentation-grid-bg" />

      {/* Persistent Controls & Navigation Header/Footer */}
      <PresentationControls
        currentSlide={currentSlide}
        totalSlides={totalSlides}
        onNext={nextSlide}
        onPrev={prevSlide}
        onJumpToSlide={jumpToSlide}
        onExit={handleExit}
        slidesMeta={slidesMeta}
      />

      {/* Main Slide Stage with Framer Motion transitions */}
      <main className="presentation-slide-stage">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, x: slideDirection > 0 ? 50 : -50, scale: 0.98 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: slideDirection > 0 ? -50 : 50, scale: 0.98 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            style={{ width: '100%', display: 'flex', justifyContent: 'center' }}
          >
            {renderSlide()}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}

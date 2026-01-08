// src/pages/home/Loading.jsx
import React, { useEffect, useState, useRef } from 'react';
import './Loading.css';
import { FaStar, FaRocket, FaCode, FaBolt } from 'react-icons/fa';

const Loading = () => {
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState(0);
  const [stars, setStars] = useState([]);
  const requestRef = useRef();

  // Créer des étoiles
  useEffect(() => {
    const generateStars = () => {
      const newStars = [];
      for (let i = 0; i < 50; i++) {
        newStars.push({
          id: i,
          x: Math.random() * 100,
          y: Math.random() * 100,
          size: Math.random() * 3 + 1,
          speed: Math.random() * 0.5 + 0.2,
          opacity: Math.random() * 0.5 + 0.3,
          twinkleSpeed: Math.random() * 0.05 + 0.02
        });
      }
      setStars(newStars);
    };
    generateStars();
  }, []);

  // Animation des étoiles
  useEffect(() => {
    const animateStars = () => {
      setStars(prevStars => 
        prevStars.map(star => ({
          ...star,
          y: (star.y + star.speed) % 100,
          opacity: Math.abs(Math.sin(Date.now() * star.twinkleSpeed)) * 0.5 + 0.3
        }))
      );
      requestRef.current = requestAnimationFrame(animateStars);
    };

    requestRef.current = requestAnimationFrame(animateStars);
    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, []);

  // Progression du loading - FIXE à 4 secondes
  useEffect(() => {
    const phases = [
      { text: "Initializing Systems...", duration: 2000 },
      
    ];

    let currentPhase = 0;
    let accumulatedTime = 0;
    const totalDuration = 1000; // 4 secondes
    const interval = 60; // 25 fps
    const increment = 100 / (totalDuration / interval);

    const timer = setInterval(() => {
      setProgress(prev => {
        const newProgress = prev + increment;
        
        // Gestion des phases
        accumulatedTime += interval;
        if (accumulatedTime >= phases[currentPhase].duration && currentPhase < phases.length - 1) {
          currentPhase++;
          accumulatedTime = 0;
          setPhase(currentPhase);
        }

        if (newProgress >= 100) {
          clearInterval(timer);
          return 100;
        }
        return Math.min(newProgress, 100);
      });
    }, interval);

    return () => clearInterval(timer);
  }, []);

  // Messages inspirants
  const motivationalQuotes = [
    "Great design is making something memorable and meaningful",
    "Simplicity is the ultimate sophistication",
    "Details matter, it's worth waiting to get it right",
    "Creating experiences that users love"
  ];

  const getActiveQuote = () => {
    if (progress < 25) return motivationalQuotes[0];
    if (progress < 50) return motivationalQuotes[1];
    if (progress < 75) return motivationalQuotes[2];
    return motivationalQuotes[3];
  };

  return (
    <div className="loading-premium">
      {/* Background avec étoiles */}
      <div className="star-field">
        {stars.map(star => (
          <div
            key={star.id}
            className="star"
            style={{
              left: `${star.x}%`,
              top: `${star.y}%`,
              width: `${star.size}px`,
              height: `${star.size}px`,
              opacity: star.opacity,
              animationDelay: `${star.id * 0.1}s`
            }}
          />
        ))}
      </div>

      {/* Particules flottantes */}
      <div className="floating-particles">
        {[1, 2, 3, 4, 5].map(i => (
          <div key={i} className="particle" style={{ '--i': i }}>
            <FaStar />
          </div>
        ))}
      </div>

      {/* Contenu principal */}
      <div className="loading-content">
        {/* Logo animé */}
        <div className="logo-orb">
          <div className="orb-inner">
            <div className="orb-core">
              <FaCode className="orb-icon" />
            </div>
            <div className="orb-ring orb-ring-1"></div>
            <div className="orb-ring orb-ring-2"></div>
            <div className="orb-ring orb-ring-3"></div>
          </div>
          <div className="orb-glow"></div>
        </div>

        {/* Titre avec effet néon */}
        <h1 className="loading-title">
          <span className="title-gradient">LARBI EL AOUAD</span>
          <span className="title-sub">PORTFOLIO</span>
        </h1>

        {/* Phase actuelle avec icône */}
        <div className="phase-container">
          <div className="phase-icon">
            {phase === 0 && <FaRocket />}
            {phase === 1 && <FaCode />}
            {phase === 2 && <FaBolt />}
            {phase === 3 && <FaStar />}
          </div>
          <div className="phase-text">
            <p className="phase-current">{getPhaseText(phase)}</p>
            <p className="phase-quote">{getActiveQuote()}</p>
          </div>
        </div>

        {/* Barre de progression avancée */}
        <div className="progress-master">
          <div className="progress-track">
            <div 
              className="progress-fill"
              style={{ width: `${progress}%` }}
            >
              <div className="progress-shine"></div>
              <div className="progress-pulse"></div>
            </div>
            <div className="progress-marker" style={{ left: `${progress}%` }}>
              <div className="marker-dot"></div>
              <div className="marker-value">{Math.round(progress)}%</div>
            </div>
          </div>
          
          {/* Labels de progression */}
          <div className="progress-labels">
            <span className="progress-label">Init</span>
            <span className="progress-label">Load</span>
            <span className="progress-label">Optimize</span>
            <span className="progress-label">Launch</span>
          </div>
        </div>

        {/* Stats en temps réel */}
        <div className="loading-stats">
          <div className="stat">
            <div className="stat-value">{(progress * 2.5).toFixed(0)}</div>
            <div className="stat-label">Components</div>
          </div>
          <div className="stat">
            <div className="stat-value">{(progress * 1.8).toFixed(0)}</div>
            <div className="stat-label">Assets</div>
          </div>
          <div className="stat">
            <div className="stat-value">{(progress * 3).toFixed(0)}</div>
            <div className="stat-label">Lines of Code</div>
          </div>
        </div>

        {/* Footer avec message */}
        <div className="loading-footer">
          <p className="footer-text">
            Crafting exceptional digital experiences since 2023
          </p>
          <div className="signature">
            <span className="signature-text">© Larbi El Aouad</span>
          </div>
        </div>
      </div>

      {/* Effet de bords */}
      <div className="edge-glow edge-top"></div>
      <div className="edge-glow edge-bottom"></div>
      <div className="corner corner-tl"></div>
      <div className="corner corner-tr"></div>
      <div className="corner corner-bl"></div>
      <div className="corner corner-br"></div>
    </div>
  );
};

// Helper function pour les textes de phase
const getPhaseText = (phase) => {
  const texts = [
    "Initializing Systems...",
    "Loading Assets...",
    "Optimizing Performance...",
    "Launching Portfolio..."
  ];
  return texts[phase];
};

export default Loading;
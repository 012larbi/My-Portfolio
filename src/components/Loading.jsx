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

};



export default Loading;
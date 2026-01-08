// src/pages/home/Home.jsx
import React, { useState, useEffect } from 'react';
import Profile from '../../assets/larbi.jpg';
import { Link } from 'react-router-dom';
import { FaArrowRight } from "react-icons/fa6";
import './home.css';

const Home = () => {
  const [showContent, setShowContent] = useState(false);
  const [isFirstVisit, setIsFirstVisit] = useState(false);

  useEffect(() => {
    // Vérifier si c'est la première visite
    const hasVisitedBefore = localStorage.getItem('hasVisitedBefore');
    
    if (hasVisitedBefore === 'true') {
      // Déjà visité - montrer directement le contenu
      setTimeout(() => {
        setShowContent(true);
      }, 100);
    } else {
      // Première visite
      setIsFirstVisit(true);
      localStorage.setItem('hasVisitedBefore', 'true');
      
      // Empêcher le scroll pendant l'animation
      document.body.classList.add('no-scroll');
      
      // Montrer l'animation Maroc pendant 3 secondes
      setTimeout(() => {
        setShowContent(true);
        document.body.classList.remove('no-scroll');
      }, 3000);
    }
  }, []);

  // Animation Maroc pour première visite
  if (isFirstVisit && !showContent) {
    return (
      <div className="morocco-first-load">
        <div className="morocco-animation-content">
          {/* Drapeau animé */}
          <div className="animated-flag">
            <div className="flag-base"></div>
            <div className="flag-star-animated">
              <svg viewBox="0 0 100 100">
                <path 
                  d="M50,10 L61,35 L88,35 L67,53 L73,80 L50,65 L27,80 L33,53 L12,35 L39,35 Z"
                  fill="#006233"
                />
              </svg>
            </div>
          </div>
          
          {/* Message */}
          <div className="morocco-welcome">
            <h1>🇲🇦 Welcome from Morocco</h1>
            <p>Loading exceptional digital experience...</p>
          </div>
          
          {/* Loading simple */}
          <div className="simple-loader">
            <div className="loader-bar">
              <div className="loader-progress"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Contenu principal
  return (
    <div className={`home-wrapper ${showContent ? 'visible' : ''}`}>
      <section className="home-container grid animated-content">
        
        <img className='home-img' src={Profile} alt="Larbi El Aouad" />
        
        <div className="home-content">
          <h1 className="home-title">
            <span>I'm Larbi El Aouad </span> <br /> Web Developer
          </h1>

          <p className="home-description">
            I am a Moroccan based web developer & front-end developer focused on
            crafting clean & user-friendly experiences,
            I am passionate about building excellent software
            that improves the lives of those around me.
          </p>

          <Link to='/about' className='button'>
            More About Me
            <span className="button-icon">
              <FaArrowRight />
            </span>
          </Link>
        </div>
       

        <div className="color-block"></div>

         <div className="boxes">
          <div className="box"></div>
         </div>
      </section>
    </div>
  );
};

export default Home;
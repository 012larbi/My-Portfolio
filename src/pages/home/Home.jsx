// src/pages/home/Home.jsx
import React, { useState, useEffect } from 'react';
import Profile from '../../assets/larbi.jpg';
import { Link } from 'react-router-dom';
import { FaArrowRight } from "react-icons/fa6";
import './home.css';
import { TypeAnimation } from "react-type-animation";

const Home = () => {
  const [showContent, setShowContent] = useState(false);
  const [isFirstVisit, setIsFirstVisit] = useState(false);
  const [imageClicked, setImageClicked] = useState(false); // ✨ NOUVEAU

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

  // ✨ NOUVELLE FONCTION pour l'animation au clic
  const handleImageClick = () => {
    setImageClicked(true);
    setTimeout(() => setImageClicked(false), 1200);
  };

  // Contenu principal
  return (
    <div className={`home-wrapper ${showContent ? 'visible' : ''}`}>
      <section className="home-container grid animated-content">
        
        <img
          className={`home-img ${imageClicked ? 'clicked' : ''}`} 
          src={Profile}
          alt="Larbi El Aouad"
          onClick={handleImageClick}  
        />

        <div className="home-content">
          <h1 className="home-title">
            <span>I'm Larbi El Aouad </span> <br /> 
            <TypeAnimation
        sequence={[
          "Front-End Developer",
          2500,
          "Backend Developer",
          2500,
          "Full-Stack Developer",
          2500,
        ]}
        speed={10}
        repeat={Infinity}
        
      />
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
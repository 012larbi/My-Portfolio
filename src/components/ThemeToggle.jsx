import React, { useState, useRef, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import { 
  RiMoonLine, 
  RiSunLine, 
  RiPaletteLine,
  RiCloseLine,
  RiCheckLine
} from 'react-icons/ri';
import './ThemeToggle.css';

const ThemeToggle = () => {
  const { 
    isDarkMode, 
    toggleDarkMode, 
    currentColor, 
    changeColor, 
    colorPalettes, 
    currentPalette,
    isLightMode 
  } = useTheme();
  
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const colorPickerRef = useRef(null);

  // Détecter si on est sur mobile
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);
    
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (colorPickerRef.current && !colorPickerRef.current.contains(event.target)) {
        setShowColorPicker(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Données des palettes en anglais
  const colorPalettesEn = {
    default: { name: 'Purple' },
    blue: { name: 'Blue' },
    green: { name: 'Green' },
    amber: { name: 'Amber' },
    coral: { name: 'Coral' },
    teal: { name: 'Teal' }
  };

  // Fonction pour calculer les couleurs dynamiques
  const getButtonStyle = () => {
    if (!currentPalette) return {};
    
    const hue = currentPalette.hue;
    const saturation = currentPalette.saturation;
    const lightness = currentPalette.lightness;
    
    return {
      background: `linear-gradient(135deg, 
        hsl(${hue}, ${saturation}%, ${lightness}%),
        hsl(${hue}, ${saturation + 20}%, ${lightness + 10}%))`,
      borderColor: `hsl(${hue}, ${saturation}%, ${lightness - 15}%)`,
      color: lightness > 50 ? '#000' : '#fff'
    };
  };

  const getCardStyle = (colorKey) => {
    const palette = colorPalettes[colorKey];
    if (!palette) return {};
    
    return {
      background: `linear-gradient(135deg, 
        hsl(${palette.hue}, ${palette.saturation}%, ${palette.lightness}%),
        hsl(${palette.hue}, ${palette.saturation + 15}%, ${palette.lightness + 8}%))`
    };
  };

  const getCurrentColorStyle = () => {
    if (!currentPalette) return {};
    
    const hue = currentPalette.hue;
    const saturation = currentPalette.saturation;
    const lightness = currentPalette.lightness;
    
    return {
      background: `linear-gradient(135deg, 
        hsl(${hue}, ${saturation}%, ${lightness}%),
        hsl(${hue}, ${saturation + 20}%, ${lightness + 10}%))`
    };
  };

  // Version PC uniquement
  if (!isMobile) {
    return (
      <div className="theme-desktop-right" ref={colorPickerRef}>
        <div className="theme-desktop-right-buttons">
          {/* Bouton Dark/Light Mode */}
          <button 
            className="theme-desktop-right-btn dark-mode-btn"
            onClick={toggleDarkMode}
            aria-label={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
            title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
          >
            {isDarkMode ? <RiSunLine /> : <RiMoonLine />}
          </button>

          {/* Bouton Color Picker - DYNAMIQUE */}
          <button 
            className="theme-desktop-right-btn color-picker-btn"
            onClick={() => setShowColorPicker(!showColorPicker)}
            aria-label="Color Palette"
            title="Change Color Theme"
            style={getButtonStyle()}
          >
            <RiPaletteLine />
          </button>
        </div>

        {/* Menu Color Picker */}
        {showColorPicker && (
          <div className="color-picker-desktop-right-menu">
            <div className="color-picker-desktop-right-header">
              <h4>Color Theme</h4>
              <button 
                className="close-desktop-right-btn"
                onClick={() => setShowColorPicker(false)}
                aria-label="Close"
              >
                <RiCloseLine />
              </button>
            </div>
            
            <div className="color-desktop-right-grid">
              {Object.entries(colorPalettes).map(([key, palette]) => (
                <button
                  key={key}
                  className={`color-desktop-right-option ${currentColor === key ? 'active' : ''}`}
                  onClick={() => {
                    changeColor(key);
                    setShowColorPicker(false);
                  }}
                  aria-label={`${colorPalettesEn[key]?.name || key} Theme`}
                  title={colorPalettesEn[key]?.name || key}
                >
                  <div className="color-desktop-right-card">
                    <div 
                      className="color-desktop-right-swatch" 
                      style={getCardStyle(key)}
                    >
                      {currentColor === key && (
                        <div className="color-desktop-right-check">
                          <RiCheckLine />
                        </div>
                      )}
                    </div>
                    <span className="color-desktop-right-name">
                      {colorPalettesEn[key]?.name || key}
                    </span>
                  </div>
                </button>
              ))}
            </div>

            <div className="current-color-desktop-right-info">
              <div 
                className="current-color-desktop-right-dot" 
                style={getCurrentColorStyle()}
              />
              <div className="current-color-desktop-right-details">
                <span className="current-color-desktop-right-name">
                  {colorPalettesEn[currentColor]?.name || 'Purple'}
                </span>
                <span className="current-color-desktop-right-mode">
                  {isDarkMode ? 'Dark Theme' : 'Light Theme'}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Version Mobile - Rendu null
  return null;
};

export default ThemeToggle;
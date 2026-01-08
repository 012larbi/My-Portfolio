import React, { useState, useRef, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import { 
  RiMoonLine, 
  RiSunLine, 
  RiPaletteLine,
  RiCloseLine,
  RiCheckLine,
  RiBrushLine
} from 'react-icons/ri';
import './ThemeToggle.css';

const ThemeToggle = () => {
  const { 
    isDarkMode, 
    toggleDarkMode, 
    currentColor, 
    changeColor, 
    colorPalettes, 
    currentPalette
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

  // Appliquer le style du curseur selon le thème
  useEffect(() => {
    if (!currentPalette || isMobile) return;
    
    const hue = currentPalette.hue;
    const saturation = currentPalette.saturation;
    const lightness = currentPalette.lightness;
    
    // Style pour le curseur principal
    const primaryColor = `hsl(${hue}, ${saturation}%, ${lightness}%)`;
    const hoverColor = `hsl(${hue}, ${saturation}%, ${lightness + 15}%)`;
    const clickColor = `hsl(${hue}, ${saturation}%, ${lightness - 15}%)`;
    
    // Créer les styles CSS pour le curseur
    const cursorStyles = `
      /* Curseur par défaut */
      * {
        cursor: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='32' height='32' viewBox='0 0 32 32'%3E%3Cpath fill='${encodeURIComponent(primaryColor)}' d='M6 6 L26 16 L18 18 L20 26 L6 6Z'/%3E%3C/svg%3E") 6 6, auto;
      }
      
      /* Curseur sur les éléments cliquables */
      button, a, .cursor-pointer {
        cursor: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='32' height='32' viewBox='0 0 32 32'%3E%3Cpath fill='${encodeURIComponent(hoverColor)}' d='M6 6 L26 16 L18 18 L20 26 L6 6Z'/%3E%3Ccircle cx='10' cy='10' r='8' fill='none' stroke='${encodeURIComponent(hoverColor)}' stroke-width='1'/%3E%3C/svg%3E") 6 6, pointer;
      }
      
      /* Curseur sur les inputs */
      input, textarea, select, .cursor-text {
        cursor: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='32' height='32' viewBox='0 0 32 32'%3E%3Cpath fill='${encodeURIComponent(primaryColor)}' d='M8 8 L12 24 L16 20 L24 26 L8 8Z'/%3E%3C/svg%3E") 8 8, text;
      }
      
      /* Curseur en attente */
      .loading, [disabled], .cursor-wait {
        cursor: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='32' height='32' viewBox='0 0 32 32'%3E%3Ccircle cx='16' cy='16' r='14' fill='none' stroke='${encodeURIComponent(primaryColor)}' stroke-width='2' stroke-dasharray='60 40'/%3E%3C/svg%3E") 16 16, wait;
      }
      
      /* Curseur de déplacement */
      .cursor-move {
        cursor: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='32' height='32' viewBox='0 0 32 32'%3E%3Cpath fill='${encodeURIComponent(primaryColor)}' d='M16 6 L26 16 L16 26 L6 16 Z'/%3E%3Cpath fill='${encodeURIComponent(hoverColor)}' d='M12 12 L20 20 M20 12 L12 20' stroke-width='2'/%3E%3C/svg%3E") 16 16, move;
      }
      
      /* Curseur de redimensionnement */
      .cursor-resize {
        cursor: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='32' height='32' viewBox='0 0 32 32'%3E%3Cpath fill='${encodeURIComponent(primaryColor)}' d='M6 6 L26 26 M6 26 L26 6' stroke='${encodeURIComponent(clickColor)}' stroke-width='2'/%3E%3C/svg%3E") 16 16, nwse-resize;
      }
      
      /* Curseur zoom */
      .cursor-zoom {
        cursor: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='32' height='32' viewBox='0 0 32 32'%3E%3Ccircle cx='16' cy='16' r='12' fill='none' stroke='${encodeURIComponent(primaryColor)}' stroke-width='2'/%3E%3Cpath stroke='${encodeURIComponent(hoverColor)}' stroke-width='2' d='M24 24 L30 30 M16 12 L16 20 M12 16 L20 16'/%3E%3C/svg%3E") 16 16, zoom-in;
      }
      
      /* Animation du curseur au hover */
      button:hover, a:hover, .cursor-pointer:hover {
        cursor: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='32' height='32' viewBox='0 0 32 32'%3E%3Cpath fill='${encodeURIComponent(hoverColor)}' d='M6 6 L26 16 L18 18 L20 26 L6 6Z'/%3E%3Ccircle cx='10' cy='10' r='10' fill='none' stroke='${encodeURIComponent(hoverColor)}' stroke-width='1.5'/%3E%3Ccircle cx='10' cy='10' r='6' fill='${encodeURIComponent(clickColor)}' opacity='0.3'/%3E%3C/svg%3E") 6 6, pointer;
      }
      
      /* Effet de clic */
      button:active, a:active {
        cursor: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='32' height='32' viewBox='0 0 32 32'%3E%3Cpath fill='${encodeURIComponent(clickColor)}' d='M6 6 L26 16 L18 18 L20 26 L6 6Z'/%3E%3Ccircle cx='10' cy='10' r='12' fill='none' stroke='${encodeURIComponent(clickColor)}' stroke-width='2'/%3E%3C/svg%3E") 6 6, pointer;
      }
      
      /* Curseur personnalisé pour le color picker */
      .cursor-color {
        cursor: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='32' height='32' viewBox='0 0 32 32'%3E%3Ccircle cx='16' cy='16' r='14' fill='${encodeURIComponent(primaryColor)}'/%3E%3Ccircle cx='16' cy='16' r='10' fill='${encodeURIComponent(hoverColor)}'/%3E%3Ccircle cx='16' cy='16' r='6' fill='${encodeURIComponent(clickColor)}'/%3E%3Cpath fill='white' d='M8 8 L24 24 M8 24 L24 8' stroke='white' stroke-width='1'/%3E%3C/svg%3E") 16 16, pointer;
      }
      
      /* Curseur pour les boutons du thème */
      .theme-desktop-right-btn {
        cursor: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='32' height='32' viewBox='0 0 32 32'%3E%3Ccircle cx='16' cy='16' r='15' fill='${encodeURIComponent(primaryColor)}' opacity='0.8'/%3E%3Cpath fill='white' d='M12 12 L20 20 M12 20 L20 12'/%3E%3C/svg%3E") 16 16, pointer;
      }
      
      .theme-desktop-right-btn:hover {
        cursor: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='32' height='32' viewBox='0 0 32 32'%3E%3Ccircle cx='16' cy='16' r='15' fill='${encodeURIComponent(hoverColor)}' opacity='0.9'/%3E%3Ccircle cx='16' cy='16' r='10' fill='white' opacity='0.3'/%3E%3Cpath fill='white' d='M12 12 L20 20 M12 20 L20 12'/%3E%3C/svg%3E") 16 16, pointer;
      }
    `;
    
    // Appliquer les styles
    const styleElement = document.createElement('style');
    styleElement.id = 'custom-cursor-styles';
    styleElement.innerHTML = cursorStyles;
    
    // Supprimer l'ancien style s'il existe
    const oldStyle = document.getElementById('custom-cursor-styles');
    if (oldStyle) {
      oldStyle.remove();
    }
    
    document.head.appendChild(styleElement);
    
    return () => {
      const style = document.getElementById('custom-cursor-styles');
      if (style) {
        style.remove();
      }
    };
  }, [currentPalette, isMobile]);

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
      color: lightness > 50 ? '#000' : '#fff',
      boxShadow: `0 0 20px hsla(${hue}, ${saturation}%, ${lightness}%, 0.4)`
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
            className="theme-desktop-right-btn dark-mode-btn cursor-pointer"
            onClick={toggleDarkMode}
            aria-label={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
            title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
          >
            {isDarkMode ? <RiSunLine /> : <RiMoonLine />}
          </button>

          {/* Bouton Color Picker - DYNAMIQUE */}
          <button 
            className="theme-desktop-right-btn color-picker-btn cursor-color"
            onClick={() => setShowColorPicker(!showColorPicker)}
            aria-label="Color Palette"
            title="Change Color Theme"
            style={getButtonStyle()}
          >
            <RiBrushLine />
          </button>
        </div>

        {/* Menu Color Picker */}
        {showColorPicker && (
          <div className="color-picker-desktop-right-menu">
            <div className="color-picker-desktop-right-header">
              <h4>Color Theme</h4>
              <button 
                className="close-desktop-right-btn cursor-pointer"
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
                  className={`color-desktop-right-option cursor-pointer ${currentColor === key ? 'active' : ''}`}
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
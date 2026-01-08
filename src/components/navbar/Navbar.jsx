import React, { useState, useEffect } from 'react';
import { links } from '../../Data';
import { NavLink } from 'react-router-dom';
import { 
  RiHomeLine, 
  RiUserLine, 
  RiBriefcaseLine, 
  RiMailLine,
  RiMoonLine, 
  RiSunLine, 
  RiPaletteLine,
  RiCloseLine,
  RiCheckLine
} from "react-icons/ri";
import './navbar.css';
import { useTheme } from '../../context/ThemeContext';

const Navbar = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const colorPickerRef = React.useRef(null);
  
  const { isDarkMode, toggleDarkMode, currentColor, changeColor, colorPalettes, currentPalette } = useTheme();

  // Données des palettes en anglais
  const colorPalettesEn = {
    default: { name: 'Purple', hue: 271 },
    blue: { name: 'Blue', hue: 220 },
    green: { name: 'Green', hue: 142 },
    amber: { name: 'Amber', hue: 30 },
    coral: { name: 'Coral', hue: 350 },
    teal: { name: 'Teal', hue: 180 }
  };

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

  // Obtenir l'icône appropriée
  const getIcon = (name) => {
    switch(name.toLowerCase()) {
      case 'home':
        return <RiHomeLine className="nav-icon" />;
      case 'about':
        return <RiUserLine className="nav-icon" />;
      case 'portfolio':
        return <RiBriefcaseLine className="nav-icon" />;
      case 'contact':
        return <RiMailLine className="nav-icon" />;
      default:
        return null;
    }
  };

  const getHorizontalIcon = (name) => {
    switch(name.toLowerCase()) {
      case 'home':
        return <RiHomeLine className="nav-horizontal-icon" />;
      case 'about':
        return <RiUserLine className="nav-horizontal-icon" />;
      case 'portfolio':
        return <RiBriefcaseLine className="nav-horizontal-icon" />;
      case 'contact':
        return <RiMailLine className="nav-horizontal-icon" />;
      default:
        return null;
    }
  };

  return (
    <>
      {/* =============== NAVBAR VERTICALE (DESKTOP) =============== */}
      <nav className='nav'>
        <div className="nav-menu">
          <ul className='nav-list grid'>
            {links.map(({ name, path }, index) => (
              <li className='nav-item' key={index}>
                <NavLink 
                  to={path} 
                  className={({ isActive }) =>
                    isActive ? 'nav-link active-nav' : 'nav-link'
                  }
                >
                  {getIcon(name)}
                  <h3 className="nav-name">{name}</h3>
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
      </nav>

      {/* =============== NAVBAR HORIZONTALE (MOBILE) =============== */}
      {isMobile && (
        <>
          <nav className='nav-horizontal'>
            <div className="nav-horizontal-container">
              {/* Liens de navigation + boutons thème dans la même ligne */}
              <ul className='nav-horizontal-list'>
                {links.map(({ name, path }, index) => (
                  <li key={index}>
                    <NavLink 
                      to={path} 
                      className={({ isActive }) =>
                        isActive ? 'nav-horizontal-link active-nav' : 'nav-horizontal-link'
                      }
                    >
                      {getHorizontalIcon(name)}
                      <span className="nav-horizontal-name">{name}</span>
                    </NavLink>
                  </li>
                ))}
                
                {/* Boutons thème intégrés */}
                <li className="nav-theme-buttons" ref={colorPickerRef}>
                  {/* Bouton Dark/Light Mode */}
                  <button 
                    className="nav-theme-btn dark-mode-btn"
                    onClick={toggleDarkMode}
                    aria-label={isDarkMode ? "Light Mode" : "Dark Mode"}
                    title={isDarkMode ? "Light Mode" : "Dark Mode"}
                  >
                    {isDarkMode ? <RiSunLine /> : <RiMoonLine />}
                  </button>
                  
                  {/* Bouton Color Picker */}
                  <button 
                    className="nav-theme-btn color-picker-btn"
                    onClick={() => setShowColorPicker(!showColorPicker)}
                    aria-label="Color Palette"
                    title="Color Palette"
                    style={{
                      background: `linear-gradient(135deg, 
                        hsl(${currentPalette.hue}, ${currentPalette.saturation}%, ${currentPalette.lightness}%),
                        hsl(${currentPalette.hue}, ${currentPalette.saturation + 20}%, ${currentPalette.lightness + 10}%))`
                    }}
                  >
                    <RiPaletteLine />
                  </button>
                </li>
              </ul>
            </div>
          </nav>

          {/* Menu Color Picker Mobile */}
          {showColorPicker && (
            <>
              <div 
                className="mobile-color-picker-overlay"
                onClick={() => setShowColorPicker(false)}
              />
              <div className="mobile-color-picker-menu" ref={colorPickerRef}>
                <div className="mobile-color-picker-header">
                  <h4>Color Theme</h4>
                  <button 
                    className="close-mobile-color-btn"
                    onClick={() => setShowColorPicker(false)}
                    aria-label="Close"
                  >
                    <RiCloseLine />
                  </button>
                </div>
                
                <div className="mobile-color-grid">
                  {Object.entries(colorPalettesEn).map(([key, color]) => (
                    <button
                      key={key}
                      className={`mobile-color-option ${currentColor === key ? 'active' : ''}`}
                      onClick={() => {
                        changeColor(key);
                        setShowColorPicker(false);
                      }}
                      aria-label={`${color.name} Theme`}
                      title={color.name}
                    >
                      <div 
                        className="mobile-color-swatch"
                        style={{ 
                          background: `linear-gradient(135deg, 
                            hsl(${color.hue}, 50%, 60%),
                            hsl(${color.hue}, 70%, 70%))`
                        }}
                      >
                        {currentColor === key && (
                          <div className="mobile-color-check">
                            <RiCheckLine />
                          </div>
                        )}
                      </div>
                      <span className="mobile-color-name">{color.name}</span>
                    </button>
                  ))}
                </div>

                <div className="current-mobile-color-info">
                  <div 
                    className="current-mobile-color-dot"
                    style={{ 
                      background: `linear-gradient(135deg, 
                        hsl(${currentPalette.hue}, ${currentPalette.saturation}%, ${currentPalette.lightness}%),
                        hsl(${currentPalette.hue}, ${currentPalette.saturation + 20}%, ${currentPalette.lightness + 10}%))`
                    }}
                  />
                  <div className="current-mobile-color-details">
                    <span className="current-mobile-color-name">
                      {colorPalettesEn[currentColor].name}
                    </span>
                    <span className="current-mobile-color-mode">
                      {isDarkMode ? 'Dark' : 'Light'}
                    </span>
                  </div>
                </div>
              </div>
            </>
          )}
        </>
      )}
    </>
  );
};

export default Navbar;
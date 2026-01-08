import React, { createContext, useState, useContext, useEffect } from 'react';

// Palettes de couleurs pour Light Mode
const lightPalettes = {
  default: {
    hue: 271,
    saturation: 46,
    lightness: 53,
    name: 'Violet Clair',
    bgLightness: 98,
    containerLightness: 96,
    textLightness: 38,
    textColor: 'hsl(271, 20%, 23%)' // Couleur de texte visible en light mode
  },
  blue: {
    hue: 220,
    saturation: 52,
    lightness: 58,
    name: 'Bleu Clair',
    bgLightness: 97,
    containerLightness: 94,
    textLightness: 40,
    textColor: 'hsl(220, 20%, 25%)'
  },
  green: {
    hue: 142,
    saturation: 48,
    lightness: 56,
    name: 'Vert Clair',
    bgLightness: 96,
    containerLightness: 92,
    textLightness: 36,
    textColor: 'hsl(142, 20%, 21%)'
  },
  amber: {
    hue: 30,
    saturation: 85,
    lightness: 55,
    name: 'Ambre',
    bgLightness: 99,
    containerLightness: 95,
    textLightness: 42,
    textColor: 'hsl(30, 20%, 27%)'
  },
  coral: {
    hue: 350,
    saturation: 65,
    lightness: 58,
    name: 'Corail',
    bgLightness: 98,
    containerLightness: 96,
    textLightness: 35,
    textColor: 'hsl(350, 20%, 20%)'
  },
  teal: {
    hue: 180,
    saturation: 45,
    lightness: 52,
    name: 'Sarcelle',
    bgLightness: 96,
    containerLightness: 92,
    textLightness: 38,
    textColor: 'hsl(180, 20%, 23%)'
  }
};

// Palettes de couleurs pour Dark Mode
const darkPalettes = {
  default: {
    hue: 271,
    saturation: 35,
    lightness: 60,
    name: 'Violet Sombre',
    bgLightness: 12,
    containerLightness: 20,
    textLightness: 85,
    textColor: 'hsl(271, 10%, 90%)' // Couleur de texte visible en dark mode
  },
  blue: {
    hue: 220,
    saturation: 40,
    lightness: 65,
    name: 'Bleu Sombre',
    bgLightness: 15,
    containerLightness: 22,
    textLightness: 88,
    textColor: 'hsl(220, 10%, 93%)'
  },
  green: {
    hue: 142,
    saturation: 35,
    lightness: 62,
    name: 'Vert Sombre',
    bgLightness: 10,
    containerLightness: 18,
    textLightness: 82,
    textColor: 'hsl(142, 10%, 87%)'
  },
  amber: {
    hue: 30,
    saturation: 70,
    lightness: 65,
    name: 'Ambre Sombre',
    bgLightness: 14,
    containerLightness: 24,
    textLightness: 90,
    textColor: 'hsl(30, 10%, 95%)'
  },
  coral: {
    hue: 350,
    saturation: 55,
    lightness: 65,
    name: 'Corail Sombre',
    bgLightness: 13,
    containerLightness: 21,
    textLightness: 87,
    textColor: 'hsl(350, 10%, 92%)'
  },
  teal: {
    hue: 180,
    saturation: 35,
    lightness: 60,
    name: 'Sarcelle Sombre',
    bgLightness: 11,
    containerLightness: 19,
    textLightness: 83,
    textColor: 'hsl(180, 10%, 88%)'
  }
};

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('darkMode');
      if (savedTheme !== null) return JSON.parse(savedTheme);
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  const [currentColor, setCurrentColor] = useState(() => {
    if (typeof window !== 'undefined') {
      const savedColor = localStorage.getItem('themeColor');
      return savedColor || 'default';
    }
    return 'default';
  });

  useEffect(() => {
    const applyTheme = () => {
      const root = document.documentElement;
      const body = document.body;
      const palette = isDarkMode ? darkPalettes[currentColor] : lightPalettes[currentColor];
      
      // Ajouter/supprimer l'attribut data-theme
      if (isDarkMode) {
        body.setAttribute('data-theme', 'dark');
      } else {
        body.removeAttribute('data-theme');
      }
      
      // Variables principales HSL
      root.style.setProperty('--hue', palette.hue);
      root.style.setProperty('--saturation', `${palette.saturation}%`);
      root.style.setProperty('--lightness', `${palette.lightness}%`);
      
      // Couleur principale
      const firstColor = `hsl(${palette.hue}, ${palette.saturation}%, ${palette.lightness}%)`;
      root.style.setProperty('--first-color', firstColor);
      
      // Mode Light
      if (!isDarkMode) {
        // Couleurs claires et chaleureuses
        root.style.setProperty('--title-color', 
          `hsl(${palette.hue}, 20%, ${palette.textLightness - 15}%)`);
        root.style.setProperty('--text-color', 
          `hsl(${palette.hue}, 15%, ${palette.textLightness}%)`);
        root.style.setProperty('--body-color', 
          `hsl(${palette.hue}, 10%, ${palette.bgLightness}%)`);
        root.style.setProperty('--container-color', 
          `hsl(${palette.hue}, 12%, ${palette.containerLightness}%)`);
        root.style.setProperty('--border-color', 
          `hsl(${palette.hue}, 15%, ${palette.containerLightness - 10}%)`);
        root.style.setProperty('--white-color', 'hsl(0, 0%, 100%)');
        root.style.setProperty('--shadow-color', 
          `hsla(${palette.hue}, 20%, 10%, 0.08)`);
        root.style.setProperty('--accent-light', 
          `hsl(${palette.hue}, 40%, ${palette.lightness + 30}%)`);
        root.style.setProperty('--accent-dark', 
          `hsl(${palette.hue}, 60%, ${palette.lightness - 15}%)`);
        
        // Couleurs de fond spécifiques
        root.style.setProperty('--card-bg', 
          `hsl(${palette.hue}, 8%, ${palette.bgLightness + 1}%)`);
        root.style.setProperty('--input-bg', 
          `hsl(${palette.hue}, 5%, ${palette.bgLightness + 2}%)`);
        root.style.setProperty('--hover-bg', 
          `hsl(${palette.hue}, 15%, ${palette.containerLightness - 2}%)`);
        root.style.setProperty('--gradient-start', 
          `hsl(${palette.hue}, 30%, ${palette.bgLightness - 3}%)`);
        root.style.setProperty('--gradient-end', 
          `hsl(${palette.hue}, 20%, ${palette.bgLightness}%)`);
        root.style.setProperty('--overlay-color', 
          `hsla(${palette.hue}, 15%, 5%, 0.05)`);
      } 
      // Mode Dark
      else {
        // Couleurs sombres avec contraste suffisant
        root.style.setProperty('--title-color', 
          `hsl(${palette.hue}, 10%, ${palette.textLightness + 5}%)`);
        root.style.setProperty('--text-color', 
          `hsl(${palette.hue}, 8%, ${palette.textLightness}%)`);
        root.style.setProperty('--body-color', 
          `hsl(${palette.hue}, 12%, ${palette.bgLightness}%)`);
        root.style.setProperty('--container-color', 
          `hsl(${palette.hue}, 14%, ${palette.containerLightness}%)`);
        root.style.setProperty('--border-color', 
          `hsl(${palette.hue}, 10%, ${palette.containerLightness + 5}%)`);
        root.style.setProperty('--white-color', 
          `hsl(${palette.hue}, 5%, ${palette.bgLightness - 2}%)`);
        root.style.setProperty('--shadow-color', 
          `hsla(${palette.hue}, 20%, 0%, 0.3)`);
        root.style.setProperty('--accent-light', 
          `hsl(${palette.hue}, 30%, ${palette.lightness + 15}%)`);
        root.style.setProperty('--accent-dark', 
          `hsl(${palette.hue}, 40%, ${palette.lightness - 10}%)`);
        
        // Couleurs de fond spécifiques
        root.style.setProperty('--card-bg', 
          `hsl(${palette.hue}, 14%, ${palette.containerLightness - 2}%)`);
        root.style.setProperty('--input-bg', 
          `hsl(${palette.hue}, 16%, ${palette.containerLightness - 4}%)`);
        root.style.setProperty('--hover-bg', 
          `hsl(${palette.hue}, 18%, ${palette.containerLightness + 3}%)`);
        root.style.setProperty('--gradient-start', 
          `hsl(${palette.hue}, 20%, ${palette.bgLightness + 2}%)`);
        root.style.setProperty('--gradient-end', 
          `hsl(${palette.hue}, 15%, ${palette.bgLightness}%)`);
        root.style.setProperty('--overlay-color', 
          `hsla(${palette.hue}, 15%, 95%, 0.05)`);
      }
      
      // Variables RGB pour utiliser avec rgba()
      root.style.setProperty('--first-color-r', palette.hue);
      root.style.setProperty('--first-color-s', `${palette.saturation}%`);
      root.style.setProperty('--first-color-l', `${palette.lightness}%`);
      
      // Pour utilisation dans rgba(var(--first-color-r), var(--first-color-s), var(--first-color-l), alpha)
      root.style.setProperty('--first-color-rgb', `${palette.hue}, ${palette.saturation}%, ${palette.lightness}%`);
    };

    applyTheme();
    
    // Sauvegarder les préférences
    localStorage.setItem('darkMode', JSON.stringify(isDarkMode));
    localStorage.setItem('themeColor', currentColor);
    
    // Écouter les changements de préférence système
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e) => {
      // Si l'utilisateur n'a pas encore sauvegardé de préférence
      if (localStorage.getItem('darkMode') === null) {
        setIsDarkMode(e.matches);
      }
    };
    
    mediaQuery.addEventListener('change', handleChange);
    
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [isDarkMode, currentColor]);

  const toggleDarkMode = () => {
    setIsDarkMode(prev => !prev);
  };

  const changeColor = (colorKey) => {
    if (lightPalettes[colorKey]) {
      setCurrentColor(colorKey);
    }
  };

  const getCurrentPalette = () => {
    return isDarkMode ? darkPalettes[currentColor] : lightPalettes[currentColor];
  };

  const value = {
    isDarkMode,
    toggleDarkMode,
    currentColor,
    changeColor,
    currentPalette: getCurrentPalette(),
    colorPalettes: isDarkMode ? darkPalettes : lightPalettes,
    isLightMode: !isDarkMode
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
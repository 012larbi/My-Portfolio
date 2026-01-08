// src/App.jsx
import './App.css'
import Home from './pages/home/Home'
import About from './pages/about/About'
import Contact from './pages/contact/Contact'
import Portfolio from './pages/portfolio/Portfolio'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import AppLayout from './components/AppLayout'
import { ThemeProvider } from './context/ThemeContext'
import { FirstLoadProvider, useFirstLoad } from './context/FirstLoadContext' // Ajoutez cette ligne
import Loading from './components/Loading' // Importez le composant Loading
import './index.css'

// Composant wrapper pour gérer le loading
const AppWrapper = () => {
  const { isLoading } = useFirstLoad();

  if (isLoading) {
    return <Loading />;
  }

  const router = createBrowserRouter([
    {
      path: '/',
      element: <AppLayout />,
      children: [
        {
          index: true,
          element: <Home />,
        },
        {
          path: '/about',
          element: <About />,
        },
        {
          path: '/portfolio',
          element: <Portfolio />,
        },
        {
          path: '/contact',
          element: <Contact />,
        },
      ],
    },
  ]);

  return <RouterProvider router={router} />;
};

function App() {
  return (
    <ThemeProvider>
      <FirstLoadProvider>
        <AppWrapper />
      </FirstLoadProvider>
    </ThemeProvider>
  )
}

export default App
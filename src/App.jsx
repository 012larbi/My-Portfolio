// src/App.jsx
import './App.css'
import { lazy, Suspense } from 'react'
import Home from './pages/home/Home'
import About from './pages/about/About'
import Contact from './pages/contact/Contact'
import Portfolio from './pages/portfolio/Portfolio'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import AppLayout from './components/AppLayout'
import { ThemeProvider } from './context/ThemeContext'

// Admin dashboard is code-split: visitors to the public site never
// download the admin UI or the Firebase Auth SDK.
const AdminRoot = lazy(() => import('./admin/AdminRoot'))
const RequireAuth = lazy(() => import('./admin/RequireAuth'))
const AdminLayout = lazy(() => import('./pages/admin/AdminLayout'))
const AdminLogin = lazy(() => import('./pages/admin/AdminLogin'))
const AdminProjects = lazy(() => import('./pages/admin/AdminProjects'))
const AdminCategories = lazy(() => import('./pages/admin/AdminCategories'))
const AdminAbout = lazy(() => import('./pages/admin/AdminAbout'))

const AdminFallback = <div className="admin-boot">Loading…</div>
const lazyAdmin = (node) => <Suspense fallback={AdminFallback}>{node}</Suspense>

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
    {
      path: '/admin',
      element: lazyAdmin(<AdminRoot />),
      children: [
        {
          path: 'login',
          element: lazyAdmin(<AdminLogin />),
        },
        {
          element: lazyAdmin(<RequireAuth />),
          children: [
            {
              element: lazyAdmin(<AdminLayout />),
              children: [
                {
                  index: true,
                  element: lazyAdmin(<AdminProjects />),
                },
                {
                  path: 'categories',
                  element: lazyAdmin(<AdminCategories />),
                },
                {
                  path: 'about',
                  element: lazyAdmin(<AdminAbout />),
                },
              ],
            },
          ],
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
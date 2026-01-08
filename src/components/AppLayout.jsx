import { Outlet } from 'react-router-dom'
import Navbar from "./navbar/Navbar"
import ThemeToggle from './ThemeToggle'

const AppLayout = () => {
    return (
        <>
            <Navbar />
            <ThemeToggle />
            <Outlet />
        </>
    )
}

export default AppLayout
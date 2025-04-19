import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import LoginPage from './pages/loginPage/LoginPage'
import { ThemeProvider } from './context/ThemeContext'
import Sidebar from './components/sidebar/Sidebar'
import './common/theme/Theme.css'
import NotFound from './pages/notFound/NotFound';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'

import Register from './pages/register/Register'
import { useState } from 'react'

function App() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <ThemeProvider>
      <BrowserRouter>
        <div
          className={`flex flex-col md:flex-row w-full font-display vh-100 ${
            menuOpen ? 'overflow-hidden h-screen' : 'overflow-y-hidden'
          }`}
        >
          <Sidebar isOpen={menuOpen} setIsOpen={setMenuOpen} />
          <div className="flex-1">
            <Routes>
              <Route Component={NotFound} path="*" />
              <Route Component={LoginPage} path="/login" />
              <Route Component={Register} path="/register" />
            </Routes>
          </div>
        </div>
        <ToastContainer />
      </BrowserRouter>
    </ThemeProvider>
  )
}

export default App

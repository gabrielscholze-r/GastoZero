import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import LoginPage from './pages/loginPage/LoginPage'
import { ThemeProvider } from './context/ThemeContext';
import Sidebar from './components/sidebar/Sidebar'
import './common/theme/Theme.css'
import NotFound from './pages/notFound/NotFound';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'


function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <div className="flex font-display">
          <Sidebar />
          <Routes>
            <Route Component={NotFound} path='*' />
            <Route Component={LoginPage} path='/login' />
          </Routes>
        </div>
        <ToastContainer />
      </BrowserRouter>
    </ThemeProvider>
  )
}

export default App

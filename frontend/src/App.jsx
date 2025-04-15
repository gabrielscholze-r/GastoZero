import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import LoginPage from './pages/loginPage/LoginPage'
import { ThemeProvider } from './context/ThemeContext';



function App() {

  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          <Route Component={LoginPage} path='/login' />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  )
}

export default App

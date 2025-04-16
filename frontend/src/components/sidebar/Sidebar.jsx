import React from 'react'
import { NavLink } from 'react-router-dom'
import { useTheme } from '../../context/ThemeContext.jsx'

export default function Sidebar() {
  const { theme, toggleTheme } = useTheme()



  return (
    <div className="w-1/5 min-h-screen bg-primary text-bglight flex flex-col justify-between py-8 px-6">
      <div className="space-y-6">
        <NavLink 
          to="/login" 
          className="block text-bglight text-xl font-bold hover:underline transition"
        >
          Login
        </NavLink>
        <NavLink 
          to="/register" 
          className="block text-bglight text-xl font-bold hover:underline transition"
        >
          Register
        </NavLink>
      </div>
      <div>
        <label className="block mb-2 text-base font-semibold">Tema:</label>
        <select
          value={theme}
          onChange={(e) => {
            toggleTheme(e.target.value)
          }}
          className="bg-bglight text-primary font-medium px-3 py-2 rounded text-base"
        >
          <option value="light">Claro</option>
          <option value="dark">Escuro</option>
        </select>
      </div>
    </div>
  )
}

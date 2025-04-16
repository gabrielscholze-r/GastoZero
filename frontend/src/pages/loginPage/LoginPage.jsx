import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import login from './Actions.jsx'
import Cookies from 'js-cookie'

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const navigate = useNavigate()

  useEffect(() => {
    const token = Cookies.get("authToken")
    if (token) {
      navigate("/home")
    }
  }, [])

  const handleSubmit = () => {
    login(email, password)
  }

  return (
    <div className="h-screen w-full flex items-center justify-center font-displa text-textcontainerbg dark:bg-bglight">
      <div className="w-full max-w-md bg-containerbg dark:bg-grayDark p-10 rounded-2xl shadow-lg space-y-6">
        <h1 className="text-4xl font-bold text-center text-textcontainerbg">Login</h1>

        <div>
          <label className="block text-textcontainerbg mb-1 font-semibold text-sm">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Digite seu email"
            className="w-full px-4 py-2 rounded-lg bg-textcontainerbg text-primary dark:bg-bglight dark:text-primary font-medium outline-none focus:ring-2 focus:ring-gold"
          />
        </div>

        <div>
          <label className="block text-textcontainerbg mb-1 font-semibold text-sm">Senha</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Digite sua senha"
            className="w-full px-4 py-2 rounded-lg bg-textcontainerbg text-primary dark:bg-bglight dark:text-primary font-medium outline-none focus:ring-2 focus:ring-gold"
          />
        </div>

        <button
          onClick={handleSubmit}
          className="w-full py-3 bg-gold hover:bg-yellow transition-all text-textcontainerbg font-bold text-lg rounded-lg"
        >
          Entrar
        </button>
      </div>
    </div>
  )
}

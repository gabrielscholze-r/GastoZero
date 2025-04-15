import React, { useEffect, useState } from 'react'
import { Cookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';
import login from './Actions.jsx'
export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const cookies = new Cookies()
  const navigate = useNavigate();

  useEffect(() => {
    const token = cookies.get("authToken")
    if (token) {
      navigate("/home")
    }
  }, [])

  const handleSubmit = () => {
    login(email, password)
  }

  return (
    <div className='h-screen flex items-center justify-center'>
      <div class=" p-8 rounded shadow-md w-3xl h-100 flex flex-col">
        <input placeholder="Email" type="text" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input placeholder="Password" type="text" value={password} onChange={(e) => setPassword(e.target.value)} />
        <button onClick={handleSubmit}> //create button component
          Entrar
        </button>
      </div>
    </div>
  )
}

import React, { useState } from 'react'
import create from './Actions.jsx'
import Cookies from "js-cookie";
import {toast} from "react-toastify";
import {useNavigate} from "react-router-dom";

export default function Register() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("")
  const [name, setName] = useState("")
  const [password, setPassword] = useState("")
  const [cPassword, setCPassword] = useState("")

  const handleCreate = async () => {
    if (password !== cPassword) {
      toast.error("Passwords dont match");
      return;
    }
    try {
      await create(name, email, password);
      toast.success("Account created successfully.");
      navigate('/login');
    } catch (e) {
      toast.error(`Error creating account: ${e.message}`);
    }
  };


  return (
    <div className="h-screen w-full flex items-center justify-center font-displa text-textcontainerbg dark:bg-bglight">
      <div className="w-full max-w-md bg-containerbg dark:bg-grayDark p-10 rounded-2xl shadow-lg space-y-6">
        <h1 className="text-4xl font-bold text-center text-textcontainerbg">Sign Up</h1>

        <div>
          <label className="block text-textcontainerbg mb-1 font-semibold text-sm">Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="First and Last Name"
            className="w-full px-4 py-2 rounded-lg bg-textcontainerbg text-primary dark:bg-bglight dark:text-primary font-medium outline-none focus:ring-2 focus:ring-gold"
          />
        </div>
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
          <label className="block text-textcontainerbg mb-1 font-semibold text-sm">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="w-full px-4 py-2 rounded-lg bg-textcontainerbg text-primary dark:bg-bglight dark:text-primary font-medium outline-none focus:ring-2 focus:ring-gold"
          />
        </div>
        <div>
          <label className="block text-textcontainerbg mb-1 font-semibold text-sm">Confirm password</label>
          <input
            type="password"
            value={cPassword}
            onChange={(e) => setCPassword(e.target.value)}
            placeholder="Confirm password"
            className="w-full px-4 py-2 rounded-lg bg-textcontainerbg text-primary dark:bg-bglight dark:text-primary font-medium outline-none focus:ring-2 focus:ring-gold"
          />
        </div>
        <p className={`text-red-500 ${password != cPassword ? "opacity-100" : "opacity-0"}`}>Passwords must match</p>

        <button
          onClick={handleCreate}
          className="w-full py-3 bg-blue-dark transition-all text-textcontainerbg font-bold text-lg rounded-lg cursor-pointer hover:opacity-80"
        >
          Sign in
        </button>
      </div>
    </div>
  )
}

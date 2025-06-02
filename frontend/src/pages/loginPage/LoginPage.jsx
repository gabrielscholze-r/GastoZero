import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import login from "./Actions.jsx";
import Cookies from "js-cookie";
import { toast } from "react-toastify";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const [fields, setFields] = useState(false);

  useEffect(() => {
    const token = Cookies.get("authToken");
    if (token) {
      navigate("/home");
    }
  }, [navigate]);

  const handleSubmit = async () => {
    if (!email || !password) {
      setFields(true);
      return;
    }
    setFields(false);
    try {
      const token = await login(email, password);
      Cookies.set("authToken", token);
      toast.success("Logged in successfully!");
      navigate("/home");
    } catch (e) {
      console.log(e);
      toast.error("Error logging in: " + e.message.replace("Error: ", ""));
    }
  };

  return (
    <div className="h-screen w-full flex items-center justify-center font-display text-textcontainerbg dark:bg-bglight">
      <div className="w-full max-w-md bg-containerbg dark:bg-grayDark p-10 rounded-2xl shadow-lg space-y-6">
        <h1 className="text-4xl font-bold text-center text-textcontainerbg">
          Login
        </h1>

        <div>
          <label className="block text-textcontainerbg mb-1 font-semibold text-sm">
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setFields(false);
            }}
            placeholder="Digite seu email"
            className="w-full px-4 py-2 rounded-lg bg-textcontainerbg text-primary dark:bg-bglight dark:text-primary font-medium outline-none focus:ring-2 focus:ring-gold transition duration-200 border border-transparent focus:border-gold"
          />
        </div>

        <div>
          <label className="block text-textcontainerbg mb-1 font-semibold text-sm">
            Senha
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setFields(false);
            }}
            placeholder="Digite sua senha"
            className="w-full px-4 py-2 rounded-lg bg-textcontainerbg text-primary dark:bg-bglight dark:text-primary font-medium outline-none focus:ring-2 focus:ring-gold transition duration-200 border border-transparent focus:border-gold"
          />
        </div>
        {fields && (
          <p className="text-red-500 text-center font-medium">
            Email and Password are required
          </p>
        )}
        <button
          onClick={handleSubmit}
          className="w-full py-3 bg-bgdark transition-all text-white font-bold text-lg rounded-lg cursor-pointer hover:opacity-80 focus:outline-none focus:ring-2 focus:ring-bgdark focus:ring-offset-2 focus:ring-offset-containerbg"
        >
          Entrar
        </button>
      </div>
    </div>
  );
}

import React, { useEffect } from 'react'
import { FaSpinner } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'
import { Slide, toast } from 'react-toastify'

export default function NotFound() {
  const navigate = useNavigate()

  useEffect(() => {
    toast.info(
        <div className="flex items-center gap-2">
          <FaSpinner  className="animate-spin" />
          <span>Página não encontrada. Redirecionando...</span>
        </div>,
        {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: false,
          draggable: false,
          theme: "light",
          transition: Slide,
        }
      )

    const timer = setTimeout(() => {
      navigate('/login')
    }, 3000)

    return () => clearTimeout(timer)
  }, [navigate])

  return (
    <div className="h-screen w-full flex items-center justify-center font-display text-textcontainerbg dark:bg-bglight">
      <div className="w-full max-w-lg bg-containerbg dark:bg-grayDark p-10 rounded-2xl shadow-lg space-y-6">
        <h1 className='font-bold'>404 Page Not Found</h1>
      </div>
    </div>
  )
}

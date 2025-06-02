# 💸 SpendZero

SpendZero is a web application for personal finance management, developed as a learning project in Golang and React.js. The application allows users to simply and securely record and track their income and expenses

## 🛠️ Tech Stack

This project is built with a modern full-stack architecture, utilizing the following technologies:

### Backend

The backend is developed in **Go**, focusing on performance, concurrency, and robustness.

- **Language:** Go (v1.24.1)
- **Web Framework:** [Gorilla Mux](https://github.com/gorilla/mux) for HTTP routing.
- **ORM/Database:** [Bun](https://github.com/uptrace/bun) for interaction with the **PostgreSQL** database.
- **Authentication:** [golang-jwt/jwt/v5](https://github.com/golang-jwt/jwt) for JSON Web Token generation and validation.
- **Logging:** [zerolog](https://github.com/rs/zerolog) for structured logging.
- **Cryptography:** [golang.org/x/crypto](https://pkg.go.dev/golang.org/x/crypto) for password hashing.
- **Containerization:** [Docker](https://www.docker.com/) for application packaging and isolation.

### Frontend

The frontend is a Single Page Application (SPA) built with **React**, focusing on a responsive and dynamic user experience.

- **Framework:** [React](https://react.dev/) (v19.0.0)
- **Bundler:** [Vite](https://vitejs.dev/) (v6.2.0)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/) (v4.1.3)
- **HTTP Requests:** [Axios](https://axios-http.com/) (v1.8.4) for communicating with the backend.
- **Animations:** [Framer Motion](https://www.framer.com/motion/) (v12.10.1) for fluid and elegant animations.
- **Routing:** [React Router DOM](https://reactrouter.com/en/main) (v7.5.0) for client-side navigation.
- **Forms:** [React Hook Form](https://react-hook-form.com/) (v7.56.2) for efficient form management.
- **Icons:** [React Icons](https://react-icons.github.io/react-icons/) (v5.5.0)
- **Notifications:** [React Toastify](https://fkhadra.github.io/react-toastify/) (v11.0.5) for user feedback messages.
- **Charts:** [Recharts](https://recharts.org/) (v2.15.3) for data visualization.
- **Cookies:** [JS-Cookie](https://github.com/js-cookie/js-cookie) (v3.0.5) for client-side cookie manipulation.

# 🔧 Features

* User registration and login with **JWT** authentication

* Income and expense **tracking**

* Current balance visualization and expense **charts**

* **Responsive** and modern interface

**Not working on mobile**

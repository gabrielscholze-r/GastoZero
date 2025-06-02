import {
  BrowserRouter,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { ThemeProvider } from "./context/ThemeContext";
import Sidebar from "./components/sidebar/Sidebar";
import "./App.css";
import "./common/theme/Theme.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import LoginPage from "./pages/loginPage/LoginPage";
import Register from "./pages/register/Register";
import NotFound from "./pages/notFound/NotFound";
import HomePage from "./pages/homePage/Home.jsx";
import ProtectedRoute from "./components/protectedRoutes/ProtectedRoutes.jsx";
import Plan from "./pages/plan/Plan.jsx";
import { setUnauthorizedHandler } from "./services/API.jsx";
import Reports from "./pages/reports/Reports.jsx";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 30,
      cacheTime: 1000 * 60 * 30,
      refetchOnWindowFocus: false,
    },
  },
});

function AppContent() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [plan, setPlan] = useState({});
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.pathname !== "/plan") {
      setPlan({});
    }

    setMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const token = Cookies.get("authToken");
    setIsAuthenticated(!!token);

    setUnauthorizedHandler(() => {
      setIsAuthenticated(false);
      navigate("/login");
    });
  }, [navigate]);

  return (
    <div className="flex flex-col md:flex-row w-full font-display min-h-screen bg-bglight overflow-hidden">
      <Sidebar
        isOpen={menuOpen}
        setIsOpen={setMenuOpen}
        setPlan={setPlan}
        selectedPlan={plan}
      />
      <main className="flex-1 pt-16 md:pt-0 pb-4 md:pb-0 overflow-y-auto">
        <Routes>
          <Route
            path="/home"
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <HomePage />
              </ProtectedRoute>
            }
          />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/"
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <HomePage />
              </ProtectedRoute>
            }
          />
          <Route path="/home" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<Register />} />

          <Route
            path="/plan"
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <Plan data={plan} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/reports"
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <Reports />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
    </div>
  );
}

function App() {
  return (
    <div>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <BrowserRouter>
            <AppContent />
            <ToastContainer />
          </BrowserRouter>
        </ThemeProvider>
      </QueryClientProvider>
    </div>
  );
}

export default App;

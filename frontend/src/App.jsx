import {BrowserRouter, Route, Routes, useNavigate} from 'react-router-dom';
import {ThemeProvider} from './context/ThemeContext';
import Sidebar from './components/sidebar/Sidebar';
import './App.css';
import './common/theme/Theme.css';
import {ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {useEffect, useState} from 'react';
import Cookies from 'js-cookie';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';

import LoginPage from './pages/loginPage/LoginPage';
import Register from './pages/register/Register';
import NotFound from './pages/notFound/NotFound';
import HomePage from './pages/homePage/Home.jsx';
import ProtectedRoute from './components/protectedRoutes/ProtectedRoutes.jsx';
import PlansPage from "./pages/plans/PlansPage.jsx";

import {setUnauthorizedHandler} from './services/API.jsx';
import Plan from "./pages/plan/Plan.jsx";

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


    useEffect(() => {
        const token = Cookies.get('authToken');
        setIsAuthenticated(!!token);

        setUnauthorizedHandler(() => {
            setIsAuthenticated(false);
            navigate('/login');
        });
    }, [navigate]);

    return (
        <div
            className={`flex flex-col md:flex-row w-full font-display vh-100 bg-bgdark ${
                menuOpen ? 'overflow-hidden h-screen' : 'overflow-y-hidden'
            }`}
        >
            <Sidebar isOpen={menuOpen} setIsOpen={setMenuOpen} setPlan={setPlan}/>
            <div className="flex-1">
                <Routes>
                    <Route
                        path="/home"
                        element={
                            <ProtectedRoute isAuthenticated={isAuthenticated}>
                                <HomePage/>
                            </ProtectedRoute>
                        }
                    />
                    <Route path="/login" element={<LoginPage/>}/>
                    <Route path="/register" element={<Register/>}/>
                    <Route path="*" element={<NotFound/>}/>
                    <Route path="/plan" element={<Plan data={plan}/>}/>
                </Routes>
            </div>
        </div>
    );
}

function App() {
    return (
        <QueryClientProvider client={queryClient}>
            <ThemeProvider>
                <BrowserRouter>
                    <AppContent/>
                    <ToastContainer/>
                </BrowserRouter>
            </ThemeProvider>
        </QueryClientProvider>
    );
}

export default App;

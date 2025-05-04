import {BrowserRouter, Route, Routes} from 'react-router-dom';
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
const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 1000 * 60 * 30,
            cacheTime: 1000 * 60 * 30,
            refetchOnWindowFocus: false,
        },
    },
});
function App() {
    const [menuOpen, setMenuOpen] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false);



    useEffect(() => {
        const token = Cookies.get('authToken');
        if (token) {
            setIsAuthenticated(true);
        } else {
            setIsAuthenticated(false);
        }
    }, []);

    return (
        <QueryClientProvider client={queryClient}>
            <ThemeProvider>
                <BrowserRouter>
                    <div
                        className={`flex flex-col md:flex-row w-full font-display vh-100 bg-bgdark ${
                            menuOpen ? 'overflow-hidden h-screen' : 'overflow-y-hidden'
                        }`}
                    >
                        <Sidebar isOpen={menuOpen} setIsOpen={setMenuOpen}/>
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
                                <Route path="/plans" element={<PlansPage/>}/>
                            </Routes>
                        </div>
                    </div>
                    <ToastContainer/>
                </BrowserRouter>
            </ThemeProvider>
        </QueryClientProvider>
    );
}

export default App;

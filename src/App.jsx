import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Link, Navigate } from 'react-router-dom';
import { supabase } from './lib/supabaseClient';
import PropertyList from './components/PropertyList';
import PropertyForm from './components/PropertyForm';
import PropertyEdit from './pages/PropertyEdit';
import LoginPage from './pages/LoginPage';

function App() {
    const [session, setSession] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const getSession = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            setSession(session);
            setLoading(false);
        };

        getSession();

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
        });

        return () => subscription.unsubscribe();
    }, []);

    const handleLogout = async () => {
        await supabase.auth.signOut();
    };

    if (loading) {
        return <div className="min-h-screen bg-gray-100 flex items-center justify-center">Loading...</div>;
    }

    return (
        <Router>
            <div className="flex min-h-screen bg-gray-100">
                {session && (
                    <aside className="w-64 bg-gray-800 text-white p-4">
                        <h1 className="text-2xl font-bold mb-8">Admin Panel</h1>
                        <nav>
                            <ul>
                                <li className="mb-4">
                                    <Link to="/" className="flex items-center p-2 text-gray-300 hover:bg-gray-700 rounded">
                                        <span className="mr-2">🏠</span> Home
                                    </Link>
                                </li>
                                <li className="mb-4">
                                    <Link to="/add" className="flex items-center p-2 text-gray-300 hover:bg-gray-700 rounded">
                                        <span className="mr-2">➕</span> Add Property
                                    </Link>
                                </li>
                                <li>
                                    <button onClick={handleLogout} className="flex items-center p-2 text-gray-300 hover:bg-gray-700 rounded w-full">
                                        <span className="mr-2">🚪</span> Logout
                                    </button>
                                </li>
                            </ul>
                        </nav>
                    </aside>
                )}

                <main className="flex-1 p-8">
                    <Routes>
                        <Route path="/login" element={<LoginPage />} />
                        <Route
                            path="/"
                            element={session ? <PropertyList /> : <Navigate to="/login" />}
                        />
                        <Route
                            path="/add"
                            element={session ? <PropertyForm /> : <Navigate to="/login" />}
                        />
                        <Route
                            path="/edit/:id"
                            element={session ? <PropertyEdit /> : <Navigate to="/login" />}
                        />
                    </Routes>
                </main>
            </div>
        </Router>
    );
}

export default App;

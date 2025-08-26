import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { supabase } from './lib/supabaseClient';
import PropertyList from './components/PropertyList';
import PropertyEdit from './pages/PropertyEdit';
import LoginPage from './pages/LoginPage';
import BlogsPage from './pages/BlogsPage';
import BlogForm from './components/BlogForm';
import BlogEdit from './pages/BlogEdit';
import Header from './components/Header';
import HomePage from './pages/HomePage';

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
        return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
    }

    return (
        <Router>
            <div className="min-vh-100 d-flex flex-column">
                {session && <Header handleLogout={handleLogout} />}
                <main className="flex-grow-1 p-4">
                    <Routes>
                        <Route path="/login" element={<LoginPage />} />
                        <Route 
                            path="/" 
                            element={session ? <HomePage /> : <Navigate to="/login" />}
                        />
                        <Route
                            path="/properties"
                            element={session ? <PropertyList /> : <Navigate to="/login" />}
                        />
                        <Route
                            path="/properties/edit/:id"
                            element={session ? <PropertyEdit /> : <Navigate to="/login" />}
                        />
                        <Route
                            path="/blogs"
                            element={session ? <BlogsPage /> : <Navigate to="/login" />}
                        />
                        <Route
                            path="/blogs/add"
                            element={session ? <BlogForm /> : <Navigate to="/login" />}
                        />
                        <Route
                            path="/blogs/edit/:id"
                            element={session ? <BlogEdit /> : <Navigate to="/login" />}
                        />
                    </Routes>
                </main>
            </div>
        </Router>
    );
}

export default App;

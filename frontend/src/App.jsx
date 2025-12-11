import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import BusinessProfile from './pages/BusinessProfile';
import Chat from './pages/Chat';
import Layout from './components/Layout';
import useAuth from './hooks/useAuth';

function PrivateRoute({ children }) {
    const { isAuthenticated } = useAuth();
    return isAuthenticated ? children : <Navigate to="/login" />;
}

function App() {
    return (
        <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route
                path="/dashboard"
                element={
                    <PrivateRoute>
                        <Layout>
                            <Dashboard />
                        </Layout>
                    </PrivateRoute>
                }
            />
            <Route
                path="/business"
                element={
                    <PrivateRoute>
                        <Layout>
                            <BusinessProfile />
                        </Layout>
                    </PrivateRoute>
                }
            />
            <Route
                path="/chat"
                element={
                    <PrivateRoute>
                        <Layout>
                            <Chat />
                        </Layout>
                    </PrivateRoute>
                }
            />
            <Route path="/" element={<Navigate to="/dashboard" />} />
        </Routes>
    );
}

export default App;

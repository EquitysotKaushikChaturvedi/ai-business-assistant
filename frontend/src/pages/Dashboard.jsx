import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';
import useAuth from '../hooks/useAuth';

export default function Dashboard() {
    const { user } = useAuth();
    const [business, setBusiness] = useState(null);
    const [loading, setLoading] = useState(true);
    const [recentChats, setRecentChats] = useState([]); // Mock for now

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [businessRes, activityRes] = await Promise.all([
                    api.get('/business/'),
                    api.get('/business/activity')
                ]);
                setBusiness(businessRes.data);

                // Process activity for display
                const formattedChats = activityRes.data.map((msg, index) => ({
                    id: index,
                    snippet: msg.content.substring(0, 50) + (msg.content.length > 50 ? '...' : ''),
                    timestamp: new Date(msg.timestamp).toLocaleString(),
                    role: msg.role
                }));
                setRecentChats(formattedChats);
            } catch (err) {
                console.error("Error fetching dashboard data:", err);
                // We might fail on business not found, but we should still try to handle basic errors gracefully
                if (err.response && err.response.status === 404) {
                    setBusiness(null); // Explicitly handle no business
                }
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-textDark">Dashboard</h1>
                <p className="text-textSoft mt-1">Welcome back, {user?.email}</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content - Left Column */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Business Overview Card */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                            <h2 className="text-xl font-semibold text-textDark">Business Profile</h2>
                            {business && (
                                <Link
                                    to="/business"
                                    className="text-sm font-medium text-primary hover:text-secondary transition"
                                >
                                    Edit Profile
                                </Link>
                            )}
                        </div>

                        <div className="p-6">
                            {!business ? (
                                <div className="text-center py-8">
                                    <div className="mx-auto h-12 w-12 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                                        <svg className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                        </svg>
                                    </div>
                                    <h3 className="text-lg font-medium text-textDark mb-2">No Profile Found</h3>
                                    <p className="text-textSoft mb-6 max-w-sm mx-auto">
                                        Create your business profile to start using the AI assistant tailored to your needs.
                                    </p>
                                    <Link
                                        to="/business"
                                        className="inline-flex items-center px-4 py-2 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-primary hover:bg-secondary transition"
                                    >
                                        Create Profile
                                    </Link>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    <div>
                                        <h3 className="text-lg font-bold text-textDark">{business.name}</h3>
                                        <p className="text-textSoft mt-1">{business.description}</p>
                                    </div>

                                    <div className="flex flex-wrap gap-2 mt-4">
                                        {business.services.split(',').map((service, index) => (
                                            <span
                                                key={index}
                                                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700"
                                            >
                                                {service.trim()}
                                            </span>
                                        ))}
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 pt-4 border-t border-gray-50 text-sm">
                                        {business.address && (
                                            <div className="flex items-start gap-2">
                                                <svg className="h-5 w-5 text-gray-400 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                                </svg>
                                                <span className="text-textSoft">{business.address}</span>
                                            </div>
                                        )}
                                        {business.contact && (
                                            <div className="flex items-start gap-2">
                                                <svg className="h-5 w-5 text-gray-400 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                                </svg>
                                                <span className="text-textSoft">{business.contact}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Recent Activity / Chats */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                        <h2 className="text-xl font-semibold text-textDark mb-4">Recent Activity</h2>
                        {recentChats.length > 0 ? (
                            <ul className="space-y-4">
                                {recentChats.map((chat) => (
                                    <li key={chat.id} className="flex items-start gap-3 pb-4 border-b border-gray-50 last:border-0">
                                        <div className="h-8 w-8 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                                            </svg>
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-textDark">{chat.snippet}</p>
                                            <p className="text-xs text-textSoft">{chat.timestamp}</p>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <div className="text-center py-6 text-textSoft text-sm">
                                No recent chats found.
                            </div>
                        )}
                    </div>
                </div>

                {/* Sidebar - Right Column */}
                <div className="space-y-8">
                    {/* Quick Actions */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                        <h2 className="text-lg font-semibold text-textDark mb-4">Quick Actions</h2>
                        <div className="space-y-3">
                            <Link
                                to="/chat"
                                className="flex items-center gap-3 w-full p-3 rounded-xl bg-primary/5 text-primary hover:bg-primary/10 transition"
                            >
                                <div className="h-8 w-8 bg-white rounded-lg flex items-center justify-center shadow-sm">
                                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                    </svg>
                                </div>
                                <span className="font-medium">Start New Chat</span>
                            </Link>

                            <Link
                                to="/business"
                                className="flex items-center gap-3 w-full p-3 rounded-xl bg-gray-50 text-textDark hover:bg-gray-100 transition"
                            >
                                <div className="h-8 w-8 bg-white rounded-lg flex items-center justify-center shadow-sm">
                                    <svg className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                    </svg>
                                </div>
                                <span className="font-medium">Edit Profile</span>
                            </Link>

                            <button className="flex items-center gap-3 w-full p-3 rounded-xl bg-gray-50 text-textDark hover:bg-gray-100 transition opacity-50 cursor-not-allowed">
                                <div className="h-8 w-8 bg-white rounded-lg flex items-center justify-center shadow-sm">
                                    <svg className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                    </svg>
                                </div>
                                <span className="font-medium">View Analytics (Coming Soon)</span>
                            </button>
                        </div>
                    </div>

                    {/* AI Stats (Mock) */}
                    <div className="bg-gradient-to-br from-primary to-secondary rounded-2xl shadow-lg p-6 text-white">
                        <h2 className="text-lg font-semibold mb-4 opacity-90">AI Usage</h2>
                        <div className="flex justify-between items-end">
                            <div>
                                <p className="text-3xl font-bold">0</p>
                                <p className="text-sm opacity-75">Messages sent</p>
                            </div>
                            <div className="h-10 w-10 bg-white/20 rounded-full flex items-center justify-center">
                                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

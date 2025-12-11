import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api';
import useAuth from '../hooks/useAuth';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    // States: idle, submitting, slow, timing_out, error, offline, success
    const [status, setStatus] = useState('idle');
    const [error, setError] = useState('');
    const [retryCount, setRetryCount] = useState(0);
    const [cooldown, setCooldown] = useState(0);
    const [diagnostics, setDiagnostics] = useState(null);
    const [showDiagnostics, setShowDiagnostics] = useState(false);

    const { login } = useAuth();
    const navigate = useNavigate();
    const abortControllerRef = useRef(null);
    const timeoutRef = useRef(null);
    const slowTimerRef = useRef(null);

    const MAX_RETRIES = 3;
    const TIMEOUT_MS = 20000; // 20s
    const SLOW_THRESHOLD_MS = 7000; // 7s

    useEffect(() => {
        const handleOnline = () => setStatus('idle');
        const handleOffline = () => setStatus('offline');
        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);
        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, []);

    useEffect(() => {
        if (cooldown > 0) {
            const timer = setInterval(() => setCooldown(c => c - 1), 1000);
            return () => clearInterval(timer);
        }
    }, [cooldown]);

    const performLogin = async (isRetry = false) => {
        if (!navigator.onLine) {
            setStatus('offline');
            return;
        }

        if (retryCount >= MAX_RETRIES && !isRetry) {
            setCooldown(60);
            setError('Too many attempts. Please wait.');
            return;
        }

        setStatus('submitting');
        setError('');
        setDiagnostics(null);

        // Abort previous request if any
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
        }
        abortControllerRef.current = new AbortController();

        // Start Timers
        slowTimerRef.current = setTimeout(() => {
            setStatus('slow');
        }, SLOW_THRESHOLD_MS);

        timeoutRef.current = setTimeout(() => {
            if (abortControllerRef.current) {
                abortControllerRef.current.abort();
            }
            setStatus('timing_out');
            setError('Connection timed out. Retry or contact support.');
        }, TIMEOUT_MS);

        const startTime = Date.now();

        try {
            const formData = new FormData();
            formData.append('username', email);
            formData.append('password', password);

            const response = await api.post('/auth/token', formData, {
                signal: abortControllerRef.current.signal
            });

            // Success
            clearTimers();
            setStatus('success');

            // Capture Diagnostics
            const duration = Date.now() - startTime;
            const correlationId = response.headers['x-correlation-id'];
            setDiagnostics({ duration, correlationId, status: response.status });

            login(response.data.access_token);
            window.location.href = '/dashboard';

        } catch (err) {
            clearTimers();
            const duration = Date.now() - startTime;

            if (err.name === 'AbortError') {
                setStatus('timing_out');
                return;
            }

            // Handle Errors
            let errorMessage = 'An unexpected error occurred.';
            if (err.response) {
                if (err.response.status === 401) errorMessage = 'Incorrect email or password.';
                else if (err.response.status === 429) errorMessage = 'Too many attempts. Try again later.';
                else if (err.response.status >= 500) errorMessage = 'Service temporarily unavailable.';

                setDiagnostics({
                    duration,
                    status: err.response.status,
                    correlationId: err.response.headers['x-correlation-id']
                });
            } else {
                errorMessage = 'Network error. Check your connection.';
                setDiagnostics({ duration, status: 'Network Error' });
            }

            setError(errorMessage);
            setStatus('error');

            // Auto-retry logic for 5xx or Network errors (not 401/400)
            if (!err.response || err.response.status >= 500) {
                if (retryCount < MAX_RETRIES) {
                    const backoff = Math.pow(2, retryCount) * 1000 + (Math.random() * 1000);
                    setTimeout(() => {
                        setRetryCount(c => c + 1);
                        performLogin(true);
                    }, backoff);
                }
            }
        }
    };

    const clearTimers = () => {
        if (slowTimerRef.current) clearTimeout(slowTimerRef.current);
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setRetryCount(0);
        performLogin();
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-white px-4">
            <div className="max-w-[400px] w-full">
                {/* Header */}
                <div className="flex justify-center mb-8">
                    <div className="bg-gray-50 p-1 rounded-xl inline-flex">
                        <button className="px-6 py-2 rounded-lg bg-white shadow-sm text-sm font-semibold text-gray-900 flex items-center gap-2">
                            Login
                        </button>
                        <Link to="/register" className="px-6 py-2 rounded-lg text-sm font-medium text-gray-500 hover:text-gray-900 flex items-center gap-2">
                            Sign Up
                        </Link>
                    </div>
                </div>

                {/* Status Banners */}
                <div aria-live="polite" className="space-y-4 mb-6">
                    {status === 'offline' && (
                        <div className="p-3 bg-yellow-50 text-yellow-800 text-sm rounded-lg flex items-center gap-2">
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                            You're offline. Check your connection.
                        </div>
                    )}

                    {status === 'slow' && (
                        <div className="p-3 bg-blue-50 text-blue-800 text-sm rounded-lg flex items-center gap-2">
                            <div className="animate-spin h-4 w-4 border-2 border-blue-600 border-t-transparent rounded-full"></div>
                            Taking longer than usual...
                        </div>
                    )}

                    {status === 'timing_out' && (
                        <div className="p-3 bg-red-50 text-red-800 text-sm rounded-lg">
                            Connection timed out.
                            <button onClick={() => performLogin()} className="ml-2 font-semibold underline">Retry</button>
                        </div>
                    )}

                    {error && status === 'error' && (
                        <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg">
                            {error}
                            {cooldown > 0 && <span className="block mt-1 font-medium">Try again in {cooldown}s</span>}
                        </div>
                    )}
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email address</label>
                        <input
                            type="email"
                            required
                            disabled={status === 'submitting' || status === 'slow'}
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-gray-900 focus:ring-0 placeholder-gray-400 text-sm transition-colors disabled:bg-gray-50 disabled:text-gray-500"
                            placeholder="Enter your email address"
                        />
                    </div>

                    <div>
                        <div className="flex justify-between items-center mb-1.5">
                            <label className="block text-sm font-semibold text-gray-700">Password</label>
                            <a href="#" className="text-xs font-semibold text-gray-900 hover:underline">Forgot password?</a>
                        </div>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                required
                                disabled={status === 'submitting' || status === 'slow'}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-gray-900 focus:ring-0 placeholder-gray-400 text-sm transition-colors pr-10 disabled:bg-gray-50 disabled:text-gray-500"
                                placeholder="Enter your password"
                            />
                            <button
                                type="button"
                                disabled={status === 'submitting' || status === 'slow'}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? (
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
                                ) : (
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                                )}
                            </button>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={status === 'submitting' || status === 'slow' || cooldown > 0}
                        className="w-full bg-gray-900 text-white py-3.5 rounded-xl text-sm font-semibold hover:bg-gray-800 transition-colors disabled:opacity-70 flex justify-center items-center gap-2"
                    >
                        {(status === 'submitting' || status === 'slow') && (
                            <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                        )}
                        {status === 'submitting' ? 'Logging in...' :
                            status === 'slow' ? 'Still trying...' :
                                cooldown > 0 ? `Wait ${cooldown}s` : 'Log In'}
                    </button>
                </form>

                {/* Diagnostics Panel */}
                <div className="mt-8 text-center">
                    <button
                        onClick={() => setShowDiagnostics(!showDiagnostics)}
                        className="text-xs text-gray-400 hover:text-gray-600 underline"
                    >
                        Diagnostics
                    </button>
                    {showDiagnostics && diagnostics && (
                        <div className="mt-2 p-3 bg-gray-100 rounded text-xs text-left font-mono text-gray-600 overflow-x-auto">
                            <p>Status: {diagnostics.status}</p>
                            <p>Duration: {diagnostics.duration}ms</p>
                            {diagnostics.correlationId && <p>Correlation ID: {diagnostics.correlationId}</p>}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

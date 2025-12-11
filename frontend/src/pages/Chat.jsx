import React, { useState, useEffect, useRef } from 'react';
import useAuth from '../hooks/useAuth';
import ChatBubble from '../components/ChatBubble';
import Input from '../components/Input';

export default function Chat() {
    const { token } = useAuth();
    const [messages, setMessages] = useState([]);
    const [inputValue, setInputValue] = useState('');
    const [isConnected, setIsConnected] = useState(false);
    const [isTyping, setIsTyping] = useState(false);
    const [connectionError, setConnectionError] = useState(null);
    const ws = useRef(null);
    const messagesEndRef = useRef(null);
    const reconnectTimeoutRef = useRef(null);
    const retryCountRef = useRef(0);
    const maxRetries = 5;

    const connectWebSocket = () => {
        if (!token || ws.current?.readyState === WebSocket.OPEN) return;

        // Use production URL or fallback to localhost
        const apiUrl = 'https://ai-business-assistant-backend.onrender.com';
        const wsProtocol = apiUrl.startsWith('https') ? 'wss' : 'ws';
        const wsHost = apiUrl.replace(/^https?:\/\//, '');
        const wsUrl = `${wsProtocol}://${wsHost}/chat/ws?token=${token}`;
        ws.current = new WebSocket(wsUrl);

        ws.current.onopen = () => {
            setIsConnected(true);
            setConnectionError(null);
            retryCountRef.current = 0;
            console.log('Connected to WebSocket');
        };

        ws.current.onmessage = (event) => {
            const data = JSON.parse(event.data);
            if (data.reply) {
                setIsTyping(false);
                setMessages((prev) => [...prev, { text: data.reply, isUser: false }]);
            }
        };

        ws.current.onclose = (event) => {
            setIsConnected(false);
            console.log('Disconnected from WebSocket', event.code);

            // Attempt reconnect if not closed cleanly and retries left
            if (event.code !== 1000 && retryCountRef.current < maxRetries) {
                const timeout = Math.min(1000 * Math.pow(2, retryCountRef.current), 10000); // Exponential backoff
                setConnectionError(`Disconnected. Retrying in ${timeout / 1000}s...`);
                reconnectTimeoutRef.current = setTimeout(() => {
                    retryCountRef.current++;
                    connectWebSocket();
                }, timeout);
            } else if (retryCountRef.current >= maxRetries) {
                setConnectionError('Connection lost. Please refresh the page.');
            }
        };

        ws.current.onerror = (error) => {
            console.error('WebSocket error:', error);
            ws.current.close();
        };
    };

    useEffect(() => {
        connectWebSocket();

        return () => {
            if (ws.current) {
                ws.current.close(1000); // Clean close
            }
            if (reconnectTimeoutRef.current) {
                clearTimeout(reconnectTimeoutRef.current);
            }
        };
    }, [token]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isTyping]);

    const handleSend = () => {
        if (!inputValue.trim() || !isConnected) return;

        const message = inputValue.trim();
        setMessages((prev) => [...prev, { text: message, isUser: true }]);
        setIsTyping(true);
        ws.current.send(JSON.stringify({ message }));
        setInputValue('');
    };

    return (
        <div className="flex flex-col h-[calc(100vh-140px)] max-w-4xl mx-auto bg-bgLight rounded-2xl shadow-xl overflow-hidden border border-gray-200">
            {/* Header */}
            <div className="bg-white p-4 border-b border-gray-200 flex justify-between items-center shadow-sm z-10">
                <div className="flex items-center gap-3">
                    <div className="h-10 w-10 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                        </svg>
                    </div>
                    <div>
                        <h2 className="font-semibold text-textDark">AI Business Assistant</h2>
                        <p className="text-xs text-textSoft">Always here to help</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    {connectionError ? (
                        <span className="text-xs px-2 py-1 rounded-full bg-red-100 text-red-700 font-medium animate-pulse">
                            {connectionError}
                        </span>
                    ) : (
                        <span className={`text-xs px-2 py-1 rounded-full font-medium flex items-center gap-1 ${isConnected ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                            <span className={`h-2 w-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-gray-400'}`}></span>
                            {isConnected ? 'Online' : 'Connecting...'}
                        </span>
                    )}
                </div>
            </div>

            {/* Messages Area */}
            <div className="flex-grow overflow-y-auto p-6 bg-gray-50 space-y-6">
                {messages.length === 0 && (
                    <div className="flex flex-col items-center justify-center h-full text-center text-textSoft opacity-70">
                        <div className="h-16 w-16 bg-gray-200 rounded-full flex items-center justify-center mb-4">
                            <svg className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                            </svg>
                        </div>
                        <p className="font-medium">Start a conversation</p>
                        <p className="text-sm">Ask about your business insights or get help with tasks.</p>
                    </div>
                )}

                {messages.map((msg, index) => (
                    <ChatBubble key={index} message={msg.text} isUser={msg.isUser} />
                ))}

                {isTyping && (
                    <div className="flex justify-start mb-4 animate-fadeIn">
                        <div className="bg-white border border-gray-100 rounded-2xl rounded-bl-none px-4 py-3 shadow-sm flex items-center gap-1">
                            <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                            <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                            <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onSend={handleSend}
                disabled={!isConnected}
            />
        </div>
    );
}

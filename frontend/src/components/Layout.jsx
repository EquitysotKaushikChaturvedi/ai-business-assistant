import React from 'react';
import Navbar from './Navbar';

export default function Layout({ children }) {
    return (
        <div className="min-h-screen flex flex-col bg-bgLight">
            <Navbar />
            <main className="flex-grow container mx-auto px-4 py-8">
                {children}
            </main>
            <footer className="bg-white border-t border-gray-200 py-6">
                <div className="container mx-auto px-4 text-center text-textSoft text-sm">
                    &copy; {new Date().getFullYear()} Business AI Chat. All rights reserved.
                </div>
            </footer>
        </div>
    );
}

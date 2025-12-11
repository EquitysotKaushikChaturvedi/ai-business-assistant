import React from 'react';

export default function Input({ value, onChange, onSend, disabled }) {
    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            onSend();
        }
    };

    return (
        <div className="flex gap-2 items-end bg-white p-4 border-t border-gray-200">
            <textarea
                value={value}
                onChange={onChange}
                onKeyDown={handleKeyDown}
                placeholder="Type your message..."
                className="flex-grow resize-none border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary focus:outline-none max-h-32"
                rows={1}
                disabled={disabled}
            />
            <button
                onClick={onSend}
                disabled={disabled || !value.trim()}
                className="bg-primary text-white p-3 rounded-xl hover:bg-secondary transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                    <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
                </svg>
            </button>
        </div>
    );
}

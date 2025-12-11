import React from 'react';
import ReactMarkdown from 'react-markdown';

export default function ChatBubble({ message, isUser }) {
    return (
        <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4 animate-fadeIn`}>
            <div
                className={`max-w-[85%] md:max-w-[75%] rounded-2xl px-5 py-3 shadow-sm ${isUser
                        ? 'bg-primary text-white rounded-br-none'
                        : 'bg-white text-textDark rounded-bl-none border border-gray-100'
                    }`}
            >
                <div className={`prose prose-sm max-w-none ${isUser ? 'prose-invert' : ''}`}>
                    <ReactMarkdown
                        components={{
                            a: ({ node, ...props }) => (
                                <a {...props} target="_blank" rel="noopener noreferrer" className="underline font-medium hover:text-opacity-80" />
                            ),
                            p: ({ node, ...props }) => <p {...props} className="mb-1 last:mb-0" />,
                        }}
                    >
                        {message}
                    </ReactMarkdown>
                </div>
            </div>
        </div>
    );
}

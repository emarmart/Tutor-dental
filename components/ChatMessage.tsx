import React, { useState } from 'react';
import type { Message } from '../types';

interface ChatMessageProps {
    message: Message;
}

const UserIcon = () => (
    <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
        Est
    </div>
);

const ModelIcon = () => (
    <div className="w-8 h-8 rounded-full bg-cyan-500 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
        AI
    </div>
);

const CopyIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
    </svg>
);

const CheckIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
);


const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
    const isUser = message.role === 'user';
    const [isCopied, setIsCopied] = useState(false);

    const handleCopy = () => {
        if (isCopied) return;

        navigator.clipboard.writeText(message.content).then(() => {
            setIsCopied(true);
            setTimeout(() => {
                setIsCopied(false);
            }, 2000); // Reset after 2 seconds
        }).catch(err => {
            console.error('Failed to copy text: ', err);
        });
    };

    return (
        <div className={`flex items-start gap-3 my-4 ${isUser ? 'justify-end' : 'justify-start'}`}>
            {!isUser && <ModelIcon />}
            <div className="group relative">
                <div
                    className={`max-w-md lg:max-w-2xl px-4 py-3 rounded-2xl shadow-sm ${
                        isUser
                            ? 'bg-blue-500 text-white rounded-br-none'
                            : 'bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-bl-none'
                    }`}
                >
                    <p className="whitespace-pre-wrap text-base">{message.content}</p>
                </div>
                {!isUser && (
                    <button
                        onClick={handleCopy}
                        aria-label={isCopied ? 'Copiado' : 'Copiar texto'}
                        className={`absolute -bottom-2 -right-2 p-1.5 rounded-full bg-gray-200 dark:bg-gray-600 text-gray-600 dark:text-gray-300 opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity duration-200 ease-in-out ${isCopied ? 'text-green-500' : 'hover:bg-gray-300 dark:hover:bg-gray-500'}`}
                    >
                        {isCopied ? <CheckIcon /> : <CopyIcon />}
                    </button>
                )}
            </div>
            {isUser && <UserIcon />}
        </div>
    );
};

export default ChatMessage;


import React from 'react';
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


const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
    const isUser = message.role === 'user';

    return (
        <div className={`flex items-start gap-3 my-4 ${isUser ? 'justify-end' : 'justify-start'}`}>
            {!isUser && <ModelIcon />}
            <div
                className={`max-w-md lg:max-w-2xl px-4 py-3 rounded-2xl shadow-sm ${
                    isUser
                        ? 'bg-blue-500 text-white rounded-br-none'
                        : 'bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-bl-none'
                }`}
            >
                <p className="whitespace-pre-wrap">{message.content}</p>
            </div>
            {isUser && <UserIcon />}
        </div>
    );
};

export default ChatMessage;

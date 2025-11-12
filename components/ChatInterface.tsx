
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Chat } from '@google/genai';
import { createChatSession } from '../services/geminiService';
import type { Message } from '../types';
import ChatMessage from './ChatMessage';
import LoadingSpinner from './LoadingSpinner';

const ChatInterface: React.FC = () => {
    const [messages, setMessages] = useState<Message[]>([
        {
            role: 'model',
            content: '¡Hola! Soy tu tutor de técnico dental AI. ¿En qué tema te gustaría profundizar hoy? Puedo explicarte desde anatomía dental hasta los últimos materiales y técnicas de laboratorio.',
        },
    ]);
    const [inputValue, setInputValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const chatSession = useRef<Chat | null>(null);
    const messagesEndRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        try {
            chatSession.current = createChatSession();
        } catch (e: any) {
            setError(e.message);
        }
    }, []);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isLoading]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!inputValue.trim() || isLoading) return;

        const userMessage: Message = { role: 'user', content: inputValue.trim() };
        setMessages((prev) => [...prev, userMessage]);
        setInputValue('');
        setIsLoading(true);
        setError(null);

        try {
            if (!chatSession.current) {
                throw new Error("Chat session not initialized.");
            }
            
            const response = await chatSession.current.sendMessage({ message: userMessage.content });
            const modelMessage: Message = { role: 'model', content: response.text };
            setMessages((prev) => [...prev, modelMessage]);

        } catch (err) {
            console.error(err);
            const errorMessage = "Lo siento, ha ocurrido un error. Por favor, inténtalo de nuevo.";
            setError(errorMessage);
            setMessages((prev) => [...prev, {role: 'model', content: errorMessage}]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col h-full bg-gray-100 dark:bg-gray-900">
            <div className="flex-1 overflow-y-auto p-4 md:p-6">
                <div className="max-w-4xl mx-auto">
                    {messages.map((msg, index) => (
                        <ChatMessage key={index} message={msg} />
                    ))}
                    {isLoading && <LoadingSpinner />}
                    <div ref={messagesEndRef} />
                </div>
            </div>
            <div className="p-4 md:p-6 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
                <div className="max-w-4xl mx-auto">
                    {error && <p className="text-red-500 text-center text-sm mb-2">{error}</p>}
                    <form onSubmit={handleSubmit} className="flex items-center space-x-3">
                        <textarea
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && !e.shiftKey) {
                                    e.preventDefault();
                                    handleSubmit(e);
                                }
                            }}
                            placeholder="Escribe tu pregunta aquí..."
                            className="flex-1 w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg resize-none focus:ring-2 focus:ring-cyan-500 focus:outline-none bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                            rows={1}
                            disabled={isLoading}
                        />
                        <button
                            type="submit"
                            disabled={isLoading || !inputValue.trim()}
                            className="p-3 rounded-full bg-cyan-500 text-white hover:bg-cyan-600 disabled:bg-cyan-300 dark:disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ChatInterface;

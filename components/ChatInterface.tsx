import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Chat } from '@google/genai';
import { createChatSession } from '../services/geminiService';
import type { Message } from '../types';
import ChatMessage from './ChatMessage';
import LoadingSpinner from './LoadingSpinner';

const CHAT_HISTORY_KEY = 'dentalTutorChatHistory';

const TrashIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
    </svg>
);


const ChatInterface: React.FC = () => {
    const [messages, setMessages] = useState<Message[]>(() => {
        try {
            const savedMessages = localStorage.getItem(CHAT_HISTORY_KEY);
            if (savedMessages) {
                const parsedMessages = JSON.parse(savedMessages);
                if (Array.isArray(parsedMessages) && parsedMessages.length > 0) {
                    return parsedMessages;
                }
            }
        } catch (error) {
            console.error("Error al cargar el historial de chat desde localStorage", error);
            localStorage.removeItem(CHAT_HISTORY_KEY);
        }
        return [
            {
                role: 'model',
                content: '¡Hola! Soy tu tutor de técnico dental AI. ¿En qué tema te gustaría profundizar hoy? Puedo explicarte desde anatomía dental hasta los últimos materiales y técnicas de laboratorio.',
            },
        ];
    });
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
    
    useEffect(() => {
        try {
            localStorage.setItem(CHAT_HISTORY_KEY, JSON.stringify(messages));
        } catch (error) {
            console.error("Error al guardar el historial de chat en localStorage", error);
        }
    }, [messages]);

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
                throw new Error("La sesión de chat no está inicializada.");
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
    
    const handleClearChat = () => {
        if (window.confirm('¿Estás seguro de que quieres borrar el historial de chat? Esta acción no se puede deshacer.')) {
            setMessages([
                {
                    role: 'model',
                    content: '¡Hola! Soy tu tutor de técnico dental AI. ¿En qué tema te gustaría profundizar hoy?',
                },
            ]);
            localStorage.removeItem(CHAT_HISTORY_KEY);
            try {
                chatSession.current = createChatSession();
            } catch (e: any) {
                setError(e.message);
            }
        }
    };

    return (
        <div className="relative flex flex-col h-full bg-gray-100 dark:bg-gray-900">
             <button
                onClick={handleClearChat}
                className="absolute top-4 right-4 md:right-6 z-20 p-2 rounded-full text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 hover:text-gray-700 dark:hover:text-gray-200 transition-colors shadow-sm"
                aria-label="Limpiar historial de chat"
                title="Limpiar historial de chat"
            >
                <TrashIcon />
            </button>
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
                            className="flex-1 w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg resize-none focus:ring-2 focus:ring-cyan-500 focus:outline-none bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-200 text-base"
                            rows={1}
                            disabled={isLoading}
                        />
                        <button
                            type="submit"
                            disabled={isLoading || !inputValue.trim()}
                            className="p-3 rounded-full bg-cyan-500 text-white hover:bg-cyan-600 disabled:bg-cyan-300 dark:disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500"
                            aria-label="Enviar mensaje"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 11l3-3m0 0l3 3m-3-3v8m0-13a9 9 0 110 18 9 9 0 010-18z" />
                            </svg>
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ChatInterface;

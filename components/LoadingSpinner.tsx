
import React from 'react';

const LoadingSpinner: React.FC = () => {
    return (
        <div className="flex items-start gap-3 my-4 justify-start">
             <div className="w-8 h-8 rounded-full bg-cyan-500 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                AI
            </div>
            <div className="bg-white dark:bg-gray-700 rounded-2xl rounded-bl-none p-3 shadow-sm flex items-center space-x-2">
                <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
                <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            </div>
        </div>
    );
};

export default LoadingSpinner;

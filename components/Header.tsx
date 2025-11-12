
import React from 'react';

const ToothIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-cyan-500" viewBox="0 0 20 20" fill="currentColor">
        <path d="M10 3.5c-1.38 0-2.5 1.12-2.5 2.5 0 .97.56 1.81 1.36 2.24-.95.4-1.64 1.34-1.64 2.43 0 1.47 1.19 2.66 2.66 2.66s2.66-1.19 2.66-2.66c0-1.09-.69-2.03-1.64-2.43.8-.43 1.36-1.27 1.36-2.24 0-1.38-1.12-2.5-2.5-2.5zM10 2c4.42 0 8 3.58 8 8s-3.58 8-8 8-8-3.58-8-8 3.58-8 8-8zm0 1.5c-3.59 0-6.5 2.91-6.5 6.5s2.91 6.5 6.5 6.5 6.5-2.91 6.5-6.5-2.91-6.5-6.5-6.5z" />
    </svg>
);


const Header: React.FC = () => {
    return (
        <header className="bg-white dark:bg-gray-800 shadow-md p-4 flex items-center space-x-3 z-10">
            <ToothIcon />
            <div>
                <h1 className="text-xl font-bold text-gray-800 dark:text-white">Tutor Técnico Dental AI</h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">Tu asistente personal para el aprendizaje</p>
            </div>
        </header>
    );
};

export default Header;

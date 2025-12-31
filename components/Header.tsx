import React from 'react';

interface HeaderProps {
    title: string;
    onBack?: () => void;
    rightAction?: React.ReactNode;
    variant?: 'default' | 'transparent';
}

export const Header: React.FC<HeaderProps> = ({
    title,
    onBack,
    rightAction,
    variant = 'default'
}) => {
    const bgClass = variant === 'transparent'
        ? 'bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md'
        : 'bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-md border-b border-gray-200 dark:border-white/5';

    return (
        <header className={`sticky top-0 z-50 ${bgClass} px-4 py-3`}>
            <div className="flex items-center justify-between">
                {onBack ? (
                    <button
                        onClick={onBack}
                        className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-gray-200 dark:hover:bg-white/10 transition-colors"
                    >
                        <span className="material-symbols-outlined text-gray-900 dark:text-white">arrow_back</span>
                    </button>
                ) : (
                    <div className="w-10" />
                )}

                <h1 className="text-lg font-bold text-gray-900 dark:text-white tracking-tight">{title}</h1>

                {rightAction ? (
                    <div className="flex items-center justify-center">
                        {rightAction}
                    </div>
                ) : (
                    <div className="w-10" />
                )}
            </div>
        </header>
    );
};

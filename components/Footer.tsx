import React from 'react';

interface FooterProps {
    className?: string;
}

export const Footer: React.FC<FooterProps> = ({ className = '' }) => {
    return (
        <div className={`w-full py-2 text-center opacity-70 ${className}`}>
            <p className="text-[10px] text-slate-400 dark:text-slate-600 font-medium">
                Fenrih MetaDev - Versão 2.7
            </p>
        </div>
    );
};

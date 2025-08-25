import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export const Card: React.FC<CardProps> = ({ children, className = '' }) => {
  return (
    <div className={`bg-[var(--card-bg)] rounded-lg border border-[var(--border-color)] shadow-lg p-6 sm:p-8 ${className}`}>
      {children}
    </div>
  );
};

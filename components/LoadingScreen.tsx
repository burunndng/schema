import React, { useState, useEffect } from 'react';
import { Card } from './common/Card';

const LoadingSpinner: React.FC = () => (
  <div className="w-16 h-16 border-4 border-gray-600 border-t-[var(--primary-500)] rounded-full animate-spin"></div>
);

const loadingMessages = [
  "Analyzing your responses...",
  "Identifying core patterns...",
  "Consulting with our digital schema expert...",
  "Crafting personalized feedback...",
  "Just a moment more...",
];

const LoadingScreen: React.FC = () => {
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex(prevIndex => (prevIndex + 1) % loadingMessages.length);
    }, 2500);

    return () => clearInterval(interval);
  }, []);

  return (
    <Card className="text-center flex flex-col items-center justify-center space-y-6 h-96">
      <LoadingSpinner />
      <h2 className="text-2xl font-bold text-[var(--text-primary)]">Generating Your Report</h2>
      <p className="text-[var(--text-secondary)] text-lg transition-opacity duration-500">
        {loadingMessages[messageIndex]}
      </p>
    </Card>
  );
};

export default LoadingScreen;

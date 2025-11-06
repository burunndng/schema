import React, { useState, useRef, useEffect } from 'react';
import { TestResult, TestType, ChatMessage } from '../types';
import { getChatbotResponse } from '../services/geminiService';
import { Button } from './common/Button';

interface PersistentChatbotProps {
    allResults: Partial<Record<TestType, TestResult>>;
}

export const PersistentChatbot: React.FC<PersistentChatbotProps> = ({ allResults }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
    const [userInput, setUserInput] = useState('');
    const [isLoadingChat, setIsLoadingChat] = useState(false);
    const chatEndRef = useRef<HTMLDivElement>(null);

    const hasCompletedTests = Object.keys(allResults).length > 0;
    const latestTest = Object.values(allResults)[Object.values(allResults).length - 1];

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [chatMessages]);

    const handleSendMessage = async () => {
        if (!userInput.trim() || isLoadingChat || !latestTest) return;

        const userMessage: ChatMessage = {
            role: 'user',
            content: userInput.trim()
        };

        setChatMessages(prev => [...prev, userMessage]);
        setUserInput('');
        setIsLoadingChat(true);

        try {
            const response = await getChatbotResponse(userInput.trim(), latestTest, allResults);
            const botMessage: ChatMessage = {
                role: 'assistant',
                content: response
            };
            setChatMessages(prev => [...prev, botMessage]);
        } catch (error) {
            const errorMessage: ChatMessage = {
                role: 'assistant',
                content: 'Sorry, I encountered an error. Please try again.'
            };
            setChatMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoadingChat(false);
        }
    };

    if (!hasCompletedTests) return null;

    return (
        <>
            {/* Floating Chat Button */}
            {!isOpen && (
                <button
                    onClick={() => setIsOpen(true)}
                    className="fixed bottom-6 right-6 w-16 h-16 bg-[var(--primary-500)] hover:bg-[var(--primary-600)] text-white rounded-full shadow-2xl flex items-center justify-center transition-all hover:scale-110 z-50"
                    aria-label="Open chat assistant"
                >
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                    </svg>
                </button>
            )}

            {/* Chat Panel */}
            {isOpen && (
                <div className="fixed bottom-6 right-6 w-96 h-[600px] bg-gray-900 border border-[var(--border-color)] rounded-lg shadow-2xl flex flex-col z-50">
                    {/* Header */}
                    <div className="flex items-center justify-between p-4 border-b border-[var(--border-color)] bg-gray-800/50">
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                            <h3 className="font-semibold text-white">Schema Therapy Assistant</h3>
                        </div>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="text-gray-400 hover:text-white transition-colors"
                            aria-label="Close chat"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4">
                        {chatMessages.length === 0 ? (
                            <div className="text-center py-8 text-[var(--text-secondary)]">
                                <p className="text-sm mb-3">Ask me anything about your results!</p>
                                <div className="space-y-2 text-xs">
                                    <p className="text-[var(--primary-400)]">Try asking:</p>
                                    <p>"Why do I have high Abandonment?"</p>
                                    <p>"How can I work on my schemas?"</p>
                                    <p>"What's the connection between my tests?"</p>
                                </div>
                            </div>
                        ) : (
                            <>
                                {chatMessages.map((msg, idx) => (
                                    <div
                                        key={idx}
                                        className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                                    >
                                        <div
                                            className={`max-w-[85%] p-3 rounded-lg ${
                                                msg.role === 'user'
                                                    ? 'bg-[var(--primary-500)] text-white'
                                                    : 'bg-gray-800 text-gray-200 border border-gray-700'
                                            }`}
                                        >
                                            <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                                        </div>
                                    </div>
                                ))}
                                {isLoadingChat && (
                                    <div className="flex justify-start">
                                        <div className="bg-gray-800 text-gray-400 p-3 rounded-lg border border-gray-700">
                                            <p className="text-sm">Thinking...</p>
                                        </div>
                                    </div>
                                )}
                                <div ref={chatEndRef} />
                            </>
                        )}
                    </div>

                    {/* Input */}
                    <div className="p-4 border-t border-[var(--border-color)] bg-gray-800/50">
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={userInput}
                                onChange={(e) => setUserInput(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                                placeholder="Ask a question..."
                                className="flex-1 px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[var(--primary-500)] text-sm"
                                disabled={isLoadingChat}
                            />
                            <button
                                onClick={handleSendMessage}
                                disabled={!userInput.trim() || isLoadingChat}
                                className="px-4 py-2 bg-[var(--primary-500)] hover:bg-[var(--primary-600)] disabled:bg-gray-700 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

import React, { useState, useMemo } from 'react';
import HomePage from './components/HomePage';
import AboutPage from './components/AboutPage';
import ServicesPage from './components/ServicesPage';
import WelcomeScreen from './components/WelcomeScreen';
import TestScreen from './components/TestScreen';
import ReviewScreen from './components/ReviewScreen';
import LoadingScreen from './components/LoadingScreen';
import ResultsScreen from './components/ResultsScreen';
import { PersistentChatbot } from './components/PersistentChatbot';
import { Button } from './components/common/Button';
import { Card } from './components/common/Card';
import { AppState, TestResult, Answers, Test, YSCTestResult, YPITestResult, YPICategoryScores, YPICategory, Question, SMITestResult, SchemaMode, OITestResult, OICategory, TestType } from './types';
import { TESTS, YPI_QUESTION_TO_CATEGORY_MAP, SMI_QUESTION_GROUPINGS, OI_QUESTION_GROUPINGS } from './constants';
import { getYSQFeedback, getParentingFeedback, getSMIFeedback, getOIFeedback } from './services/geminiService';

type Page = 'home' | 'about' | 'services' | 'tests';

const App: React.FC = () => {
    const [currentPage, setCurrentPage] = useState<Page>('home');
    const [appState, setAppState] = useState<AppState>('welcome');
    const [selectedTest, setSelectedTest] = useState<Test | null>(null);
    const [answers, setAnswers] = useState<Answers>({});
    const [currentTestResult, setCurrentTestResult] = useState<TestResult | null>(null);
    const [allTestResults, setAllTestResults] = useState<Partial<Record<TestType, TestResult>>>({});
    const [errorMessage, setErrorMessage] = useState<string>('');
    const [caregiverNames, setCaregiverNames] = useState({ c1: 'Mother', c2: 'Father' });
    const [userName, setUserName] = useState('');

    const handleNavigate = (page: Page) => {
        setCurrentPage(page);
        if (page === 'tests') {
            setAppState('welcome');
            setSelectedTest(null);
            setAnswers({});
            setCurrentTestResult(null);
        }
    };

    const handleStartTest = (testId: number) => {
        const testToStart = TESTS.find(t => t.id === testId);
        if (testToStart) {
            setSelectedTest(testToStart);
            setAnswers({});
            setCurrentTestResult(null);
            setAppState('testing');
        }
    };

    const handleAnswer = (questionId: string, value: number, caregiver?: 'c1' | 'c2') => {
        const key = caregiver ? `${questionId}_${caregiver}` : questionId;
        setAnswers(prev => ({ ...prev, [key]: value }));
    };

    const handleNext = () => setAppState('review');
    const handleEdit = () => setAppState('testing');
    const handleReset = () => {
        setCurrentPage('home');
        setAppState('welcome');
        setSelectedTest(null);
        setAnswers({});
        setCurrentTestResult(null);
        setAllTestResults({});
        setErrorMessage('');
        setCaregiverNames({ c1: 'Mother', c2: 'Father' });
        // Do not reset username
    };

    const submitAnswers = async () => {
        if (!selectedTest) return;

        setAppState('loading');
        setErrorMessage('');

        try {
            let result: TestResult | null = null;
            if (selectedTest.type === 'YSQ') {
                const totalScore = selectedTest.questions.reduce((sum, q) => sum + (answers[q.id] || 0), 0);
                const scores = selectedTest.questions
                  .filter(q => q.schema)
                  .map(q => ({ schema: q.schema!, score: answers[q.id] || 0 }));
                const feedback = await getYSQFeedback(scores);
                result = { type: 'YSQ', scores, totalScore, feedback };
            } else if (selectedTest.type === 'YPI') {
                const scores: YPICategoryScores = {
                    caregiver1: Object.fromEntries(Object.values(YPICategory).map(cat => [cat, [] as Question[]])) as Record<YPICategory, Question[]>,
                    caregiver2: Object.fromEntries(Object.values(YPICategory).map(cat => [cat, [] as Question[]])) as Record<YPICategory, Question[]>,
                };
                selectedTest.questions.forEach(q => {
                    if(answers[`${q.id}_c1`] >= 4){
                        const category = YPI_QUESTION_TO_CATEGORY_MAP[q.id];
                        if(category) scores.caregiver1[category].push(q);
                    }
                    if(answers[`${q.id}_c2`] >= 4){
                        const category = YPI_QUESTION_TO_CATEGORY_MAP[q.id];
                        if(category) scores.caregiver2[category].push(q);
                    }
                });
                const feedback = await getParentingFeedback(scores, caregiverNames);
                result = { type: 'YPI', scores, feedback };
            } else if (selectedTest.type === 'SMI') {
                const scores = Object.entries(SMI_QUESTION_GROUPINGS).map(([mode, questionIds]) => {
                    const total = questionIds.reduce((sum, qId) => sum + (answers[qId] || 0), 0);
                    return { mode: mode as SchemaMode, score: total / questionIds.length };
                });
                const feedback = await getSMIFeedback(scores);
                result = { type: 'SMI', scores, feedback };
            } else if (selectedTest.type === 'OI') {
                const scores = Object.entries(OI_QUESTION_GROUPINGS).map(([category, questionIds]) => {
                    const total = questionIds.reduce((sum, qId) => sum + (answers[qId] || 0), 0);
                    return { category: category as OICategory, score: total / questionIds.length };
                });
                const feedback = await getOIFeedback(scores);
                result = { type: 'OI', scores, feedback };
            }
            
            if (result) {
                setCurrentTestResult(result);
                setAllTestResults(prev => ({...prev, [selectedTest!.type]: result!}));
            }
            setAppState('results');
        } catch (error) {
            console.error("Error submitting test:", error);
            setErrorMessage(error instanceof Error ? error.message : "An unknown error occurred while analyzing your results.");
            setAppState('error');
        }
    };
    
    const renderContent = () => {
        // Render company website pages
        if (currentPage === 'home') {
            return <HomePage onNavigate={handleNavigate} />;
        } else if (currentPage === 'about') {
            return <AboutPage onNavigate={handleNavigate} />;
        } else if (currentPage === 'services') {
            return <ServicesPage onNavigate={handleNavigate} />;
        }

        // Render assessment pages (when currentPage === 'tests')
        switch (appState) {
            case 'testing':
                return selectedTest && <TestScreen test={selectedTest} answers={answers} onAnswer={handleAnswer} onNext={handleNext} caregiverNames={caregiverNames} onCaregiverNamesChange={setCaregiverNames} />;
            case 'review':
                return selectedTest && <ReviewScreen test={selectedTest} answers={answers} onSubmit={submitAnswers} onEdit={handleEdit} caregiverNames={caregiverNames} />;
            case 'loading':
                return <LoadingScreen />;
            case 'results':
                return currentTestResult && <ResultsScreen currentResult={currentTestResult} allResults={allTestResults} onReset={handleReset} caregiverNames={caregiverNames} userName={userName} currentTest={selectedTest} answers={answers} />;
            case 'error':
                 return (
                    <Card className="text-center border-red-500/50">
                        <h2 className="text-2xl font-bold text-red-400 mb-4">An Error Occurred</h2>
                        <p className="text-red-400 mb-6">{errorMessage}</p>
                        <Button onClick={handleReset} className="bg-red-600 hover:bg-red-700 focus:ring-red-500 text-white">
                            Start Over
                        </Button>
                    </Card>
                );
            case 'welcome':
            default:
                return <WelcomeScreen onStart={handleStartTest} userName={userName} onUserNameChange={setUserName} />;
        }
    };

    return (
        <div className="flex flex-col min-h-screen">
            <header className="bg-gray-900/80 backdrop-blur-sm sticky top-0 z-10 border-b border-[var(--border-color)]">
                <div className="container mx-auto px-6 py-4 flex items-center justify-between">
                    <button onClick={handleReset} className="flex items-center gap-3 focus:outline-none hover:opacity-80 transition-opacity">
                        <svg className="w-8 h-8 text-[var(--primary-500)]" fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                            <path d="M24 4C25.7818 14.2173 33.7827 22.2182 44 24C33.7827 25.7818 25.7818 33.7827 24 44C22.2182 33.7827 14.2173 25.7818 4 24C14.2173 22.2182 22.2182 14.2173 24 4Z" fill="currentColor"></path>
                        </svg>
                        <h1 className="text-2xl font-bold tracking-tight text-white">Burundanga</h1>
                    </button>

                    <nav className="flex items-center gap-6">
                        <button
                            onClick={() => handleNavigate('home')}
                            className={`text-sm font-medium transition-colors ${currentPage === 'home' ? 'text-[var(--primary-500)]' : 'text-[var(--text-secondary)] hover:text-white'}`}
                        >
                            Home
                        </button>
                        <button
                            onClick={() => handleNavigate('about')}
                            className={`text-sm font-medium transition-colors ${currentPage === 'about' ? 'text-[var(--primary-500)]' : 'text-[var(--text-secondary)] hover:text-white'}`}
                        >
                            About
                        </button>
                        <button
                            onClick={() => handleNavigate('services')}
                            className={`text-sm font-medium transition-colors ${currentPage === 'services' ? 'text-[var(--primary-500)]' : 'text-[var(--text-secondary)] hover:text-white'}`}
                        >
                            Services
                        </button>
                        <button
                            onClick={() => handleNavigate('tests')}
                            className={`text-sm font-medium transition-colors ${currentPage === 'tests' ? 'text-[var(--primary-500)]' : 'text-[var(--text-secondary)] hover:text-white'}`}
                        >
                            Assessments
                        </button>
                    </nav>
                </div>
            </header>
            <main className="flex-grow">
                <div className="container mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
                    {renderContent()}
                </div>
            </main>
            <footer className="bg-gray-900 border-t border-gray-800 mt-auto">
                <div className="container mx-auto px-6 py-6 text-center text-sm text-[var(--text-secondary)]">
                    <p>© 2024 Burundanga. All rights reserved. Schema Therapy Assessments.</p>
                </div>
            </footer>

            {/* Persistent Chatbot - Always accessible */}
            <PersistentChatbot allResults={allTestResults} currentTest={selectedTest} answers={answers} />
        </div>
    );
};

export default App;
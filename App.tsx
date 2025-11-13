import React, { useState, useMemo, useEffect } from 'react';
import HomePage from './components/HomePage';
import AboutPage from './components/AboutPage';
import ServicesPage from './components/ServicesPage';
import PricingPage from './components/PricingPage';
import TestimonialsPage from './components/TestimonialsPage';
import ForumPageNew from './components/ForumPageNew';
import GitHubDiscussionsPage from './components/GitHubDiscussionsPage';
import { AuraOSPage } from './components/AuraOSPage';
import LoginPage from './components/LoginPage';
import RegisterPage from './components/RegisterPage';
import AIKeyModal from './components/AIKeyModal';
import WelcomeScreen from './components/WelcomeScreen';
import TestScreen from './components/TestScreen';
import ReviewScreen from './components/ReviewScreen';
import LoadingScreen from './components/LoadingScreen';
import ResultsScreen from './components/ResultsScreen';
import { PersistentChatbot } from './components/PersistentChatbot';
import { BurundangaLogo } from './components/BurundangaLogo';
import { MobileMenu } from './components/MobileMenu';
import { Button } from './components/common/Button';
import { Card } from './components/common/Card';
import { AppState, TestResult, Answers, Test, YSCTestResult, YPITestResult, YPICategoryScores, YPICategory, Question, SMITestResult, SchemaMode, OITestResult, OICategory, TestType } from './types';
import { TESTS, YPI_QUESTION_TO_CATEGORY_MAP, SMI_QUESTION_GROUPINGS, OI_QUESTION_GROUPINGS } from './constants';
import { getYSQFeedback, getParentingFeedback, getSMIFeedback, getOIFeedback } from './services/geminiService';
import { User } from './types/auth';
import { authService } from './services/authService';
import { aiService } from './services/aiService';

type Page = 'home' | 'about' | 'services' | 'pricing' | 'testimonials' | 'forum' | 'discussions' | 'tests' | 'auraos';

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

    // Authentication state
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [authPage, setAuthPage] = useState<'login' | 'register' | null>(null);
    const [showAIKeyModal, setShowAIKeyModal] = useState(false);

    // Mobile menu state
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    // Initialize auth state on mount
    useEffect(() => {
        const initializeAuth = async () => {
            let user = await authService.getCurrentUser();

            // Auto-login as demo user if no user is logged in
            if (!user) {
                try {
                    user = await authService.login('demo@burundanga.com', 'demo123');
                } catch (error) {
                    console.error('Failed to auto-login as demo user:', error);
                }
            }

            setCurrentUser(user);
            // Show AI key modal only if:
            // 1. No API key is configured, AND
            // 2. Modal is not explicitly skipped via VITE_SKIP_OPENROUTER_MODAL flag
            const skipModal = import.meta.env.VITE_SKIP_OPENROUTER_MODAL === 'true';
            setShowAIKeyModal(!aiService.hasApiKey() && !skipModal);
        };
        initializeAuth();
    }, []);

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

    // Authentication handlers
    const handleLoginSuccess = (user: User) => {
        setCurrentUser(user);
        setAuthPage(null);
    };

    const handleRegisterSuccess = (user: User) => {
        setCurrentUser(user);
        setAuthPage(null);
    };

    const handleLogout = async () => {
        await authService.logout();
        setCurrentUser(null);
    };

    const handleNeedLogin = () => {
        setAuthPage('login');
    };

    const renderContent = () => {
        // Render auth pages
        if (authPage === 'login') {
            return (
                <LoginPage
                    onLoginSuccess={handleLoginSuccess}
                    onSwitchToRegister={() => setAuthPage('register')}
                />
            );
        }

        if (authPage === 'register') {
            return (
                <RegisterPage
                    onRegisterSuccess={handleRegisterSuccess}
                    onSwitchToLogin={() => setAuthPage('login')}
                />
            );
        }

        // Render company website pages
        if (currentPage === 'home') {
            return <HomePage onNavigate={handleNavigate} />;
        } else if (currentPage === 'about') {
            return <AboutPage onNavigate={handleNavigate} />;
        } else if (currentPage === 'services') {
            return <ServicesPage onNavigate={handleNavigate} />;
        } else if (currentPage === 'pricing') {
            return <PricingPage onNavigate={handleNavigate} />;
        } else if (currentPage === 'testimonials') {
            return <TestimonialsPage onNavigate={handleNavigate} />;
        } else if (currentPage === 'forum') {
            return <ForumPageNew onNavigate={handleNavigate} currentUser={currentUser} onNeedLogin={handleNeedLogin} />;
        } else if (currentPage === 'discussions') {
            return <GitHubDiscussionsPage onNavigate={handleNavigate} currentUser={currentUser} />;
        } else if (currentPage === 'auraos') {
            return <AuraOSPage onNavigate={handleNavigate} />;
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
            <header className="bg-gradient-to-b from-gray-900/95 to-gray-900/85 backdrop-blur-sm sticky top-0 z-10 border-b border-[var(--border-color)] shadow-lg">
                <div className="container mx-auto px-6 py-4 flex items-center justify-between">
                    <button onClick={handleReset} className="flex items-center gap-3 focus:outline-none hover:opacity-80 transition-opacity group">
                        <svg className="w-9 h-9 text-[var(--primary-500)] group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                            {/* Brain lobes */}
                            <circle cx="15" cy="14" r="6" fill="currentColor" opacity="0.9"/>
                            <circle cx="33" cy="14" r="6" fill="currentColor" opacity="0.9"/>
                            <circle cx="10" cy="24" r="5.5" fill="currentColor" opacity="0.85"/>
                            <circle cx="38" cy="24" r="5.5" fill="currentColor" opacity="0.85"/>
                            <ellipse cx="24" cy="28" rx="8" ry="7" fill="currentColor" opacity="0.8"/>

                            {/* Brain stem */}
                            <rect x="22" y="34" width="4" height="6" fill="currentColor" opacity="0.7"/>

                            {/* Happy eyes */}
                            <circle cx="18" cy="20" r="1.5" fill="white"/>
                            <circle cx="30" cy="20" r="1.5" fill="white"/>

                            {/* Cute smile */}
                            <path d="M 20 26 Q 24 28 28 26" stroke="white" strokeWidth="1.5" fill="none" strokeLinecap="round"/>

                            {/* Sparkles */}
                            <g opacity="0.95">
                                <circle cx="8" cy="8" r="1.5" fill="currentColor"/>
                                <circle cx="40" cy="8" r="1.5" fill="currentColor"/>
                                <circle cx="6" cy="38" r="1" fill="currentColor"/>
                                <circle cx="42" cy="36" r="1" fill="currentColor"/>
                            </g>
                        </svg>
                        <h1 className="text-2xl font-bold tracking-tight text-white group-hover:text-[var(--primary-400)] transition-colors">Burundanga</h1>
                    </button>

                    {/* Desktop Navigation - Hidden on mobile */}
                    <nav className="hidden md:flex items-center gap-8">
                        <button
                            onClick={() => handleNavigate('home')}
                            className={`text-sm font-medium transition-all pb-1 border-b-2 ${currentPage === 'home' ? 'text-[var(--primary-500)] border-[var(--primary-500)]' : 'text-[var(--text-secondary)] border-transparent hover:text-white'}`}
                        >
                            Home
                        </button>
                        <button
                            onClick={() => handleNavigate('about')}
                            className={`text-sm font-medium transition-all pb-1 border-b-2 ${currentPage === 'about' ? 'text-[var(--primary-500)] border-[var(--primary-500)]' : 'text-[var(--text-secondary)] border-transparent hover:text-white'}`}
                        >
                            About
                        </button>
                        <button
                            onClick={() => handleNavigate('services')}
                            className={`text-sm font-medium transition-all pb-1 border-b-2 ${currentPage === 'services' ? 'text-[var(--primary-500)] border-[var(--primary-500)]' : 'text-[var(--text-secondary)] border-transparent hover:text-white'}`}
                        >
                            Services
                        </button>
                        <button
                            onClick={() => handleNavigate('pricing')}
                            className={`text-sm font-medium transition-all pb-1 border-b-2 ${currentPage === 'pricing' ? 'text-[var(--primary-500)] border-[var(--primary-500)]' : 'text-[var(--text-secondary)] border-transparent hover:text-white'}`}
                        >
                            Pricing
                        </button>
                        <button
                            onClick={() => handleNavigate('testimonials')}
                            className={`text-sm font-medium transition-all pb-1 border-b-2 ${currentPage === 'testimonials' ? 'text-[var(--primary-500)] border-[var(--primary-500)]' : 'text-[var(--text-secondary)] border-transparent hover:text-white'}`}
                        >
                            Reviews
                        </button>
                        <button
                            onClick={() => handleNavigate('forum')}
                            className={`text-sm font-medium transition-all pb-1 border-b-2 ${currentPage === 'forum' ? 'text-[var(--primary-500)] border-[var(--primary-500)]' : 'text-[var(--text-secondary)] border-transparent hover:text-white'}`}
                        >
                            Forum
                        </button>
                        <button
                            onClick={() => handleNavigate('discussions')}
                            className={`text-sm font-medium transition-all pb-1 border-b-2 ${currentPage === 'discussions' ? 'text-[var(--primary-500)] border-[var(--primary-500)]' : 'text-[var(--text-secondary)] border-transparent hover:text-white'}`}
                        >
                            💬 Discussions
                        </button>
                        <button
                            onClick={() => handleNavigate('auraos')}
                            className={`text-sm font-medium transition-all pb-1 border-b-2 ${currentPage === 'auraos' ? 'text-[var(--accent-500)] border-[var(--accent-500)]' : 'text-[var(--text-secondary)] border-transparent hover:text-white'}`}
                        >
                            ✨ Aura OS
                        </button>
                        <button
                            onClick={() => handleNavigate('tests')}
                            className={`text-sm font-medium transition-all pb-1 border-b-2 ${currentPage === 'tests' ? 'text-[var(--primary-500)] border-[var(--primary-500)]' : 'text-[var(--text-secondary)] border-transparent hover:text-white'}`}
                        >
                            Assessments
                        </button>

                        {/* Auth buttons */}
                        <div className="border-l border-gray-700 pl-8">
                            {currentUser ? (
                                <div className="flex items-center gap-4">
                                    <div className="flex items-center gap-2">
                                        <img
                                            src={currentUser.avatar}
                                            alt={currentUser.username}
                                            className="w-7 h-7 rounded-full object-cover ring-2 ring-[var(--primary-500)]/50"
                                        />
                                        <span className="text-sm font-medium text-white">{currentUser.username}</span>
                                    </div>
                                    <button
                                        onClick={handleLogout}
                                        className="text-sm text-[var(--text-secondary)] hover:text-[var(--primary-400)] transition-colors font-medium"
                                    >
                                        Logout
                                    </button>
                                </div>
                            ) : (
                                <div className="flex items-center gap-3">
                                    <button
                                        onClick={() => setAuthPage('login')}
                                        className="text-sm font-medium text-[var(--text-secondary)] hover:text-white transition-colors"
                                    >
                                        Login
                                    </button>
                                    <button
                                        onClick={() => setAuthPage('register')}
                                        className="text-sm font-medium bg-[var(--primary-500)] hover:bg-[var(--primary-600)] text-white px-4 py-1.5 rounded-lg transition-all hover:shadow-lg hover:shadow-[var(--primary-500)]/20"
                                    >
                                        Register
                                    </button>
                                </div>
                            )}
                        </div>
                    </nav>

                    {/* Mobile Menu Button - Visible only on mobile */}
                    <button
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="flex md:hidden items-center justify-center w-10 h-10 text-[var(--primary-500)] hover:bg-gray-800 rounded-lg transition-colors"
                    >
                        {mobileMenuOpen ? (
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        ) : (
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        )}
                    </button>
                </div>
            </header>

            {/* Mobile Menu */}
            <MobileMenu
                isOpen={mobileMenuOpen}
                onClose={() => setMobileMenuOpen(false)}
                onNavigate={handleNavigate}
                currentPage={currentPage}
                currentUser={currentUser}
                onLogout={handleLogout}
                onNeedLogin={handleNeedLogin}
            />

            <main className="flex-grow">
                <div className="container mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
                    {renderContent()}
                </div>
            </main>
            <footer className="bg-gradient-to-t from-gray-900/95 to-gray-900/85 border-t border-gray-800 mt-auto shadow-lg">
                <div className="container mx-auto px-6 py-8 text-center text-sm text-[var(--text-secondary)]">
                    <p>© 2024 Burundanga. All rights reserved. Schema Therapy Assessments.</p>
                    <p className="mt-2 text-xs text-gray-600">🧠 Powered by intelligent insights | 💭 Where therapy meets technology</p>
                </div>
            </footer>

            {/* Persistent Chatbot - Always accessible */}
            <PersistentChatbot allResults={allTestResults} currentTest={selectedTest} answers={answers} />

            {/* AI Key Modal */}
            {showAIKeyModal && <AIKeyModal onClose={() => setShowAIKeyModal(false)} />}
        </div>
    );
};

export default App;
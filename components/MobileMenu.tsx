import React, { useState } from 'react';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (page: 'home' | 'about' | 'services' | 'pricing' | 'testimonials' | 'forum' | 'discussions' | 'tests' | 'auraos') => void;
  currentPage: string;
  currentUser: any;
  onLogout: () => void;
  onNeedLogin: () => void;
}

export const MobileMenu: React.FC<MobileMenuProps> = ({
  isOpen,
  onClose,
  onNavigate,
  currentPage,
  currentUser,
  onLogout,
  onNeedLogin,
}) => {
  const handleNavigate = (page: string) => {
    onNavigate(page as 'home' | 'about' | 'services' | 'pricing' | 'testimonials' | 'forum' | 'discussions' | 'tests' | 'auraos');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/50 z-40 md:hidden"
        onClick={onClose}
      />

      {/* Menu */}
      <div className="fixed top-0 left-0 right-0 bg-gray-900 border-b border-gray-800 z-50 md:hidden max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <div className="flex justify-end p-4 border-b border-gray-800">
          <button
            onClick={onClose}
            className="text-white hover:text-[var(--primary-500)] transition-colors text-2xl"
          >
            ✕
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="flex flex-col gap-0">
          <button
            onClick={() => handleNavigate('home')}
            className={`px-6 py-4 text-left border-b border-gray-800 transition-colors ${
              currentPage === 'home'
                ? 'bg-[var(--primary-500)]/20 text-[var(--primary-500)] font-semibold'
                : 'text-white hover:bg-gray-800'
            }`}
          >
            Home
          </button>
          <button
            onClick={() => handleNavigate('about')}
            className={`px-6 py-4 text-left border-b border-gray-800 transition-colors ${
              currentPage === 'about'
                ? 'bg-[var(--primary-500)]/20 text-[var(--primary-500)] font-semibold'
                : 'text-white hover:bg-gray-800'
            }`}
          >
            About
          </button>
          <button
            onClick={() => handleNavigate('services')}
            className={`px-6 py-4 text-left border-b border-gray-800 transition-colors ${
              currentPage === 'services'
                ? 'bg-[var(--primary-500)]/20 text-[var(--primary-500)] font-semibold'
                : 'text-white hover:bg-gray-800'
            }`}
          >
            Services
          </button>
          <button
            onClick={() => handleNavigate('pricing')}
            className={`px-6 py-4 text-left border-b border-gray-800 transition-colors ${
              currentPage === 'pricing'
                ? 'bg-[var(--primary-500)]/20 text-[var(--primary-500)] font-semibold'
                : 'text-white hover:bg-gray-800'
            }`}
          >
            Pricing
          </button>
          <button
            onClick={() => handleNavigate('testimonials')}
            className={`px-6 py-4 text-left border-b border-gray-800 transition-colors ${
              currentPage === 'testimonials'
                ? 'bg-[var(--primary-500)]/20 text-[var(--primary-500)] font-semibold'
                : 'text-white hover:bg-gray-800'
            }`}
          >
            Reviews
          </button>
          <button
            onClick={() => handleNavigate('forum')}
            className={`px-6 py-4 text-left border-b border-gray-800 transition-colors ${
              currentPage === 'forum'
                ? 'bg-[var(--primary-500)]/20 text-[var(--primary-500)] font-semibold'
                : 'text-white hover:bg-gray-800'
            }`}
          >
            Forum
          </button>
          <button
            onClick={() => handleNavigate('discussions')}
            className={`px-6 py-4 text-left border-b border-gray-800 transition-colors ${
              currentPage === 'discussions'
                ? 'bg-[var(--primary-500)]/20 text-[var(--primary-500)] font-semibold'
                : 'text-white hover:bg-gray-800'
            }`}
          >
            💬 Discussions
          </button>
          <button
            onClick={() => handleNavigate('tests')}
            className={`px-6 py-4 text-left border-b border-gray-800 transition-colors ${
              currentPage === 'tests'
                ? 'bg-[var(--primary-500)]/20 text-[var(--primary-500)] font-semibold'
                : 'text-white hover:bg-gray-800'
            }`}
          >
            Assessments
          </button>
          <button
            onClick={() => handleNavigate('auraos')}
            className={`px-6 py-4 text-left border-b border-gray-800 transition-colors ${
              currentPage === 'auraos'
                ? 'bg-[var(--accent-500)]/20 text-[var(--accent-500)] font-semibold'
                : 'text-white hover:bg-gray-800'
            }`}
          >
            ✨ Aura OS
          </button>
        </nav>

        {/* Auth Section */}
        <div className="border-t border-gray-800 p-6 space-y-3">
          {currentUser ? (
            <>
              <div className="flex items-center gap-3 mb-4 pb-4 border-b border-gray-800">
                <img
                  src={currentUser.avatar}
                  alt={currentUser.username}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div>
                  <p className="font-semibold text-white text-sm">{currentUser.username}</p>
                  <p className="text-xs text-[var(--text-secondary)]">Logged in</p>
                </div>
              </div>
              <button
                onClick={() => {
                  onLogout();
                  onClose();
                }}
                className="w-full py-2.5 text-sm font-medium text-white hover:text-red-400 transition-colors"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => {
                  onNeedLogin();
                  onClose();
                }}
                className="w-full py-2.5 text-sm font-medium text-[var(--text-secondary)] hover:text-white transition-colors border border-gray-700 rounded-lg"
              >
                Login
              </button>
              <button
                onClick={() => {
                  onNeedLogin();
                  onClose();
                }}
                className="w-full py-2.5 text-sm font-medium bg-[var(--primary-500)] hover:bg-[var(--primary-600)] text-white rounded-lg transition-colors"
              >
                Register
              </button>
            </>
          )}
        </div>
      </div>
    </>
  );
};

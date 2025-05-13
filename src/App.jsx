import { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import getIcon from './utils/iconUtils';
import Home from './pages/Home';
import NotFound from './pages/NotFound';

function App() {
  const [darkMode, setDarkMode] = useState(() => {
    // Check local storage first
    const savedMode = localStorage.getItem('darkMode');
    if (savedMode !== null) {
      return savedMode === 'true';
    }
    // Otherwise use system preference
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  // Update class on document when darkMode changes
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('darkMode', darkMode);
  }, [darkMode]);

  // Toggle dark mode handler
  const toggleDarkMode = () => {
    setDarkMode(prev => !prev);
  };

  const MoonIcon = getIcon('Moon');
  const SunIcon = getIcon('Sun');
  const GithubIcon = getIcon('Github');

  return (
    <div className="min-h-screen relative">
      {/* Header with dark mode toggle */}
      <header className="sticky top-0 z-10 bg-white/80 dark:bg-surface-900/80 backdrop-blur-md border-b border-surface-200 dark:border-surface-800">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <a href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center text-white">
              <span className="font-bold text-lg">BT</span>
            </div>
            <h1 className="text-xl md:text-2xl font-bold text-surface-900 dark:text-white">
              BrainTwist
            </h1>
          </a>
          
          <div className="flex items-center gap-4">
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-full hover:bg-surface-200 dark:hover:bg-surface-700 transition-colors"
              aria-label="Toggle dark mode"
            >
              {darkMode ? (
                <SunIcon className="w-6 h-6 text-yellow-400" />
              ) : (
                <MoonIcon className="w-6 h-6 text-surface-600" />
              )}
            </button>
            
            <a 
              href="https://github.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="p-2 rounded-full hover:bg-surface-200 dark:hover:bg-surface-700 transition-colors"
              aria-label="GitHub"
            >
              <GithubIcon className="w-6 h-6 dark:text-white" />
            </a>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="container mx-auto px-4 py-8">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      {/* Footer */}
      <footer className="bg-surface-100 dark:bg-surface-800 py-8 border-t border-surface-200 dark:border-surface-700 mt-16">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-surface-600 dark:text-surface-400 mb-4 md:mb-0">
              © {new Date().getFullYear()} BrainTwist. All rights reserved.
            </p>
            <div className="flex gap-6">
              <a href="#" className="text-sm text-surface-600 hover:text-primary dark:text-surface-400 dark:hover:text-primary-light">
                Terms
              </a>
              <a href="#" className="text-sm text-surface-600 hover:text-primary dark:text-surface-400 dark:hover:text-primary-light">
                Privacy
              </a>
              <a href="#" className="text-sm text-surface-600 hover:text-primary dark:text-surface-400 dark:hover:text-primary-light">
                Contact
              </a>
            </div>
          </div>
        </div>
      </footer>

      {/* Toast container for notifications */}
      <ToastContainer 
        position="bottom-right"
        autoClose={4000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme={darkMode ? "dark" : "light"}
      />
    </div>
  );
}

export default App;
import { useState, useContext } from 'react';
import { Outlet, NavLink, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { AnimatePresence, motion } from 'framer-motion';
import { AuthContext } from '../App';
import getIcon from '../utils/iconUtils';

const Layout = () => {
  const { darkMode, toggleDarkMode, logout } = useContext(AuthContext);
  const user = useSelector((state) => state.user.user);
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Icon components
  const MoonIcon = getIcon('Moon');
  const SunIcon = getIcon('Sun');
  const UserIcon = getIcon('User');
  const LogOutIcon = getIcon('LogOut');
  const MenuIcon = getIcon('Menu');
  const XIcon = getIcon('X');
  const HomeIcon = getIcon('Home');
  const LayoutGridIcon = getIcon('LayoutGrid');
  const TrophyIcon = getIcon('Trophy');
  
  // Navigation items
  const navItems = [
    { 
      to: '/dashboard', 
      label: 'Dashboard', 
      icon: HomeIcon 
    },
    { 
      to: '/achievements', 
      label: 'Achievements', 
      icon: TrophyIcon 
    }
  ];
  
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <div className="min-h-screen relative">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white/80 dark:bg-surface-900/80 backdrop-blur-md border-b border-surface-200 dark:border-surface-800">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <NavLink to="/dashboard" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center text-white">
              <span className="font-bold text-lg">BT</span>
            </div>
            <h1 className="text-xl md:text-2xl font-bold text-surface-900 dark:text-white">
              BrainTwist
            </h1>
          </NavLink>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            {navItems.map((item) => (
              <NavLink 
                key={item.to}
                to={item.to}
                className={({ isActive }) => 
                  `flex items-center gap-2 text-sm font-medium px-3 py-2 rounded-lg transition-colors ${
                    isActive 
                      ? 'bg-primary/10 text-primary' 
                      : 'text-surface-600 dark:text-surface-400 hover:bg-surface-100 dark:hover:bg-surface-800'
                  }`
                }
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </NavLink>
            ))}
          </nav>
          
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
            
            <div className="group relative">
              <button className="flex items-center gap-2 p-2 rounded-full bg-surface-100 dark:bg-surface-800 hover:bg-surface-200 dark:hover:bg-surface-700">
                <UserIcon className="w-5 h-5" />
                <span className="hidden md:inline text-sm font-medium">{user?.firstName || 'User'}</span>
              </button>
              
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-surface-800 rounded-lg shadow-lg py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                <button 
                  onClick={logout}
                  className="w-full px-4 py-2 text-left flex items-center gap-2 text-red-600 dark:text-red-400 hover:bg-surface-100 dark:hover:bg-surface-700"
                >
                  <LogOutIcon className="w-4 h-4" />
                  Logout
                </button>
              </div>
            </div>
            
            {/* Mobile menu button */}
            <button 
              className="md:hidden p-2 rounded-full hover:bg-surface-200 dark:hover:bg-surface-700"
              onClick={toggleMobileMenu}
            >
              {isMobileMenuOpen ? <XIcon className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile navigation */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            className="md:hidden fixed inset-0 z-50 bg-white dark:bg-surface-900 p-4 flex flex-col"
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-xl font-bold">Menu</h2>
              <button onClick={toggleMobileMenu}>
                <XIcon className="w-6 h-6" />
              </button>
            </div>
            <nav className="flex flex-col gap-2">
              {navItems.map((item) => (
                <NavLink 
                  key={item.to}
                  to={item.to}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={({ isActive }) => 
                    `flex items-center gap-3 text-lg font-medium px-4 py-3 rounded-lg transition-colors ${
                      isActive 
                        ? 'bg-primary/10 text-primary' 
                        : 'text-surface-600 dark:text-surface-400 hover:bg-surface-100 dark:hover:bg-surface-800'
                    }`
                  }
                >
                  <item.icon className="w-5 h-5" />
                  {item.label}
                </NavLink>
              ))}
              <button 
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  logout();
                }}
                className="flex items-center gap-3 text-lg font-medium px-4 py-3 rounded-lg text-red-600 dark:text-red-400 hover:bg-surface-100 dark:hover:bg-surface-800 mt-4"
              >
                <LogOutIcon className="w-5 h-5" />
                Logout
              </button>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main content */}
      <main className="container mx-auto px-4 py-8">
        <Outlet />
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
    </div>
  );
};

export default Layout;
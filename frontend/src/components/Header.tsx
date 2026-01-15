import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Shield, User, LogOut } from 'lucide-react';
import clsx from 'clsx';
import { useAuth } from '../context/AuthContext';

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { state, logout } = useAuth();

  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'About Us', path: '/about' },
    { name: 'Events', path: '/events' },
    { name: 'Blogs', path: '/blogs' },
    { name: 'Services', path: '/services' },
    { name: 'Gallery', path: '/gallery' },
    { name: 'Contact', path: '/contact' },
  ];

  // Add forums to nav if user is authenticated
  if (state.isAuthenticated) {
    navItems.splice(3, 0, { name: 'Forums', path: '/forums' });
  }

  return (
    <header className="bg-primary text-white sticky top-0 z-50 shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <Shield className="h-8 w-8 text-secondary" />
            <div className="flex flex-col">
              <span className="text-xl font-bold tracking-wider">ACSP</span>
              <span className="text-xs text-gray-300 hidden md:block">Association of Cybersecurity Practitioners</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex space-x-6">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={clsx(
                  'font-medium hover:text-secondary transition-colors',
                  location.pathname === item.path ? 'text-secondary' : ''
                )}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Desktop Auth Buttons */}
          <div className="hidden lg:flex items-center space-x-4">
            {state.loading ? (
              <div className="h-8 w-8 rounded-full bg-gray-300 animate-pulse"></div>
            ) : state.isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <Link 
                  to="/dashboard" 
                  className="flex items-center space-x-1 text-sm font-medium hover:text-secondary"
                >
                  <User className="h-5 w-5" />
                  <span>{state.user?.name || 'Dashboard'}</span>
                </Link>
                <button 
                  onClick={logout}
                  className="flex items-center space-x-1 text-sm font-medium hover:text-secondary"
                >
                  <LogOut className="h-5 w-5" />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <>
                <Link 
                  to="/login" 
                  className="px-4 py-2 text-sm font-medium hover:text-secondary transition-colors"
                >
                  Login
                </Link>
                <Link 
                  to="/register" 
                  className="bg-secondary hover:bg-secondary-light text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Register
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button 
            className="lg:hidden text-white focus:outline-none"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="lg:hidden py-4">
            <nav className="flex flex-col space-y-3">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={clsx(
                    'text-sm font-medium transition-colors hover:text-secondary',
                    location.pathname === item.path ? 'text-secondary' : ''
                  )}
                  onClick={() => setIsOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              <div className="pt-4 border-t border-gray-700 space-y-3">
                {state.loading ? (
                  <div className="h-8 w-1/2 rounded bg-gray-700 animate-pulse"></div>
                ) : state.isAuthenticated ? (
                  <>
                    <Link 
                      to="/dashboard" 
                      className="block text-sm font-medium hover:text-secondary"
                      onClick={() => setIsOpen(false)}
                    >
                      Dashboard
                    </Link>
                    <button 
                      onClick={() => {
                        logout();
                        setIsOpen(false);
                      }}
                      className="block text-sm font-medium hover:text-secondary w-full text-left"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <Link 
                      to="/login" 
                      className="block text-sm font-medium hover:text-secondary"
                      onClick={() => setIsOpen(false)}
                    >
                      Login
                    </Link>
                    <Link 
                      to="/register" 
                      className="block text-sm font-medium hover:text-secondary"
                      onClick={() => setIsOpen(false)}
                    >
                      Register
                    </Link>
                  </>
                )}
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
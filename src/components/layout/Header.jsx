// src/components/layout/Header.jsx
import { useState } from 'react';
import { NAV_ITEMS } from '../../utils/constants';
import ImportExportModal from '../common/ImportExportModal';

const Header = ({ currentPage, onPageChange }) => {
  const [isImportExportModalOpen, setIsImportExportModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(prev => !prev);
  };

  return (
    <>
      <header className="bg-gray-800 border-b border-gray-700 px-4 py-3 lg:px-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-8">
            {/* Logo and title */}
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">📦</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">PoE Sales Tracker</h1>
                <p className="text-sm text-gray-400 hidden sm:block">Path of Exile Item Sales</p>
              </div>
            </div>

            {/* Navigation Menu */}
            <nav className="hidden md:flex space-x-1">
              {NAV_ITEMS.map((item) => {
                const isActive = currentPage === item.path;
                return (
                  <button
                    key={item.id}
                    onClick={() => onPageChange(item.path)}
                    className={`
                      flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors
                      ${isActive 
                        ? 'bg-orange-600 text-white' 
                        : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                      }
                    `}
                  >
                    <span className="mr-2">{item.icon}</span>
                    {item.name}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Right side actions */}
          <div className="flex items-center space-x-3">
            {/* Import/Export Button (Desktop) */}
            <button 
              onClick={() => setIsImportExportModalOpen(true)}
              className="hidden md:flex items-center px-3 py-2 text-sm font-medium text-gray-300 rounded-md hover:bg-gray-700 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <span className="mr-2">📦</span>
              Import/Export
            </button>

            {/* Settings button */}
            <button className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </button>

            {/* Mobile menu button */}
            <div className="md:hidden relative">
              <button 
                onClick={toggleMobileMenu}
                className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>

              {/* Mobile dropdown menu */}
              {isMobileMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-gray-800 border border-gray-700 rounded-lg shadow-lg z-50">
                  <div className="py-1">
                    {NAV_ITEMS.map((item) => {
                      const isActive = currentPage === item.path;
                      return (
                        <button
                          key={item.id}
                          onClick={() => {
                            onPageChange(item.path);
                            setIsMobileMenuOpen(false);
                          }}
                          className={`
                            w-full flex items-center px-4 py-2 text-sm transition-colors text-left
                            ${isActive 
                              ? 'bg-orange-600 text-white' 
                              : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                            }
                          `}
                        >
                          <span className="mr-3">{item.icon}</span>
                          {item.name}
                        </button>
                      );
                    })}
                    <hr className="my-1 border-gray-700" />
                    <button
                      onClick={() => {
                        setIsImportExportModalOpen(true);
                        setIsMobileMenuOpen(false);
                      }}
                      className="w-full flex items-center px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white transition-colors text-left"
                    >
                      <span className="mr-3">📦</span>
                      Import/Export
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Import/Export Modal */}
      <ImportExportModal
        isOpen={isImportExportModalOpen}
        onClose={() => setIsImportExportModalOpen(false)}
      />

      {/* Mobile menu backdrop */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 z-40 md:hidden" 
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </>
  );
};

export default Header;
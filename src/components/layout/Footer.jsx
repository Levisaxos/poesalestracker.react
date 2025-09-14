import { useState } from 'react';
import AboutModal from '../common/AboutModal';

const Footer = () => {
  const [isAboutModalOpen, setIsAboutModalOpen] = useState(false);

  return (
    <>
      <footer className="bg-gray-800 border-t border-gray-700 px-4 py-8 lg:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Creator Section */}
            <div>
              <h3 className="text-sm font-semibold text-white mb-4">Creator</h3>
              <div className="space-y-2 text-sm text-gray-400">
                <p>Created by Levisaxos</p>
                <div className="flex flex-col space-y-1">
                  <a 
                    href="https://github.com/Levisaxos/poesalestracker.react" 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center hover:text-white transition-colors"
                  >
                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z" clipRule="evenodd" />
                    </svg>
                    View Repository
                  </a>
                  <a 
                    href="https://github.com/Levisaxos" 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center hover:text-white transition-colors"
                  >
                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                    </svg>
                    GitHub Profile
                  </a>
                </div>
                <p className="text-xs pt-2">Built with assistance from Claude AI</p>
              </div>
            </div>
        
            {/* Legal Section */}
            <div>
              <h3 className="text-sm font-semibold text-white mb-4">Legal</h3>
              <div className="space-y-2 text-sm text-gray-400">
                <div className="flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  MIT License
                </div>
                <p className="text-xs">
                  This tool is not affiliated with or endorsed by Grinding Gear Games.
                </p>
                <p className="text-xs">
                  Path of Exile is a trademark of Grinding Gear Games.
                </p>
                   <p className="text-xs">
            No user data is collected or stored by this application.
            </p>
              </div>
            </div>            
          </div>

          {/* Bottom Section */}
          <div className="border-t border-gray-700 mt-8 pt-6">
            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
              <div className="text-sm text-gray-400">
                <p>&copy; 2025 Levisaxos. This project is open source under the MIT License.</p>
              </div>
              
              <div className="flex items-center space-x-6 text-sm text-gray-400">
                <button 
                  onClick={() => setIsAboutModalOpen(true)}
                  className="hover:text-white transition-colors"
                >
                  About
                </button>
                <a 
                  href="https://github.com/Levisaxos/poesalestracker.react/issues" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors"
                >               
                  GitHub
                </a>
              </div>
            </div>

           
          </div>
        </div>
      </footer>

      {/* About Modal */}
      <AboutModal 
        isOpen={isAboutModalOpen} 
        onClose={() => setIsAboutModalOpen(false)} 
      />
    </>
  );
};

export default Footer;
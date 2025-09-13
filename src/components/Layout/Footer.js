import React from 'react';
import { Github, ExternalLink, Users } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-slate-900/95 backdrop-blur-sm border-t border-slate-700/50 mt-12">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Creator Section */}
          <div>
            <h3 className="text-white font-semibold mb-3">Creator</h3>
            <div className="space-y-2 text-sm">
              <p className="text-slate-400">Created by YourUsername</p>
              <div className="flex items-center gap-2">
                <Github size={14} className="text-slate-400" />
                <a 
                  href="https://github.com/yourusername/poe-sales-tracker" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:text-blue-300 transition-colors flex items-center gap-1"
                >
                  View Repository
                  <ExternalLink size={12} />
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Github size={14} className="text-slate-400" />
                <a 
                  href="https://github.com/yourusername" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:text-blue-300 transition-colors flex items-center gap-1"
                >
                  GitHub Profile
                  <ExternalLink size={12} />
                </a>
              </div>
              <p className="text-slate-500 text-xs mt-3">
                Built with assistance from Claude AI
              </p>
            </div>
          </div>

          {/* Source Section */}
          <div>
            <h3 className="text-white font-semibold mb-3">Source</h3>
            <div className="space-y-2 text-sm">
              <p className="text-slate-400">Based on comprehensive guides from:</p>
              <a 
                href="https://www.poewiki.net/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-400 hover:text-blue-300 transition-colors flex items-center gap-1"
              >
                PoE Wiki
                <ExternalLink size={12} />
              </a>
              <a 
                href="https://poe.ninja/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-400 hover:text-blue-300 transition-colors flex items-center gap-1"
              >
                poe.ninja
                <ExternalLink size={12} />
              </a>
              <a 
                href="https://www.pathofexile.com/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-400 hover:text-blue-300 transition-colors flex items-center gap-1"
              >
                Path of Exile Official
                <ExternalLink size={12} />
              </a>
            </div>
          </div>

          {/* Legal Section */}
          <div>
            <h3 className="text-white font-semibold mb-3">Legal</h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                <span className="text-slate-300">MIT License</span>
              </div>
              <div className="space-y-1 text-xs text-slate-500">
                <p>This tool is not affiliated with or endorsed by</p>
                <p>Grinding Gear Games.</p>
                <p>Path of Exile is a trademark of Grinding Gear Games.</p>
              </div>
              <div className="flex items-center gap-2 mt-4">
                <Users size={14} className="text-slate-400" />
                <span className="text-slate-400 text-xs">Community built</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-slate-700/50 mt-6 pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-slate-500 text-sm">
            © 2025 PoE Sales Tracker. This project is open source under the MIT License.
          </p>
          <p className="text-slate-600 text-xs">
            No user data is collected or stored by this application.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
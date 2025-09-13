import React from 'react';
import { Home, Package, TrendingUp, Plus, Settings } from 'lucide-react';

const Header = ({ currentPage, onNavigate }) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'active', label: 'Active Items', icon: Package },
    { id: 'sold', label: 'Sold Items', icon: TrendingUp },
    { id: 'create', label: 'Add Item', icon: Plus },
  ];

  return (
    <header className="bg-slate-900/90 backdrop-blur-sm border-b border-slate-700/50">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-600 rounded-lg">
              <Package size={24} className="text-white" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-white">PoE Sales Tracker</h1>
              <p className="text-sm text-slate-400">Path of Exile Item Sales</p>
            </div>
          </div>
          
          <nav className="flex items-center gap-2">
            {navItems.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => onNavigate(id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors font-medium ${
                  currentPage === id
                    ? 'bg-amber-600 text-white'
                    : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
                }`}
              >
                <Icon size={18} />
                <span className="hidden md:inline">{label}</span>
              </button>
            ))}
            
            <div className="w-px h-6 bg-slate-700 mx-2" />
            
            <button className="p-2 text-slate-400 hover:text-white hover:bg-slate-700/50 rounded-lg transition-colors">
              <Settings size={20} />
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
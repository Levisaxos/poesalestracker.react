import { NAV_ITEMS } from '../../utils/constants';

const Navigation = ({ currentPage, onPageChange, isMobileOpen, onMobileClose }) => {
  const handleNavClick = (path) => {
    onPageChange(path);
    onMobileClose(); // Close mobile menu when navigating
  };

  return (
    <>
      {/* Mobile backdrop */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onMobileClose}
        />
      )}
      
      {/* Sidebar */}
      <nav className={`
        fixed top-0 left-0 z-50 w-64 h-full bg-gray-800 border-r border-gray-700 transform transition-transform duration-200 ease-in-out lg:translate-x-0 lg:static lg:inset-0
        ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex flex-col h-full">
          {/* Mobile header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-700 lg:hidden">
            <span className="text-lg font-semibold text-white">Menu</span>
            <button
              onClick={onMobileClose}
              className="p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Navigation items */}
          <div className="flex-1 px-3 py-4 space-y-1">
            {NAV_ITEMS.map((item) => {
              const isActive = currentPage === item.path;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.path)}
                  className={`
                    w-full flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors
                    ${isActive 
                      ? 'bg-orange-600 text-white' 
                      : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                    }
                  `}
                >
                  <span className="mr-3 text-lg">{item.icon}</span>
                  {item.name}
                </button>
              );
            })}
          </div>

          {/* Bottom actions */}
          <div className="border-t border-gray-700 p-3 space-y-1">
            <button className="w-full flex items-center px-3 py-2 text-sm font-medium text-gray-300 rounded-md hover:bg-gray-700 hover:text-white transition-colors">
              <span className="mr-3 text-lg">📤</span>
              Import/Export
            </button>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navigation;
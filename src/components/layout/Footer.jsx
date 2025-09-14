const Footer = () => {
  return (
    <footer className="bg-gray-800 border-t border-gray-700 px-4 py-6 lg:px-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="text-sm text-gray-400">
            <p>&copy; 2025 PoE Sales Tracker. Built for Path of Exile 2.</p>
          </div>
          
          <div className="flex items-center space-x-6 text-sm text-gray-400">
            <a 
              href="#" 
              className="hover:text-white transition-colors"
            >
              About
            </a>
            <a 
              href="#" 
              className="hover:text-white transition-colors"
            >
              Support
            </a>
            <a 
              href="#" 
              className="hover:text-white transition-colors"
            >
              GitHub
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
import Header from './Header';
import Footer from './Footer';

const Layout = ({ children, currentPage, onPageChange }) => {
  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 flex flex-col">
      <Header currentPage={currentPage} onPageChange={onPageChange} />
      
      <main className="flex-1 p-4 lg:p-6">
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Layout;
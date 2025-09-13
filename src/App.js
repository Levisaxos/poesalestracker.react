import React, { useState } from 'react';
import Header from './components/Layout/Header';
import Footer from './components/Layout/Footer';
import Dashboard from './components/Pages/Dashboard';
import ActiveItems from './components/Pages/ActiveItems';
import SoldItems from './components/Pages/SoldItems';
import CreateItem from './components/Pages/CreateItem';

const App = () => {
  const [currentPage, setCurrentPage] = useState('dashboard');

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard onNavigate={setCurrentPage} />;
      case 'active':
        return <ActiveItems onNavigate={setCurrentPage} />;
      case 'sold':
        return <SoldItems onNavigate={setCurrentPage} />;
      case 'create':
        return <CreateItem onNavigate={setCurrentPage} />;
      default:
        return <Dashboard onNavigate={setCurrentPage} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex flex-col">
      <Header currentPage={currentPage} onNavigate={setCurrentPage} />
      <main className="flex-1 max-w-7xl mx-auto px-6 py-6 w-full">
        {renderPage()}
      </main>
      <Footer />
    </div>
  );
};

export default App;
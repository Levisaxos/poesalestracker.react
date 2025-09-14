import { useState } from 'react';
import Layout from './components/layout/Layout';
import Dashboard from './pages/Dashboard';
import ActiveItems from './pages/ActiveItems';
import SoldItems from './pages/SoldItems';
import { ItemsProvider } from './context/ItemsContext';
import { ToastProvider } from './context/ToastContext';
import { ROUTES } from './utils/constants';

function App() {
  document.title = 'Poe Sales Tracker';
  const [currentPage, setCurrentPage] = useState(ROUTES.DASHBOARD);

  const renderPage = () => {
    switch (currentPage) {
      case ROUTES?.DASHBOARD || '/':
        return <Dashboard />;
      case ROUTES?.ACTIVE_ITEMS || '/active':
        return <ActiveItems />;
      case ROUTES?.SOLD_ITEMS || '/sold':
        return <SoldItems />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <ToastProvider>
      <ItemsProvider>
        <Layout currentPage={currentPage} onPageChange={setCurrentPage}>
          {renderPage()}
        </Layout>
      </ItemsProvider>
    </ToastProvider>
  );
}

export default App;
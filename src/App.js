import { useState } from 'react';
import Layout from './components/layout/Layout';
import Dashboard from './pages/Dashboard';
import ActiveItems from './pages/ActiveItems';
import SoldItems from './pages/SoldItems';
import { ROUTES } from './utils/constants';

function App() {
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
    <Layout currentPage={currentPage} onPageChange={setCurrentPage}>
      {renderPage()}
    </Layout>
  );
}

export default App;
// src/pages/Dashboard.jsx
import { useState } from 'react';
import ItemTooltip from '../components/items/ItemTooltip';
import AddItemModal from '../components/items/AddItemModal';
import ImportExportModal from '../components/common/ImportExportModal';
import Button from '../components/common/Button';
import { useItems } from '../context/ItemsContext';

const Dashboard = () => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isImportExportModalOpen, setIsImportExportModalOpen] = useState(false);
  const { activeItems, soldItems, totalActiveValue, totalRevenue } = useItems();

  const recentItems = activeItems.slice(0, 5); // Show last 5 items

  const stats = {
    totalActiveItems: activeItems.length,
    totalSoldItems: soldItems.length,
    totalValue: Math.round(totalActiveValue),
    recentSales: soldItems.filter(item => {
      if (!item.dateSold) return false;
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return new Date(item.dateSold) > weekAgo;
    }).length
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Dashboard</h1>
          <p className="text-gray-400">Overview of your PoE2 sales activity</p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="secondary" 
            onClick={() => setIsImportExportModalOpen(true)}
          >
            📦 Import/Export
          </Button>
          <Button onClick={() => setIsAddModalOpen(true)}>
            + Add Item
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Active Items</p>
              <p className="text-2xl font-bold text-white">{stats.totalActiveItems}</p>
            </div>
            <div className="w-8 h-8 bg-orange-600 rounded-full flex items-center justify-center">
              <span className="text-white text-sm">🔥</span>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Sold Items</p>
              <p className="text-2xl font-bold text-white">{stats.totalSoldItems}</p>
            </div>
            <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
              <span className="text-white text-sm">✅</span>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Total Value</p>
              <p className="text-2xl font-bold text-white">{stats.totalValue.toLocaleString()}</p>
              <p className="text-xs text-gray-500">Chaos Orbs</p>
            </div>
            <div className="w-8 h-8 bg-yellow-600 rounded-full flex items-center justify-center">
              <span className="text-white text-sm">💰</span>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Recent Sales</p>
              <p className="text-2xl font-bold text-white">{stats.recentSales}</p>
              <p className="text-xs text-gray-500">Last 7 days</p>
            </div>
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
              <span className="text-white text-sm">📈</span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <h2 className="text-lg font-semibold text-white mb-4">Recent Items</h2>
          {recentItems.length > 0 ? (
            <div className="space-y-4">
              {recentItems.map((item) => (
                <div key={item.id} className="group cursor-pointer relative">
                  <div className="flex items-center justify-between p-3 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors">
                    <div className="flex-1">
                      <p className="text-white font-medium">{item.name}</p>
                      <p className="text-sm text-gray-400">{item.baseType}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-yellow-400 font-bold">
                        {item.price?.amount} {item.price?.currency?.charAt(0).toUpperCase()}
                      </p>
                      <p className="text-xs text-gray-500">Active</p>
                    </div>
                  </div>
                  
                  {/* Tooltip on hover */}
                  <div className="absolute left-full top-0 ml-2 opacity-0 group-hover:opacity-100 transition-opacity z-10 pointer-events-none">
                    <ItemTooltip item={item} showPrice={true} />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-400 mb-4">No items yet</p>
              <Button onClick={() => setIsAddModalOpen(true)}>
                Add Your First Item
              </Button>
            </div>
          )}
        </div>

        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <h2 className="text-lg font-semibold text-white mb-4">Quick Actions</h2>
          <div className="space-y-3">
            <button 
              onClick={() => setIsAddModalOpen(true)}
              className="w-full flex items-center justify-between p-3 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors text-left"
            >
              <span className="text-white">Add New Item</span>
              <span className="text-gray-400">+</span>
            </button>
            <button 
              onClick={() => setIsImportExportModalOpen(true)}
              className="w-full flex items-center justify-between p-3 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors text-left"
            >
              <span className="text-white">Import/Export Data</span>
              <span className="text-gray-400">📦</span>
            </button>
            <button className="w-full flex items-center justify-between p-3 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors text-left">
              <span className="text-white">View Statistics</span>
              <span className="text-gray-400">📊</span>
            </button>
          </div>
        </div>
      </div>

      {/* Modals */}
      <AddItemModal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)} 
      />
      
      <ImportExportModal
        isOpen={isImportExportModalOpen}
        onClose={() => setIsImportExportModalOpen(false)}
      />
    </div>
  );
};

export default Dashboard;
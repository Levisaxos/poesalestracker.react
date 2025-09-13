import React, { useState } from 'react';
import { usePoEItems } from '../../hooks/useLocalStorage';
import ItemCard from '../Common/ItemCard';
import { Package, Plus, Search, Filter } from 'lucide-react';

const ActiveItems = () => {
  const { getActiveItems } = usePoEItems();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  
  const activeItems = getActiveItems();
  
  const filteredItems = activeItems
    .filter(item => 
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.createdAt) - new Date(a.createdAt);
        case 'oldest':
          return new Date(a.createdAt) - new Date(b.createdAt);
        case 'price-high':
          return b.expectedPrice - a.expectedPrice;
        case 'price-low':
          return a.expectedPrice - b.expectedPrice;
        case 'name':
          return a.name.localeCompare(b.name);
        default:
          return 0;
      }
    });

  const totalValue = activeItems.reduce((sum, item) => sum + item.expectedPrice, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700/50 p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Active Items</h1>
            <p className="text-slate-300">
              {activeItems.length} items listed • {totalValue.toFixed(1)}♦ total value
            </p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg transition-colors font-medium">
            <Plus size={18} />
            Add Item
          </button>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700/50 p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search size={18} className="absolute left-3 top-3 text-slate-400" />
            <input
              type="text"
              placeholder="Search items by name or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none transition-colors"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter size={18} className="text-slate-400" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none transition-colors"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="price-high">Price: High to Low</option>
              <option value="price-low">Price: Low to High</option>
              <option value="name">Name A-Z</option>
            </select>
          </div>
        </div>
      </div>

      {/* Items Grid */}
      {filteredItems.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map(item => (
            <ItemCard key={item.id} item={item} showActions={true} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700/50">
          <Package size={72} className="mx-auto text-slate-600 mb-6" />
          <h3 className="text-2xl font-semibold text-white mb-3">
            {searchTerm ? 'No items found' : 'No active items'}
          </h3>
          <p className="text-slate-400 text-lg mb-6">
            {searchTerm 
              ? 'Try adjusting your search terms' 
              : 'Start by adding your first item for sale'
            }
          </p>
          {!searchTerm && (
            <button className="px-6 py-3 bg-amber-600 hover:bg-amber-700 text-white rounded-lg transition-colors font-medium">
              <Plus size={20} className="inline mr-2" />
              Add Your First Item
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default ActiveItems;
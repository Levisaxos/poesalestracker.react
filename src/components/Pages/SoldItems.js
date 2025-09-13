import React, { useState } from 'react';
import { usePoEItems } from '../../hooks/useLocalStorage';
import ItemCard from '../Common/ItemCard';
import { TrendingUp, Search, Filter, Download } from 'lucide-react';

const SoldItems = () => {
  const { getSoldItems, getStats } = usePoEItems();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  
  const soldItems = getSoldItems();
  const stats = getStats();
  
  const filteredItems = soldItems
    .filter(item => 
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.soldAt) - new Date(a.soldAt);
        case 'oldest':
          return new Date(a.soldAt) - new Date(b.soldAt);
        case 'profit-high':
          return (b.actualPrice - b.expectedPrice) - (a.actualPrice - a.expectedPrice);
        case 'profit-low':
          return (a.actualPrice - a.expectedPrice) - (b.actualPrice - b.expectedPrice);
        case 'revenue-high':
          return b.actualPrice - a.actualPrice;
        case 'revenue-low':
          return a.actualPrice - b.actualPrice;
        default:
          return 0;
      }
    });

  const exportSalesData = () => {
    const exportData = soldItems.map(item => ({
      name: item.name,
      expectedPrice: item.expectedPrice,
      actualPrice: item.actualPrice,
      profit: item.actualPrice - item.expectedPrice,
      soldDate: new Date(item.soldAt).toLocaleDateString(),
      createdDate: new Date(item.createdAt).toLocaleDateString(),
      daysToSell: Math.ceil((new Date(item.soldAt) - new Date(item.createdAt)) / (1000 * 60 * 60 * 24))
    }));

    const csvContent = [
      'Item Name,Expected Price,Actual Price,Profit,Sold Date,Listed Date,Days to Sell',
      ...exportData.map(row => 
        `"${row.name}",${row.expectedPrice},${row.actualPrice},${row.profit},"${row.soldDate}","${row.createdDate}",${row.daysToSell}`
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `poe-sales-export-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const StatCard = ({ title, value, subtitle, color = "text-white" }) => (
    <div className="bg-slate-700/30 rounded-lg p-4">
      <h3 className="text-slate-400 text-sm font-medium mb-1">{title}</h3>
      <div className={`text-2xl font-bold ${color} mb-1`}>{value}</div>
      {subtitle && <p className="text-slate-500 text-sm">{subtitle}</p>}
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header with Stats */}
      <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700/50 p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Sold Items</h1>
            <p className="text-slate-300">
              {soldItems.length} items sold • Sales performance overview
            </p>
          </div>
          <button
            onClick={exportSalesData}
            disabled={soldItems.length === 0}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-slate-600 disabled:cursor-not-allowed text-white rounded-lg transition-colors font-medium"
          >
            <Download size={18} />
            Export CSV
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard
            title="Total Revenue"
            value={`${stats.totalRevenue.toFixed(1)}♦`}
            subtitle="Divine Orbs earned"
            color="text-green-400"
          />
          <StatCard
            title="Total Profit"
            value={`${stats.totalProfit.toFixed(1)}♦`}
            subtitle="Above expected price"
            color={stats.totalProfit >= 0 ? "text-green-400" : "text-red-400"}
          />
          <StatCard
            title="Average Profit"
            value={`${stats.averageProfit.toFixed(1)}♦`}
            subtitle="Per item sold"
            color={stats.averageProfit >= 0 ? "text-green-400" : "text-red-400"}
          />
          <StatCard
            title="Success Rate"
            value={`${soldItems.length > 0 ? ((soldItems.filter(item => item.actualPrice >= item.expectedPrice).length / soldItems.length) * 100).toFixed(0) : 0}%`}
            subtitle="Met or exceeded expected"
            color="text-blue-400"
          />
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700/50 p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search size={18} className="absolute left-3 top-3 text-slate-400" />
            <input
              type="text"
              placeholder="Search sold items..."
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
              <option value="newest">Recently Sold</option>
              <option value="oldest">Oldest Sales</option>
              <option value="profit-high">Highest Profit</option>
              <option value="profit-low">Lowest Profit</option>
              <option value="revenue-high">Highest Revenue</option>
              <option value="revenue-low">Lowest Revenue</option>
            </select>
          </div>
        </div>
      </div>

      {/* Items Grid */}
      {filteredItems.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map(item => (
            <ItemCard key={item.id} item={item} showProfit={true} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700/50">
          <TrendingUp size={72} className="mx-auto text-slate-600 mb-6" />
          <h3 className="text-2xl font-semibold text-white mb-3">
            {searchTerm ? 'No sales found' : 'No sales yet'}
          </h3>
          <p className="text-slate-400 text-lg">
            {searchTerm 
              ? 'Try adjusting your search terms' 
              : 'Start selling items to see your sales history here'
            }
          </p>
        </div>
      )}
    </div>
  );
};

export default SoldItems;
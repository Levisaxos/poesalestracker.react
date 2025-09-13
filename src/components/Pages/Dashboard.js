import React from 'react';
import { usePoEItems } from '../../hooks/useLocalStorage';
import { getCurrencyDisplay } from '../Common/CurrencySelector';
import { getCurrency } from '../../constants/currencies';
import { Package, TrendingUp, Plus, DollarSign, Target } from 'lucide-react';

const Dashboard = ({ onNavigate }) => {
  const { getStats, getActiveItems, getSoldItems } = usePoEItems();
  const stats = getStats();
  const recentActive = getActiveItems().slice(0, 3);
  const recentSold = getSoldItems().slice(0, 3);

  const StatCard = ({ title, value, icon: Icon, color, subtitle, onClick }) => (
    <div 
      className={`bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700/50 p-6 hover:bg-slate-800/70 transition-all duration-200 ${onClick ? 'cursor-pointer' : ''}`}
      onClick={onClick}
    >
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 ${color} rounded-lg`}>
          <Icon size={24} className="text-white" />
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-white">{value}</div>
          {subtitle && <div className="text-sm text-slate-400">{subtitle}</div>}
        </div>
      </div>
      <h3 className="text-slate-300 font-medium">{title}</h3>
    </div>
  );

  const ItemPreview = ({ item, showProfit = false }) => (
    <div className="flex items-center gap-3 p-3 bg-slate-700/30 rounded-lg">
      <div className="flex-1 min-w-0">
        <h4 className="text-white font-medium truncate">{item.name}</h4>
        <p className="text-sm text-slate-400 truncate">
          {item.description?.split('\n')[0] || 'No description'}
        </p>
      </div>
      <div className="text-right">
        <div className="font-medium">
          {getCurrencyDisplay(item.currency || 'divine', item.expectedPrice)}
        </div>
        {showProfit && item.actualPrice && (
          <div className={`text-sm flex items-center gap-1 ${
            (item.actualPrice - item.expectedPrice) >= 0 ? 'text-green-400' : 'text-red-400'
          }`}>
            {item.actualPrice >= item.expectedPrice ? '+' : ''}
            {(item.actualPrice - item.expectedPrice).toFixed(1)}
            <img 
              src={getCurrency(item.actualCurrency || item.currency || 'divine').image}
              alt="currency"
              style={{ width: '14px', height: '14px' }}
              className="inline-block"
            />
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700/50 p-6">
        <h1 className="text-3xl font-bold text-white mb-2">Welcome to PoE Sales Tracker</h1>
        <p className="text-slate-300 mb-6">
          Track your Path of Exile item sales, monitor profits, and manage your trading business.
        </p>
        <button
          onClick={() => onNavigate('create')}
          className="flex items-center gap-2 px-6 py-3 bg-amber-600 hover:bg-amber-700 text-white rounded-lg transition-colors font-medium"
        >
          <Plus size={20} />
          Add Your First Item
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Active Items"
          value={stats.activeCount}
          icon={Package}
          color="bg-blue-600"
          subtitle="Listed for sale"
          onClick={() => onNavigate('active')}
        />
        <StatCard
          title="Sold Items"
          value={stats.soldCount}
          icon={TrendingUp}
          color="bg-green-600"
          subtitle="Completed sales"
          onClick={() => onNavigate('sold')}
        />
        <StatCard
          title="Total Profit"
          value={`${stats.totalProfit.toFixed(1)}♦`}
          icon={DollarSign}
          color="bg-emerald-600"
          subtitle="Divine Orbs earned"
        />
        <StatCard
          title="Average Profit"
          value={`${stats.averageProfit.toFixed(1)}♦`}
          icon={Target}
          color="bg-purple-600"
          subtitle="Per item sold"
        />
      </div>

      {/* Recent Items */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Active Items */}
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700/50 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-white">Recent Active Items</h2>
            <button
              onClick={() => onNavigate('active')}
              className="text-blue-400 hover:text-blue-300 text-sm font-medium"
            >
              View All
            </button>
          </div>
          <div className="space-y-3">
            {recentActive.length > 0 ? (
              recentActive.map(item => (
                <ItemPreview key={item.id} item={item} />
              ))
            ) : (
              <p className="text-slate-400 text-center py-8">No active items yet</p>
            )}
          </div>
        </div>

        {/* Recent Sold Items */}
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700/50 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-white">Recent Sales</h2>
            <button
              onClick={() => onNavigate('sold')}
              className="text-green-400 hover:text-green-300 text-sm font-medium"
            >
              View All
            </button>
          </div>
          <div className="space-y-3">
            {recentSold.length > 0 ? (
              recentSold.map(item => (
                <ItemPreview key={item.id} item={item} showProfit={true} />
              ))
            ) : (
              <p className="text-slate-400 text-center py-8">No sales yet</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
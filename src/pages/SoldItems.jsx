import { useState } from 'react';
import ItemTooltip from '../components/items/ItemTooltip';
import SearchBar from '../components/common/SearchBar';
import PriceHistoryModal from '../components/items/PriceHistoryModal';
import ConfirmationModal from '../components/common/ConfirmationModal';
import { useItems } from '../context/ItemsContext';
import { useToast } from '../context/ToastContext';

const SoldItems = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('recently-sold');
  const [priceHistoryModal, setPriceHistoryModal] = useState({ isOpen: false, item: null });
  const [confirmModal, setConfirmModal] = useState({ isOpen: false, itemId: null, itemName: '' });

  const { soldItems, deleteItem, totalRevenue } = useItems();
  const { showSuccess, showError } = useToast();

  // Filter items based on search
  const filteredItems = soldItems.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.baseType.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.properties.some(prop => prop.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Sort items
  const sortedItems = [...filteredItems].sort((a, b) => {
    switch (sortBy) {
      case 'recently-sold':
        return new Date(b.dateSold || b.dateAdded) - new Date(a.dateSold || a.dateAdded);
      case 'oldest-sold':
        return new Date(a.dateSold || a.dateAdded) - new Date(b.dateSold || b.dateAdded);
      case 'price-high':
        return (b.price?.amount || 0) - (a.price?.amount || 0);
      case 'price-low':
        return (a.price?.amount || 0) - (b.price?.amount || 0);
      case 'fastest-sale':
        const aDays = getDaysListed(a.dateAdded, a.dateSold);
        const bDays = getDaysListed(b.dateAdded, b.dateSold);
        return aDays - bDays;
      default:
        return 0;
    }
  });

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getDaysListed = (dateAdded, dateSold) => {
    const added = new Date(dateAdded);
    const sold = new Date(dateSold || new Date());
    const diffTime = Math.abs(sold - added);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const handleViewPriceHistory = (item) => {
    setPriceHistoryModal({ isOpen: true, item });
  };

  const handleDelete = (item) => {
    setConfirmModal({
      isOpen: true,
      itemId: item.id,
      itemName: item.name
    });
  };

  const handleConfirmDelete = () => {
    try {
      deleteItem(confirmModal.itemId);
      showSuccess(`${confirmModal.itemName} deleted from sold items!`);
    } catch (error) {
      showError('Failed to delete item. Please try again.');
    }
    
    setConfirmModal({ isOpen: false, itemId: null, itemName: '' });
  };

  const averageSalePrice = soldItems.length > 0 ? Math.round(totalRevenue / soldItems.length) : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Sold Items</h1>
          <p className="text-gray-400">
            {sortedItems.length} items sold • {Math.round(totalRevenue).toLocaleString()} total revenue
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
          <div className="text-center">
            <p className="text-2xl font-bold text-green-400">{soldItems.length}</p>
            <p className="text-sm text-gray-400">Items Sold</p>
          </div>
        </div>
        <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
          <div className="text-center">
            <p className="text-2xl font-bold text-yellow-400">{Math.round(totalRevenue).toLocaleString()}</p>
            <p className="text-sm text-gray-400">Total Revenue (Chaos)</p>
          </div>
        </div>
        <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
          <div className="text-center">
            <p className="text-2xl font-bold text-blue-400">
              {averageSalePrice.toLocaleString()}
            </p>
            <p className="text-sm text-gray-400">Average Sale Price</p>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <SearchBar 
            value={searchTerm}
            onChange={setSearchTerm}
            placeholder="Search sold items..."
          />
        </div>
        <select 
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
        >
          <option value="recently-sold">Recently Sold</option>
          <option value="oldest-sold">Oldest Sold</option>
          <option value="price-high">Price: High to Low</option>
          <option value="price-low">Price: Low to High</option>
          <option value="fastest-sale">Fastest Sale</option>
        </select>
      </div>

      {/* Sold Items List */}
      <div className="space-y-4">
        {sortedItems.map((item) => (
          <div key={item.id} className="bg-gray-800 rounded-lg p-4 border border-gray-700">
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Item Tooltip */}
              <div className="lg:w-1/3">
                <ItemTooltip item={item} showPrice={true} className="w-full" />
              </div>
              
              {/* Sale Information */}
              <div className="lg:w-2/3 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm text-gray-400">Sale Price</p>
                    <p className="text-lg font-bold text-green-400">
                      {item.price?.amount} {item.price?.currency?.toUpperCase()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Date Sold</p>
                    <p className="text-white">
                      {item.dateSold ? formatDate(item.dateSold) : 'Recently'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Days Listed</p>
                    <p className="text-white">{getDaysListed(item.dateAdded, item.dateSold)} days</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-400">Date Added</p>
                    <p className="text-gray-300">{formatDate(item.dateAdded)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Item Level</p>
                    <p className="text-gray-300">{item.itemLevel || 'Unknown'}</p>
                  </div>
                </div>

                {/* Price History Indicator */}
                {item.priceHistory && item.priceHistory.length > 1 && (
                  <div className="bg-blue-900/30 border border-blue-700 rounded-lg p-3">
                    <p className="text-sm text-blue-300">
                      📊 Price was adjusted {item.priceHistory.length - 1} time(s) before selling
                    </p>
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-2 pt-2">
                  <button className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded text-sm font-medium transition-colors">
                    📊 View Details
                  </button>
                  {item.priceHistory && item.priceHistory.length > 0 && (
                    <button 
                      onClick={() => handleViewPriceHistory(item)}
                      className="bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded text-sm font-medium transition-colors"
                    >
                      💰 Price History
                    </button>
                  )}
                  <button className="bg-orange-600 hover:bg-orange-700 text-white py-2 px-4 rounded text-sm font-medium transition-colors">
                    🔄 Relist Similar
                  </button>
                  <button 
                    onClick={() => handleDelete(item)}
                    className="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded text-sm font-medium transition-colors"
                  >
                    🗑️ Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty state */}
      {sortedItems.length === 0 && (
        <div className="text-center py-12">
          {soldItems.length === 0 ? (
            <>
              <div className="text-gray-400 text-lg mb-4">No sold items yet</div>
              <p className="text-gray-500">Items you mark as sold will appear here</p>
            </>
          ) : (
            <div className="text-gray-400 text-lg">
              No sold items match your search criteria
            </div>
          )}
        </div>
      )}

      {/* Price History Modal */}
      <PriceHistoryModal
        isOpen={priceHistoryModal.isOpen}
        onClose={() => setPriceHistoryModal({ isOpen: false, item: null })}
        item={priceHistoryModal.item}
      />

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={confirmModal.isOpen}
        onClose={() => setConfirmModal({ isOpen: false, itemId: null, itemName: '' })}
        onConfirm={handleConfirmDelete}
        title="Delete Sold Item"
        message={`Are you sure you want to permanently delete "${confirmModal.itemName}" from your sold items? This action cannot be undone.`}
        confirmText="Delete"
        variant="danger"
      />
    </div>
  );
};

export default SoldItems;
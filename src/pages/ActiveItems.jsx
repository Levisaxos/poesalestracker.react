import { useState } from 'react';
import ItemTooltip from '../components/items/ItemTooltip';
import SearchBar from '../components/common/SearchBar';
import AddItemModal from '../components/items/AddItemModal';
import ConfirmationModal from '../components/common/ConfirmationModal';
import Button from '../components/common/Button';
import { useItems } from '../context/ItemsContext';
import { useToast } from '../context/ToastContext';

const ActiveItems = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [confirmModal, setConfirmModal] = useState({ isOpen: false, type: '', itemId: null, itemName: '' });

  const { activeItems, markAsSold, deleteItem, totalActiveValue } = useItems();
  const { showSuccess, showError } = useToast();

  // Filter items based on search
  const filteredItems = activeItems.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.baseType.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.properties.some(prop => prop.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Sort items
  const sortedItems = [...filteredItems].sort((a, b) => {
    switch (sortBy) {
      case 'newest':
        return new Date(b.dateAdded) - new Date(a.dateAdded);
      case 'oldest':
        return new Date(a.dateAdded) - new Date(b.dateAdded);
      case 'price-high':
        return (b.price?.amount || 0) - (a.price?.amount || 0);
      case 'price-low':
        return (a.price?.amount || 0) - (b.price?.amount || 0);
      case 'name':
        return a.name.localeCompare(b.name);
      default:
        return 0;
    }
  });

  const handleMarkSold = (item) => {
    setConfirmModal({
      isOpen: true,
      type: 'markSold',
      itemId: item.id,
      itemName: item.name
    });
  };

  const handleDelete = (item) => {
    setConfirmModal({
      isOpen: true,
      type: 'delete',
      itemId: item.id,
      itemName: item.name
    });
  };

  const handleConfirmAction = () => {
    try {
      if (confirmModal.type === 'markSold') {
        markAsSold(confirmModal.itemId);
        showSuccess(`${confirmModal.itemName} marked as sold!`);
      } else if (confirmModal.type === 'delete') {
        deleteItem(confirmModal.itemId);
        showSuccess(`${confirmModal.itemName} deleted successfully!`);
      }
    } catch (error) {
      showError('Action failed. Please try again.');
    }
    
    setConfirmModal({ isOpen: false, type: '', itemId: null, itemName: '' });
  };

  const getConfirmModalProps = () => {
    if (confirmModal.type === 'markSold') {
      return {
        title: 'Mark Item as Sold',
        message: `Are you sure you want to mark "${confirmModal.itemName}" as sold?`,
        confirmText: 'Mark Sold',
        variant: 'success'
      };
    } else if (confirmModal.type === 'delete') {
      return {
        title: 'Delete Item',
        message: `Are you sure you want to permanently delete "${confirmModal.itemName}"? This action cannot be undone.`,
        confirmText: 'Delete',
        variant: 'danger'
      };
    }
    return {};
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Active Items</h1>
          <p className="text-gray-400">
            {sortedItems.length} items listed • {Math.round(totalActiveValue).toLocaleString()} total value
          </p>
        </div>
        <Button onClick={() => setIsAddModalOpen(true)}>
          + Add Item
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <SearchBar 
            value={searchTerm}
            onChange={setSearchTerm}
            placeholder="Search items by name or description..."
          />
        </div>
        <select 
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
        >
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
          <option value="price-high">Price: High to Low</option>
          <option value="price-low">Price: Low to High</option>
          <option value="name">Name A-Z</option>
        </select>
      </div>

      {/* Items Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {sortedItems.map((item) => (
          <div key={item.id} className="bg-gray-800 rounded-lg border border-gray-700 hover:border-orange-500 transition-colors overflow-hidden">
            <div>
              <ItemTooltip item={item} showPrice={true} className="w-full border-none bg-transparent p-0" />
            </div>
            
            {/* Action Buttons */}
            <div className="px-4 pb-4 border-t border-gray-600 pt-4 flex gap-2">
              <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-3 rounded text-xs font-medium transition-colors">
                ✏️ Edit Price
              </button>
              <button 
                onClick={() => handleMarkSold(item)}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 px-3 rounded text-xs font-medium transition-colors"
              >
                💰 Mark Sold
              </button>
              <button 
                onClick={() => handleDelete(item)}
                className="bg-red-600 hover:bg-red-700 text-white py-2 px-3 rounded text-xs font-medium transition-colors"
              >
                🗑️
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Empty state */}
      {sortedItems.length === 0 && (
        <div className="text-center py-12">
          {activeItems.length === 0 ? (
            <>
              <div className="text-gray-400 text-lg mb-4">No active items found</div>
              <Button onClick={() => setIsAddModalOpen(true)}>
                Add Your First Item
              </Button>
            </>
          ) : (
            <div className="text-gray-400 text-lg">
              No items match your search criteria
            </div>
          )}
        </div>
      )}

      {/* Add Item Modal */}
      <AddItemModal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)} 
      />

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={confirmModal.isOpen}
        onClose={() => setConfirmModal({ isOpen: false, type: '', itemId: null, itemName: '' })}
        onConfirm={handleConfirmAction}
        {...getConfirmModalProps()}
      />
    </div>
  );
};

export default ActiveItems;
import React, { useState } from 'react';
import { usePoEItems } from '../../hooks/useLocalStorage';
import ItemTooltip from './ItemTooltip';
import { getCurrency } from '../../constants/currencies';
import { getTimeListedText, getTimeSoldText } from '../../utils/timeUtils';
import { ErrorModal, DeleteModal, SoldModal } from './ItemCardModals';
import { Trash2, DollarSign, Clock, CheckCircle } from 'lucide-react';

const ItemCard = ({ item, showActions = false, showProfit = false }) => {
  const { deleteItem, markAsSold } = usePoEItems();
  const [showSoldModal, setShowSoldModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const profit = showProfit && item.actualPrice ? item.actualPrice - item.expectedPrice : 0;

  const showError = (message) => {
    setErrorMessage(message);
    setShowErrorModal(true);
  };

  const handleMarkAsSold = (actualPrice) => {
    try {
      markAsSold(item.id, actualPrice);
      setShowSoldModal(false);
    } catch (error) {
      showError('Failed to mark item as sold: ' + error.message);
    }
  };

  const handleDelete = () => {
    try {
      deleteItem(item.id);
      setShowDeleteModal(false);
    } catch (error) {
      showError('Failed to delete item: ' + error.message);
      setShowDeleteModal(false);
    }
  };

  return (
    <>
      <div className="bg-gray-900 border-2 border-gray-700 rounded-xl overflow-hidden hover:bg-gray-800 transition-all duration-200 flex flex-col relative">
        {/* Status Badge */}
        {item.status === 'sold' && (
          <div className="absolute top-2 right-2 z-10">
            <span className="flex items-center gap-1 px-2 py-1 bg-green-600/20 text-green-400 rounded-full text-xs font-medium">
              <CheckCircle size={12} />
              Sold
            </span>
          </div>
        )}

        {/* Item Content */}
        <div className="flex-1 p-3">
          {item.description ? (
            <ItemTooltip itemText={item.description} direct={true} />
          ) : (
            <div className="text-slate-500 text-center py-8">
              <div className="text-2xl mb-1">📦</div>
              <p className="text-xs">No item data available</p>
            </div>
          )}
        </div>

        {/* Bottom Section */}
        <div className="bg-slate-800/95 backdrop-blur-sm border-t border-slate-700/50 p-3">
          {/* Pricing Row */}
          <div className="flex items-center justify-between mb-2">
            <span className="text-slate-300 text-sm font-medium">
              {showProfit ? 'Sale Price' : 'Requested Price'}
            </span>
            <div className="flex items-center gap-2">
              <span className="text-amber-400 font-bold text-lg">
                {showProfit && item.actualPrice ? item.actualPrice : item.expectedPrice}
              </span>
              <img 
                src={getCurrency(item.actualCurrency || item.currency || 'divine').image}
                alt="Divine Orb"
                className="w-6 h-6"
              />
            </div>
          </div>

          {/* Profit Row (if showing profit) */}
          {showProfit && item.actualPrice && (
            <div className="flex items-center justify-between mb-2">
              <span className="text-slate-400 text-xs">Profit</span>
              <span className={`text-sm font-bold flex items-center gap-1 ${profit >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {profit >= 0 ? '+' : ''}{profit.toFixed(1)}
                <img 
                  src={getCurrency(item.actualCurrency || item.currency || 'divine').image}
                  alt="currency"
                  className="w-4 h-4"
                />
              </span>
            </div>
          )}

          {/* Time and Actions Row */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1 text-xs text-slate-400">
              <Clock size={12} />
              {showProfit && item.soldAt 
                ? getTimeSoldText(item.createdAt, item.soldAt)
                : getTimeListedText(item.createdAt)
              }
            </div>

            {/* Actions */}
            {showActions && item.status === 'active' && (
              <div className="flex gap-2">
                <button
                  onClick={() => setShowSoldModal(true)}
                  className="flex items-center gap-1 px-3 py-1.5 text-xs bg-green-700 hover:bg-green-600 text-white rounded transition-colors font-medium"
                >
                  <DollarSign size={12} />
                  Mark Sold
                </button>
                <button
                  onClick={() => setShowDeleteModal(true)}
                  className="flex items-center gap-1 px-2 py-1.5 text-xs bg-red-700 hover:bg-red-600 text-white rounded transition-colors font-medium"
                >
                  <Trash2 size={12} />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modals */}
      <ErrorModal 
        show={showErrorModal} 
        message={errorMessage} 
        onClose={() => setShowErrorModal(false)} 
      />
      <DeleteModal 
        show={showDeleteModal} 
        itemName={item.name} 
        onConfirm={handleDelete} 
        onCancel={() => setShowDeleteModal(false)} 
      />
      <SoldModal 
        show={showSoldModal} 
        itemName={item.name} 
        expectedPrice={item.expectedPrice} 
        onSubmit={handleMarkAsSold} 
        onCancel={() => setShowSoldModal(false)} 
      />
    </>
  );
};

export default ItemCard;
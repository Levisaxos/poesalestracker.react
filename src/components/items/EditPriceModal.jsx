import { useState } from 'react';
import Modal from '../common/Modal';
import Button from '../common/Button';
import { useItems } from '../../context/ItemsContext';
import { useToast } from '../../context/ToastContext';
import { CURRENCIES, VALIDATION_RULES } from '../../utils/constants';
import { validatePrice } from '../../utils/itemParser';

const EditPriceModal = ({ isOpen, onClose, item }) => {
  const [price, setPrice] = useState(() => {
    if (!item?.price) return { amount: '', currency: CURRENCIES.CHAOS };
    return {
      amount: item.price.amount.toString(),
      currency: item.price.currency
    };
  });
  const [errors, setErrors] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { updateItemPrice } = useItems();
  const { showSuccess, showError } = useToast();

  const handlePriceChange = (field, value) => {
    setPrice(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear price-related errors when user changes price
    setErrors([]);
  };

  const validateForm = () => {
    const priceErrors = validatePrice(price);
    return priceErrors;
  };

  const handleSubmit = async () => {
    const validationErrors = validateForm();
    
    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      return;
    }

    // Check if price actually changed
    const newAmount = parseFloat(price.amount);
    const oldAmount = item?.price?.amount || 0;
    const oldCurrency = item?.price?.currency || CURRENCIES.CHAOS;
    
    if (newAmount === oldAmount && price.currency === oldCurrency) {
      showError('Price has not changed');
      return;
    }

    setIsSubmitting(true);
    
    try {
      const newPrice = {
        amount: newAmount,
        currency: price.currency
      };

      updateItemPrice(item.id, newPrice);
      showSuccess(`Price updated for ${item.name}!`);
      
      handleClose();
    } catch (error) {
      console.error('Error updating price:', error);
      showError('Failed to update price. Please try again.');
      setErrors(['Failed to update price. Please try again.']);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (item?.price) {
      setPrice({
        amount: item.price.amount.toString(),
        currency: item.price.currency
      });
    } else {
      setPrice({ amount: '', currency: CURRENCIES.CHAOS });
    }
    setErrors([]);
    setIsSubmitting(false);
    onClose();
  };

  if (!item) return null;

  const canSubmit = price.amount && !isSubmitting && errors.length === 0;

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title={`Edit Price - ${item.name}`} size="sm">
      <div className="space-y-4">
        {/* Current Price Display */}
        {item.price && (
          <div className="bg-gray-700 rounded-lg p-3 border border-gray-600">
            <p className="text-sm text-gray-400 mb-1">Current Price</p>
            <p className="text-lg font-bold text-yellow-400">
              {item.price.amount} {item.price.currency.toUpperCase()}
            </p>
          </div>
        )}

        {/* New Price Input */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            New Price *
          </label>
          <div className="grid grid-cols-3 gap-3">
            <div className="col-span-2">
              <input
                type="number"
                value={price.amount}
                onChange={(e) => handlePriceChange('amount', e.target.value)}
                placeholder="Enter new price"
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                min={VALIDATION_RULES.PRICE_MIN_VALUE}
                max={VALIDATION_RULES.PRICE_MAX_VALUE}
                step="0.01"
                autoFocus
              />
            </div>
            <div>
              <select
                value={price.currency}
                onChange={(e) => handlePriceChange('currency', e.target.value)}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              >
                <option value={CURRENCIES.CHAOS}>Chaos</option>
                <option value={CURRENCIES.DIVINE}>Divine</option>
                <option value={CURRENCIES.EXALTED}>Exalted</option>
              </select>
            </div>
          </div>
        </div>

        {/* Price History Link */}
        {item.priceHistory && item.priceHistory.length > 1 && (
          <div className="bg-blue-900/30 border border-blue-700 rounded-lg p-3">
            <p className="text-sm text-blue-300 mb-2">
              💡 This item has been repriced {item.priceHistory.length - 1} time(s)
            </p>
            <button className="text-xs text-blue-400 hover:text-blue-300 underline">
              View Price History
            </button>
          </div>
        )}

        {/* Errors */}
        {errors.length > 0 && (
          <div className="bg-red-900/50 border border-red-700 rounded-md p-3">
            <div className="flex items-start">
              <svg className="w-4 h-4 text-red-400 mt-0.5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <div>
                <ul className="text-sm text-red-300 space-y-1">
                  {errors.map((error, index) => (
                    <li key={index}>• {error}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex justify-end space-x-3 pt-4 border-t border-gray-600">
          <Button variant="secondary" onClick={handleClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit}
            disabled={!canSubmit}
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline-block" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Updating...
              </>
            ) : (
              'Update Price'
            )}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default EditPriceModal;
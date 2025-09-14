import { useState } from 'react';
import Modal from '../common/Modal';
import Button from '../common/Button';
import ItemTooltip from './ItemTooltip';
import { parseItemText, validateItem } from '../../utils/itemParser';
import { useItems } from '../../context/ItemsContext';
import { useToast } from '../../context/ToastContext';
import { CURRENCIES } from '../../utils/constants';

const AddItemModal = ({ isOpen, onClose }) => {
  const [itemText, setItemText] = useState('');
  const [parsedItem, setParsedItem] = useState(null);
  const [price, setPrice] = useState({ amount: '', currency: CURRENCIES.CHAOS });
  const [errors, setErrors] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { addItem } = useItems();
  const { showSuccess, showError } = useToast();

  const handleTextChange = (e) => {
    const text = e.target.value;
    setItemText(text);
    setErrors([]);

    if (text.trim()) {
      const parsed = parseItemText(text);
      setParsedItem(parsed);
      
      const validationErrors = validateItem(parsed);
      setErrors(validationErrors);
    } else {
      setParsedItem(null);
    }
  };

  const handlePriceChange = (field, value) => {
    setPrice(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async () => {
    if (!parsedItem) {
      setErrors(['Please paste a valid item']);
      return;
    }

    const validationErrors = validateItem(parsedItem);
    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      return;
    }

    if (!price.amount || isNaN(price.amount) || parseFloat(price.amount) <= 0) {
      setErrors(['Please enter a valid price']);
      return;
    }

    setIsSubmitting(true);
    
    try {
      const itemWithPrice = {
        ...parsedItem,
        price: {
          amount: parseFloat(price.amount),
          currency: price.currency
        }
      };

      addItem(itemWithPrice);
      showSuccess(`${parsedItem.name} added successfully!`);
      
      // Reset form
      setItemText('');
      setParsedItem(null);
      setPrice({ amount: '', currency: CURRENCIES.CHAOS });
      setErrors([]);
      
      onClose();
    } catch (error) {
      showError('Failed to add item. Please try again.');
      setErrors(['Failed to add item. Please try again.']);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setItemText('');
    setParsedItem(null);
    setPrice({ amount: '', currency: CURRENCIES.CHAOS });
    setErrors([]);
    onClose();
  };
  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Add New Item" size="lg">
      <div className="space-y-6">
        {/* Item Text Input */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Paste Item Text from PoE2
          </label>
          <textarea
            value={itemText}
            onChange={handleTextChange}
            placeholder={`Item Class: Wands
Rarity: Rare
Vortex Call
Withered Wand
--------
Requires: Level 78, 137 Int
--------
Item Level: 81
--------
+1 to Level of all Spell Skills (rune)
34% increased Spell Damage
...`}
            className="w-full h-32 px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 font-mono text-sm"
            rows={8}
          />
        </div>

        {/* Price Input */}
        <div className="grid grid-cols-3 gap-4">
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Price
            </label>
            <input
              type="number"
              value={price.amount}
              onChange={(e) => handlePriceChange('amount', e.target.value)}
              placeholder="Enter price"
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              min="0"
              step="0.01"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Currency
            </label>
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

        {/* Errors */}
        {errors.length > 0 && (
          <div className="bg-red-900 border border-red-700 rounded-md p-3">
            <div className="text-red-200 text-sm">
              <strong>Please fix the following errors:</strong>
              <ul className="mt-1 list-disc list-inside">
                {errors.map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* Preview */}
        {parsedItem && errors.length === 0 && (
          <div>
            <h4 className="text-sm font-medium text-gray-300 mb-3">Item Preview</h4>
            <div className="flex justify-center">
              <ItemTooltip 
                item={parsedItem} 
                showPrice={price.amount && price.amount > 0}
              />
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex justify-end space-x-3 pt-4 border-t border-gray-600">
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit}
            disabled={!parsedItem || errors.length > 0 || !price.amount || isSubmitting}
          >
            {isSubmitting ? 'Adding...' : 'Add Item'}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default AddItemModal;
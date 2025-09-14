import { useState, useEffect } from 'react';
import Modal from '../common/Modal';
import Button from '../common/Button';
import ItemTooltip from './ItemTooltip';
import { parseItemText, validateItem, validatePrice, cleanItemText } from '../../utils/itemParser';
import { useItems } from '../../context/ItemsContext';
import { useToast } from '../../context/ToastContext';
import { CURRENCIES, VALIDATION_RULES } from '../../utils/constants';

const AddItemModal = ({ isOpen, onClose }) => {
  const [itemText, setItemText] = useState('');
  const [parsedItem, setParsedItem] = useState(null);
  const [price, setPrice] = useState({ amount: '', currency: CURRENCIES.CHAOS });
  const [errors, setErrors] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { addItem } = useItems();
  const { showSuccess, showError } = useToast();

  // Auto-populate price when item is parsed and contains a buyout note
  useEffect(() => {
    if (parsedItem?.price) {
      setPrice({
        amount: parsedItem.price.amount.toString(),
        currency: parsedItem.price.currency
      });
    }
  }, [parsedItem]);

  const handleTextChange = (e) => {
    const text = e.target.value;
    setItemText(text);
    setErrors([]);

    if (text.trim()) {
      const cleanedText = cleanItemText(text);
      const parsed = parseItemText(cleanedText);
      setParsedItem(parsed);
      
      if (parsed) {
        const validationErrors = validateItem(parsed);
        setErrors(validationErrors);
      } else {
        setErrors(['Unable to parse item. Please check the format.']);
      }
    } else {
      setParsedItem(null);
      setErrors([]);
      // Reset price when clearing item text
      setPrice({ amount: '', currency: CURRENCIES.CHAOS });
    }
  };

  const handlePriceChange = (field, value) => {
    setPrice(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear price-related errors when user changes price
    setErrors(prev => prev.filter(error => 
      !error.toLowerCase().includes('price') && 
      !error.toLowerCase().includes('amount') && 
      !error.toLowerCase().includes('currency')
    ));
  };

  const validateForm = () => {
    const allErrors = [];

    // Validate parsed item
    if (!parsedItem) {
      allErrors.push('Please paste a valid item');
      return allErrors;
    }

    const itemErrors = validateItem(parsedItem);
    allErrors.push(...itemErrors);

    // Validate price
    const priceErrors = validatePrice(price);
    allErrors.push(...priceErrors);

    return allErrors;
  };

  const handleSubmit = async () => {
    const validationErrors = validateForm();
    
    if (validationErrors.length > 0) {
      setErrors(validationErrors);
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

      // Remove the parsed price from the item object to avoid duplication
      delete itemWithPrice.price;
      itemWithPrice.price = {
        amount: parseFloat(price.amount),
        currency: price.currency
      };

      addItem(itemWithPrice);
      showSuccess(`${parsedItem.name} added successfully!`);
      
      // Reset form
      handleClose();
    } catch (error) {
      console.error('Error adding item:', error);
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
    setIsSubmitting(false);
    onClose();
  };

  const getPlaceholderText = () => {
    return `Item Class: Wands
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
Adds 15 to 28 Lightning Damage to Spells
+65 to maximum Mana
17% increased Cast Speed
--------
Grants Skill: Lightning Bolt Level 1
--------
Note: ~b/o 34 divine
--------
Corrupted`;
  };

  const canSubmit = parsedItem && errors.length === 0 && price.amount && !isSubmitting;

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Add New Item" size="lg">
      <div className="space-y-6">
        {/* Instructions */}
        <div className="bg-gray-700 rounded-lg p-4 border border-gray-600">
          <h4 className="text-sm font-medium text-gray-300 mb-2">Instructions</h4>
          <ul className="text-sm text-gray-400 space-y-1">
            <li>1. Copy item text from Path of Exile 2 (Ctrl+C while hovering over item)</li>
            <li>2. Paste the text in the field below</li>
            <li>3. Price will auto-populate from buyout notes (e.g. "Note: ~b/o 34 divine")</li>
            <li>4. Adjust price if needed and click "Add Item" to save</li>
          </ul>
        </div>

        {/* Item Text Input */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Item Text from PoE2
          </label>
          <textarea
            value={itemText}
            onChange={handleTextChange}
            placeholder={getPlaceholderText()}
            className="w-full h-32 px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 font-mono text-sm resize-vertical"
            rows={8}
            maxLength={5000}
          />
          <div className="text-xs text-gray-500 mt-1">
            {itemText.length}/5000 characters            
          </div>
        </div>

        {/* Price Input */}
        <div className="grid grid-cols-3 gap-4">
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Price * {parsedItem?.price && <span className="text-green-400 text-xs">(auto-populated)</span>}
            </label>
            <input
              type="number"
              value={price.amount}
              onChange={(e) => handlePriceChange('amount', e.target.value)}
              placeholder="Enter price"
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              min={VALIDATION_RULES.PRICE_MIN_VALUE}
              max={VALIDATION_RULES.PRICE_MAX_VALUE}
              step="0.01"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Currency *
            </label>
            <select
              value={price.currency}
              onChange={(e) => handlePriceChange('currency', e.target.value)}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            >
              <option value={CURRENCIES.CHAOS}>Chaos Orb</option>
              <option value={CURRENCIES.DIVINE}>Divine Orb</option>
              <option value={CURRENCIES.EXALTED}>Exalted Orb</option>
            </select>
          </div>
        </div>

        {/* Errors */}
        {errors.length > 0 && (
          <div className="bg-red-900/50 border border-red-700 rounded-md p-3">
            <div className="flex items-start">
              <svg className="w-5 h-5 text-red-400 mt-0.5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <div>
                <h4 className="text-sm font-medium text-red-200 mb-1">Please fix the following errors:</h4>
                <ul className="text-sm text-red-300 space-y-1">
                  {errors.map((error, index) => (
                    <li key={index}>• {error}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}        

        {/* Preview */}
        {parsedItem && errors.length === 0 && (
          <div>
            <h4 className="text-sm font-medium text-gray-300 mb-3">Item Preview</h4>
            <div className="flex justify-center bg-gray-900 rounded-lg p-4">
              <ItemTooltip 
                item={{
                  ...parsedItem,
                  price: price.amount ? {
                    amount: parseFloat(price.amount),
                    currency: price.currency
                  } : null
                }}
                showPrice={!!price.amount}
              />
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
                Adding...
              </>
            ) : (
              '+ Add Item'
            )}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default AddItemModal;
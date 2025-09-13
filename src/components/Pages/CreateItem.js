import React, { useState } from 'react';
import { usePoEItems } from '../../hooks/useLocalStorage';
import ItemTooltip from '../Common/ItemTooltip';
import CurrencySelector from '../Common/CurrencySelector';
import { Save, ArrowLeft, FileText, CheckCircle, AlertTriangle, X } from 'lucide-react';

const CreateItem = ({ onNavigate }) => {
  const { addItem } = usePoEItems();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    expectedPrice: '',
    currency: 'divine'
  });
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [createdItemName, setCreatedItemName] = useState('');

  const showError = (message) => {
    setErrorMessage(message);
    setShowErrorModal(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.description.trim()) {
      showError('Please enter item description/stats');
      return;
    }
    
    if (!formData.expectedPrice || isNaN(parseFloat(formData.expectedPrice)) || parseFloat(formData.expectedPrice) <= 0) {
      showError('Please enter a valid expected price greater than 0');
      return;
    }

    // Auto-extract name if not provided
    let itemName = formData.name.trim();
    if (!itemName) {
      itemName = extractItemName(formData.description);
    }

    if (!itemName) {
      showError('Could not determine item name from description. Please ensure your item stats are properly formatted.');
      return;
    }

    try {
      const itemData = {
        ...formData,
        name: itemName,
        expectedPrice: parseFloat(formData.expectedPrice)
      };

      addItem(itemData);
      setCreatedItemName(itemName);
      
      // Reset form
      setFormData({
        name: '',
        description: '',
        expectedPrice: '',
        currency: 'divine'
      });

      setShowSuccessModal(true);
    } catch (error) {
      showError('Failed to save item: ' + error.message);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Extract item name from description
  const extractItemName = (description) => {
    if (!description) return '';
    
    const lines = description.trim().split('\n');
    let nameFound = false;
    for (let line of lines) {
      line = line.trim();
      if (line.startsWith('Rarity:')) {
        nameFound = true;
        continue;
      }
      if (nameFound && line && !line.includes(':') && !line.includes('-')) {
        return line;
      }
    }
    return '';
  };

  // Auto-extract price from description
  const autoFillPrice = () => {
    if (formData.description && !formData.expectedPrice) {
      const priceMatch = formData.description.match(/~b\/o\s*(\d+(?:\.\d+)?)/i);
      if (priceMatch) {
        handleInputChange('expectedPrice', priceMatch[1]);
      }
    }
  };

  // Auto-extract name when description changes
  React.useEffect(() => {
    if (formData.description && !formData.name) {
      const extractedName = extractItemName(formData.description);
      if (extractedName) {
        handleInputChange('name', extractedName);
      }
    }
    autoFillPrice();
  }, [formData.description]);

  // Success Modal Component
  const SuccessModal = () => (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-slate-800 rounded-xl border border-green-500/50 p-6 max-w-md w-full">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-green-600/20 rounded-lg">
            <CheckCircle size={20} className="text-green-400" />
          </div>
          <h3 className="text-xl font-semibold text-white">Item Added Successfully!</h3>
        </div>
        <p className="text-slate-300 mb-2">
          Your item has been added to the active items list:
        </p>
        <p className="text-white font-medium mb-6 bg-slate-700/50 p-3 rounded-lg">
          "{createdItemName}"
        </p>
        <div className="flex gap-3">
          <button
            onClick={() => {
              setShowSuccessModal(false);
              onNavigate('active');
            }}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors font-medium flex-1 justify-center"
          >
            View Active Items
          </button>
          <button
            onClick={() => setShowSuccessModal(false)}
            className="px-4 py-2 bg-slate-600 hover:bg-slate-700 text-white rounded-lg transition-colors font-medium"
          >
            Add Another
          </button>
        </div>
      </div>
    </div>
  );

  // Error Modal Component
  const ErrorModal = () => (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-slate-800 rounded-xl border border-red-500/50 p-6 max-w-md w-full">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-600/20 rounded-lg">
              <AlertTriangle size={20} className="text-red-400" />
            </div>
            <h3 className="text-xl font-semibold text-white">Error</h3>
          </div>
          <button
            onClick={() => setShowErrorModal(false)}
            className="p-1 text-slate-400 hover:text-white rounded"
          >
            <X size={20} />
          </button>
        </div>
        <p className="text-slate-300 mb-6">{errorMessage}</p>
        <div className="flex justify-end">
          <button
            onClick={() => setShowErrorModal(false)}
            className="px-4 py-2 bg-slate-600 hover:bg-slate-700 text-white rounded-lg transition-colors font-medium"
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => onNavigate('dashboard')}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-700/50 rounded-lg transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-white">Add New Item</h1>
            <p className="text-slate-400">Create a new item listing for sale tracking</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Form */}
          <div className="lg:col-span-1">
            <form onSubmit={handleSubmit} className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700/50 p-6 space-y-6">
              {/* Item Description/Stats */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Item Stats/Description *
                </label>
                <div className="relative">
                  <textarea
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    placeholder={`Rarity: Rare
Tempest Weaver
Withered Wand
--------
Requires: Level 78, 137 Int
--------
Item Level: 81
--------
Grants Skill: Level 18 Chaos Bolt
--------
77% increased Spell Damage
78% increased Chaos Damage
+5 to Level of all Chaos Spell Skills
23% increased Cast Speed
19% increased Mana Cost Efficiency
--------
Note: ~b/o 35 divine`}
                    rows={16}
                    className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none transition-colors resize-vertical font-mono text-sm"
                    required
                  />
                  <FileText size={16} className="absolute top-3 right-3 text-slate-500" />
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  Copy stats directly from the game using Ctrl+C while hovering over the item
                </p>
              </div>

              {/* Expected Price */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Expected Price *
                </label>
                <div className="flex gap-2">
                  <div className="flex-1 relative">
                    <input
                      type="number"
                      step="0.1"
                      min="0.1"
                      value={formData.expectedPrice}
                      onChange={(e) => handleInputChange('expectedPrice', e.target.value)}
                      placeholder="0.0"
                      className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none transition-colors"
                      required
                    />
                  </div>
                  <CurrencySelector
                    value={formData.currency}
                    onChange={(currency) => handleInputChange('currency', currency)}
                    size="normal"
                    showLabel={false}
                  />
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  Will auto-fill from "~b/o" price in item stats
                </p>
              </div>

              {/* Form Actions */}
              <div className="flex gap-4 pt-4">
                <button
                  type="submit"
                  className="flex items-center gap-2 px-6 py-3 bg-amber-600 hover:bg-amber-700 text-white rounded-lg transition-colors font-medium flex-1 justify-center"
                >
                  <Save size={18} />
                  Save Item
                </button>
                <button
                  type="button"
                  onClick={() => onNavigate('dashboard')}
                  className="px-6 py-3 bg-slate-600 hover:bg-slate-700 text-white rounded-lg transition-colors font-medium"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>

          {/* Preview Panel - Always Visible and Larger */}
          <div className="lg:col-span-2">
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700/50 p-6">
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-white">Item Preview</h3>
                <p className="text-slate-400 text-sm">Live preview of your item tooltip</p>
              </div>
              
              <div className="min-h-[500px] flex items-center justify-center">
                {formData.description.trim() ? (
                  <div className="transform scale-110">
                    <ItemTooltip itemText={formData.description} />
                  </div>
                ) : (
                  <div className="text-slate-500 text-center">
                    <FileText size={64} className="mx-auto mb-4" />
                    <p className="text-xl mb-2">Item Preview</p>
                    <p className="text-sm">
                      Paste item stats to see live preview
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Quick Tips */}
        <div className="mt-6 bg-slate-800/30 backdrop-blur-sm rounded-xl border border-slate-700/30 p-4">
          <h3 className="text-white font-medium mb-3">Quick Tips</h3>
          <ul className="text-sm text-slate-400 space-y-1">
            <li>• Use Ctrl+C in-game to copy item stats, then paste into the description field</li>
            <li>• Item name will automatically be extracted from the pasted stats</li>
            <li>• Include "~b/o [price] divine" in your item stats for automatic price detection</li>
            <li>• Check poe.ninja or similar sites for current market prices</li>
            <li>• The preview shows exactly how your item tooltip will look</li>
          </ul>
        </div>
      </div>

      {/* Modals */}
      {showSuccessModal && <SuccessModal />}
      {showErrorModal && <ErrorModal />}
    </>
  );
};

export default CreateItem;
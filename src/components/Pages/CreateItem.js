import React, { useState } from 'react';
import { usePoEItems } from '../../hooks/useLocalStorage';
import ItemTooltip from '../Common/ItemTooltip';
import CurrencySelector from '../Common/CurrencySelector';
import { Save, ArrowLeft, FileText, Eye } from 'lucide-react';

const CreateItem = ({ onNavigate }) => {
  const { addItem } = usePoEItems();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    expectedPrice: '',
    notes: ''
  });
  const [showPreview, setShowPreview] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      alert('Please enter an item name');
      return;
    }
    
    if (!formData.expectedPrice || isNaN(parseFloat(formData.expectedPrice))) {
      alert('Please enter a valid expected price');
      return;
    }

    const itemData = {
      ...formData,
      expectedPrice: parseFloat(formData.expectedPrice)
    };

    addItem(itemData);
    
    // Reset form
    setFormData({
      name: '',
      description: '',
      expectedPrice: '',
      notes: ''
    });

    alert('Item added successfully!');
    onNavigate('active');
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Auto-extract item name from description if possible
  const autoFillName = () => {
    if (formData.description && !formData.name) {
      const lines = formData.description.trim().split('\n');
      // Look for the item name (usually comes after rarity line)
      let nameFound = false;
      for (let line of lines) {
        line = line.trim();
        if (line.startsWith('Rarity:')) {
          nameFound = true;
          continue;
        }
        if (nameFound && line && !line.includes(':') && !line.includes('-')) {
          handleInputChange('name', line);
          break;
        }
      }
    }
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

  React.useEffect(() => {
    autoFillName();
    autoFillPrice();
  }, [formData.description]);

  return (
    <div className="max-w-4xl mx-auto">
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700/50 p-6 space-y-6">
          {/* Item Name */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Item Name *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              placeholder="e.g., Tempest Weaver, Belly of the Beast, etc."
              className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none transition-colors"
              required
            />
            <p className="text-xs text-slate-500 mt-1">
              Will auto-fill from item stats if left empty
            </p>
          </div>

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
                rows={12}
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
                  min="0"
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

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Additional Notes
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => handleInputChange('notes', e.target.value)}
              placeholder="Any additional notes about the item, pricing strategy, etc."
              rows={3}
              className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none transition-colors resize-vertical"
            />
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

        {/* Preview Panel */}
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700/50 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">Item Preview</h3>
            <button
              onClick={() => setShowPreview(!showPreview)}
              className={`flex items-center gap-1 px-3 py-1 rounded text-xs transition-colors ${
                showPreview 
                  ? 'bg-amber-600 text-white' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Eye size={12} />
              {showPreview ? 'Hide' : 'Show'}
            </button>
          </div>
          
          <div className="min-h-[400px] flex items-center justify-center">
            {formData.description.trim() && showPreview ? (
              <ItemTooltip itemText={formData.description} />
            ) : (
              <div className="text-slate-500 text-center">
                <FileText size={48} className="mx-auto mb-4" />
                <p className="text-lg mb-2">Item Preview</p>
                <p className="text-sm">
                  {!formData.description.trim() 
                    ? 'Paste item stats to see preview' 
                    : 'Click "Show" to preview item tooltip'
                  }
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quick Tips */}
      <div className="mt-6 bg-slate-800/30 backdrop-blur-sm rounded-xl border border-slate-700/30 p-4">
        <h3 className="text-white font-medium mb-3">Quick Tips</h3>
        <ul className="text-sm text-slate-400 space-y-1">
          <li>• Use Ctrl+C in-game to copy item stats, then paste into the description field</li>
          <li>• Item name and price will auto-fill from the pasted stats</li>
          <li>• Include "~b/o [price] divine" in your item stats for automatic price detection</li>
          <li>• Check poe.ninja or similar sites for current market prices</li>
          <li>• The preview shows how your item tooltip will look</li>
        </ul>
      </div>
    </div>
  );
};

export default CreateItem;
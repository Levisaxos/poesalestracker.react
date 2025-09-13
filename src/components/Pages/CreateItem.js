import React, { useState } from 'react';
import { usePoEItems } from '../../hooks/useLocalStorage';
import ImageUpload from '../Common/ImageUpload';
import { Save, ArrowLeft, FileText } from 'lucide-react';

const CreateItem = ({ onNavigate }) => {
  const { addItem } = usePoEItems();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    expectedPrice: '',
    image: null,
    notes: ''
  });

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
      image: null,
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

  return (
    <div className="max-w-2xl mx-auto">
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
            placeholder="e.g., Belly of the Beast, Tabula Rasa, etc."
            className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none transition-colors"
            required
          />
        </div>

        {/* Item Description/Stats */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Item Stats/Description
          </label>
          <div className="relative">
            <textarea
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Paste item stats from game or add description..."
              rows={6}
              className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none transition-colors resize-vertical"
            />
            <FileText size={16} className="absolute top-3 right-3 text-slate-500" />
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Tip: Copy stats directly from the game using Ctrl+C while hovering over the item
          </p>
        </div>

        {/* Expected Price */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Expected Price (Divine Orbs) *
          </label>
          <div className="relative">
            <input
              type="number"
              step="0.1"
              min="0"
              value={formData.expectedPrice}
              onChange={(e) => handleInputChange('expectedPrice', e.target.value)}
              placeholder="0.0"
              className="w-full px-4 py-3 pr-12 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none transition-colors"
              required
            />
            <span className="absolute right-4 top-3 text-amber-400 font-bold">♦</span>
          </div>
        </div>

        {/* Image Upload */}
        <ImageUpload
          onImageChange={(image) => handleInputChange('image', image)}
          initialImage={formData.image}
        />

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

      {/* Quick Tips */}
      <div className="mt-6 bg-slate-800/30 backdrop-blur-sm rounded-xl border border-slate-700/30 p-4">
        <h3 className="text-white font-medium mb-3">Quick Tips</h3>
        <ul className="text-sm text-slate-400 space-y-1">
          <li>• Use Ctrl+C in-game to copy item stats, then paste here</li>
          <li>• Take screenshots with Windows+Shift+S and paste with Ctrl+V</li>
          <li>• Check poe.ninja or similar sites for current market prices</li>
          <li>• Include important mods and item level in the description</li>
        </ul>
      </div>
    </div>
  );
};

export default CreateItem;
import React, { useState } from 'react';
import ImageUpload from './ImageUpload';
import ItemTooltip from './ItemTooltip';
import { Image as ImageIcon, FileText, Eye } from 'lucide-react';

const ItemDisplay = ({ onImageChange, onStatsChange, initialImage = null, initialStats = '', className = "" }) => {
  const [viewMode, setViewMode] = useState('image'); // 'image', 'tooltip', 'both'
  const [itemStats, setItemStats] = useState(initialStats);

  const handleStatsChange = (value) => {
    setItemStats(value);
    onStatsChange && onStatsChange(value);
  };

  return (
    <div className={className}>
      <div className="flex items-center justify-between mb-4">
        <label className="block text-sm font-medium text-slate-300">
          Item Information
        </label>
        
        {/* View Mode Toggle */}
        <div className="flex items-center gap-1 bg-slate-700/50 rounded-lg p-1">
          <button
            type="button"
            onClick={() => setViewMode('image')}
            className={`flex items-center gap-1 px-3 py-1 rounded text-xs transition-colors ${
              viewMode === 'image' 
                ? 'bg-amber-600 text-white' 
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <ImageIcon size={12} />
            Image
          </button>
          <button
            type="button"
            onClick={() => setViewMode('tooltip')}
            className={`flex items-center gap-1 px-3 py-1 rounded text-xs transition-colors ${
              viewMode === 'tooltip' 
                ? 'bg-amber-600 text-white' 
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <FileText size={12} />
            Tooltip
          </button>
          <button
            type="button"
            onClick={() => setViewMode('both')}
            className={`flex items-center gap-1 px-3 py-1 rounded text-xs transition-colors ${
              viewMode === 'both' 
                ? 'bg-amber-600 text-white' 
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Eye size={12} />
            Both
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {/* Item Stats Textarea */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Item Stats (Copy from game with Ctrl+C)
          </label>
          <textarea
            value={itemStats}
            onChange={(e) => handleStatsChange(e.target.value)}
            placeholder={`Item Class: Wands
Rarity: Rare
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
Note: ~b/o 23 divine`}
            rows={8}
            className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none transition-colors resize-vertical font-mono text-sm"
          />
        </div>

        {/* Display Area */}
        <div className={`grid gap-4 ${viewMode === 'both' ? 'md:grid-cols-2' : 'grid-cols-1'}`}>
          {/* Image Upload Section */}
          {(viewMode === 'image' || viewMode === 'both') && (
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Screenshot
              </label>
              
              {image ? (
                <div className="relative">
                  <div className="bg-slate-700/50 rounded-lg p-4 border border-slate-600">
                    <img 
                      src={image} 
                      alt="Item" 
                      className="max-w-full h-32 object-contain mx-auto rounded"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={removeImage}
                    className="absolute -top-2 -right-2 p-1 bg-red-600 hover:bg-red-700 text-white rounded-full transition-colors"
                  >
                    <X size={16} />
                  </button>
                </div>
              ) : (
                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  className={`border-2 border-dashed rounded-lg p-6 text-center transition-all duration-200 ${
                    dragOver 
                      ? 'border-amber-500 bg-amber-500/10 backdrop-blur-sm' 
                      : 'border-slate-600 bg-slate-800/30 backdrop-blur-sm hover:bg-slate-800/50'
                  }`}
                >
                  <ImageIcon size={32} className="mx-auto text-slate-400 mb-3" />
                  <p className="text-slate-300 mb-2">Drop screenshot here</p>
                  <p className="text-slate-500 text-sm mb-4">
                    Or paste with <span className="px-1 py-0.5 bg-slate-700 rounded text-amber-400 font-mono text-xs">Ctrl+V</span>
                  </p>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center gap-2 mx-auto px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg transition-colors font-medium"
                  >
                    <Upload size={16} />
                    Browse Files
                  </button>
                </div>
              )}

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
            </div>
          )}

          {/* Item Tooltip Preview */}
          {(viewMode === 'tooltip' || viewMode === 'both') && (
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Item Preview
              </label>
              <div className="bg-slate-800/30 rounded-lg p-4 min-h-[200px] flex items-center justify-center">
                {itemStats.trim() ? (
                  <ItemTooltip itemText={itemStats} />
                ) : (
                  <div className="text-slate-500 text-center">
                    <FileText size={32} className="mx-auto mb-2" />
                    <p>Paste item stats to see preview</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Tips */}
        <div className="bg-slate-800/30 rounded-lg p-3">
          <h4 className="text-slate-300 font-medium mb-2 text-sm">Tips:</h4>
          <ul className="text-xs text-slate-400 space-y-1">
            <li>• Hover over item in-game and press <kbd className="px-1 py-0.5 bg-slate-700 rounded">Ctrl+C</kbd> to copy stats</li>
            <li>• Take screenshot with <kbd className="px-1 py-0.5 bg-slate-700 rounded">Win+Shift+S</kbd> then paste here with <kbd className="px-1 py-0.5 bg-slate-700 rounded">Ctrl+V</kbd></li>
            <li>• The tooltip preview will automatically format your item text</li>
            <li>• Use "Both" view to compare your screenshot with the generated tooltip</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ItemDisplay;
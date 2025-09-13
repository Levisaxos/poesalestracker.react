import React from 'react';
import { DollarSign, CheckCircle, AlertTriangle, Trash2, X } from 'lucide-react';

export const ErrorModal = ({ show, message, onClose }) => {
  if (!show) return null;
  
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-slate-800 rounded-xl border border-red-500/50 p-6 max-w-md w-full">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-red-600/20 rounded-lg">
            <AlertTriangle size={20} className="text-red-400" />
          </div>
          <h3 className="text-xl font-semibold text-white">Error</h3>
        </div>
        <p className="text-slate-300 mb-6">{message}</p>
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-600 hover:bg-slate-700 text-white rounded-lg transition-colors font-medium"
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );
};

export const DeleteModal = ({ show, itemName, onConfirm, onCancel }) => {
  if (!show) return null;
  
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-slate-800 rounded-xl border border-red-500/50 p-6 max-w-md w-full">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-red-600/20 rounded-lg">
            <Trash2 size={20} className="text-red-400" />
          </div>
          <h3 className="text-xl font-semibold text-white">Delete Item</h3>
        </div>
        <p className="text-slate-300 mb-2">
          Are you sure you want to delete this item?
        </p>
        <p className="text-white font-medium mb-6 bg-slate-700/50 p-3 rounded-lg">
          "{itemName}"
        </p>
        <div className="flex gap-3">
          <button
            onClick={onConfirm}
            className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors font-medium flex-1 justify-center"
          >
            <Trash2 size={16} />
            Delete
          </button>
          <button
            onClick={onCancel}
            className="px-4 py-2 bg-slate-600 hover:bg-slate-700 text-white rounded-lg transition-colors font-medium"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export const SoldModal = ({ show, itemName, expectedPrice, onSubmit, onCancel }) => {
  const [actualPrice, setActualPrice] = React.useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!actualPrice || isNaN(parseFloat(actualPrice)) || parseFloat(actualPrice) <= 0) {
      return;
    }
    onSubmit(actualPrice);
    setActualPrice('');
  };

  if (!show) return null;
  
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-slate-800 rounded-xl border border-green-500/50 p-6 max-w-md w-full">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-600/20 rounded-lg">
              <DollarSign size={20} className="text-green-400" />
            </div>
            <h3 className="text-xl font-semibold text-white">Mark as Sold</h3>
          </div>
          <button
            onClick={onCancel}
            className="p-1 text-slate-400 hover:text-white rounded"
          >
            <X size={20} />
          </button>
        </div>
        <p className="text-slate-300 mb-4">
          Enter the actual sale price for <strong>{itemName}</strong>
        </p>
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Actual Sale Price (Divine Orbs)
            </label>
            <div className="relative">
              <input
                type="number"
                step="0.1"
                min="0.1"
                value={actualPrice}
                onChange={(e) => setActualPrice(e.target.value)}
                placeholder="0.0"
                className="w-full px-4 py-3 pr-12 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:border-green-500 focus:ring-1 focus:ring-green-500 outline-none transition-colors"
                autoFocus
                required
              />
              <span className="absolute right-4 top-3 text-amber-400 font-bold">♦</span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Expected: {expectedPrice}♦
            </p>
          </div>
          <div className="flex gap-3">
            <button
              type="submit"
              className="flex items-center gap-2 flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors font-medium justify-center"
            >
              <CheckCircle size={16} />
              Confirm Sale
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 bg-slate-600 hover:bg-slate-700 text-white rounded-lg transition-colors font-medium"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
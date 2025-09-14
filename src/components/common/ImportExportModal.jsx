// src/components/common/ImportExportModal.jsx
import { useState } from 'react';
import Modal from './Modal';
import Button from './Button';
import { useItems } from '../../context/ItemsContext';
import { useToast } from '../../context/ToastContext';
import { 
  exportItemsToFile, 
  importItemsFromFile, 
  mergeImportedItems, 
  createBackup 
} from '../../utils/importExport';

const ImportExportModal = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState('export');
  const [isProcessing, setIsProcessing] = useState(false);
  const [importFile, setImportFile] = useState(null);
  const [importPreview, setImportPreview] = useState(null);
  const [importOptions, setImportOptions] = useState({
    skipDuplicates: true,
    overwriteExisting: false,
    createBackup: true
  });

  const { items, setItems } = useItems();
  const { showSuccess, showError, showInfo } = useToast();

  const handleExport = async () => {
    if (items.length === 0) {
      showError('No items to export');
      return;
    }

    setIsProcessing(true);
    
    try {
      const result = exportItemsToFile(items);
      
      if (result.success) {
        showSuccess(`Successfully exported ${result.itemCount} items!`);
        onClose();
      } else {
        showError(`Export failed: ${result.error}`);
      }
    } catch (error) {
      showError('Export failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFileSelect = async (event) => {
    const file = event.target.files[0];
    setImportFile(file);
    setImportPreview(null);

    if (!file) return;

    setIsProcessing(true);

    try {
      const result = await importItemsFromFile(file);
      setImportPreview(result);
      showInfo(`Found ${result.items.length} items in file`);
    } catch (error) {
      showError(`Import preview failed: ${error.message}`);
      setImportFile(null);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleImport = async () => {
    if (!importPreview || !importPreview.items) {
      showError('No valid import data available');
      return;
    }

    setIsProcessing(true);

    try {
      // Create backup if requested
      if (importOptions.createBackup && items.length > 0) {
        const backupResult = createBackup(items);
        if (backupResult.success) {
          showInfo('Backup created successfully');
        }
      }

      // Merge imported items with existing ones
      const mergeResult = mergeImportedItems(items, importPreview.items, {
        skipDuplicates: importOptions.skipDuplicates,
        overwriteExisting: importOptions.overwriteExisting
      });

      // Update the items in context (you'll need to add setItems to your context)
      // For now, we'll assume you add this method to ItemsContext
      if (typeof setItems === 'function') {
        setItems(mergeResult.items);
      }

      // Show success message with stats
      const { stats } = mergeResult;
      const messages = [];
      if (stats.added > 0) messages.push(`${stats.added} items added`);
      if (stats.updated > 0) messages.push(`${stats.updated} items updated`);
      if (stats.skipped > 0) messages.push(`${stats.skipped} items skipped`);

      showSuccess(`Import completed! ${messages.join(', ')}`);
      
      // Reset state and close modal
      setImportFile(null);
      setImportPreview(null);
      onClose();

    } catch (error) {
      showError(`Import failed: ${error.message}`);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleClose = () => {
    if (!isProcessing) {
      setImportFile(null);
      setImportPreview(null);
      setActiveTab('export');
      onClose();
    }
  };

  const activeItems = items.filter(item => item.status === 'active');
  const soldItems = items.filter(item => item.status === 'sold');

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Import / Export Data" size="lg">
      <div className="space-y-6">
        {/* Tab Navigation */}
        <div className="flex space-x-1 bg-gray-700 p-1 rounded-lg">
          <button
            onClick={() => setActiveTab('export')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'export'
                ? 'bg-orange-600 text-white'
                : 'text-gray-300 hover:text-white hover:bg-gray-600'
            }`}
          >
            📤 Export Data
          </button>
          <button
            onClick={() => setActiveTab('import')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'import'
                ? 'bg-orange-600 text-white'
                : 'text-gray-300 hover:text-white hover:bg-gray-600'
            }`}
          >
            📥 Import Data
          </button>
        </div>

        {/* Export Tab */}
        {activeTab === 'export' && (
          <div className="space-y-4">
            <div className="bg-gray-700 rounded-lg p-4 border border-gray-600">
              <h3 className="text-lg font-semibold text-white mb-3">📊 Export Summary</h3>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-2xl font-bold text-white">{items.length}</p>
                  <p className="text-sm text-gray-400">Total Items</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-orange-400">{activeItems.length}</p>
                  <p className="text-sm text-gray-400">Active Items</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-green-400">{soldItems.length}</p>
                  <p className="text-sm text-gray-400">Sold Items</p>
                </div>
              </div>
            </div>

            <div className="bg-blue-900/30 border border-blue-700 rounded-lg p-4">
              <h4 className="text-sm font-medium text-blue-300 mb-2">💡 Export Information</h4>
              <ul className="text-sm text-blue-200 space-y-1">
                <li>• Exports all your items, prices, and price history</li>
                <li>• Creates a JSON file you can save to your computer</li>
                <li>• Data can be imported back into any instance of this tool</li>
                <li>• Includes metadata like export date and item counts</li>
              </ul>
            </div>

            {items.length === 0 ? (
              <div className="text-center py-6">
                <p className="text-gray-400 mb-4">No items to export</p>
                <p className="text-sm text-gray-500">Add some items first, then come back to export them.</p>
              </div>
            ) : (
              <div className="flex justify-end">
                <Button 
                  onClick={handleExport}
                  disabled={isProcessing}
                  className="flex items-center"
                >
                  {isProcessing ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Exporting...
                    </>
                  ) : (
                    <>
                      📤 Export {items.length} Items
                    </>
                  )}
                </Button>
              </div>
            )}
          </div>
        )}

        {/* Import Tab */}
        {activeTab === 'import' && (
          <div className="space-y-4">
            {/* File Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Select Import File
              </label>
              <input
                type="file"
                accept=".json"
                onChange={handleFileSelect}
                disabled={isProcessing}
                className="block w-full text-sm text-gray-400 
                         file:mr-4 file:py-2 file:px-4
                         file:rounded-md file:border-0
                         file:text-sm file:font-medium
                         file:bg-orange-600 file:text-white
                         hover:file:bg-orange-700
                         file:disabled:opacity-50
                         file:disabled:cursor-not-allowed"
              />
            </div>

            {/* Import Options */}
            {importPreview && (
              <>
                <div className="space-y-3">
                  <h4 className="text-sm font-medium text-gray-300">Import Options</h4>
                  
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={importOptions.skipDuplicates}
                      onChange={(e) => setImportOptions(prev => ({ ...prev, skipDuplicates: e.target.checked }))}
                      className="rounded bg-gray-700 border-gray-600 text-orange-600 focus:ring-orange-500"
                    />
                    <span className="text-sm text-gray-300">Skip duplicate items</span>
                  </label>
                  
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={importOptions.overwriteExisting}
                      onChange={(e) => setImportOptions(prev => ({ ...prev, overwriteExisting: e.target.checked }))}
                      disabled={!importOptions.skipDuplicates}
                      className="rounded bg-gray-700 border-gray-600 text-orange-600 focus:ring-orange-500 disabled:opacity-50"
                    />
                    <span className="text-sm text-gray-300">Overwrite existing duplicates</span>
                  </label>
                  
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={importOptions.createBackup}
                      onChange={(e) => setImportOptions(prev => ({ ...prev, createBackup: e.target.checked }))}
                      className="rounded bg-gray-700 border-gray-600 text-orange-600 focus:ring-orange-500"
                    />
                    <span className="text-sm text-gray-300">Create backup before import</span>
                  </label>
                </div>

                {/* Import Preview */}
                <div className="bg-gray-700 rounded-lg p-4 border border-gray-600">
                  <h4 className="text-sm font-medium text-gray-300 mb-3">📋 Import Preview</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-400">File contains:</p>
                      <p className="text-white">{importPreview.items.length} items</p>
                    </div>
                    <div>
                      <p className="text-gray-400">Export date:</p>
                      <p className="text-white">
                        {importPreview.metadata?.exportDate 
                          ? new Date(importPreview.metadata.exportDate).toLocaleDateString()
                          : 'Unknown'
                        }
                      </p>
                    </div>
                  </div>
                  
                  {importPreview.items.length > 0 && (
                    <div className="mt-3 text-xs text-gray-400">
                      <p>Sample items: {importPreview.items.slice(0, 3).map(item => item.name).join(', ')}</p>
                      {importPreview.items.length > 3 && <p>...and {importPreview.items.length - 3} more</p>}
                    </div>
                  )}
                </div>
              </>
            )}

            {/* Warning for existing data */}
            {items.length > 0 && importPreview && (
              <div className="bg-yellow-900/30 border border-yellow-700 rounded-lg p-4">
                <h4 className="text-sm font-medium text-yellow-300 mb-2">⚠️ Existing Data Warning</h4>
                <p className="text-sm text-yellow-200">
                  You currently have {items.length} items. Importing will merge the new data with your existing items.
                  {importOptions.createBackup && ' A backup will be created automatically.'}
                </p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex justify-end space-x-3">
              <Button variant="secondary" onClick={handleClose} disabled={isProcessing}>
                Cancel
              </Button>
              {importPreview && (
                <Button 
                  onClick={handleImport}
                  disabled={isProcessing}
                  className="flex items-center"
                >
                  {isProcessing ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Importing...
                    </>
                  ) : (
                    <>
                      📥 Import {importPreview.items.length} Items
                    </>
                  )}
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default ImportExportModal;
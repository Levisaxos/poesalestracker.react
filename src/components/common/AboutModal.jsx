import Modal from './Modal';
import Button from './Button';

const AboutModal = ({ isOpen, onClose }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="About PoE Sales Tracker" size="lg">
      <div className="space-y-6">
        {/* Introduction */}
        <div className="bg-gray-700 rounded-lg p-4 border border-gray-600">
          <h3 className="text-lg font-semibold text-white mb-3 flex items-center">
            <span className="mr-2">📦</span>
            What is this?
          </h3>
          <p className="text-gray-300 leading-relaxed">
            PoE Sales Tracker is a web-based tool designed to help Path of Exile 2 players 
            manage their item sales efficiently. Simply copy-paste item text from the game, 
            set your price, and track your inventory and sales history all in one place.
          </p>
        </div>

        {/* Why I Created This */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-3 flex items-center">
            <span className="mr-2">💡</span>
            Why I created this
          </h3>
          <div className="text-gray-300 space-y-3">
            <p>
              As an active Path of Exile 2 player, I found myself constantly losing track of what items 
              I had listed for sale, their prices, and which ones were selling well. Managing dozens of 
              items across different stash tabs became overwhelming.
            </p>
            <p>
              I wanted a simple, clean interface where I could:
            </p>
            <ul className="list-disc ml-6 space-y-1 text-gray-400">
              <li>Quickly add items by copy-pasting from the game</li>
              <li>Track price adjustments and see what works</li>
              <li>Monitor sales performance and revenue</li>
              <li>Keep everything organized without external spreadsheets</li>
            </ul>
            <p>
              This tool is born from personal need and shared freely with the PoE community.
            </p>
          </div>
        </div>

        {/* Features */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-3 flex items-center">
            <span className="mr-2">⚡</span>
            Key Features
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-800 rounded-lg p-3 border border-gray-700">
              <h4 className="font-medium text-orange-400 mb-2">📋 Easy Item Import</h4>
              <p className="text-sm text-gray-400">Copy item text from PoE2, paste it here, and it's automatically parsed with all properties and pricing</p>
            </div>
            <div className="bg-gray-800 rounded-lg p-3 border border-gray-700">
              <h4 className="font-medium text-orange-400 mb-2">💰 Price Management</h4>
              <p className="text-sm text-gray-400">Track price changes, view history, and optimize your pricing strategy</p>
            </div>
            <div className="bg-gray-800 rounded-lg p-3 border border-gray-700">
              <h4 className="font-medium text-orange-400 mb-2">📊 Sales Analytics</h4>
              <p className="text-sm text-gray-400">Monitor your total revenue, average sale prices, and selling patterns</p>
            </div>
            <div className="bg-gray-800 rounded-lg p-3 border border-gray-700">
              <h4 className="font-medium text-orange-400 mb-2">🔒 Privacy First</h4>
              <p className="text-sm text-gray-400">All data is stored locally in your browser - no accounts, no cloud storage</p>
            </div>
          </div>
        </div>

        {/* Community & Contributions */}
        <div className="bg-blue-900/30 border border-blue-700 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-blue-300 mb-3 flex items-center">
            <span className="mr-2">🤝</span>
            Community & Feature Requests
          </h3>
          <div className="text-blue-200 space-y-3">
            <p>
              This is an open-source project and I welcome community input! You're encouraged to:
            </p>
            <ul className="list-disc ml-6 space-y-1">
              <li>Submit feature requests or bug reports on GitHub</li>
              <li>Suggest improvements to the user experience</li>
              <li>Share ideas for new functionality</li>
            </ul>
            <p className="text-sm bg-blue-800/50 rounded p-3 mt-3">
              <strong>Please note:</strong> While I appreciate all feedback and suggestions, 
              I cannot promise to implement every request. Development time is limited, and I 
              prioritize features that benefit the broader PoE community while maintaining 
              the tool's simplicity and performance.
            </p>
          </div>
        </div>

        {/* Technical Info */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-3 flex items-center">
            <span className="mr-2">🛠️</span>
            Technical Details
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <h4 className="font-medium text-gray-300 mb-2">Built With:</h4>
              <ul className="text-gray-400 space-y-1">
                <li>• React 18 with Hooks</li>
                <li>• Tailwind CSS for styling</li>
                <li>• Local Storage for data persistence</li>
                <li>• No external APIs or servers</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-gray-300 mb-2">Data & Privacy:</h4>
              <ul className="text-gray-400 space-y-1">
                <li>• All data stays on your device</li>
                <li>• No user tracking or analytics</li>
                <li>• No accounts or registration required</li>
                <li>• Export/import your data anytime</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Links */}
        <div className="border-t border-gray-600 pt-4">
          <div className="flex flex-wrap gap-4 justify-center">
            <a 
              href="https://github.com/Levisaxos/poesalestracker.react" 
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded-md transition-colors"
            >
              <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z" clipRule="evenodd" />
              </svg>
              View on GitHub
            </a>
            <a 
              href="https://github.com/Levisaxos/poesalestracker.react/issues" 
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center bg-orange-600 hover:bg-orange-700 text-white py-2 px-4 rounded-md transition-colors"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Report Issues
            </a>
          </div>
        </div>

        {/* Close Button */}
        <div className="flex justify-end pt-4 border-t border-gray-600">
          <Button onClick={onClose}>
            Got it!
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default AboutModal;
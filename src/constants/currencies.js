// Currency definitions with images and properties
export const CURRENCIES = {
  divine: {
    name: 'Divine Orb',
    color: 'text-amber-400',
    image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMTIiIGN5PSIxMiIgcj0iMTAiIGZpbGw9IiNGRkJGMDAiIHN0cm9rZT0iI0Y1OTUwNSIgc3Ryb2tlLXdpZHRoPSIyIi8+CjxwYXRoIGQ9Ik0xMiA2TDE0IDEwSDEwTDEyIDZaIiBmaWxsPSIjRjU5NTA1Ii8+CjxwYXRoIGQ9Ik0xMiAxOEwxMCAxNEgxNEwxMiAxOFoiIGZpbGw9IiNGNTk1MDUiLz4KPHBhdGggZD0iTTYgMTJMMTAgMTBWMTRMNiAxMloiIGZpbGw9IiNGNTk1MDUiLz4KPHBhdGggZD0iTTE4IDEyTDE0IDEwVjE0TDE4IDEyWiIgZmlsbD0iI0Y1OTUwNSIvPgo8L3N2Zz4K'
  },
  chaos: {
    name: 'Chaos Orb',
    color: 'text-orange-400',
    image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMTIiIGN5PSIxMiIgcj0iMTAiIGZpbGw9IiNGRjc0MDAiIHN0cm9rZT0iI0VBNTgwQyIgc3Ryb2tlLXdpZHRoPSIyIi8+CjxjaXJjbGUgY3g9IjEyIiBjeT0iMTIiIHI9IjYiIGZpbGw9IiNFQTU4MEMiLz4KPGNpcmNsZSBjeD0iMTIiIGN5PSIxMiIgcj0iMyIgZmlsbD0iI0ZGNzQwMCIvPgo8L3N2Zz4K'
  },
  exalted: {
    name: 'Exalted Orb',
    color: 'text-yellow-300',
    image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMTIiIGN5PSIxMiIgcj0iMTAiIGZpbGw9IiNGRUY5QzMiIHN0cm9rZT0iI0VBQjMwOCIgc3Ryb2tlLXdpZHRoPSIyIi8+CjxwYXRoIGQ9Ik0xMiA0TDE2IDhIMTJMMTYgMTJIMTJMMTYgMTZIMTJMMTYgMjBIMTJMOCAyMEgxMkw4IDE2SDEyTDggMTJIMTJMOCA4SDEyTDggNEgxMloiIGZpbGw9IiNFQUIzMDgiLz4KPC9zdmc+Cg=='
  }
};

// Helper function to get currency data
export const getCurrency = (currencyKey) => {
  return CURRENCIES[currencyKey] || CURRENCIES.divine;
};

// Helper function to get all currency keys
export const getCurrencyKeys = () => {
  return Object.keys(CURRENCIES);
};
// Currency definitions with local images from public directory
export const CURRENCIES = {
  divine: {
    name: 'Divine Orb',
    color: 'text-amber-400',
    image: '/divine_orb.png'
  },
  chaos: {
    name: 'Chaos Orb',
    color: 'text-orange-400',
    image: '/chaos_orb.png'
  },
  exalted: {
    name: 'Exalted Orb',
    color: 'text-yellow-300',
    image: '/exalted_orb.png'
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
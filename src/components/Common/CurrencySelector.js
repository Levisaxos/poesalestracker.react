import React from 'react';
import { ChevronDown } from 'lucide-react';
import { CURRENCIES, getCurrency } from '../../constants/currencies';

const CurrencySelector = ({ value, onChange, size = 'normal', showLabel = true }) => {
  const selectedCurrency = getCurrency(value);
  const isSmall = size === 'small';

  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`appearance-none bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none transition-colors cursor-pointer ${
          isSmall 
            ? 'px-8 py-1 pr-6 text-xs' 
            : 'px-10 py-2 pr-8 text-sm'
        }`}
        style={{
          backgroundImage: `url(${selectedCurrency.image})`,
          backgroundRepeat: 'no-repeat',
          backgroundPosition: isSmall ? '4px center' : '8px center',
          backgroundSize: isSmall ? '12px 12px' : '16px 16px'
        }}
      >
        {Object.entries(CURRENCIES).map(([key, currency]) => (
          <option key={key} value={key}>
            {showLabel ? currency.name : key.charAt(0).toUpperCase() + key.slice(1)}
          </option>
        ))}
      </select>
      <ChevronDown 
        size={isSmall ? 12 : 16} 
        className="absolute right-1 top-1/2 transform -translate-y-1/2 text-slate-400 pointer-events-none" 
      />
    </div>
  );
};

export const getCurrencyDisplay = (currency, amount, size = 'normal') => {
  const curr = getCurrency(currency);
  const imageSize = size === 'small' ? '16px' : '20px';
  
  return (
    <span className={`${curr.color} font-bold ${size === 'small' ? 'text-xs' : 'text-sm'} flex items-center gap-1`}>
      {amount}
      <img 
        src={curr.image} 
        alt={curr.name}
        style={{ width: imageSize, height: imageSize }}
        className="inline-block"
      />
    </span>
  );
};

export default CurrencySelector;
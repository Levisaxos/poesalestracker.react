import { RARITIES } from '../../utils/constants';

const ItemTooltip = ({ item, showPrice = false, className = "" }) => {
  if (!item) return null;

  const getRarityStyles = (rarity) => {
    switch (rarity) {
      case RARITIES.NORMAL:
        return 'text-gray-300';
      case RARITIES.MAGIC:
        return 'text-blue-400';
      case RARITIES.RARE:
        return 'text-yellow-400';
      case RARITIES.UNIQUE:
        return 'text-orange-500';
      default:
        return 'text-gray-300';
    }
  };

  const getPropertyColor = (property) => {
    if (property.includes('increased') || property.includes('+')) {
      return 'text-blue-300';
    }
    if (property.includes('Grants Skill')) {
      return 'text-purple-400';
    }
    if (property.includes('(rune)') || property.includes('(desecrated)')) {
      return 'text-green-400';
    }
    return 'text-gray-300';
  };

  return (
    <div className={`bg-gray-900 border-2 border-yellow-600 rounded-lg p-3 font-mono text-sm w-fit min-w-64 ${className}`}>
      {/* Item Name */}
      <div className="text-center mb-2">
        <div className={`text-lg font-bold ${getRarityStyles(item.rarity)}`}>
          {item.name}
        </div>
        <div className="text-gray-400 text-sm">
          {item.baseType}
        </div>
      </div>

      {/* Separator */}
      <div className="border-t border-gray-600 my-2"></div>

      {/* Item Class */}
      <div className="text-gray-400 text-xs mb-1">
        {item.itemClass?.toUpperCase()}
      </div>

      {/* Requirements */}
      {item.requirements && (
        <>
          <div className="text-gray-400 text-xs">
            REQUIRES: LEVEL {item.requirements.level}
            {item.requirements.intelligence && `, ${item.requirements.intelligence} INT`}
            {item.requirements.strength && `, ${item.requirements.strength} STR`}
            {item.requirements.dexterity && `, ${item.requirements.dexterity} DEX`}
          </div>
          <div className="border-t border-gray-600 my-2"></div>
        </>
      )}

      {/* Sockets */}
      {item.sockets && (
        <>
          <div className="text-gray-300 text-xs mb-1">
            {item.sockets}
          </div>
          <div className="border-t border-gray-600 my-2"></div>
        </>
      )}

      {/* Item Level */}
      {item.itemLevel && (
        <>
          <div className="text-gray-400 text-xs mb-1">
            ITEM LEVEL: {item.itemLevel}
          </div>
          <div className="border-t border-gray-600 my-2"></div>
        </>
      )}

      {/* Properties */}
      {item.properties && item.properties.length > 0 && (
        <div className="space-y-1">
          {item.properties.map((property, index) => (
            <div key={index} className={`text-xs ${getPropertyColor(property)} whitespace-nowrap`}>
              {property}
            </div>
          ))}
        </div>
      )}

      {/* Price (if showing) */}
      {showPrice && item.price && (
        <>
          <div className="border-t border-gray-600 my-2"></div>
          <div className="text-center">
            <span className="text-yellow-400 font-bold text-sm">
              {item.price.amount} {item.price.currency.toUpperCase()}
            </span>
          </div>
        </>
      )}
    </div>
  );
};

export default ItemTooltip;
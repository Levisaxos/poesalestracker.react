import React from 'react';

const ItemTooltip = ({ itemText, className = "", direct = false }) => {
  if (!itemText || !itemText.trim()) {
    return null;
  }

  const parseItemText = (text) => {
    const lines = text.trim().split('\n');
    const item = {
      itemClass: '',
      rarity: 'Normal',
      name: '',
      baseType: '',
      requirements: [],
      itemLevel: '',
      grantedSkill: '',
      stats: [],
      note: ''
    };

    let currentSection = 'header';
    
    for (let line of lines) {
      line = line.trim();
      
      if (line === '--------') {
        continue;
      }
      
      if (line.startsWith('Item Class:')) {
        item.itemClass = line.replace('Item Class:', '').trim();
      } else if (line.startsWith('Rarity:')) {
        item.rarity = line.replace('Rarity:', '').trim();
      } else if (line.startsWith('Requires:')) {
        item.requirements.push(line.replace('Requires:', '').trim());
      } else if (line.startsWith('Item Level:')) {
        item.itemLevel = line.replace('Item Level:', '').trim();
      } else if (line.startsWith('Grants Skill:')) {
        item.grantedSkill = line.replace('Grants Skill:', '').trim();
      } else if (line.startsWith('Note:')) {
        item.note = line.replace('Note:', '').trim();
      } else if (line && !line.includes(':') && item.name === '') {
        // First non-special line is the item name
        item.name = line;
      } else if (line && !line.includes(':') && item.baseType === '' && item.name !== '') {
        // Second non-special line is the base type
        item.baseType = line;
      } else if (line && (line.includes('%') || line.includes('+') || line.includes('-') || line.includes('to'))) {
        // Stats lines
        item.stats.push(line);
      }
    }
    
    return item;
  };

  const item = parseItemText(itemText);

  const getRarityColor = (rarity) => {
    switch (rarity.toLowerCase()) {
      case 'normal': return 'text-gray-300';
      case 'magic': return 'text-blue-400';
      case 'rare': return 'text-yellow-400';
      case 'unique': return 'text-orange-400';
      case 'gem': return 'text-cyan-400';
      case 'currency': return 'text-yellow-300';
      default: return 'text-gray-300';
    }
  };

  const getStatColor = (stat) => {
    if (stat.includes('(desecrated)')) {
      return 'text-red-400';
    }
    if (stat.includes('Chaos') || stat.includes('chaos')) {
      return 'text-purple-400';
    }
    if (stat.includes('+') || stat.includes('increased') || stat.includes('more')) {
      return 'text-blue-400';
    }
    if (stat.includes('Grants Skill')) {
      return 'text-cyan-400';
    }
    return 'text-blue-400';
  };

  const formatStat = (stat) => {
    // Remove (desecrated) for display but keep color indication
    return stat.replace(' (desecrated)', '');
  };

  const tooltipContent = (
    <>
      {/* Item Header */}
      <div className="text-center mb-2">
        <div className={`text-lg font-bold ${getRarityColor(item.rarity)}`}>
          {item.name}
        </div>
        {item.baseType && (
          <div className="text-gray-400 text-base">
            {item.baseType}
          </div>
        )}
      </div>

      {/* Separator */}
      {(item.name || item.baseType) && <div className="border-t border-gray-600 my-2"></div>}

      {/* Item Class */}
      {item.itemClass && (
        <div className="text-gray-400 text-sm mb-1">
          Item Class: <span className="text-gray-300">{item.itemClass}</span>
        </div>
      )}

      {/* Requirements */}
      {item.requirements.length > 0 && (
        <div className="text-gray-400 text-sm mb-1">
          Requires: <span className="text-red-400">{item.requirements.join(', ')}</span>
        </div>
      )}

      {/* Separator */}
      {(item.requirements.length > 0 || item.itemClass) && (
        <div className="border-t border-gray-600 my-2"></div>
      )}

      {/* Item Level */}
      {item.itemLevel && (
        <>
          <div className="text-gray-400 text-sm mb-1">
            Item Level: <span className="text-gray-300">{item.itemLevel}</span>
          </div>
          <div className="border-t border-gray-600 my-2"></div>
        </>
      )}

      {/* Granted Skill */}
      {item.grantedSkill && (
        <>
          <div className="text-cyan-400 text-sm flex items-center mb-2">
            <div className="w-5 h-5 bg-purple-600 rounded mr-2 flex items-center justify-center text-xs">
              💎
            </div>
            {item.grantedSkill}
          </div>
          <div className="border-t border-gray-600 my-2"></div>
        </>
      )}

      {/* Stats */}
      {item.stats.length > 0 && (
        <div className="space-y-1 mb-2">
          {item.stats.map((stat, index) => (
            <div key={index} className={`${getStatColor(stat)} text-sm`}>
              {formatStat(stat)}
            </div>
          ))}
        </div>
      )}    
    </>
  );

  // If direct mode, return just the content without container
  if (direct) {
    return <div className={`font-mono text-sm ${className}`}>{tooltipContent}</div>;
  }

  // Otherwise return with the traditional tooltip container
  return (
    <div className={`bg-gray-900 border-2 border-gray-700 rounded-lg p-3 font-mono text-sm max-w-sm ${className}`}>
      {tooltipContent}
    </div>
  );
};

export default ItemTooltip;
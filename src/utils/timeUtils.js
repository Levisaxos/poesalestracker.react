// Smart time formatting utilities
export const getTimeListedText = (createdAt) => {
  const now = new Date();
  const created = new Date(createdAt);
  const diffMs = now - created;
  const diffMinutes = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const diffWeeks = Math.floor(diffDays / 7);

  if (diffMinutes < 60) {
    return `${diffMinutes}m listed`;
  } else if (diffHours < 24) {
    return `${diffHours}h listed`;
  } else if (diffDays < 7) {
    return `${diffDays}d listed`;
  } else {
    return `${diffWeeks}w listed`;
  }
};

export const getTimeSoldText = (createdAt, soldAt) => {
  if (!soldAt) return '';
  
  const created = new Date(createdAt);
  const sold = new Date(soldAt);
  const diffMs = sold - created;
  const diffMinutes = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const diffWeeks = Math.floor(diffDays / 7);

  if (diffMinutes < 60) {
    return `${diffMinutes}m to sell`;
  } else if (diffHours < 24) {
    return `${diffHours}h to sell`;
  } else if (diffDays < 7) {
    return `${diffDays}d to sell`;
  } else {
    return `${diffWeeks}w to sell`;
  }
};
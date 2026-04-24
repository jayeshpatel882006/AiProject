export const formatDate = (iso) => {
  const d = new Date(iso);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

export const formatTime = (iso) => {
  return new Date(iso).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
};

export const formatDateTime = (iso) => `${formatDate(iso)} · ${formatTime(iso)}`;

export const truncate = (str = '', max = 80) =>
  str.length > max ? str.slice(0, max) + '…' : str;

export const formatTokens = (n) => (n ? n.toLocaleString() : '—');

export const capitalize = (s = '') => s.charAt(0).toUpperCase() + s.slice(1);

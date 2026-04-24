export const SUMMARY_STYLES = [
  { value: 'concise', label: 'Concise', icon: '⚡' },
  { value: 'detailed', label: 'Detailed', icon: '📄' },
  { value: 'bullet',  label: 'Bullet',   icon: '•' },
];

export const CONTENT_TYPES = [
  { value: 'blog',    label: 'Blog Post',    icon: '✍️' },
  { value: 'email',   label: 'Email',        icon: '📧' },
  { value: 'social',  label: 'Social Media', icon: '📱' },
  { value: 'ad',      label: 'Ad Copy',      icon: '📢' },
  { value: 'product', label: 'Product Desc', icon: '🛍️' },
];

export const TONES = [
  { value: 'professional', label: 'Professional' },
  { value: 'casual',       label: 'Casual' },
  { value: 'humorous',     label: 'Humorous' },
  { value: 'formal',       label: 'Formal' },
];

export const HISTORY_TYPES = [
  { value: '',          label: 'All' },
  { value: 'chat',      label: 'Chat' },
  { value: 'summarize', label: 'Summarize' },
  { value: 'generate',  label: 'Generate' },
];

export const TYPE_COLORS = {
  chat:      { bg: 'rgba(99,102,241,0.15)',  color: '#6366f1' },
  summarize: { bg: 'rgba(6,182,212,0.15)',   color: '#06b6d4' },
  generate:  { bg: 'rgba(139,92,246,0.15)',  color: '#8b5cf6' },
};

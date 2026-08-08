export interface JournalColorSwatch {
  id: string;
  label: string;
  hex: string;
  soft: string;
}

export const JOURNAL_COLORS: JournalColorSwatch[] = [
  { id: 'peach', label: 'Peach', hex: '#f5804a', soft: '#fde8da' },
  { id: 'blush', label: 'Blush', hex: '#e5808f', soft: '#fbe3e6' },
  { id: 'honey', label: 'Honey', hex: '#d99a3d', soft: '#faedd3' },
  { id: 'cocoa', label: 'Cocoa', hex: '#a6795f', soft: '#f0e4da' },
  { id: 'sage', label: 'Sage', hex: '#8ba888', soft: '#e6ede5' },
  { id: 'sky', label: 'Sky', hex: '#7fa8c9', soft: '#e2edf5' },
];

export const JOURNAL_STICKERS = [
  '✨', '🌙', '⭐️', '☕️', '📖', '🌸',
  '🤲', '🕊️', '🔥', '💭', '🌿', '📿',
  '🍂', '💫', '🖋️', '🌤️',
];
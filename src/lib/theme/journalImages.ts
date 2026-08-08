export type JournalImage = {
  id: string;
  label: string;
  src: string;
};

// Replace src paths with your own assets in /public/journal or a CDN.
export const JOURNAL_IMAGES: JournalImage[] = [
  { id: 'coffee', label: 'Coffee', src: '/journal/coffee.webp' },
  { id: 'sunset', label: 'Sunset', src: '/journal/sunset.jpg' },
  { id: 'plants', label: 'Plants', src: '/journal/plants.jpg' },
  { id: 'books', label: 'Books', src: '/journal/books.jpg' },
  { id: 'beach', label: 'Beach', src: '/journal/beach.jpg' },
  { id: 'city', label: 'City', src: '/journal/city.jpg' },
  { id: 'castle', label: 'Castle', src: '/journal/castle.avif' },
  { id: 'dragon', label: 'Dragon', src: '/journal/dragon.jpg' },
  { id: 'unicorn', label: 'Unicorn', src: '/journal/unicorn.webp' },

];
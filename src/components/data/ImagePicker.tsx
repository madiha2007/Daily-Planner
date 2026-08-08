'use client';

import { useRef } from 'react';
import { Upload, X } from 'lucide-react';
import { JOURNAL_IMAGES } from '@/lib/theme/journalImages';

export default function ImagePicker({
  value,
  onChange,
}: {
  value?: string;
  onChange: (image: string | undefined) => void;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => onChange(reader.result as string);
    reader.readAsDataURL(file);
  };

  return (
    <div>
      <p className="mb-2 text-xs font-medium text-cocoa-600">Image (optional)</p>

      <div className="flex flex-wrap gap-2">
        {JOURNAL_IMAGES.map((img) => (
          <button
            key={img.id}
            type="button"
            onClick={() => onChange(img.src)}
            className={`h-14 w-14 overflow-hidden rounded-lg border-2 transition-colors ${
              value === img.src ? 'border-peach-400' : 'border-transparent'
            }`}
            aria-label={img.label}
          >
            <img src={img.src} alt={img.label} className="h-full w-full object-cover" />
          </button>
        ))}

        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="flex h-14 w-14 items-center justify-center rounded-lg border-2 border-dashed border-peach-300 text-cocoa-400 hover:bg-peach-50"
          aria-label="Upload image"
        >
          <Upload size={16} />
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleUpload(file);
          }}
        />
      </div>

      {value && (
        <div className="mt-3 flex items-center gap-2">
          <img src={value} alt="Selected" className="h-16 w-16 rounded-lg object-cover" />
          <button
            type="button"
            onClick={() => onChange(undefined)}
            className="flex items-center gap-1 text-xs text-cocoa-400 hover:text-red-400"
          >
            <X size={12} /> Remove
          </button>
        </div>
      )}
    </div>
  );
}
'use client';

import { useState, useRef } from 'react';
import { Camera, Loader2 } from 'lucide-react';
import { useAuthStore } from '@/stores/useAuthStore';
import { uploadAvatar } from '@/lib/firebase/profile';

export default function AvatarUploader() {
  const user = useAuthStore((s) => s.user);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    if (file.size > 5 * 1024 * 1024) {
      setError('Image must be under 5MB.');
      return;
    }

    setError(null);
    setUploading(true);
    try {
      await uploadAvatar(user, file);
    } catch {
      setError('Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <button
        onClick={() => inputRef.current?.click()}
        disabled={uploading}
        className="group relative flex h-20 w-20 items-center justify-center overflow-hidden rounded-full border-2 border-peach-200 bg-peach-50 shadow-soft"
      >
        {user?.photoURL ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={user.photoURL} alt="" className="h-full w-full object-cover" />
        ) : (
          <span className="text-2xl font-semibold text-peach-500">
            {user?.displayName?.charAt(0).toUpperCase() ?? 'U'}
          </span>
        )}
        <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
          {uploading ? (
            <Loader2 size={18} className="animate-spin text-white" />
          ) : (
            <Camera size={18} className="text-white" />
          )}
        </div>
      </button>
      <input ref={inputRef} type="file" accept="image/*" onChange={handleFile} className="hidden" />
      {error && <span className="text-xs text-red-500">{error}</span>}
    </div>
  );
}
'use client';

import { useState } from 'react';
import { X, Check } from 'lucide-react';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import { Textarea, Input } from '@/components/ui/Input';
import { useJournalStore } from '@/stores/useJournalStore';
import { useOverlayStore } from '@/stores/useOverlayStore';
import { JournalEntry } from '@/lib/types';
import { JOURNAL_COLORS, JOURNAL_STICKERS } from '@/lib/theme/journalPalette';
import { JOURNAL_IMAGES } from '@/lib/theme/journalImages';
import { cn } from '@/lib/utils';

const MOODS: { id: JournalEntry['mood']; emoji: string; label: string }[] = [
  { id: 'great', emoji: '😄', label: 'Great' },
  { id: 'good', emoji: '🙂', label: 'Good' },
  { id: 'okay', emoji: '😐', label: 'Okay' },
  { id: 'low', emoji: '😔', label: 'Low' },
  { id: 'rough', emoji: '😣', label: 'Rough' },
];

export default function AddJournalModal() {
  const payload = useOverlayStore((s) => s.payload) as { entry?: JournalEntry } | null;
  const editing = payload?.entry;

  const addEntry = useJournalStore((s) => s.addEntry);
  const editEntry = useJournalStore((s) => s.editEntry);
  const close = useOverlayStore((s) => s.close);

  const [title, setTitle] = useState(editing?.title ?? '');
  const [content, setContent] = useState(editing?.content ?? '');
  const [mood, setMood] = useState<JournalEntry['mood']>(editing?.mood ?? 'good');
  const [color, setColor] = useState(editing?.color ?? JOURNAL_COLORS[0].id);
  const [stickers, setStickers] = useState<string[]>(editing?.stickers ?? []);
  const [image, setImage] = useState<string | undefined>(editing?.image);
  const [imagePosition, setImagePosition] = useState<'top' | 'left'>(editing?.imagePosition ?? 'top');
  const [submitting, setSubmitting] = useState(false);

  const toggleSticker = (s: string) => {
    setStickers((prev) =>
      prev.includes(s) ? prev.filter((x) => x !== s) : prev.length < 6 ? [...prev, s] : prev
    );
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setImage(reader.result as string);
    reader.readAsDataURL(file);
  };

  const onSubmit = async () => {
    if (!content.trim()) return;
    setSubmitting(true);
    const payloadData = {
      title: title.trim() || undefined,
      content,
      mood,
      color,
      stickers,
      image,
      imagePosition,
    };
    if (editing) {
      await editEntry(editing.id, payloadData);
    } else {
      await addEntry(payloadData);
    }
    setSubmitting(false);
    close();
  };

  const swatch = JOURNAL_COLORS.find((c) => c.id === color) ?? JOURNAL_COLORS[0];

  return (
    <Modal title={editing ? 'Edit Entry' : 'New Journal Entry'} maxWidth="max-w-lg">
      <div className="flex max-h-[70vh] flex-col gap-4 overflow-y-auto pr-1">
        <div className="flex justify-between gap-2">
          {MOODS.map((m) => (
            <button
              key={m.id}
              type="button"
              onClick={() => setMood(m.id)}
              className={cn(
                'flex flex-1 flex-col items-center gap-1 rounded-xl border py-2 text-lg transition-colors',
                mood === m.id ? 'border-peach-400 bg-peach-50' : 'border-peach-100 bg-white hover:bg-peach-50'
              )}
            >
              <span>{m.emoji}</span>
              <span className="text-[10px] text-cocoa-400">{m.label}</span>
            </button>
          ))}
        </div>

        <Input
          label="Title (optional)"
          placeholder="A word for today..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <Textarea
          label="How was your day?"
          rows={5}
          placeholder="Write it out..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />

        <div>
          <p className="mb-2 text-sm font-medium text-cocoa-700">Color</p>
          <div className="flex gap-2">
            {JOURNAL_COLORS.map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => setColor(c.id)}
                aria-label={c.label}
                className={cn(
                  'h-8 w-8 rounded-full border-2 transition-transform',
                  color === c.id ? 'scale-110 border-cocoa-600' : 'border-transparent hover:scale-105'
                )}
                style={{ backgroundColor: c.hex }}
              />
            ))}
          </div>
        </div>

        <div>
          <p className="mb-2 text-sm font-medium text-cocoa-700">Photo (optional)</p>

          {image ? (
            <div className="relative mb-3 h-28 w-full overflow-hidden rounded-xl">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={image} alt="" className="h-full w-full object-cover" />
              <button
                type="button"
                onClick={() => setImage(undefined)}
                className="absolute right-2 top-2 rounded-full bg-white/90 p-1 text-cocoa-600 hover:text-red-400"
              >
                <X size={14} />
              </button>
            </div>
          ) : (
            <>
              <p className="mb-1.5 text-xs text-cocoa-400">Pick a preset</p>
              <div className="mb-3 grid grid-cols-5 gap-2">
                {JOURNAL_IMAGES.map((img) => (
                  <button
                    key={img.id}
                    type="button"
                    onClick={() => setImage(img.src)}
                    title={img.label}
                    className="relative aspect-square overflow-hidden rounded-lg border border-peach-100 hover:border-peach-300"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={img.src} alt={img.label} className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>

              <label className="flex h-16 w-full cursor-pointer items-center justify-center rounded-xl border-2 border-dashed border-peach-200 text-xs text-cocoa-400 hover:border-peach-300 hover:bg-peach-50">
                Or upload your own
                <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
              </label>
            </>
          )}

          {image && (
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setImagePosition('top')}
                className={cn(
                  'flex-1 rounded-lg border py-1.5 text-xs transition-colors',
                  imagePosition === 'top'
                    ? 'border-peach-400 bg-peach-50 text-peach-700'
                    : 'border-peach-100 text-cocoa-500 hover:bg-peach-50'
                )}
              >
                Image on top
              </button>
              <button
                type="button"
                onClick={() => setImagePosition('left')}
                className={cn(
                  'flex-1 rounded-lg border py-1.5 text-xs transition-colors',
                  imagePosition === 'left'
                    ? 'border-peach-400 bg-peach-50 text-peach-700'
                    : 'border-peach-100 text-cocoa-500 hover:bg-peach-50'
                )}
              >
                Image on left
              </button>
            </div>
          )}
        </div>

        <div>
          <p className="mb-2 text-sm font-medium text-cocoa-700">Stickers (up to 6)</p>
          <div className="flex flex-wrap gap-2">
            {JOURNAL_STICKERS.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => toggleSticker(s)}
                className={cn(
                  'flex h-9 w-9 items-center justify-center rounded-full border text-base transition-colors',
                  stickers.includes(s)
                    ? 'border-peach-400 bg-peach-100'
                    : 'border-peach-100 bg-white hover:bg-peach-50'
                )}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        <div
          className="rounded-2xl border border-peach-100 p-3 text-sm text-cocoa-600"
          style={{ backgroundColor: swatch.soft }}
        >
          <p className="mb-1 text-xs font-medium text-cocoa-500">Preview</p>
          {title && <p className="font-semibold text-cocoa-800">{title}</p>}
          <p className="line-clamp-2">{content || 'Your entry preview will show here...'}</p>
        </div>

        <div className="mt-1 flex justify-end gap-2">
          <Button type="button" variant="ghost" onClick={close}>
            Cancel
          </Button>
          <Button type="button" onClick={onSubmit} disabled={submitting || !content.trim()}>
            {submitting ? 'Saving...' : editing ? 'Save Changes' : 'Add Entry'}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
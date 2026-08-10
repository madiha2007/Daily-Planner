'use client';

import { format, parseISO } from 'date-fns';
import { Pencil, Trash2 } from 'lucide-react';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import { useJournalStore } from '@/stores/useJournalStore';
import { useOverlayStore } from '@/stores/useOverlayStore';
import { JournalEntry } from '@/lib/types';
import { JOURNAL_COLORS } from '@/lib/theme/journalPalette';

const moodEmoji: Record<JournalEntry['mood'], string> = {
  great: '😄',
  good: '🙂',
  okay: '😐',
  low: '😔',
  rough: '😣',
};

const moodLabel: Record<JournalEntry['mood'], string> = {
  great: 'Great',
  good: 'Good',
  okay: 'Okay',
  low: 'Low',
  rough: 'Rough',
};

export default function ViewJournalModal() {
  const payload = useOverlayStore((s) => s.payload) as { entry: JournalEntry } | null;
  const open = useOverlayStore((s) => s.open);
  const close = useOverlayStore((s) => s.close);
  const removeEntry = useJournalStore((s) => s.removeEntry);

  if (!payload?.entry) return null;
  const entry = payload.entry;

  const swatch = JOURNAL_COLORS.find((c) => c.id === entry.color) ?? JOURNAL_COLORS[0];
  const stickers = entry.stickers ?? [];
  const imagePosition = entry.imagePosition ?? 'top';

  const handleDelete = () => {
    removeEntry(entry.id);
    close();
  };

  const handleEdit = () => {
    open('addJournal', { entry });
  };

  return (
<Modal
  title=""
  maxWidth="max-w-xl"
  contentClassName="border border-white/40 bg-white/80 backdrop-blur-md"
  closeButtonClassName="text-cocoa-300 hover:bg-cream-100 hover:text-cocoa-500 border border-peach-100"
>
      <div className="-m-2 overflow-hidden rounded-2xl"
      >
        {entry.image && imagePosition === 'top' && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={entry.image} alt="" className="h-56 w-full object-cover" />
        )}

        <div
          className="flex flex-col gap-5 p-6"
          style={{ backgroundColor: swatch.soft }}
        >
          <div className="flex items-start gap-4">
            {entry.image && imagePosition === 'left' && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={entry.image}
                alt=""
                className="h-20 w-20 shrink-0 rounded-xl object-cover shadow-warm"
              />
            )}

            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 text-xs text-cocoa-500">
                <span
                  className="flex h-6 w-6 items-center justify-center rounded-full text-sm"
                  
                >
                  {moodEmoji[entry.mood]}
                </span>
                <span>{moodLabel[entry.mood]}</span>
                <span>·</span>
                <span>{format(parseISO(entry.createdAt), 'EEEE, MMMM d, yyyy · h:mma')}</span>
              </div>
              {entry.title && (
                <h2 className="mt-2 text-2xl font-semibold text-cocoa-800">{entry.title}</h2>
              )}
            </div>
          </div>

          <p className="whitespace-pre-wrap text-[15px] leading-relaxed text-cocoa-700">
            {entry.content}
          </p>

          {stickers.length > 0 && (
            <div className="flex gap-2 text-xl">
              {stickers.map((s, i) => (
                <span key={i}>{s}</span>
              ))}
            </div>
          )}

          <div className="mt-2 flex justify-end gap-2 border-t border-white/60 pt-4">
            <Button type="button" variant="ghost" onClick={handleDelete}>
              <Trash2 size={15} /> Delete
            </Button>
            <Button type="button" onClick={handleEdit}>
              <Pencil size={15} /> Edit
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
}
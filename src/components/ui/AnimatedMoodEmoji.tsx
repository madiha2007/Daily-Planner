'use client';

import { useState } from 'react';
import { JournalEntry } from '@/lib/types';
import dynamic from 'next/dynamic';

const Player = dynamic(
  () =>
    import('@lottiefiles/react-lottie-player').then((mod) => mod.Player),
  {
    ssr: false,
  }
);

const MOOD_CODEPOINTS: Record<JournalEntry['mood'], string> = {
  great: '1f604', // grinning face with smiling eyes
  good: '1f642',  // slightly smiling face
  okay: '1f610',  // neutral face
  low: '1f614',   // pensive face
  rough: '1f623', // persevering face
};

const FALLBACK_EMOJI: Record<JournalEntry['mood'], string> = {
  great: '😄',
  good: '🙂',
  okay: '😐',
  low: '😔',
  rough: '😣',
};

export default function AnimatedMoodEmoji({
  mood,
  size = 20,
}: {
  mood: JournalEntry['mood'];
  size?: number;
}) {
  const [failed, setFailed] = useState(false);
  const codepoint = MOOD_CODEPOINTS[mood];

  if (failed) {
    return <span style={{ fontSize: size * 0.8 }}>{FALLBACK_EMOJI[mood]}</span>;
  }

  return (
    <Player
      autoplay
      loop
      src={`https://fonts.gstatic.com/s/e/notoemoji/latest/${codepoint}/lottie.json`}
      style={{ height: size, width: size }}
      onEvent={(event) => {
        if (event === 'error') setFailed(true);
      }}
    />
  );
}
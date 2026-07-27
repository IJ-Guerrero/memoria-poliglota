import { useState, useEffect, useCallback } from 'react';
import { Check } from 'lucide-react';
import type { TranslationPair } from '@/types';

export interface MemoryCard {
  id: string;
  word: string;
  translation_key: string;
  isSource: boolean;
  matched: boolean;
}

export const difficultyConfig = {
  easy: 4,
  medium: 6,
  hard: 8,
};

interface MemoryBoardProps {
  pairs: TranslationPair[];
  difficulty: 'easy' | 'medium' | 'hard';
  onWin: (moves: number, timeSeconds: number) => void;
}

function shuffle<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export default function MemoryBoard({ pairs, difficulty, onWin }: MemoryBoardProps) {
  const [cards, setCards] = useState<MemoryCard[]>([]);
  const [flipped, setFlipped] = useState<number[]>([]);
  const [matchedKeys, setMatchedKeys] = useState<Set<string>>(new Set());
  const [moves, setMoves] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [started, setStarted] = useState(false);
  const [won, setWon] = useState(false);

  const pairCount = difficultyConfig[difficulty] ?? 6;

  const initBoard = useCallback(() => {
    const selected = shuffle(pairs).slice(0, Math.min(pairCount, pairs.length));
    const board: MemoryCard[] = [];
    selected.forEach((p) => {
      board.push({
        id: `${p.translation_key}-src`,
        word: p.source_word,
        translation_key: p.translation_key,
        isSource: true,
        matched: false,
      });
      board.push({
        id: `${p.translation_key}-tgt`,
        word: p.target_word,
        translation_key: p.translation_key,
        isSource: false,
        matched: false,
      });
    });
    setCards(shuffle(board));
    setFlipped([]);
    setMatchedKeys(new Set());
    setMoves(0);
    setSeconds(0);
    setStarted(false);
    setWon(false);
  }, [pairs, pairCount]);

  useEffect(() => {
    initBoard();
  }, [initBoard]);

  useEffect(() => {
    if (!started || won) return;
    const t = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(t);
  }, [started, won]);

  useEffect(() => {
    if (matchedKeys.size > 0 && matchedKeys.size === pairCount) {
      setWon(true);
      onWin(moves, seconds);
    }
  }, [matchedKeys, pairCount, moves, seconds, onWin]);

  function handleFlip(index: number) {
    if (won) return;
    if (flipped.length >= 2) return;
    if (flipped.includes(index)) return;
    if (matchedKeys.has(cards[index].translation_key)) return;

    if (!started) setStarted(true);

    const nextFlipped = [...flipped, index];
    setFlipped(nextFlipped);

    if (nextFlipped.length === 2) {
      setMoves((m) => m + 1);
      const [a, b] = nextFlipped;
      const cardA = cards[a];
      const cardB = cards[b];
      if (
        cardA.translation_key === cardB.translation_key &&
        cardA.isSource !== cardB.isSource
      ) {
        setTimeout(() => {
          setMatchedKeys((prev) => {
            const next = new Set(prev);
            next.add(cardA.translation_key);
            return next;
          });
          setFlipped([]);
        }, 600);
      } else {
        setTimeout(() => setFlipped([]), 900);
      }
    }
  }

  if (cards.length === 0) {
    return (
      <div className="py-16 text-center text-slate-400">
        Not enough word pairs for this category. Try another one.
      </div>
    );
  }

  const gridCols =
    cards.length <= 8 ? 'grid-cols-2 sm:grid-cols-4' : 'grid-cols-3 sm:grid-cols-4';

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4 text-sm">
          <span className="chip bg-teal-50 text-teal-700">
            Moves: <strong className="ml-1">{moves}</strong>
          </span>
          <span className="chip bg-slate-100 text-slate-700">
            Time: <strong className="ml-1">{seconds}s</strong>
          </span>
          <span className="chip bg-emerald-50 text-emerald-700">
            Pairs: <strong className="ml-1">{matchedKeys.size}/{pairCount}</strong>
          </span>
        </div>
        <button onClick={initBoard} className="btn-ghost">
          Restart
        </button>
      </div>

      {won && (
        <div className="mb-6 animate-pop rounded-2xl border border-teal-200 bg-teal-50 p-5 text-center">
          <p className="font-display text-xl font-semibold text-teal-800">
            You did it!
          </p>
          <p className="mt-1 text-sm text-teal-700">
            Cleared in {moves} moves and {seconds} seconds.
          </p>
        </div>
      )}

      <div className={`grid ${gridCols} gap-3 sm:gap-4`}>
        {cards.map((card, index) => {
          const isFlipped = flipped.includes(index) || matchedKeys.has(card.translation_key);
          const isMatched = matchedKeys.has(card.translation_key);
          return (
            <button
              key={card.id}
              onClick={() => handleFlip(index)}
              disabled={isMatched}
              className={`relative flex h-28 items-center justify-center rounded-2xl border p-3 text-center transition-all duration-300 sm:h-32 ${
                isMatched
                  ? 'border-teal-300 bg-teal-50 opacity-70'
                  : isFlipped
                  ? 'border-teal-400 bg-white shadow-md'
                  : 'border-slate-200 bg-gradient-to-br from-slate-100 to-slate-200 shadow-sm hover:border-teal-300 hover:shadow-md'
              }`}
            >
              {isFlipped ? (
                <span className="animate-fade-in">
                  <span
                    className={`block font-display text-lg font-semibold ${
                      isMatched ? 'text-teal-700' : 'text-slate-900'
                    }`}
                  >
                    {card.word}
                  </span>
                  <span className="mt-1 block text-[10px] font-medium uppercase tracking-wide text-slate-400">
                    {card.isSource ? 'Source' : 'Target'}
                  </span>
                  {isMatched && (
                    <Check className="mx-auto mt-1 h-4 w-4 text-teal-500" />
                  )}
                </span>
              ) : (
                <span className="text-2xl text-slate-400">?</span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

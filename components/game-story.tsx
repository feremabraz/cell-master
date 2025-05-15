'use client';

import { useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { useAtomValue } from 'jotai';
import { gameHistoryAtom } from '@store/game-store';

export function GameHistory() {
  const gameHistory = useAtomValue(gameHistoryAtom);
  const historyRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to the bottom of the history
  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    if (historyRef.current) {
      historyRef.current.scrollTop = historyRef.current.scrollHeight;
    }
  }, [gameHistory]);

  return (
    <div ref={historyRef} className="flex-1 overflow-y-auto mb-4 font-mono text-green-500 p-2">
      {gameHistory.map((line, index) => (
        <motion.div
          // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
          key={index}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.05 }}
          className={`mb-1 ${line.startsWith('>') ? 'text-yellow-400' : ''}`}
        >
          {line}
        </motion.div>
      ))}
    </div>
  );
}

import React from 'react';
import { motion } from 'motion/react';

export default function TypingIndicator() {
  return (
    <div className="flex items-center gap-1 px-4 py-2 bg-bg-surface3 border border-border rounded-2xl w-fit">
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          animate={{
            y: [0, -4, 0],
            opacity: [0.4, 1, 0.4],
          }}
          transition={{
            duration: 0.6,
            repeat: Infinity,
            delay: i * 0.1,
          }}
          className="w-1.5 h-1.5 bg-text-muted rounded-full"
        />
      ))}
      <span className="text-[10px] font-black uppercase tracking-widest text-text-muted ml-2">Typing</span>
    </div>
  );
}

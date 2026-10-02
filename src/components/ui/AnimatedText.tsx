import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import type { MotionValue } from 'framer-motion';

interface AnimatedTextProps {
  text: string;
  className?: string;
}

const Letter = ({ letter, progress, start, end }: { letter: string, progress: MotionValue<number>, start: number, end: number }) => {
  const opacity = useTransform(progress, [start, end], [0.2, 1]);
  return (
    <span style={{ position: 'relative' }}>
      <span style={{ opacity: 0 }}>{letter}</span>
      <motion.span style={{ position: 'absolute', left: 0, top: 0, opacity }}>
        {letter}
      </motion.span>
    </span>
  );
};

export const AnimatedText = ({ text, className }: AnimatedTextProps) => {
  const containerRef = useRef<HTMLParagraphElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start 0.8', 'end 0.2'],
  });

  const words = text.split(" ");
  let globalIndex = 0;
  const totalLetters = text.length;

  return (
    <p ref={containerRef} className={className} style={{ display: 'inline-flex', flexWrap: 'wrap', gap: '0.25em' }}>
      {words.map((word, wordIndex) => {
        const letters = word.split("");
        return (
          <span key={wordIndex} style={{ display: 'inline-flex' }}>
            {letters.map((letter, letterIndex) => {
              const start = globalIndex / totalLetters;
              const end = start + (1 / totalLetters);
              globalIndex++;
              
              return (
                <Letter key={letterIndex} letter={letter} progress={scrollYProgress} start={start} end={end} />
              );
            })}
          </span>
        );
      })}
    </p>
  );
};

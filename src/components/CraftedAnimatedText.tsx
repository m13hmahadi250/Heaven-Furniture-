/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * CraftedAnimatedText
 * Continuous looping 3-block per character furniture joinery assembly animation.
 * Each letter (C, R, A, F, T, E, D) is composed of 3 modular architectural blocks
 * that fly in sequentially, interlock, fasten with a dowel pin ("প্যারাগ"),
 * hold in pristine form, and repeat continuously in an infinite loop.
 */

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface SegmentDef {
  id: string;
  clipPath: string;
  initialX: number;
  initialY: number;
  initialRotate: number;
  initialScale: number;
  delay: number;
  pinPos: { top: string; left: string };
}

interface LetterDef {
  char: string;
  segments: SegmentDef[];
}

export function CraftedAnimatedText() {
  const [cycle, setCycle] = useState(0);
  const [activeStage, setActiveStage] = useState<'animating' | 'assembled'>('animating');
  const [assembledLetters, setAssembledLetters] = useState<Record<number, boolean>>({});

  // 7 Letters x 3 distinct physical joinery blocks = 21 modular components
  // Clean, visible, deliberate timing
  const letters: LetterDef[] = useMemo(() => {
    const baseDelay = 0.35;
    const letterInterval = 0.38; // Time between each letter
    const pieceInterval = 0.13;  // Time between the 3 pieces of a single letter

    return [
      // 1. 'C' (3 blocks: Top header, Central spine, Bottom base)
      {
        char: 'C',
        segments: [
          {
            id: 'C-1',
            clipPath: 'polygon(0% 0%, 100% 0%, 100% 36%, 0% 36%)',
            initialX: -110,
            initialY: -95,
            initialRotate: -32,
            initialScale: 0.65,
            delay: baseDelay,
            pinPos: { top: '32%', left: '25%' },
          },
          {
            id: 'C-2',
            clipPath: 'polygon(0% 36%, 100% 36%, 100% 66%, 0% 66%)',
            initialX: -130,
            initialY: 15,
            initialRotate: 24,
            initialScale: 0.7,
            delay: baseDelay + pieceInterval,
            pinPos: { top: '50%', left: '16%' },
          },
          {
            id: 'C-3',
            clipPath: 'polygon(0% 66%, 100% 66%, 100% 100%, 0% 100%)',
            initialX: -85,
            initialY: 110,
            initialRotate: -26,
            initialScale: 0.68,
            delay: baseDelay + pieceInterval * 2,
            pinPos: { top: '68%', left: '26%' },
          },
        ],
      },

      // 2. 'R' (3 blocks: Vertical post, Upper loop, Angled leg)
      {
        char: 'R',
        segments: [
          {
            id: 'R-1',
            clipPath: 'polygon(0% 0%, 44% 0%, 44% 100%, 0% 100%)',
            initialX: -75,
            initialY: 120,
            initialRotate: 28,
            initialScale: 0.7,
            delay: baseDelay + letterInterval,
            pinPos: { top: '35%', left: '38%' },
          },
          {
            id: 'R-2',
            clipPath: 'polygon(44% 0%, 100% 0%, 100% 54%, 44% 54%)',
            initialX: 100,
            initialY: -100,
            initialRotate: -38,
            initialScale: 0.62,
            delay: baseDelay + letterInterval + pieceInterval,
            pinPos: { top: '26%', left: '46%' },
          },
          {
            id: 'R-3',
            clipPath: 'polygon(44% 54%, 100% 54%, 100% 100%, 44% 100%)',
            initialX: 120,
            initialY: 110,
            initialRotate: 40,
            initialScale: 0.68,
            delay: baseDelay + letterInterval + pieceInterval * 2,
            pinPos: { top: '58%', left: '46%' },
          },
        ],
      },

      // 3. 'A' (3 blocks: Gable apex, Tie rail, Base struts)
      {
        char: 'A',
        segments: [
          {
            id: 'A-1',
            clipPath: 'polygon(0% 0%, 100% 0%, 100% 48%, 0% 48%)',
            initialX: 15,
            initialY: -130,
            initialRotate: -24,
            initialScale: 0.62,
            delay: baseDelay + letterInterval * 2,
            pinPos: { top: '46%', left: '48%' },
          },
          {
            id: 'A-2',
            clipPath: 'polygon(0% 48%, 100% 48%, 100% 70%, 0% 70%)',
            initialX: -100,
            initialY: -18,
            initialRotate: 30,
            initialScale: 0.75,
            delay: baseDelay + letterInterval * 2 + pieceInterval,
            pinPos: { top: '58%', left: '50%' },
          },
          {
            id: 'A-3',
            clipPath: 'polygon(0% 70%, 100% 70%, 100% 100%, 0% 100%)',
            initialX: 95,
            initialY: 100,
            initialRotate: -28,
            initialScale: 0.7,
            delay: baseDelay + letterInterval * 2 + pieceInterval * 2,
            pinPos: { top: '72%', left: '50%' },
          },
        ],
      },

      // 4. 'F' (3 blocks: Vertical post, Crown bar, Center stretcher)
      {
        char: 'F',
        segments: [
          {
            id: 'F-1',
            clipPath: 'polygon(0% 0%, 42% 0%, 42% 100%, 0% 100%)',
            initialX: -90,
            initialY: 100,
            initialRotate: -28,
            initialScale: 0.7,
            delay: baseDelay + letterInterval * 3,
            pinPos: { top: '24%', left: '38%' },
          },
          {
            id: 'F-2',
            clipPath: 'polygon(42% 0%, 100% 0%, 100% 44%, 42% 44%)',
            initialX: 110,
            initialY: -80,
            initialRotate: 34,
            initialScale: 0.65,
            delay: baseDelay + letterInterval * 3 + pieceInterval,
            pinPos: { top: '20%', left: '42%' },
          },
          {
            id: 'F-3',
            clipPath: 'polygon(42% 44%, 100% 44%, 100% 100%, 42% 100%)',
            initialX: 100,
            initialY: 55,
            initialRotate: -22,
            initialScale: 0.75,
            delay: baseDelay + letterInterval * 3 + pieceInterval * 2,
            pinPos: { top: '54%', left: '42%' },
          },
        ],
      },

      // 5. 'T' (3 blocks: Left arm, Central pillar, Right arm)
      {
        char: 'T',
        segments: [
          {
            id: 'T-1',
            clipPath: 'polygon(0% 0%, 38% 0%, 38% 100%, 0% 100%)',
            initialX: -110,
            initialY: -65,
            initialRotate: -40,
            initialScale: 0.62,
            delay: baseDelay + letterInterval * 4,
            pinPos: { top: '20%', left: '36%' },
          },
          {
            id: 'T-2',
            clipPath: 'polygon(38% 0%, 62% 0%, 62% 100%, 38% 100%)',
            initialX: 0,
            initialY: 130,
            initialRotate: 18,
            initialScale: 0.7,
            delay: baseDelay + letterInterval * 4 + pieceInterval,
            pinPos: { top: '22%', left: '50%' },
          },
          {
            id: 'T-3',
            clipPath: 'polygon(62% 0%, 100% 0%, 100% 100%, 62% 100%)',
            initialX: 110,
            initialY: -65,
            initialRotate: 40,
            initialScale: 0.62,
            delay: baseDelay + letterInterval * 4 + pieceInterval * 2,
            pinPos: { top: '20%', left: '64%' },
          },
        ],
      },

      // 6. 'E' (3 blocks: Top header, Middle shelf, Foundation foot)
      {
        char: 'E',
        segments: [
          {
            id: 'E-1',
            clipPath: 'polygon(0% 0%, 100% 0%, 100% 36%, 0% 36%)',
            initialX: -75,
            initialY: -120,
            initialRotate: 30,
            initialScale: 0.65,
            delay: baseDelay + letterInterval * 5,
            pinPos: { top: '34%', left: '26%' },
          },
          {
            id: 'E-2',
            clipPath: 'polygon(0% 36%, 100% 36%, 100% 66%, 0% 66%)',
            initialX: 110,
            initialY: 10,
            initialRotate: -30,
            initialScale: 0.75,
            delay: baseDelay + letterInterval * 5 + pieceInterval,
            pinPos: { top: '50%', left: '34%' },
          },
          {
            id: 'E-3',
            clipPath: 'polygon(0% 66%, 100% 66%, 100% 100%, 0% 100%)',
            initialX: -85,
            initialY: 110,
            initialRotate: 26,
            initialScale: 0.7,
            delay: baseDelay + letterInterval * 5 + pieceInterval * 2,
            pinPos: { top: '68%', left: '26%' },
          },
        ],
      },

      // 7. 'D' (3 blocks: Vertical post, Top curved arch, Bottom curved arch)
      {
        char: 'D',
        segments: [
          {
            id: 'D-1',
            clipPath: 'polygon(0% 0%, 40% 0%, 40% 100%, 0% 100%)',
            initialX: -95,
            initialY: 85,
            initialRotate: -24,
            initialScale: 0.75,
            delay: baseDelay + letterInterval * 6,
            pinPos: { top: '25%', left: '38%' },
          },
          {
            id: 'D-2',
            clipPath: 'polygon(40% 0%, 100% 0%, 100% 52%, 40% 52%)',
            initialX: 105,
            initialY: -100,
            initialRotate: 36,
            initialScale: 0.62,
            delay: baseDelay + letterInterval * 6 + pieceInterval,
            pinPos: { top: '28%', left: '46%' },
          },
          {
            id: 'D-3',
            clipPath: 'polygon(40% 52%, 100% 52%, 100% 100%, 40% 100%)',
            initialX: 115,
            initialY: 100,
            initialRotate: -32,
            initialScale: 0.66,
            delay: baseDelay + letterInterval * 6 + pieceInterval * 2,
            pinPos: { top: '66%', left: '44%' },
          },
        ],
      },
    ];
  }, []);

  // Continuous repeating lifecycle:
  // 1. Pieces assemble sequentially (~3.8s)
  // 2. Letters lock and stay in pristine solid form for 3.0s
  // 3. Automatically repeats continuously in an infinite loop!
  useEffect(() => {
    setActiveStage('animating');
    setAssembledLetters({});

    const timeouts: NodeJS.Timeout[] = [];

    // Progressive locking per letter
    letters.forEach((letter, idx) => {
      const lockTime = (letter.segments[2].delay + 0.8) * 1000;
      const t = setTimeout(() => {
        setAssembledLetters((prev) => ({ ...prev, [idx]: true }));
      }, lockTime);
      timeouts.push(t);
    });

    // Full word complete
    const finishAssemblyTime = (letters[6].segments[2].delay + 1.1) * 1000;
    const finishT = setTimeout(() => {
      setActiveStage('assembled');
    }, finishAssemblyTime);
    timeouts.push(finishT);

    // Continuous repeat trigger: hold for 3.0 seconds, then restart cycle
    const loopIntervalTime = finishAssemblyTime + 3000;
    const loopT = setTimeout(() => {
      setCycle((prev) => prev + 1);
    }, loopIntervalTime);
    timeouts.push(loopT);

    return () => {
      timeouts.forEach(clearTimeout);
    };
  }, [cycle, letters]);

  return (
    <span
      onClick={() => setCycle((prev) => prev + 1)}
      className="inline-block relative cursor-pointer select-none"
      title="Continuous furniture joinery animation (Click to restart immediately)"
    >
      {/* Container preserving exact typography, text-stroke-white, font, size & spacing */}
      <span className="inline-flex tracking-tighter uppercase font-black text-transparent text-stroke-white font-heading-bold relative">
        {letters.map((letterItem, charIdx) => {
          const isCharDone = assembledLetters[charIdx] || activeStage === 'assembled';

          return (
            <span
              key={`${cycle}-${letterItem.char}-${charIdx}`}
              className="relative inline-block overflow-visible"
            >
              {/* Invisible layout anchor preserving 100% metrics and kerning */}
              <span className="opacity-0 pointer-events-none select-none">
                {letterItem.char}
              </span>

              {/* Solid seamless letter overlay once assembled */}
              {isCharDone && (
                <motion.span
                  initial={{ opacity: 0, scale: 1.04 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, ease: 'easeOut' }}
                  className="absolute inset-0 select-none text-transparent text-stroke-white pointer-events-none"
                >
                  {letterItem.char}
                </motion.span>
              )}

              {/* The 3 modular furniture joinery blocks that fly in sequentially and lock */}
              {(!isCharDone || activeStage === 'animating') &&
                letterItem.segments.map((segment) => (
                  <motion.span
                    key={segment.id}
                    className="absolute inset-0 select-none text-transparent text-stroke-white pointer-events-none will-change-transform"
                    style={{
                      clipPath: segment.clipPath,
                      WebkitClipPath: segment.clipPath,
                    }}
                    initial={{
                      x: segment.initialX,
                      y: segment.initialY,
                      rotate: segment.initialRotate,
                      scale: segment.initialScale,
                      opacity: 0,
                      filter: 'drop-shadow(0 0 10px rgba(245,158,11,0.85))',
                    }}
                    animate={{
                      x: 0,
                      y: 0,
                      rotate: 0,
                      scale: 1,
                      opacity: [0, 1, 1],
                      filter: [
                        'drop-shadow(0 0 12px rgba(245,158,11,0.9))',
                        'drop-shadow(0 0 6px rgba(245,158,11,0.6))',
                        'drop-shadow(0 0 0px rgba(0,0,0,0))',
                      ],
                    }}
                    transition={{
                      duration: 1.05,
                      ease: [0.16, 1, 0.3, 1],
                      delay: segment.delay,
                    }}
                  >
                    {letterItem.char}

                    {/* Joinery Dowel Pin / Peg ("প্যারাগ") animation at point of contact */}
                    <motion.span
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{
                        scale: [0, 2.2, 1.2, 0],
                        opacity: [0, 1, 0.9, 0],
                      }}
                      transition={{
                        delay: segment.delay + 0.65,
                        duration: 0.7,
                        times: [0, 0.35, 0.75, 1],
                      }}
                      style={segment.pinPos}
                      className="absolute w-3 h-3 -ml-1.5 -mt-1.5 rounded-full bg-amber-400 border-2 border-white shadow-[0_0_12px_#f59e0b] pointer-events-none z-30 flex items-center justify-center"
                    >
                      <span className="w-1.5 h-[1.5px] bg-black font-bold" />
                    </motion.span>
                  </motion.span>
                ))}
            </span>
          );
        })}

        {/* Golden laser alignment joinery beam when the word finishes assembling */}
        {activeStage === 'assembled' && (
          <motion.div
            initial={{ left: '-10%', opacity: 0 }}
            animate={{ left: '110%', opacity: [0, 1, 0] }}
            transition={{ duration: 1.0, ease: 'easeInOut' }}
            className="absolute top-0 bottom-0 w-8 bg-gradient-to-r from-transparent via-amber-400/40 to-transparent skew-x-12 pointer-events-none"
          />
        )}
      </span>
    </span>
  );
}

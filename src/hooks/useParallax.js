import { useScroll, useTransform, useSpring } from 'framer-motion';
import { useRef } from 'react';

/**
 * useParallax — scroll-driven parallax for any element.
 * @param {number} speed  - multiplier: 0.1 (subtle) to 0.5 (dramatic)
 * @param {string} offset - framer offset pair, default 'start end' → 'end start'
 */
export function useParallax(speed = 0.2, offset = ['start end', 'end start']) {
    const ref = useRef(null);
    const { scrollYProgress } = useScroll({ target: ref, offset });
    const range = speed * 100;
    const rawY = useTransform(scrollYProgress, [0, 1], [`-${range}%`, `${range}%`]);
    const y = useSpring(rawY, { stiffness: 55, damping: 22, restDelta: 0.001 });
    return { ref, y };
}

/**
 * useHeroParallax — for the hero section (start start → end start).
 */
export function useHeroParallax(speed = 0.35) {
    const ref = useRef(null);
    const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
    const rawY = useTransform(scrollYProgress, [0, 1], ['0%', `${speed * 100}%`]);
    const y = useSpring(rawY, { stiffness: 55, damping: 22 });
    const opacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);
    const contentY = useTransform(scrollYProgress, [0, 0.6], ['0%', '-10%']);
    return { ref, y, opacity, contentY };
}

/**
 * useScrollFade — fades an element as it scrolls out of view.
 */
export function useScrollFade(offset = ['start end', 'center center']) {
    const ref = useRef(null);
    const { scrollYProgress } = useScroll({ target: ref, offset });
    const opacity = useTransform(scrollYProgress, [0, 0.4, 1], [0, 1, 1]);
    const y = useTransform(scrollYProgress, [0, 0.4], [40, 0]);
    return { ref, opacity, y };
}

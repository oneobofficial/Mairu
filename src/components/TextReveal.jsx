import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

/**
 * SplitText — splits text into words, each word revealed with a mask clip.
 * Premium cinematic timing, staggered per word.
 */
export function SplitText({
    text,
    className = '',
    wordClassName = '',
    delay = 0,
    stagger = 0.08,
    duration = 1.6,
    ease = [0.76, 0, 0.24, 1],
    once = true,
    as: Tag = 'span',
}) {
    const ref = useRef(null);
    const isInView = useInView(ref, { once, margin: '-60px' });
    const words = text.split(' ');

    return (
        <Tag ref={ref} className={className} aria-label={text}>
            {words.map((word, i) => (
                <span key={i} className="inline-block overflow-hidden" aria-hidden="true">
                    <motion.span
                        className={`inline-block ${wordClassName}`}
                        initial={{ y: '110%', opacity: 0 }}
                        animate={isInView ? { y: '0%', opacity: 1 } : {}}
                        transition={{
                            duration,
                            delay: delay + i * stagger,
                            ease,
                        }}
                    >
                        {word}
                    </motion.span>
                    {i < words.length - 1 && <span className="inline-block">&nbsp;</span>}
                </span>
            ))}
        </Tag>
    );
}

/**
 * RevealLine — reveals a single line with a clip-path mask.
 * Use for short headings or labels.
 */
export function RevealLine({
    children,
    delay = 0,
    duration = 1.6,
    className = '',
    once = true,
}) {
    const ref = useRef(null);
    const isInView = useInView(ref, { once, margin: '-60px' });

    return (
        <div ref={ref} className={`overflow-hidden ${className}`}>
            <motion.div
                initial={{ y: '105%' }}
                animate={isInView ? { y: '0%' } : {}}
                transition={{ duration, delay, ease: [0.76, 0, 0.24, 1] }}
            >
                {children}
            </motion.div>
        </div>
    );
}

/**
 * FadeUp — simple fade + translate-up reveal.
 */
export function FadeUp({
    children,
    delay = 0,
    duration = 1.6,
    y = 16,
    className = '',
    once = true,
}) {
    const ref = useRef(null);
    const isInView = useInView(ref, { once, margin: '-60px' });

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration, delay, ease: [0.22, 1, 0.36, 1] }}
            className={className}
        >
            {children}
        </motion.div>
    );
}

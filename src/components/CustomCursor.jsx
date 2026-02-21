import { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

// Evaluate once at module scope — safe, never changes after page load.
// This must happen BEFORE the component function so the hook call order is
// always the same (React Rules of Hooks).
const IS_TOUCH =
    typeof window !== 'undefined' &&
    ('ontouchstart' in window || navigator.maxTouchPoints > 0);

export default function CustomCursor() {
    const cursorX = useMotionValue(-100);
    const cursorY = useMotionValue(-100);
    const [hovered, setHovered] = useState(false);
    const [hidden, setHidden] = useState(false);

    // Smooth spring physics
    const springConfig = { damping: 25, stiffness: 150 };
    const x = useSpring(cursorX, springConfig);
    const y = useSpring(cursorY, springConfig);

    useEffect(() => {
        // Don't attach any listeners on touch devices — skip silently
        if (IS_TOUCH) return;

        const moveCursor = (e) => {
            cursorX.set(e.clientX);
            cursorY.set(e.clientY);
        };

        const handleHoverStart = (e) => {
            if (
                e.target.tagName === 'A' ||
                e.target.tagName === 'BUTTON' ||
                e.target.closest('a') ||
                e.target.closest('button') ||
                e.target.dataset.hover
            ) {
                setHovered(true);
            }
        };

        const handleHoverEnd = () => setHovered(false);
        const handleLeave = () => setHidden(true);
        const handleEnter = () => setHidden(false);

        window.addEventListener('mousemove', moveCursor);
        window.addEventListener('mouseover', handleHoverStart);
        window.addEventListener('mouseout', handleHoverEnd);
        document.addEventListener('mouseleave', handleLeave);
        document.addEventListener('mouseenter', handleEnter);

        return () => {
            window.removeEventListener('mousemove', moveCursor);
            window.removeEventListener('mouseover', handleHoverStart);
            window.removeEventListener('mouseout', handleHoverEnd);
            document.removeEventListener('mouseleave', handleLeave);
            document.removeEventListener('mouseenter', handleEnter);
        };
    }, [cursorX, cursorY]);

    // Don't render the cursor element on touch devices
    if (IS_TOUCH) return null;

    return (
        <>
            <style>{`
                body, a, button { cursor: none !important; }
                @media (pointer: coarse) {
                    body, a, button { cursor: auto !important; }
                }
            `}</style>
            <motion.div
                className="fixed top-0 left-0 pointer-events-none z-[9999] mix-blend-difference"
                style={{
                    x,
                    y,
                    translateX: '-50%',
                    translateY: '-50%',
                    opacity: hidden ? 0 : 1,
                    willChange: 'transform',
                }}
            >
                {/* Use scale instead of width/height — entirely GPU-accelerated, no layout reflow */}
                <motion.div
                    animate={{
                        scale: hovered ? 4 : 1,
                        backgroundColor: '#fff',
                    }}
                    transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                    style={{ width: 12, height: 12, willChange: 'transform' }}
                    className="rounded-full"
                />
            </motion.div>
        </>
    );
}

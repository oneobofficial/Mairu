import { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

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

        const handleHoverEnd = () => {
            setHovered(false);
        };

        // Hide cursor when leaving window
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

    // Hide on touch devices
    if (typeof navigator !== 'undefined' && typeof window !== 'undefined') {
        const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
        if (isTouch) return null;
    }

    return (
        <>
            <style>{`
            body, a, button { cursor: none !important; }
        `}</style>
            <motion.div
                className="fixed top-0 left-0 pointer-events-none z-[9999] mix-blend-difference"
                style={{
                    x,
                    y,
                    translateX: '-50%',
                    translateY: '-50%',
                    opacity: hidden ? 0 : 1,
                }}
            >
                <motion.div
                    animate={{
                        width: hovered ? 48 : 12,
                        height: hovered ? 48 : 12,
                        backgroundColor: '#fff',
                    }}
                    transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                    className="rounded-full"
                />
            </motion.div>
        </>
    );
}

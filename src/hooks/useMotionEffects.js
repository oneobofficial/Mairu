import { useRef, useEffect } from 'react';
import { useMotionValue, useSpring } from 'framer-motion';

/**
 * Magnetic button effect — element follows cursor within a radius.
 * Returns { ref, x, y } to apply to a motion element.
 */
export function useMagneticButton(strength = 0.35) {
    const ref = useRef(null);
    const rawX = useMotionValue(0);
    const rawY = useMotionValue(0);
    const x = useSpring(rawX, { stiffness: 200, damping: 18 });
    const y = useSpring(rawY, { stiffness: 200, damping: 18 });

    useEffect(() => {
        const el = ref.current;
        if (!el) return;

        const handleMove = (e) => {
            const rect = el.getBoundingClientRect();
            const cx = rect.left + rect.width / 2;
            const cy = rect.top + rect.height / 2;
            const dx = e.clientX - cx;
            const dy = e.clientY - cy;
            rawX.set(dx * strength);
            rawY.set(dy * strength);
        };

        const handleLeave = () => {
            rawX.set(0);
            rawY.set(0);
        };

        el.addEventListener('mousemove', handleMove);
        el.addEventListener('mouseleave', handleLeave);
        return () => {
            el.removeEventListener('mousemove', handleMove);
            el.removeEventListener('mouseleave', handleLeave);
        };
    }, [rawX, rawY, strength]);

    return { ref, x, y };
}

/**
 * Cursor follower hook — returns cursor position as spring motion values.
 */
export function useCursorFollower() {
    const cursorX = useMotionValue(-100);
    const cursorY = useMotionValue(-100);
    const springX = useSpring(cursorX, { stiffness: 120, damping: 18 });
    const springY = useSpring(cursorY, { stiffness: 120, damping: 18 });

    useEffect(() => {
        const move = (e) => {
            cursorX.set(e.clientX);
            cursorY.set(e.clientY);
        };
        window.addEventListener('mousemove', move);
        return () => window.removeEventListener('mousemove', move);
    }, [cursorX, cursorY]);

    return { x: springX, y: springY };
}

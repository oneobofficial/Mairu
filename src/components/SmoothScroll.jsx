import { useEffect, useRef } from 'react';
import Lenis from 'lenis';

// Coarse-pointer (touch) devices get native scroll — no JS overhead.
const IS_TOUCH =
    typeof window !== 'undefined' &&
    window.matchMedia('(pointer: coarse)').matches;

export default function SmoothScroll({ children }) {
    const lenisRef = useRef(null);

    useEffect(() => {
        // On touch devices, skip Lenis entirely — native scroll is already smooth.
        if (IS_TOUCH) return;

        lenisRef.current = new Lenis({
            duration: 1.8,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            direction: 'vertical',
            gestureDirection: 'vertical',
            smooth: true,
            smoothTouch: false,
            touchMultiplier: 2,
        });

        let rafId;
        function raf(time) {
            lenisRef.current?.raf(time);
            rafId = requestAnimationFrame(raf);
        }

        rafId = requestAnimationFrame(raf);

        return () => {
            // Cancel the pending frame first, THEN destroy Lenis
            if (rafId) cancelAnimationFrame(rafId);
            if (lenisRef.current) {
                lenisRef.current.destroy();
                lenisRef.current = null;
            }
        };
    }, []);

    return <>{children}</>;
}

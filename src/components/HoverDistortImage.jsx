import { useRef, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

/**
 * HoverDistortImage — subtle image distortion on hover.
 * Uses perspective + rotateX/Y + scale for a premium 3D tilt effect.
 * Adds a gold shimmer overlay that sweeps on hover.
 */
export default function HoverDistortImage({
    src,
    alt,
    className = '',
    intensity = 8,
    children,
}) {
    const ref = useRef(null);
    const [hovering, setHovering] = useState(false);

    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    const springConfig = { stiffness: 120, damping: 22, mass: 0.8 };
    const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [intensity, -intensity]), springConfig);
    const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-intensity, intensity]), springConfig);
    const scale = useSpring(hovering ? 1.04 : 1, { stiffness: 200, damping: 24 });

    // Shimmer position follows mouse
    const shimmerX = useSpring(useTransform(mouseX, [-0.5, 0.5], ['-30%', '130%']), { stiffness: 80, damping: 20 });

    const handleMouseMove = (e) => {
        const rect = ref.current?.getBoundingClientRect();
        if (!rect) return;
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        mouseX.set(x);
        mouseY.set(y);
    };

    const handleMouseEnter = () => setHovering(true);
    const handleMouseLeave = () => {
        setHovering(false);
        mouseX.set(0);
        mouseY.set(0);
    };

    return (
        <motion.div
            ref={ref}
            onMouseMove={handleMouseMove}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            style={{
                perspective: 1000,
                transformStyle: 'preserve-3d',
            }}
            className="relative overflow-hidden"
        >
            <motion.div
                style={{
                    rotateX,
                    rotateY,
                    scale,
                    transformStyle: 'preserve-3d',
                }}
                className="relative w-full h-full"
            >
                <img
                    src={src}
                    alt={alt}
                    className={`w-full h-full object-cover transition-[filter] duration-700 ${hovering ? 'brightness-[1.05] contrast-[1.02]' : 'brightness-100'
                        } ${className}`}
                />

                {/* Gold shimmer sweep on hover */}
                <motion.div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                        background: 'linear-gradient(105deg, transparent 30%, rgba(201,168,76,0.08) 50%, transparent 70%)',
                        x: shimmerX,
                        opacity: hovering ? 1 : 0,
                    }}
                    transition={{ opacity: { duration: 0.3 } }}
                />

                {/* Subtle vignette that lifts on hover */}
                <motion.div
                    className="absolute inset-0 pointer-events-none"
                    animate={{ opacity: hovering ? 0.3 : 0.5 }}
                    transition={{ duration: 0.6 }}
                    style={{
                        background: 'radial-gradient(ellipse at center, transparent 40%, rgba(10,10,10,0.6) 100%)',
                    }}
                />

                {children}
            </motion.div>
        </motion.div>
    );
}

import { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, useSpring, AnimatePresence } from 'framer-motion';

/* ─────────────────────────────────────────────────────────────────────────────
   Mairu Bistro — Hero Section
   Bright · Airy · Editorial
   Images: actual Mairu Bistro ambiance photos (local /public folder)
───────────────────────────────────────────────────────────────────────────── */

const IMAGES = [
    '/ambiance-day.webp',     // sunny open-air terrace, day
    '/ambiance-indoor.webp',  // glass-walled indoor + lush garden view
    '/ambiance-evening.webp', // fairy-lit outdoor terrace, evening
];

/* ─── Minimal word-by-word text mask reveal ─────────────────────────────── */
function WordReveal({ text, delay = 0, className = '' }) {
    const words = text.split(' ');
    return (
        <span className={`inline-flex flex-wrap gap-x-[0.3em] ${className}`}>
            {words.map((word, i) => (
                <span key={i} className="overflow-hidden inline-block">
                    <motion.span
                        className="inline-block"
                        initial={{ y: '105%', opacity: 0 }}
                        animate={{ y: '0%', opacity: 1 }}
                        transition={{
                            duration: 1.8,
                            delay: delay + i * 0.15,
                            ease: [0.22, 1, 0.36, 1],
                        }}
                    >
                        {word}
                    </motion.span>
                </span>
            ))}
        </span>
    );
}

/* ─── Scroll indicator ───────────────────────────────────────────────────── */
function ScrollCue() {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 3.2, duration: 1.2 }}
            className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        >
            <span
                className="eyebrow"
                style={{ fontSize: '0.55rem', letterSpacing: '0.45em', color: 'rgba(245,241,235,0.65)' }}
            >
                Scroll
            </span>
            <div className="relative w-px h-12 overflow-hidden rounded-full">
                <div className="absolute inset-0" style={{ background: 'rgba(245,241,235,0.2)' }} />
                <motion.div
                    className="absolute top-0 left-0 right-0"
                    style={{ background: '#C8A96A' }}
                    animate={{ height: ['0%', '100%'], top: ['0%', '0%'] }}
                    transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut', delay: 3.6, repeatDelay: 0.6 }}
                />
            </div>
        </motion.div>
    );
}

/* ─── Dot indicator ──────────────────────────────────────────────────────── */
function SlideDots({ current, total, onChange }) {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2.4 }}
            className="absolute bottom-10 right-10 flex gap-2 items-center"
        >
            {Array.from({ length: total }).map((_, i) => (
                <button
                    key={i}
                    onClick={() => onChange(i)}
                    className="transition-all duration-500 rounded-full"
                    style={{
                        width: i === current ? '22px' : '6px',
                        height: '4px',
                        background: i === current ? '#C8A96A' : 'rgba(245,241,235,0.4)',
                        border: 'none',
                        cursor: 'pointer',
                        touchAction: 'manipulation',
                    }}
                    aria-label={`Slide ${i + 1}`}
                />
            ))}
        </motion.div>
    );
}

/* ─── Main Hero ──────────────────────────────────────────────────────────── */
export default function Hero() {
    const ref = useRef(null);
    const [currentSlide, setCurrentSlide] = useState(0);

    // Auto-advance slides
    useEffect(() => {
        const id = setInterval(() => {
            setCurrentSlide(prev => (prev + 1) % IMAGES.length);
        }, 6000);
        return () => clearInterval(id);
    }, []);

    // Scroll-driven parallax
    const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
    const rawY = useTransform(scrollYProgress, [0, 1], ['0%', '16%']); // Even softer
    const parallaxY = useSpring(rawY, { stiffness: 35, damping: 28 }); // More damping

    // Content drifts gently upward on scroll
    const contentY = useSpring(
        useTransform(scrollYProgress, [0, 0.6], ['0%', '-5%']), // Barely moves
        { stiffness: 35, damping: 28 }
    );
    const contentOpacity = useTransform(scrollYProgress, [0, 0.55], [1, 0]);

    return (
        <section
            ref={ref}
            id="hero"
            className="relative h-screen w-full overflow-hidden flex items-center justify-center"
        >
            {/* ── 1 · Parallax slideshow ── */}
            <div className="absolute inset-0 overflow-hidden">
                <AnimatePresence mode="sync">
                    {IMAGES.map((src, i) =>
                        i === currentSlide ? (
                            <motion.div
                                key={src}
                                className="absolute inset-0 scale-[1.12] will-change-transform"
                                style={{ y: parallaxY }}
                            >
                                <motion.img
                                    src={src}
                                    alt="Mairu Bistro"
                                    className="w-full h-full object-cover object-center"
                                    initial={{ opacity: 0, scale: 1.02 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 3.0, ease: 'easeInOut' }}
                                />
                            </motion.div>
                        ) : null
                    )}
                </AnimatePresence>
            </div>

            {/* ── 2 · Warm cream overlay — very light, preserves the bright daylight ── */}
            {/* Subtle dark wash to ensure text legibility */}
            <div
                className="absolute inset-0"
                style={{ background: 'rgba(30, 26, 20, 0.42)' }}
            />
            {/* Bottom gradient — soft cream fade into next section */}
            <div
                className="absolute inset-x-0 bottom-0 h-72"
                style={{ background: 'linear-gradient(to top, #F7F3EE 0%, rgba(247,243,238,0.55) 45%, transparent 100%)' }}
            />
            {/* Top — very faint darkening to anchor nav */}
            <div
                className="absolute inset-x-0 top-0 h-36"
                style={{ background: 'linear-gradient(to bottom, rgba(46,43,40,0.14) 0%, transparent 100%)' }}
            />
            {/* Subtle edge vignette — soft, editorial */}
            <div
                className="absolute inset-0 pointer-events-none"
                style={{
                    background: 'radial-gradient(ellipse 90% 85% at 50% 45%, rgba(30,26,20,0.18) 0%, rgba(46,43,40,0.45) 100%)',
                }}
            />

            {/* ── 3 · Hero content ── */}
            <motion.div
                style={{ y: contentY, opacity: contentOpacity }}
                className="relative z-10 flex flex-col items-center text-center section-padding will-change-transform max-w-5xl mx-auto"
            >
                {/* Label */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }} // reduced y
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1.6, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
                    className="flex items-center gap-4 mb-10"
                >
                    <motion.div
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: 1 }}
                        transition={{ duration: 1.5, delay: 0.7, ease: [0.76, 0, 0.24, 1] }}
                        className="h-px w-10 origin-right"
                        style={{ background: 'rgba(200,169,106,0.8)' }}
                    />
                    <span
                        className="eyebrow"
                        style={{ color: 'rgba(245,241,235,0.88)', letterSpacing: '0.45em', fontSize: '0.58rem' }}
                    >
                        Est. 2023 &nbsp;·&nbsp; Garden Dining &nbsp;·&nbsp; Hyderabad
                    </span>
                    <motion.div
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: 1 }}
                        transition={{ duration: 1.5, delay: 0.7, ease: [0.76, 0, 0.24, 1] }}
                        className="h-px w-10 origin-left"
                        style={{ background: 'rgba(200,169,106,0.8)' }}
                    />
                </motion.div>

                {/* Restaurant name */}
                <h1 className="font-serif select-none mb-5 leading-none">
                    {/* "Mairu" */}
                    <div className="overflow-hidden">
                        <motion.div
                            initial={{ y: '108%' }} // keep y high for elegant mask reveal
                            animate={{ y: '0%' }}
                            transition={{ duration: 1.8, delay: 0.85, ease: [0.76, 0, 0.24, 1] }}
                            className="text-[clamp(4.5rem,11.5vw,9rem)] font-bold leading-none"
                            style={{ color: '#F5F1EB', textShadow: '0 2px 28px rgba(43,43,43,0.18)', letterSpacing: '0.15em' }}
                        >
                            Mairu
                        </motion.div>
                    </div>
                    {/* "Bistro" — gold accent */}
                    <div className="overflow-hidden -mt-1 md:-mt-3">
                        <motion.div
                            initial={{ y: '108%' }}
                            animate={{ y: '0%' }}
                            transition={{ duration: 1.8, delay: 1.05, ease: [0.76, 0, 0.24, 1] }}
                            className="text-[clamp(3.2rem,8.5vw,6.5rem)] font-light tracking-[0.12em] gold-shimmer"
                        >
                            Bistro
                        </motion.div>
                    </div>
                </h1>

                {/* Thin gold line separator */}
                <motion.div
                    initial={{ scaleX: 0, opacity: 0 }}
                    animate={{ scaleX: 1, opacity: 1 }}
                    transition={{ duration: 1.6, delay: 2.0, ease: [0.76, 0, 0.24, 1] }}
                    className="flex items-center gap-4 my-7"
                >
                    <div className="h-px w-14 origin-right" style={{ background: 'linear-gradient(to left, rgba(200,169,106,0.7), transparent)' }} />
                    <div className="w-1 h-1 rounded-full" style={{ background: '#C8A96A', opacity: 0.8 }} />
                    <div className="h-px w-14 origin-left" style={{ background: 'linear-gradient(to right, rgba(200,169,106,0.7), transparent)' }} />
                </motion.div>

                {/* Tagline */}
                <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1.8, delay: 2.3, ease: [0.22, 1, 0.36, 1] }}
                    className="font-display italic text-[clamp(1rem,2.2vw,1.35rem)] tracking-[0.06em] mb-14"
                    style={{ color: 'rgba(247,243,238,0.80)', fontWeight: 300 }}
                >
                    Every Dish Tells a Story
                </motion.p>

                {/* ── CTA Buttons ── */}
                <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1.6, delay: 2.7, ease: [0.22, 1, 0.36, 1] }}
                    className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto items-stretch sm:items-center px-4 sm:px-0"
                >
                    {/* Primary — minimal gold outline */}
                    <HeroButton href="#menu" primary>
                        Explore the Menu
                    </HeroButton>

                    {/* Secondary — cream ghost */}
                    <HeroButton href="#reservation">
                        Reserve a Table
                    </HeroButton>
                </motion.div>
            </motion.div>

            {/* ── 4 · Slide dots ── */}
            <SlideDots current={currentSlide} total={IMAGES.length} onChange={setCurrentSlide} />

            {/* ── 5 · Scroll cue ── */}
            <ScrollCue />
        </section>
    );
}

/* ─── Hero button sub-component ─────────────────────────────────────────── */
function HeroButton({ href, children, primary = false }) {
    const [hovered, setHovered] = useState(false);

    return (
        <motion.a
            href={href}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            whileTap={{ scale: 0.97 }}
            className="relative overflow-hidden inline-block font-sans text-[0.62rem] uppercase tracking-[0.32em] px-9 py-4 transition-all duration-500"
            style={{
                color: primary
                    ? (hovered ? '#F5F1EB' : '#C8A96A')
                    : (hovered ? '#C8A96A' : 'rgba(245,241,235,0.88)'),
                border: primary
                    ? `1px solid ${hovered ? '#DEC08A' : 'rgba(200,169,106,0.65)'}`
                    : `1px solid ${hovered ? 'rgba(200,169,106,0.65)' : 'rgba(245,241,235,0.38)'}`,
                boxShadow: hovered
                    ? (primary ? '0 0 28px rgba(200,169,106,0.20)' : '0 0 18px rgba(200,169,106,0.10)')
                    : 'none',
            }}
        >
            {/* Gold fill slide-in on hover (primary only) */}
            {primary && (
                <motion.span
                    className="absolute inset-0 z-0"
                    style={{ background: 'linear-gradient(135deg, #C8A96A, #DEC08A)', originX: 0 }}
                    animate={{ scaleX: hovered ? 1 : 0 }}
                    transition={{ duration: 0.45, ease: [0.76, 0, 0.24, 1] }}
                />
            )}
            <span className="relative z-10">{children}</span>
        </motion.a>
    );
}

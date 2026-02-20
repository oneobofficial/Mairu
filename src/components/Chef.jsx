import { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring, useInView } from 'framer-motion';
import { SplitText } from './TextReveal';

const CHEF_IMAGE =
    'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=1920&q=90&auto=format&fit=crop';

const awards = ['Michelin ★★★', "World's 50 Best", 'James Beard Award'];

export default function Chef() {
    const ref = useRef(null);
    const textRef = useRef(null);
    const isInView = useInView(textRef, { once: true, margin: '-80px' });

    const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });

    // Multi-layer parallax
    const rawBgY = useTransform(scrollYProgress, [0, 1], ['-6%', '6%']); // softer
    const bgY = useSpring(rawBgY, { stiffness: 35, damping: 28 });

    // Overlay opacity driven by scroll
    const overlayOpacity = useTransform(scrollYProgress, [0, 0.35, 0.65, 1], [0.72, 0.88, 0.88, 0.72]);

    // Text content drifts slightly opposite to bg
    const rawTextY = useTransform(scrollYProgress, [0, 1], ['2%', '-2%']); // barely moves
    const textY = useSpring(rawTextY, { stiffness: 35, damping: 28 });

    return (
        <section id="chef" ref={ref} className="relative overflow-hidden">
            <div className="relative h-[88vh] min-h-[640px] overflow-hidden">

                {/* ── Layer 1: Parallax background ── */}
                <motion.div style={{ y: bgY }} className="absolute inset-0 scale-[1.25] will-change-transform">
                    <img
                        src={CHEF_IMAGE}
                        alt="Chef Elara Mairu"
                        className="w-full h-full object-cover object-center"
                    />
                </motion.div>

                {/* ── Layer 2: Scroll-driven left overlay ── */}
                <motion.div
                    style={{ opacity: overlayOpacity, background: 'linear-gradient(to right, rgba(43,43,43,0.82) 0%, rgba(43,43,43,0.55) 55%, transparent 100%)' }}
                    className="absolute inset-0"
                />
                {/* Solid dark panel behind text for guaranteed readability */}
                <div className="absolute inset-0" style={{ background: 'linear-gradient(to right, rgba(20,18,15,0.72) 0%, rgba(20,18,15,0.45) 50%, transparent 100%)' }} />
                {/* Bottom fade to cream */}
                <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, #F5F1EB 0%, transparent 18%)' }} />
                {/* Top subtle fade */}
                <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, rgba(245,241,235,0.15) 0%, transparent 20%)' }} />

                {/* ── Layer 3: Vertical gold line ── */}
                <motion.div
                    initial={{ scaleY: 0 }}
                    animate={isInView ? { scaleY: 1 } : {}}
                    transition={{ duration: 2.2, delay: 0.6, ease: [0.76, 0, 0.24, 1] }}
                    className="absolute left-1/2 top-16 bottom-16 w-px origin-top hidden lg:block"
                    style={{ background: 'linear-gradient(180deg, transparent, rgba(200,169,106,0.2) 30%, rgba(200,169,106,0.2) 70%, transparent)' }}
                />

                {/* ── Layer 4: Text content with counter-parallax ── */}
                <motion.div
                    style={{ y: textY }}
                    ref={textRef}
                    className="relative z-10 h-full flex items-center section-padding max-w-content mx-auto"
                >
                    <div className="max-w-lg">

                        {/* Eyebrow */}
                        <motion.div
                            initial={{ opacity: 0, x: -12 }} // reduced
                            animate={isInView ? { opacity: 1, x: 0 } : {}}
                            transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
                            className="flex items-center gap-5 mb-10"
                        >
                            <motion.div
                                initial={{ scaleX: 0 }}
                                animate={isInView ? { scaleX: 1 } : {}}
                                transition={{ duration: 1.5, delay: 0.2, ease: [0.76, 0, 0.24, 1] }}
                                className="gold-divider origin-left"
                            />
                            <span className="eyebrow text-[#C8A96A]">The Experience</span>
                        </motion.div>

                        {/* Name — mask reveal per line */}
                        <div className="mb-10 lg:mb-12">
                            <div className="overflow-hidden">
                                <motion.div
                                    initial={{ y: '110%' }}
                                    animate={isInView ? { y: '0%' } : {}}
                                    transition={{ duration: 1.8, delay: 0.22, ease: [0.76, 0, 0.24, 1] }}
                                    className="font-serif text-display-md font-semibold leading-none"
                                    style={{ color: '#F5F1EB' }}
                                >
                                    Chef
                                </motion.div>
                            </div>
                            <div className="overflow-hidden">
                                <motion.div
                                    initial={{ y: '110%' }}
                                    animate={isInView ? { y: '0%' } : {}}
                                    transition={{ duration: 1.8, delay: 0.32, ease: [0.76, 0, 0.24, 1] }}
                                    className="font-serif text-display-md font-semibold gold-text leading-none"
                                >
                                    Elara Mairu
                                </motion.div>
                            </div>
                        </div>

                        {/* Quote */}
                        <motion.blockquote
                            initial={{ opacity: 0, x: -10 }} // reduced
                            animate={isInView ? { opacity: 1, x: 0 } : {}}
                            transition={{ duration: 1.6, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
                            className="relative pl-7 mb-8"
                        >
                            <motion.div
                                initial={{ scaleY: 0 }}
                                animate={isInView ? { scaleY: 1 } : {}}
                                transition={{ duration: 1.4, delay: 0.55, ease: [0.76, 0, 0.24, 1] }}
                                className="absolute left-0 top-0 bottom-0 w-px origin-top"
                                style={{ background: 'linear-gradient(180deg, #C8A96A 0%, rgba(200,169,106,0.3) 100%)' }}
                            />
                            <p className="font-display text-lg md:text-xl italic leading-[1.75]" style={{ color: 'rgba(245,241,235,0.96)' }}>
                                "I cook not to feed the body, but to nourish the soul. Every plate is a
                                conversation between memory and imagination."
                            </p>
                        </motion.blockquote>

                        {/* Bio */}
                        <motion.p
                            initial={{ opacity: 0, y: 10 }} // reduced
                            animate={isInView ? { opacity: 1, y: 0 } : {}}
                            transition={{ duration: 1.6, delay: 0.75, ease: [0.22, 1, 0.36, 1] }}
                            className="text-sm leading-[1.9] mb-10"
                            style={{ color: 'rgba(245,241,235,0.82)' }}
                        >
                            Trained at Le Cordon Bleu Paris and honed under three Michelin-starred mentors
                            across Europe, Chef Elara brings a rare alchemy of classical mastery and
                            fearless innovation to every dish.
                        </motion.p>

                        {/* Awards */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={isInView ? { opacity: 1 } : {}}
                            transition={{ duration: 1.2, delay: 0.7 }}
                            className="flex flex-wrap gap-3"
                        >
                            {awards.map((award, i) => (
                                <motion.span
                                    key={award}
                                    initial={{ opacity: 0, y: 6 }} // reduced
                                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                                    transition={{ duration: 1.2, delay: 0.85 + i * 0.15, ease: [0.22, 1, 0.36, 1] }}
                                    whileHover={{ borderColor: 'rgba(200,169,106,0.6)', color: '#C8A96A' }}
                                    className="px-4 py-2 eyebrow backdrop-blur-sm transition-colors duration-400"
                                    style={{ fontSize: '0.58rem', letterSpacing: '0.2em', border: '1px solid rgba(200,169,106,0.70)', color: '#C8A96A', background: 'rgba(20,18,15,0.62)' }}
                                >
                                    {award}
                                </motion.span>
                            ))}
                        </motion.div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}

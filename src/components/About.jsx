import { useRef } from 'react';
import { motion, useInView, useScroll, useTransform, useSpring } from 'framer-motion';
import HoverDistortImage from './HoverDistortImage';
import { SplitText, FadeUp } from './TextReveal';

const ABOUT_IMAGE =
    'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=1200&q=90&auto=format&fit=crop';

const stats = [
    { value: '18', label: 'Years', sub: 'of excellence' },
    { value: '3', label: 'Stars', sub: 'Michelin guide' },
    { value: '200+', label: 'Wines', sub: 'curated cellar' },
];

export default function About() {
    const sectionRef = useRef(null);
    const textRef = useRef(null);
    const isInView = useInView(textRef, { once: true, margin: '-80px' });

    // Parallax on the image container
    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: ['start end', 'end start'],
    });
    const rawImageY = useTransform(scrollYProgress, [0, 1], ['-4%', '4%']); // bare minimum
    const imageY = useSpring(rawImageY, { stiffness: 35, damping: 28 });

    // Floating stat card parallax
    const rawCardY = useTransform(scrollYProgress, [0, 1], ['0px', '-12px']);
    const cardY = useSpring(rawCardY, { stiffness: 35, damping: 28 });

    return (
        <section id="about" ref={sectionRef} className="section-block overflow-hidden section-cream">
            <div className="section-padding max-w-content mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 lg:gap-28 items-center">

                    {/* ── Image column ── */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }} // reduced
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, margin: '-80px' }}
                        transition={{ duration: 1.8, ease: [0.22, 1, 0.36, 1] }}
                        className="relative"
                    >
                        {/* Gold corner accents */}
                        <div className="absolute -top-5 -left-5 w-20 h-20 border-t border-l z-10 pointer-events-none" style={{ borderColor: 'rgba(200,169,106,0.28)' }} />
                        <div className="absolute -bottom-5 -right-5 w-20 h-20 border-b border-r z-10 pointer-events-none" style={{ borderColor: 'rgba(200,169,106,0.18)' }} />

                        {/* Image with parallax + hover distortion */}
                        <div className="relative overflow-hidden h-[400px] md:h-[500px] lg:h-[680px]">
                            <motion.div style={{ y: imageY }} className="absolute inset-0 h-[115%] -top-[7.5%]">
                                <HoverDistortImage
                                    src={ABOUT_IMAGE}
                                    alt="Mairu Bistro dining room"
                                    className="w-full h-full"
                                    intensity={6}
                                >
                                    <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(238,232,223,0.50), transparent)' }} />
                                </HoverDistortImage>
                            </motion.div>
                        </div>

                        {/* Floating stat card */}
                        <motion.div
                            initial={{ opacity: 0, x: 15 }} // reduced
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 1.4, delay: 0.8, ease: [0.22, 1, 0.36, 1] }}
                            className="absolute -bottom-10 -right-6 px-7 py-6 z-20"
                            style={{
                                y: cardY,
                                background: 'rgba(247,243,237,0.97)',
                                border: '1px solid rgba(229,222,211,0.80)',
                                boxShadow: '0 2px 14px rgba(43,43,43,0.05)',
                            }}
                        >
                            <div className="font-serif text-5xl font-bold gold-text leading-none mb-1">18</div>
                            <div className="eyebrow text-[#6F6F6F] tracking-ultra" style={{ fontSize: '0.55rem' }}>
                                Years of Passion
                            </div>
                        </motion.div>
                    </motion.div>

                    {/* ── Text column ── */}
                    <div ref={textRef} className="space-y-10 lg:pl-4">

                        {/* Eyebrow */}
                        <FadeUp delay={0} once>
                            <div className="flex items-center gap-5">
                                <div className="gold-divider" />
                                <span className="eyebrow text-[#C8A96A]">Our Story</span>
                            </div>
                        </FadeUp>

                        {/* Heading — SplitText word reveal */}
                        <div>
                            <SplitText
                                text="Where Culinary Art"
                                as="h2"
                                className="font-serif text-display-sm font-semibold text-[#2B2B2B] leading-tight block"
                                delay={0.1}
                                stagger={0.07}
                                duration={1.1}
                            />
                            <SplitText
                                text="Meets Passion"
                                as="div"
                                className="font-serif text-display-sm font-semibold gold-text leading-tight block"
                                delay={0.35}
                                stagger={0.08}
                                duration={1.1}
                            />
                        </div>

                        {/* Body */}
                        <FadeUp delay={0.3} once>
                            <div className="space-y-5">
                                <p className="text-[#6F6F6F] text-[0.9375rem] leading-[1.85]">
                                    Nestled in the heart of the city, Mairu Bistro is more than a restaurant — it is a
                                    sanctuary for those who believe that dining is an art form. Founded in 2008 by
                                    Chef Elara Mairu, our philosophy is rooted in the harmony of seasonal ingredients,
                                    classical technique, and modern creativity.
                                </p>
                                <p className="text-[#9A9080] text-[0.9375rem] leading-[1.85]">
                                    Every dish tells a story — of the farmer who grew the produce, the artisan who
                                    crafted the cheese, the vintner who nurtured the vine. We invite you to sit,
                                    savour, and surrender to an experience that transcends the ordinary.
                                </p>
                            </div>
                        </FadeUp>

                        {/* Stats */}
                        <FadeUp delay={0.45} once>
                            <div className="grid grid-cols-3 gap-0 pt-8" style={{ borderTop: '1px solid #E5DED3' }}>
                                {stats.map((stat, i) => (
                                    <motion.div
                                        key={stat.label}
                                        initial={{ opacity: 0, y: 12 }} // reduced
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ duration: 1.0, delay: 0.6 + i * 0.15, ease: [0.22, 1, 0.36, 1] }}
                                        className={`py-2 ${i < 2 ? 'pr-2 md:pr-6' : ''} ${i > 0 ? 'pl-2 md:pl-6' : ''}`}
                                        style={i < 2 ? { borderRight: '1px solid #E5DED3' } : {}}
                                    >
                                        <div className="font-serif text-2xl lg:text-3xl font-bold gold-text leading-none mb-1">{stat.value}</div>
                                        <div className="text-[#2B2B2B] text-xs font-medium mb-[0.125rem] truncate">{stat.label}</div>
                                        <div className="eyebrow text-[#9A9080]" style={{ fontSize: '0.45rem', letterSpacing: '0.15em', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{stat.sub}</div>
                                    </motion.div>
                                ))}
                            </div>
                        </FadeUp>

                        {/* CTA */}
                        <FadeUp delay={0.6} once>
                            <a href="#reservation" className="btn-gold">Reserve a Table</a>
                        </FadeUp>
                    </div>
                </div>
            </div>
        </section>
    );
}

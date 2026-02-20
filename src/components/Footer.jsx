import { useRef } from 'react';
import { motion, useInView, useScroll, useTransform } from 'framer-motion';
import { Instagram, Facebook, Twitter, Award, Star, Wine } from 'lucide-react';

const footerLinks = {
    'Explore': ['The Menu', 'Chef\'s Table', 'Wine Cellar', 'Private Dining', 'About Us'],
    'Visit': ['Reservations', 'Gift Cards', 'Private Events', 'Dress Code', 'Contact'],
    'Discover': ['Our Story', 'Local Partners', 'Sustainability', 'Journal', 'Press'],
};

const awards = [
    { icon: Award, text: "Michelin Guide", sub: "2024 Selection" },
    { icon: Star, text: "50 Best Discovery", sub: "Global List" },
    { icon: Wine, text: "Wine Spectator", sub: "Award of Excellence" }
];

const socialLinks = [
    { icon: Instagram, label: 'Instagram', href: '#' },
    { icon: Facebook, label: 'Facebook', href: '#' },
    { icon: Twitter, label: 'Twitter', href: '#' },
];

export default function Footer() {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: '-60px' });

    // Parallax Reveal Animation (y transform removed in favor of CSS sticky unveil)
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start end", "end end"]
    });
    const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [0, 0.8, 1]);

    return (
        <footer id="footer" ref={ref} className="relative bg-[#0A0908] text-warm-white overflow-hidden pt-24 pb-0 lg:pt-32 lg:pb-0 h-full" style={{ borderTop: '1px solid rgba(200,169,106,0.1)' }}>

            <motion.div style={{ opacity }} className="w-full h-full pb-8 lg:pb-12">

                {/* Ambient Background Glow */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] pointer-events-none opacity-40 mix-blend-screen"
                    style={{ background: 'radial-gradient(ellipse at top, rgba(200,169,106,0.08) 0%, transparent 70%)' }} />

                <div className="section-padding max-w-[1600px] mx-auto relative z-10 font-sans flex flex-col justify-between min-h-[50vh]">

                    {/* ── Top Row: Links & Info ── */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={isInView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 1.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8 mb-16 lg:mb-24"
                    >
                        {/* Column 1 & 2 & 3: Navigation Links */}
                        <div className="lg:col-span-6 grid grid-cols-2 md:grid-cols-3 gap-8 md:gap-4">
                            {Object.entries(footerLinks).map(([title, links]) => (
                                <div key={title}>
                                    <h4 className="text-warm-white/90 font-medium tracking-wide mb-6 font-display text-sm">
                                        {title}
                                    </h4>
                                    <ul className="space-y-4">
                                        {links.map((link) => (
                                            <li key={link}>
                                                <a href="#" className="text-warm-white/50 hover:text-[#C8A96A] transition-colors duration-300 text-sm font-light relative group inline-block">
                                                    {link}
                                                    <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-[#C8A96A] transition-all duration-300 group-hover:w-full opacity-50"></span>
                                                </a>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>

                        {/* Column 4: Hours & Location */}
                        <div className="lg:col-span-3">
                            <h4 className="text-warm-white/90 font-medium tracking-wide mb-6 font-display text-sm">
                                Location & Hours
                            </h4>
                            <div className="space-y-4 text-warm-white/50 text-sm font-light">
                                <p className="leading-relaxed">
                                    12 Rue de la Paix<br />
                                    New York, NY 10001
                                </p>
                                <p>
                                    <a href="mailto:dining@mairubistro.com" className="hover:text-[#C8A96A] transition-colors">dining@mairubistro.com</a><br />
                                    <a href="tel:+12125550182" className="hover:text-[#C8A96A] transition-colors">+1 (212) 555-0182</a>
                                </p>
                                <p className="pt-2">
                                    Tue–Sun:<br />
                                    6:00 PM – 11:00 PM
                                </p>
                            </div>
                        </div>

                        {/* Column 5: Awards */}
                        <div className="lg:col-span-3">
                            <h4 className="text-warm-white/90 font-medium tracking-wide mb-6 font-display text-sm">
                                Accolades
                            </h4>
                            <div className="space-y-6">
                                {awards.map((award, i) => (
                                    <div key={i} className="flex items-start gap-4 group">
                                        <div className="w-10 h-10 rounded-full border border-warm-white/10 flex items-center justify-center shrink-0 group-hover:border-[#C8A96A]/40 transition-colors duration-500">
                                            <award.icon size={18} className="text-[#C8A96A]" strokeWidth={1.5} />
                                        </div>
                                        <div>
                                            <p className="text-warm-white/80 text-sm font-medium">{award.text}</p>
                                            <p className="text-warm-white/40 text-xs italic">{award.sub}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </motion.div>

                    {/* ── Footer Bottom: Legal & Background Typography ── */}
                    <div className="relative w-full pb-6 flex flex-col justify-end">

                        {/* Legal & Social Links Row (z-10, relative) */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={isInView ? { opacity: 1, y: 0 } : {}}
                            transition={{ duration: 1.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
                            className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-6 px-4 md:px-8 border-t border-warm-white/10 pt-8 pb-12 w-full"
                        >
                            <div className="text-warm-white/40 text-[0.65rem] tracking-wider uppercase order-3 lg:order-1 flex-1">
                                Copyright © 2026 Mairu Bistro.
                            </div>

                            <div className="flex flex-wrap md:flex-nowrap justify-center gap-x-6 gap-y-3 order-2 flex-1">
                                {['Privacy Policy', 'Cookie Preferences', 'Terms of Use'].map((item) => (
                                    <a key={item} href="#" className="text-warm-white/60 hover:text-[#C8A96A] transition-colors text-[0.65rem] tracking-wider uppercase drop-shadow-sm whitespace-nowrap">
                                        {item}
                                    </a>
                                ))}
                            </div>

                            <div className="flex gap-4 order-1 lg:order-3 justify-center md:justify-end flex-1 mb-4 lg:mb-0">
                                {socialLinks.map(({ icon: Icon, label, href }) => (
                                    <a
                                        key={label}
                                        href={href}
                                        aria-label={label}
                                        className="w-8 h-8 rounded-full border border-warm-white/10 flex items-center justify-center text-warm-white/60 hover:text-[#C8A96A] hover:border-[#C8A96A]/30 transition-all duration-300"
                                    >
                                        <Icon size={14} strokeWidth={1.5} />
                                    </a>
                                ))}
                            </div>
                        </motion.div>

                        {/* Background Typography */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.98, y: 30 }}
                            animate={isInView ? { opacity: 1, scale: 1, y: 0 } : {}}
                            transition={{ duration: 2.2, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
                            className="w-full flex justify-center pointer-events-none z-0 overflow-hidden"
                        >
                            <h1
                                className="font-serif font-bold text-transparent tracking-tighter leading-none select-none text-center"
                                style={{
                                    WebkitTextStroke: '1px rgba(245,241,235,0.15)',
                                    fontSize: 'clamp(5rem, 20vw, 24rem)',
                                    lineHeight: '0.8',
                                    WebkitTextFillColor: 'transparent',
                                    color: 'transparent',
                                }}
                            >
                                Mairu
                            </h1>
                        </motion.div>
                    </div>

                </div>
            </motion.div>
        </footer>
    );
}

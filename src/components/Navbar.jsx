import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles } from 'lucide-react';

const navLinks = [
    { label: 'About', href: '#about' },
    { label: 'Menu', href: '#menu' },
    { label: 'Experience', href: '#chef' },
    { label: 'Contact', href: '#footer' },
];

export default function Navbar({ onChatClick }) {
    const [scrolled, setScrolled] = useState(false);
    const [footerInView, setFooterInView] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 80);
        window.addEventListener('scroll', onScroll, { passive: true });

        // Detect if footer is in view to hide navbar
        const footer = document.querySelector('#footer');
        let observer;
        if (footer) {
            // Un-hide the navbar slightly before the footer is fully out of view
            // Hide the navbar as soon as the footer enters the viewport
            observer = new IntersectionObserver(([entry]) => {
                setFooterInView(entry.isIntersecting);
            }, { threshold: 0.05 });
            observer.observe(footer);
        }

        return () => {
            window.removeEventListener('scroll', onScroll);
            if (observer && footer) observer.unobserve(footer);
        };
    }, []);

    // Lock body scroll when mobile menu open
    useEffect(() => {
        document.body.style.overflow = menuOpen ? 'hidden' : '';
        return () => { document.body.style.overflow = ''; };
    }, [menuOpen]);

    return (
        <>
            <motion.nav
                initial={{ y: -100, opacity: 0 }}
                animate={{ y: footerInView ? -100 : 0, opacity: footerInView ? 0 : 1 }}
                transition={{ duration: footerInView ? 0.6 : 1, delay: footerInView ? 0 : 0.1, ease: [0.22, 1, 0.36, 1] }}
                className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ${scrolled ? 'glass-nav py-4' : 'py-7'
                    }`}
                style={{ pointerEvents: footerInView ? 'none' : 'auto' }}
            >
                <div className="section-padding flex items-center justify-between">

                    {/* Logo */}
                    <a href="#" className="flex flex-col leading-none select-none">
                        <motion.span
                            className="font-serif text-xl font-medium tracking-[0.28em] transition-colors duration-700"
                            style={{ color: scrolled ? '#2E2B28' : '#F5F1EB' }}
                            whileHover={{ letterSpacing: '0.35em' }}
                            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                        >
                            MAIRU
                        </motion.span>
                        <span className="eyebrow tracking-ultra mt-1 transition-colors duration-700" style={{ fontSize: '0.5rem', color: scrolled ? '#9A8E84' : 'rgba(245,241,235,0.65)' }}>
                            BISTRO
                        </span>
                    </a>

                    {/* Desktop Nav - Centered */}
                    <nav className="absolute left-1/2 -translate-x-1/2 hidden md:flex items-center gap-12">
                        {navLinks.map((link, i) => (
                            <motion.a
                                key={link.label}
                                href={link.href}
                                initial={{ opacity: 0, y: -8 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 + i * 0.08, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                                className="relative eyebrow transition-colors duration-500 group"
                                style={{ fontSize: '0.6rem', color: scrolled ? '#706860' : 'rgba(245,241,235,0.90)' }}
                            >
                                {link.label}
                                <span className="absolute -bottom-1 left-0 w-0 h-px bg-[#C8A96A] transition-all duration-500 group-hover:w-full" />
                            </motion.a>
                        ))}
                    </nav>

                    {/* Right Actions */}
                    <div className="hidden md:flex items-center gap-6">
                        {/* Reserve CTA */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.7, duration: 0.6 }}
                        >
                            <a href="#reservation" className="btn-gold">
                                Reserve
                            </a>
                        </motion.div>

                        {/* Chat Trigger */}
                        <motion.button
                            onClick={onChatClick}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.8, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                            className="relative eyebrow transition-all duration-500 group flex items-center gap-2 px-3 py-1.5 rounded-full border border-transparent hover:border-[#C8A96A/30] hover:bg-[#C8A96A/5]"
                            style={{ fontSize: '0.6rem', color: '#C8A96A', letterSpacing: '0.15em' }}
                        >
                            <Sparkles size={10} className="text-[#C8A96A] animate-pulse" />
                            <span>ASK MAIRU</span>
                            <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-0 h-px bg-[#C8A96A] transition-all duration-500 group-hover:w-[60%] opacity-50" />
                        </motion.button>
                    </div>

                    {/* Mobile toggle */}
                    <button
                        className="md:hidden relative w-8 h-8 flex flex-col justify-center gap-1.5 group"
                        onClick={() => setMenuOpen(!menuOpen)}
                        aria-label="Toggle menu"
                    >
                        <motion.span
                            animate={menuOpen ? { rotate: 45, y: 5 } : { rotate: 0, y: 0 }}
                            transition={{ duration: 0.35, ease: [0.76, 0, 0.24, 1] }}
                            className="block h-px bg-[#2B2B2B] origin-center"
                        />
                        <motion.span
                            animate={menuOpen ? { opacity: 0, scaleX: 0 } : { opacity: 1, scaleX: 1 }}
                            transition={{ duration: 0.25 }}
                            className="block h-px bg-[#2B2B2B]"
                        />
                        <motion.span
                            animate={menuOpen ? { rotate: -45, y: -5 } : { rotate: 0, y: 0 }}
                            transition={{ duration: 0.35, ease: [0.76, 0, 0.24, 1] }}
                            className="block h-px bg-[#2B2B2B] origin-center"
                        />
                    </button>
                </div>
            </motion.nav>

            {/* Mobile full-screen menu */}
            <AnimatePresence>
                {menuOpen && (
                    <motion.div
                        initial={{ clipPath: 'inset(0 0 100% 0)' }}
                        animate={{ clipPath: 'inset(0 0 0% 0)' }}
                        exit={{ clipPath: 'inset(0 0 100% 0)' }}
                        transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }}
                        className="fixed inset-0 z-40 flex flex-col items-center justify-center"
                        style={{ background: '#F7F3EE' }}
                    >
                        {/* Subtle gold ambient */}
                        <div
                            className="absolute inset-0 pointer-events-none"
                            style={{ background: 'radial-gradient(ellipse 60% 50% at 50% 50%, rgba(200,169,106,0.06) 0%, transparent 70%)' }}
                        />

                        <nav className="flex flex-col items-center gap-10">
                            {navLinks.map((link, i) => (
                                <motion.a
                                    key={link.label}
                                    href={link.href}
                                    onClick={() => setMenuOpen(false)}
                                    initial={{ opacity: 0, y: 24 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.2 + i * 0.08, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                                    className="font-serif text-4xl text-[#2E2B28] hover:text-[#C8A96A] transition-colors duration-600 tracking-tight"
                                >
                                    {link.label}
                                </motion.a>
                            ))}
                            <motion.a
                                href="#reservation"
                                onClick={() => setMenuOpen(false)}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.55, duration: 0.5 }}
                                className="btn-gold mt-6"
                            >
                                Reserve a Table
                            </motion.a>
                            <motion.button
                                onClick={() => {
                                    setMenuOpen(false);
                                    onChatClick();
                                }}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.6, duration: 0.5 }}
                                className="eyebrow mt-4 flex items-center gap-2 px-4 py-2 border border-[#C8A96A/30] rounded-full hover:bg-[#C8A96A/10] transition-colors"
                                style={{ color: '#C8A96A', fontSize: '0.7rem' }}
                            >
                                <Sparkles size={12} className="text-[#C8A96A]" />
                                <span>ASK MAIRU</span>
                            </motion.button>
                        </nav>

                        {/* Bottom info */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.6 }}
                            className="absolute bottom-12 text-center"
                        >
                            <p className="eyebrow text-[#6F6F6F] tracking-ultra" style={{ fontSize: '0.55rem' }}>
                                Tue–Sun &nbsp;·&nbsp; 6pm–11pm &nbsp;·&nbsp; +1 (212) 555-0182
                            </p>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}

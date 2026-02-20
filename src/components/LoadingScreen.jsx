import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function LoadingScreen({ onComplete }) {
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setProgress((prev) => {
                if (prev >= 100) {
                    clearInterval(timer);
                    setTimeout(onComplete, 600);
                    return 100;
                }
                return prev + Math.random() * 15;
            });
        }, 150);

        return () => clearInterval(timer);
    }, [onComplete]);

    return (
        <motion.div
            className="fixed inset-0 z-[9999] flex flex-col items-center justify-center section-cream"
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
        >
            <div className="overflow-hidden mb-6">
                <motion.h1
                    initial={{ y: '100%' }}
                    animate={{ y: '0%' }}
                    transition={{ duration: 1.0, ease: [0.76, 0, 0.24, 1], delay: 0.2 }}
                    className="font-serif text-5xl md:text-8xl tracking-tight text-[#2B2B2B]"
                >
                    MAIRU
                </motion.h1>
            </div>

            <div className="w-64 h-[1px] bg-[#E5DED3] relative overflow-hidden">
                <motion.div
                    className="absolute inset-y-0 left-0 bg-[#C8A96A]"
                    initial={{ width: '0%' }}
                    animate={{ width: `${progress}%` }}
                    transition={{ type: 'spring', stiffness: 50, damping: 15 }}
                />
            </div>

            <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="mt-4 text-[0.6rem] tracking-[0.3em] text-[#9A9080] uppercase"
            >
                Bistro Ambiance
            </motion.p>
        </motion.div>
    );
}

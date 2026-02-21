import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Menu from './components/Menu';
import Chef from './components/Chef';
import Reservation from './components/Reservation';
import Footer from './components/Footer';
import LoadingScreen from './components/LoadingScreen';
import CustomCursor from './components/CustomCursor';
import Chatbot from './components/Chatbot';
import SmoothScroll from './components/SmoothScroll';

/* Page-level reveal after loading */
const pageVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.8, ease: 'easeOut' },
  },
};

export default function App() {
  const [loaded, setLoaded] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const handleLoadComplete = useCallback(() => setLoaded(true), []);

  return (
    <>
      {/* Custom cursor — always rendered */}
      <CustomCursor />

      {/* Elegant loading screen */}
      <AnimatePresence mode="wait">
        {!loaded && <LoadingScreen key="loader" onComplete={handleLoadComplete} />}
      </AnimatePresence>

      {/* Main site — fades in after loading */}
      <AnimatePresence>
        {loaded && (
          <SmoothScroll>
            <motion.div
              key="site"
              variants={pageVariants}
              initial="hidden"
              animate="visible"
              className="min-h-screen text-warm-white"
            >
              {/* Main content wrapper — bg covers the sticky footer reveal beneath it */}
              <div className="relative bg-[#F7F3EE]">
                <Navbar onChatClick={() => setIsChatOpen(true)} />
                <main>
                  <Hero />
                  <About />
                  <Menu />
                  <Chef />
                  <Reservation />
                </main>
              </div>

              {/* Footer Reveal Wrapper */}
              <div className="sticky bottom-0 w-full" style={{ zIndex: -1 }}>
                <Footer />
              </div>

              <Chatbot isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
            </motion.div>
          </SmoothScroll>
        )}
      </AnimatePresence>
    </>
  );
}

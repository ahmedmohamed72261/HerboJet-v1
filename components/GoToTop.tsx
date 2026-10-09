import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { FiArrowUp } from 'react-icons/fi';
import { useAppStore } from '@/store';

export default function GoToTop() {
  const [isVisible, setIsVisible] = useState(false);
  const { language } = useAppStore();
  
  // Position it in the bottom corner opposite to the WhatsApp button
  const positionClass = language === 'ar' ? 'right-6 md:right-8' : 'left-6 md:left-8';

  const toggleVisibility = () => {
    if (window.scrollY > 300) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  useEffect(() => {
    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          onClick={scrollToTop}
          initial={{ opacity: 0, scale: 0, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0, y: 20 }}
          transition={{
            duration: 0.4,
            ease: [0.22, 1, 0.36, 1],
          }}
          whileHover={{
            scale: 1.1,
          }}
          whileTap={{ scale: 0.95 }}
          title={language === 'en' ? 'Go to top' : 'العودة للأعلى'}
          aria-label="Go to top"
          className={`fixed bottom-6 ${positionClass} z-[90] flex h-14 w-14 items-center justify-center rounded-full bg-primary text-on-primary shadow-2xl border border-outline-variant/20 transition-colors duration-300 focus:outline-none focus:ring-4 focus:ring-primary/50 group`}
        >
          <FiArrowUp className="h-6 w-6 transition-transform duration-300 group-hover:-translate-y-1" />

          {/* Pulse Ring Animation */}
          <motion.div
            animate={{
              boxShadow: [
                '0 0 0 0 rgba(var(--primary-rgb), 0.4)',
                '0 0 0 16px rgba(var(--primary-rgb), 0)',
              ],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeOut',
            }}
            className="absolute inset-0 rounded-full border border-primary/30"
          />
        </motion.button>
      )}
    </AnimatePresence>
  );
}

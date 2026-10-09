import { motion, AnimatePresence } from 'motion/react';
import { useAppStore } from '@/store';

interface AppLoadingProps {
  show: boolean;
}

export default function AppLoading({ show }: AppLoadingProps) {
  const { language } = useAppStore();
  const label = language === 'ar' ? 'جاري التحميل...' : 'Loading...';

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-background/90 backdrop-blur-xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.4, ease: "easeInOut" } }}
          aria-live="polite"
          aria-busy="true"
        >
          <motion.div
            className="flex flex-col items-center"
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 1.02, y: -10 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* Elegant Brand Logo Focus */}
            <div className="relative mb-8 flex items-center justify-center gap-1">
              <span className="font-headline-lg text-4xl lg:text-5xl font-extrabold text-primary tracking-tight">
                HerboJet
              </span>
              <motion.div 
                className="w-2.5 h-2.5 rounded-full bg-secondary self-end mb-2"
                animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              />
            </div>

            {/* Ultra-minimalist Loading Line */}
            <div className="w-64 h-[2px] bg-surface-container-highest rounded-full overflow-hidden relative">
              <motion.div
                className="absolute top-0 bottom-0 left-0 bg-primary w-1/3 rounded-full"
                animate={{ x: ["-100%", "300%"] }}
                transition={{ 
                  duration: 1.5, 
                  repeat: Infinity, 
                  ease: "easeInOut" 
                }}
              />
            </div>
            
            <p className="mt-8 font-label-md text-xs text-on-surface-variant uppercase tracking-[0.3em] font-bold">
              {label}
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

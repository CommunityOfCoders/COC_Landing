"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

const images = [
  "https://images.unsplash.com/photo-1531297484001-80022131f5a1?q=80&w=2920&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?q=80&w=2940&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1516116216624-53e697fedbea?q=80&w=2728&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1537432376769-00f5c2f4c8d2?q=80&w=2940&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=2940&auto=format&fit=crop"
];

export const ImagesSliderDemo = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0
    })
  };

  return (
    <footer className="relative w-full bg-transparent py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-4xl font-bold text-white mb-4 animate-glow">
            Our Tech Journey
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Explore snapshots of our technological adventures and achievements
          </p>
        </div>

        <div className="relative w-full max-w-5xl mx-auto aspect-[16/9] rounded-lg overflow-hidden 
                      shadow-[0_0_40px_rgba(67,109,171,0.3)] hover:shadow-[0_0_60px_rgba(67,109,171,0.4)]
                      transition-shadow duration-300">
          <AnimatePresence initial={false} custom={direction}>
            <motion.img
              key={currentIndex}
              src={images[currentIndex]}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                x: { type: "spring", stiffness: 300, damping: 30 },
                opacity: { duration: 0.2 }
              }}
              className="absolute w-full h-full object-cover"
              alt={`Slide ${currentIndex + 1}`}
            />
          </AnimatePresence>
          
          {/* Navigation buttons with glow effect */}
          <button
            className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center
                     bg-black/50 text-white rounded-full hover:bg-black/70 transition-all
                     shadow-[0_0_10px_rgba(255,255,255,0.3)] hover:shadow-[0_0_15px_rgba(255,255,255,0.5)]"
            onClick={() => {
              setDirection(-1);
              setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
            }}
          >
            ←
          </button>
          <button
            className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center
                     bg-black/50 text-white rounded-full hover:bg-black/70 transition-all
                     shadow-[0_0_10px_rgba(255,255,255,0.3)] hover:shadow-[0_0_15px_rgba(255,255,255,0.5)]"
            onClick={() => {
              setDirection(1);
              setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
            }}
          >
            →
          </button>
        </div>
      </div>
    </footer>
  );
};
"use client";
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface EventImage {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
  date: string;
}

// Sample event images - replace with your actual event data
const eventImages: EventImage[] = [
  {
    id: 1,
    title: "HackXcelerate 2024",
    description: "24-hour hackathon with 200+ participants",
    imageUrl: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=600&fit=crop",
    date: "Dec 2024"
  },
  {
    id: 2,
    title: "WebGenesis Workshop",
    description: "Full-stack web development bootcamp",
    imageUrl: "https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800&h=600&fit=crop",
    date: "Nov 2024"
  },
  {
    id: 3,
    title: "API Murder Mystery",
    description: "Solve challenging API puzzles",
    imageUrl: "https://images.unsplash.com/photo-1551818255-e6e10975bc17?w=800&h=600&fit=crop",
    date: "Oct 2024"
  },
  {
    id: 4,
    title: "Debugathon",
    description: "Code debugging competition",
    imageUrl: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&h=600&fit=crop",
    date: "Sep 2024"
  },
  {
    id: 5,
    title: "Github Workshop",
    description: "Master Git and collaboration",
    imageUrl: "https://images.unsplash.com/photo-1556075798-4825dfaaf498?w=800&h=600&fit=crop",
    date: "Aug 2024"
  },
  {
    id: 6,
    title: "RouteQuest CTF",
    description: "Capture the flag challenge",
    imageUrl: "https://images.unsplash.com/photo-1504639725590-34d0984388bd?w=800&h=600&fit=crop",
    date: "Jul 2024"
  }
];

interface EventsCarouselProps {
  embedded?: boolean;
}

export default function EventsCarousel({ embedded = false }: EventsCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(1);

  useEffect(() => {
    const interval = setInterval(() => {
      setDirection(1);
      setCurrentIndex((prev) => (prev + 1) % eventImages.length);
    }, 4000); // Change image every 4 seconds

    return () => clearInterval(interval);
  }, []);

  const handleNext = () => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % eventImages.length);
  };

  const handlePrev = () => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + eventImages.length) % eventImages.length);
  };

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
      scale: 0.8,
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
    },
    exit: (direction: number) => ({
      x: direction > 0 ? -1000 : 1000,
      opacity: 0,
      scale: 0.8,
    }),
  };

  return (
    <div className={cn(
      "relative w-full h-full flex flex-col",
      embedded ? "p-8" : "p-12"
    )}>
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-b from-green-700 to-green-300 bg-clip-text text-transparent mb-2">
          Our Events
        </h2>
        <p className="text-gray-400 text-lg">
          Highlights from our community gatherings
        </p>
      </div>

      {/* Carousel Container */}
      <div className="relative flex-1 flex items-center justify-center overflow-hidden rounded-2xl">
        <AnimatePresence initial={false} custom={direction} mode="wait">
          <motion.div
            key={currentIndex}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "spring", stiffness: 300, damping: 30 },
              opacity: { duration: 0.3 },
              scale: { duration: 0.3 },
            }}
            className="absolute w-full max-w-4xl"
          >
            <div className="relative group">
              {/* Image */}
              <div className="relative aspect-video rounded-2xl overflow-hidden border border-gray-700/50 shadow-2xl">
                <img
                  src={eventImages[currentIndex].imageUrl}
                  alt={eventImages[currentIndex].title}
                  className="w-full h-full object-cover"
                />
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                
                {/* Event Info Overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <span className="inline-block px-3 py-1 bg-green-500/20 border border-green-500/30 rounded-full text-green-400 text-sm mb-3">
                      {eventImages[currentIndex].date}
                    </span>
                    <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">
                      {eventImages[currentIndex].title}
                    </h3>
                    <p className="text-gray-300 text-base md:text-lg">
                      {eventImages[currentIndex].description}
                    </p>
                  </motion.div>
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation Buttons */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            handlePrev();
          }}
          className="absolute left-4 z-10 p-3 rounded-full bg-black/50 border border-white/10 backdrop-blur-sm hover:bg-black/70 transition-all duration-200 hover:scale-110"
          aria-label="Previous event"
        >
          <svg
            className="w-6 h-6 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleNext();
          }}
          className="absolute right-4 z-10 p-3 rounded-full bg-black/50 border border-white/10 backdrop-blur-sm hover:bg-black/70 transition-all duration-200 hover:scale-110"
          aria-label="Next event"
        >
          <svg
            className="w-6 h-6 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>
      </div>

      {/* Indicators */}
      <div className="flex justify-center gap-2 mt-6">
        {eventImages.map((_, index) => (
          <button
            key={index}
            onClick={(e) => {
              e.stopPropagation();
              setDirection(index > currentIndex ? 1 : -1);
              setCurrentIndex(index);
            }}
            className={cn(
              "h-2 rounded-full transition-all duration-300",
              index === currentIndex
                ? "w-8 bg-green-500"
                : "w-2 bg-gray-600 hover:bg-gray-500"
            )}
            aria-label={`Go to event ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}

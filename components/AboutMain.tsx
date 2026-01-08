"use client";
import React from "react";
import Image from "next/image"; // Import Next.js Image component
import { BackgroundBeams } from "@/components/ui/background-beams";
import { motion } from "framer-motion";

const AboutMain = () => {
  const imageHoverVariants = {
    initial: { scale: 1, boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)" },
    hover: {
      scale: 1.03,
      boxShadow: "0 20px 25px -5px rgba(74, 222, 128, 0.2), 0 10px 10px -5px rgba(74, 222, 128, 0.1)", // Green glow shadow
      transition: { duration: 0.3, ease: "easeInOut" },
    },
  };
  return (
    <div className="min-h-screen bg-gradient-to-b from-black/95 via-neutral-900 to-black/95 text-neutral-300 px-8 py-12">
      {/* Header Section */}
      <div className="text-center mb-16 mt-16">
        <h1 className="text-6xl font-bold font-montserrat tracking-tighter bg-clip-text text-transparent bg-gradient-to-b from-green-400 to-green-300">
          About Us
        </h1>
        <p className="mt-4 text-lg max-w-3xl mx-auto font-montserrat leading-relaxed text-neutral-400">
          Welcome to the{" "}
          <span className="text-green-400">Community of Coders</span>&mdash;a
          lively space where both new and experienced developers come together.
          It&apos;s all about innovation, collaboration, and growing our skills
          together.
        </p>
      </div>

      {/* Vision Section */}
      <div className="flex justify-center mb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="p-8 bg-neutral-800/70 rounded-xl border border-neutral-700 shadow-lg w-full md:w-1/2"
        >
          <h2 className="text-3xl font-semibold mb-4 text-green-400 text-center">
            Our Vision
          </h2>
          <p className="mt-4 text-lg font-montserrat leading-relaxed text-neutral-400 italic">
            &quot;Guided by Experience, Driven by Passion – For Juniors, By the
            Seniors.&quot;
          </p>
        </motion.div>
      </div>

      {/* Senate Teams Section */}
      <div className="flex flex-col gap-12 mb-24 relative z-10">
        <div className="text-center mb-4">
          <h2 className="text-4xl font-semibold text-green-400 tracking-tight">
            Senate Teams
          </h2>
          <p className="text-neutral-500 mt-2">The pillars of our community</p>
        </div>

        {/* Image 1 - Left Aligned on Desktop, Centered on Mobile */}
        <div className="flex justify-center md:justify-start w-full relative">
          <motion.div
            className="w-full max-w-2xl rounded-2xl overflow-hidden border border-neutral-800/50 cursor-pointer"
            variants={imageHoverVariants}
            initial="initial"
            whileHover="hover"
          >
            {/* Using 'responsive' width/height approach for next/image inside a container */}
            <div className="relative h-[300px] sm:h-[400px] md:h-[450px] w-full">
              <Image
                src="/senate_image1.jpg"
                alt="Senate Team 1"
                fill
                className="object-cover transition-transform duration-500 hover:scale-105"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 66vw, 50vw"
              />
            </div>
          </motion.div>
        </div>

        {/* Image 2 - Right Aligned on Desktop, Centered on Mobile */}
        <div className="flex justify-center md:justify-end w-full relative">
          <motion.div
            className="w-full max-w-2xl rounded-2xl overflow-hidden border border-neutral-800/50 cursor-pointer"
            variants={imageHoverVariants}
            initial="initial"
            whileHover="hover"
          >
            <div className="relative h-[300px] sm:h-[400px] md:h-[450px] w-full">
              <Image
                src="/senate_image3.png"
                alt="Senate Team 2"
                fill
                className="object-cover transition-transform duration-500 hover:scale-105"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 66vw, 50vw"
              />
            </div>
          </motion.div>
        </div>

        {/* Image 3 - Left Aligned on Desktop, Centered on Mobile */}
        <div className="flex justify-center md:justify-start w-full relative">
          <motion.div
            className="w-full max-w-2xl rounded-2xl overflow-hidden border border-neutral-800/50 cursor-pointer"
            variants={imageHoverVariants}
            initial="initial"
            whileHover="hover"
          >
            <div className="relative h-[300px] sm:h-[400px] md:h-[450px] w-full">
              <Image
                src="/senate_image4.jpg"
                alt="Senate Team 3"
                fill
                className="object-cover transition-transform duration-500 hover:scale-105"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 66vw, 50vw"
              />
            </div>
          </motion.div>
        </div>
      </div>

      <BackgroundBeams />
    </div>
  );
};

export default AboutMain;

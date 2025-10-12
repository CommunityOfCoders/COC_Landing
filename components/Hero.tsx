"use client";
import React from 'react';
import { BackgroundBeams } from "@/components/ui/background-beams";
import { motion } from "framer-motion";

const Hero = () => {
  return (
    <div className="h-screen w-full bg-black/95 relative flex flex-col items-center justify-center overflow-hidden">
      <div className="container mx-auto px-4 relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-8"
        >
          <h1 className="text-6xl md:text-8xl font-bold font-montserrat tracking-tighter">
            <span className="bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400 leading-none">
              Community of
            </span>
            <br />
            <span className="bg-clip-text text-transparent bg-[linear-gradient(to_right,theme(colors.green.300),theme(colors.green.100),theme(colors.emerald.400))] leading-none">
              Coders
            </span>
          </h1>
          
          <div className="flex items-center justify-center gap-4">
            {['Innovate', 'Create', 'Collaborate'].map((text) => (
              <span 
                key={text}
                className="text-sm text-neutral-300 px-4 py-2 border border-neutral-700/50 rounded-full"
              >
                {text}
              </span>
            ))}
          </div>

          <p className="text-neutral-300 max-w-2xl mx-auto text-lg font-montserrat leading-relaxed">
            Join an exclusive community of innovative developers where ideas transform into reality. 
            <span className="text-green-400"> Build the future of technology together.</span>
          </p>
          
         
         
        </motion.div>
      </div>
      <BackgroundBeams />
      
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-black/0 z-[5]" />
    </div>
  );
};

export default Hero; 
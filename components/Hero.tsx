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
            <span className="bg-clip-text text-transparent bg-[linear-gradient(to_right,theme(colors.green.400),theme(colors.green.100),theme(colors.emerald.400))] leading-none">
              Coders
            </span>
          </h1>

          <div className="flex flex-wrap items-center justify-center gap-4 cursor-pointer">
            {['Innovate', 'Create', 'Collaborate'].map((text) => (
              <div key={text} className="relative group p-[2px] rounded-full bg-gradient-to-r from-transparent via-green-500/20 to-transparent hover:via-green-500/60 transition-all duration-500">
                <div className="px-6 py-2 rounded-full bg-black relative z-10 flex items-center justify-center">
                  <span className="text-md font-medium bg-gradient-to-r from-gray-200 to-gray-400 bg-clip-text text-transparent group-hover:from-white group-hover:to-green-200 transition-all">
                    {text}
                  </span>
                </div>
              </div>
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
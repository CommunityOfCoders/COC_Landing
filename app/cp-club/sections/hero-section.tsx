'use client';

import { motion } from 'framer-motion';
import { Rocket } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Badge {
  label: string;
  color: string;
}

export function HeroSection() {
    const badges = [
    { label: "Algorithms", color: "bg-green-500/10 text-green-300" },
    { label: "Data Structures", color: "bg-emerald-500/10 text-emerald-300" },
    { label: "Problem Solving", color: "bg-green-500/10 text-green-300" },
    { label: "Competitive Coding", color: "bg-emerald-500/10 text-emerald-300" },
    { label: "ICPC Training", color: "bg-green-500/10 text-green-300" },
    { label: "Interview Prep", color: "bg-emerald-500/10 text-emerald-300" },
  ];
  return (
    <section className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-1/2 -right-1/2 w-full h-full bg-gradient-to-br from-green-400/10 to-emerald-600/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-1/2 -left-1/2 w-full h-full bg-gradient-to-tr from-emerald-500/10 to-green-400/10 rounded-full blur-3xl" />
      </div>

      <motion.div
        className="relative z-10 text-center max-w-5xl mx-auto"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold mb-6 bg-gradient-to-r from-green-400 to-emerald-600 bg-clip-text text-transparent">
            CP Club
          </h1>
        </motion.div>

        <motion.p
          className="text-xl sm:text-2xl md:text-3xl mb-8 text-gray-300"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          Where Algorithms Meet Excellence
        </motion.p>

        <motion.p
          className="text-base sm:text-lg text-gray-400 mb-12 max-w-2xl mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          Join a thriving community of competitive programmers who are passionate about solving challenging problems. From mastering algorithms to competing in ICPC, we're building the next generation of problem solvers.
        </motion.p>
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="flex flex-wrap justify-center gap-3 max-w-3xl"
        >
          {badges.map((badge, index) => (
            <motion.span
              key={index}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{
                delay: 0.7 + index * 0.1,
                duration: 0.4,
                ease: "easeOut",
              }}
              className={`px-4 py-2 rounded-full text-sm font-medium border border-green-500/20 
                ${badge.color} backdrop-blur-sm hover:border-green-500/40 transition-all duration-300
                hover:scale-105 cursor-pointer`}
            >
              {badge.label}
            </motion.span>
          ))}
        </motion.div>
        <br />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
            <a
            href="https://chat.whatsapp.com/ITzWAJLkazz0XIJDZ5BZpv"
            target="_blank"
            rel="noopener noreferrer"
            >
            <Button
              size="lg"
              className="bg-gradient-to-r from-green-400 to-emerald-600 hover:from-green-500 hover:to-emerald-700 text-white font-semibold px-8 py-6 text-lg rounded-2xl shadow-lg hover:shadow-green-500/50 hover:scale-105 transition-all duration-300"
            >
              Join Us <Rocket className="ml-2 h-5 w-5" />
            </Button>
            </a>
        </motion.div>
      </motion.div>
    </section>
  );
}

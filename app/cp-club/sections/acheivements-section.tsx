"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Award,
  Trophy,
  Briefcase,
  Code2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const items = [
  {
    icon: Trophy,
    title: "ICPC Participation",
    desc: "Our members representing VJTI in ICPC Asia West onsite Regionals.",
    images: [
      "/ICPC1.jpeg",
      "/ICPC2.jpeg",
    ],
  },
  {
    icon: Award,
    title: "Contest Wins",
    desc: "Top finishes at university and national contests, showcasing our skills and teamwork.",
    images: [
      "/Abhay1.jpeg",
      "/Codespree.png",
      "/EscapeSequence.jpeg",
      "/Codefest1.jpeg",
      "/Abhay2.jpeg",
      "/Codecraft.jpeg",
      "/Abhay3.jpeg",
      "/Abhay4.jpeg",
    ],
  },
  {
    icon: Briefcase,
    title: "Internships & Offers",
    desc: "Members placed at top companies.",
    images: [
      "/Placement_CP.jpg",
      "/Internship_CP.jpg",
    ],
  },
  {
    icon: Code2,
    title: "Online Contests",
    desc: "Regular practice on Codeforces, Codechef, and LeetCode with impressive ratings.",
    images: [
      "/CF_Ranklist.png",
      "/Club_Leaderboard.png",
    ],
  },
];

const fadeInUp = {
  initial: { opacity: 0, y: 60 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 },
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.15,
    },
  },
};

function ImageCarousel({ images, title }: { images: string[]; title: string }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const goToPrevious = () =>
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  const goToNext = () =>
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));

  return (
    <div className="relative mt-4 overflow-hidden rounded-xl border border-[hsl(0,0%,14.9%)] bg-[hsl(0,0%,8%)] group">
      <div className="relative flex items-center justify-center h-[320px] md:h-[400px] overflow-hidden bg-black/20">
        <img
          src={images[currentIndex]}
          alt={`${title} ${currentIndex + 1}`}
          className="max-h-full max-w-full object-contain transition-transform duration-700 group-hover:scale-105"
        />
        {images.length > 1 && (
          <>
            <button
              onClick={goToPrevious}
              className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-black/60 p-2 backdrop-blur-sm hover:bg-emerald-600/40 transition-colors"
            >
              <ChevronLeft className="h-4 w-4 text-white" />
            </button>
            <button
              onClick={goToNext}
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-black/60 p-2 backdrop-blur-sm hover:bg-emerald-600/40 transition-colors"
            >
              <ChevronRight className="h-4 w-4 text-white" />
            </button>
            <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5">
              {images.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentIndex(idx)}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    idx === currentIndex
                      ? "w-6 bg-gradient-to-r from-green-400 to-emerald-600"
                      : "w-1.5 bg-white/40 hover:bg-white/70"
                  }`}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default function AchievementSection() {
  return (
    <section className="py-20 px-6 bg-gradient-to-b from-transparent via-emerald-950/5 to-transparent text-[hsl(0,0%,98%)] border-t border-[hsl(0,0%,14.9%)]">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeInUp}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-green-400 to-emerald-600 bg-clip-text text-transparent">
            Achievements
          </h2>
          <p className="text-gray-400 text-lg">
            Celebrating excellence in competitive programming and beyond
          </p>
        </motion.div>

        <motion.div
          variants={staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, margin: "-100px" }}
          className="grid md:grid-cols-2 gap-8"
        >
          {items.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.div key={index} variants={fadeInUp}>
                <div className="rounded-2xl border border-[hsl(0,0%,14.9%)] bg-[hsl(0,0%,6%)] hover:border-emerald-500/50 transition-all duration-500 hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(16,185,129,0.15)] p-8 group">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="p-3 bg-gradient-to-br from-green-400/20 to-emerald-600/20 rounded-xl group-hover:scale-110 transition-transform">
                      <Icon className="h-6 w-6 text-green-400" />
                    </div>
                    <h3 className="text-xl font-semibold group-hover:text-green-400 transition-colors">
                      {item.title}
                    </h3>
                  </div>
                  <p className="text-gray-400 mb-4">{item.desc}</p>
                  <ImageCarousel images={item.images} title={item.title} />
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}

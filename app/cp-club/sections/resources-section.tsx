'use client';

import { motion } from 'framer-motion';
import { BookOpen, Code2, Briefcase, Trophy, Award, ExternalLink, LucideIcon } from 'lucide-react';
import { Card } from '@/components/ui/card';

const fadeInUp = {
  initial: { opacity: 0, y: 60 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 }
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

interface Resource {
  title: string;
  description: string;
  url: string;
  icon: LucideIcon;
}

const resources: Resource[] = [
  {
    title: "Striver's DSA Sheet",
    description: "Comprehensive problems covering all data structures and algorithms",
    url: "#",
    icon: BookOpen
  },
  {
    title: "Codeforces",
    description: "Practice problems, participate in contests, and improve your rating",
    url: "#",
    icon: Code2
  },
  {
    title: "LeetCode",
    description: "Master interview questions and strengthen problem-solving skills",
    url: "#",
    icon: Briefcase
  },
  {
    title: "AtCoder",
    description: "Japanese platform with unique and challenging problems",
    url: "#",
    icon: Trophy
  },
  {
    title: "CSES Problem Set",
    description: "High-quality competitive programming practice problems",
    url: "#",
    icon: Award
  },
  {
    title: "CP Algorithms",
    description: "In-depth tutorials and implementations of key algorithms",
    url: "#",
    icon: BookOpen
  }
];

export function ResourcesSection() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-transparent via-emerald-950/5 to-transparent border-t border-[hsl(0,0%,14.9%)]">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeInUp}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-green-400 to-emerald-600 bg-clip-text text-transparent">
            Curated Resources
          </h2>
          <p className="text-gray-400 text-lg">Your roadmap to competitive programming mastery</p>
        </motion.div>

        <motion.div
          variants={staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, margin: "-100px" }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {resources.map((resource, index) => (
            <motion.div
              key={index}
              variants={fadeInUp}
            >
              <Card className="p-6 bg-[hsl(0,0%,8%)] border-[hsl(0,0%,14.9%)] rounded-2xl hover:border-green-500/50 hover:scale-105 transition-all duration-300 h-full group cursor-pointer">
                <div className="flex items-start justify-between mb-4">
                  <div className="p-3 bg-gradient-to-br from-green-400/20 to-emerald-600/20 rounded-xl group-hover:scale-110 transition-transform">
                    <resource.icon className="h-6 w-6 text-green-400" />
                  </div>
                  <ExternalLink className="h-5 w-5 text-gray-400 group-hover:text-green-400 transition-colors" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-white group-hover:text-green-400 transition-colors">
                  {resource.title}
                </h3>
                <p className="text-gray-400">{resource.description}</p>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

'use client';

import { motion } from 'framer-motion';
import { Users, Zap, Trophy } from 'lucide-react';
import { Card } from '@/components/ui/card';

const fadeInUp = {
  initial: { opacity: 0, y: 60 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 }
};

export function AboutSection() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 relative">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeInUp}
        >
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-green-400 to-emerald-600 bg-clip-text text-transparent">
                Our Mission
              </h2>
              <p className="text-lg text-gray-300 mb-6 leading-relaxed">
                We're dedicated to building a thriving community of problem-solvers who push boundaries
                and excel in competitive programming. Through collaborative learning, rigorous practice,
                and expert mentorship, we transform passionate coders into championship contenders.
              </p>
              <p className="text-lg text-gray-300 leading-relaxed">
                Whether you're taking your first steps into algorithms or competing at ICPC,
                CP Club provides the resources, support, and challenges you need to succeed.
              </p>
            </div>

            <div className="relative">
              <Card className="p-8 bg-[hsl(0,0%,8%)] border-[hsl(0,0%,14.9%)] rounded-2xl hover:border-green-500/50 transition-all duration-300">
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-gradient-to-br from-green-400/20 to-emerald-600/20 rounded-xl">
                      <Users className="h-6 w-6 text-green-400" />
                    </div>
                    <div>
                      <h3 className="text-xl text-white font-semibold mb-2">Community First</h3>
                      <p className="text-gray-400">Learn together, grow together, win together</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-gradient-to-br from-green-400/20 to-emerald-600/20 rounded-xl">
                      <Zap className="h-6 w-6 text-green-400" />
                    </div>
                    <div>
                      <h3 className="text-xl text-white font-semibold mb-2">Rapid Growth</h3>
                      <p className="text-gray-400">Accelerate your skills with structured guidance</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-gradient-to-br from-green-400/20 to-emerald-600/20 rounded-xl">
                      <Trophy className="h-6 w-6 text-green-400" />
                    </div>
                    <div>
                      <h3 className="text-xl text-white font-semibold mb-2">Compete & Excel</h3>
                      <p className="text-gray-400">Represent at national and international levels</p>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

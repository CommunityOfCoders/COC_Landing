'use client';

import { motion } from "framer-motion";

const team = [
  {
    name: "Karan Shah",
    role: "ETH Head",
    expertise: "Blockchain & Web3",
  },
  {
    name: "Darshit Shah",
    role: "Core Team",
    expertise: "Blockchain & Web3",
  },
  {
    name: "Rupak Gupta",
    role: "Core Team",
    expertise: "Blockchain & Web3",
  },
  {
    name: "Aarya Pandey",
    role: "Core Team",
    expertise: "Blockchain & Web3",
  },
];

export function TeamMembers() {
  return (
    <section className="py-12 md:py-20 bg-neutral-950">
      <div className="container px-4 mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8 md:mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-3 md:mb-4">Core Team</h2>
          <p className="text-gray-400 max-w-2xl mx-auto text-sm md:text-base">
            Meet our dedicated core team driving blockchain innovation and Web3 development
          </p>
        </motion.div>

        {/* ETH Lead */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-md mx-auto mb-12"
        >
          <div className="text-center bg-gradient-to-br from-green-500/10 to-emerald-500/10 border-2 border-green-500/50 rounded-xl p-8 shadow-lg shadow-green-500/20">
            <div className="mb-6 flex justify-center">
              <div className="h-28 w-28 md:h-32 md:w-32 rounded-full bg-gradient-to-br from-green-400/30 to-emerald-500/30 flex items-center justify-center ring-4 ring-green-500/50">
                <span className="text-3xl md:text-4xl font-bold text-green-300">
                  {team[0].name.split(' ').map(n => n[0]).join('')}
                </span>
              </div>
            </div>
            <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">{team[0].name}</h3>
            <p className="text-green-300 mb-3 text-lg md:text-xl font-semibold">{team[0].role}</p>
            <p className="text-gray-300 text-base md:text-lg">{team[0].expertise}</p>
          </div>
        </motion.div>

        {/* Core Team */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {team.slice(1).map((member, index) => (
            <motion.div
              key={index + 1}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: (index + 1) * 0.1 }}
              className="text-center bg-neutral-900/50 border border-neutral-800 rounded-lg p-6 hover:border-green-500/50 transition-all"
            >
              <div className="mb-4 flex justify-center">
                <div className="h-20 w-20 md:h-24 md:w-24 rounded-full bg-gradient-to-br from-green-400/20 to-emerald-500/20 flex items-center justify-center ring-2 ring-green-500/30">
                  <span className="text-2xl md:text-3xl font-bold text-green-400">
                    {member.name.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
              </div>
              <h3 className="text-lg md:text-xl font-semibold text-white mb-1">{member.name}</h3>
              <p className="text-green-400 mb-1.5 md:mb-2 text-sm md:text-base font-medium">{member.role}</p>
              <p className="text-gray-400 text-sm md:text-base">{member.expertise}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

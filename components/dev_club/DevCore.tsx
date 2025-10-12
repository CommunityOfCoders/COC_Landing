"use client";
import React from "react";
import { motion } from "framer-motion";

const teamMembers = [
  { name: "Prathamesh Sankhe", role: "Head" },
  { name: "Harshal Kamble", role: "Core Member" },
  { name: "Amal Verma", role: "Core Member" },
  { name: "Ghruank Kothare", role: "Core Member" },
  { name: "Ahaan Desai", role: "Core Member" },
  { name: "Ritesh Saindane", role: "Core Member" },
  { name: "Dipesh Chavan", role: "Core Member" },
  { name: "Kartikay Pandey", role: "Core Member" },
  { name: "Tanish Bhamre", role: "Core Member" },
  { name: "Shivraj Kolwankar", role: "Core Member" },
];

function DevCore({ embedded = false }: { embedded?: boolean }) {
  const head = teamMembers.find((member) => member.role === "Head");
  const others = teamMembers.filter((member) => member.role !== "Head");

  return embedded ? (
    <div className="max-w-7xl mx-auto px-4 pt-8 pb-8 pointer-events-auto">
      {/* Header */}
      <div className="text-center mb-12">
        <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-b from-green-700 to-green-300 bg-clip-text text-transparent mb-2">
          Our Team
        </h2>
        <p className="text-gray-400 text-lg">
          Meet the talented individuals driving innovation
        </p>
      </div>

      {/* Head (Centered at top) */}
      <div className="flex justify-center mb-16">
        <div className="relative group/head rounded-3xl overflow-hidden bg-[linear-gradient(to_right,rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:14px_14px] backdrop-blur-sm border border-white/10 w-full sm:w-2/3 md:w-1/3 transition-all duration-500 hover:shadow-[0_0_30px_rgba(16,185,129,0.3)] hover:scale-105">
          <div className="p-8 flex flex-col items-center text-center space-y-4 relative">
            <h3 className="text-2xl font-semibold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              {head?.name}
            </h3>
            <p className="text-green-400 font-medium">{head?.role}</p>
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-green-400 via-emerald-500 to-green-400 origin-left scale-x-0 group-hover/head:scale-x-100 transition-transform duration-500" />
          </div>
        </div>
      </div>

      {/* 3x3 Grid for rest */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {others.map((member, index) => (
          <div
            key={member.name}
            className="relative group/card rounded-3xl overflow-hidden bg-[linear-gradient(to_right,rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:14px_14px] backdrop-blur-sm border border-white/10 transition-all duration-500 hover:shadow-[0_0_30px_rgba(16,185,129,0.3)] hover:scale-105"
          >
            <div className="p-8 flex flex-col items-center text-center space-y-4 relative">
              <h3 className="text-xl font-semibold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                {member.name}
              </h3>
              <p className="text-green-400 font-medium">{member.role}</p>

              {/* Animated glowing underline */}
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-green-400 via-emerald-500 to-green-400 origin-left scale-x-0 group-hover/card:scale-x-100 transition-transform duration-500" />
            </div>
          </div>
        ))}
      </div>
    </div>
  ) : (
    <section className="py-24 relative">
      <div className="max-w-7xl mx-auto px-4">
    

        {/* Head (Centered at top) */}
        <div className="flex justify-center mb-16">
          <motion.div
            key={head?.name}
            className="relative group rounded-3xl overflow-hidden bg-[linear-gradient(to_right,rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:14px_14px] backdrop-blur-sm border border-white/10 w-full sm:w-2/3 md:w-1/3 transition-all duration-500 hover:shadow-[0_0_30px_rgba(16,185,129,0.3)]"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            whileHover={{
              scale: 1.05,
              transition: { duration: 0.3, ease: "easeOut" },
            }}
          >
            <div className="p-8 flex flex-col items-center text-center space-y-4 relative">
              <h3 className="text-2xl font-semibold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                {head?.name}
              </h3>
              <p className="text-green-400 font-medium">{head?.role}</p>
              <motion.div
                className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-green-400 via-emerald-500 to-green-400 origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500"
              />
            </div>
          </motion.div>
        </div>

        {/* 3x3 Grid for rest */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {others.map((member, index) => (
            <motion.div
              key={member.name}
              className="relative group rounded-3xl overflow-hidden bg-[linear-gradient(to_right,rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:14px_14px] backdrop-blur-sm border border-white/10 transition-all duration-500 hover:shadow-[0_0_30px_rgba(16,185,129,0.3)]"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05, duration: 0.6 }}
              whileHover={{
                scale: 1.05,
                transition: { duration: 0.3, ease: "easeOut" },
              }}
            >
              <div className="p-8 flex flex-col items-center text-center space-y-4 relative">
                <h3 className="text-xl font-semibold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                  {member.name}
                </h3>
                <p className="text-green-400 font-medium">{member.role}</p>

                {/* Animated glowing underline */}
                <motion.div
                  className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-green-400 via-emerald-500 to-green-400 origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500"
                />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default DevCore;


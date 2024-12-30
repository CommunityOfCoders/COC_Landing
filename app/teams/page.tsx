"use client";
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Meteors } from "@/components/ui/meteors";
import Navbar from "@/components/Navbar";
import Image from 'next/image';
import { AnimatedTestimonials } from "@/components/ui/animated-testimonials";
import { getCurrentTeamMembers, getAlumni, type TeamMember } from '@/lib/supabase';

export default function TeamsPage() {
  const [currentMembers, setCurrentMembers] = useState<TeamMember[]>([]);
  const [alumni, setAlumni] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [membersData, alumniData] = await Promise.all([
          getCurrentTeamMembers(),
          getAlumni()
        ]);
        setCurrentMembers(membersData);
        setAlumni(alumniData);
      } catch (error) {
        console.error('Error fetching team data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-950 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-green-400"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-white">
      <Navbar />
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <Meteors number={20} />
        <div className="relative z-10 text-center max-w-6xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <h1 className="text-8xl font-bold">
              <span className="bg-gradient-to-b from-white to-gray-500 bg-clip-text text-transparent">Meet The</span>{' '}
              <span className="bg-gradient-to-r from-green-400 to-emerald-600 bg-clip-text text-transparent">Innovators</span>
            </h1>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="flex flex-col items-center space-y-6"
            >
              <p className="text-2xl text-gray-400 max-w-3xl">
                A collective of passionate developers, designers, and innovators building the future of technology
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <section className="py-24 relative">
        <div className="max-w-7xl mx-auto px-4">
          <motion.h2 
            className="text-4xl font-bold mb-16 text-center bg-gradient-to-r from-green-400 to-emerald-600 bg-clip-text text-transparent"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            Core Team
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {currentMembers.map((member, index) => (
              <motion.div
                key={member.id}
                className="relative group rounded-3xl overflow-hidden bg-[linear-gradient(to_right,rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:14px_14px] backdrop-blur-sm border border-white/10"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
              >
                <div className="p-8 flex flex-col items-center text-center space-y-4">
                  <motion.div
                    className="relative w-32 h-32 rounded-full overflow-hidden border-2 border-green-400/20"
                    whileHover={{ scale: 1.05 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <Image
                      src={member.image_url}
                      alt={member.name}
                      width={128}
                      height={128}
                      className="w-full h-full object-cover"
                    />
                  </motion.div>
                  
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="space-y-2"
                  >
                    <h3 className="text-xl font-semibold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                      {member.name}
                    </h3>
                    <p className="text-green-400 font-medium">
                      {member.role}
                    </p>
                    <p className="text-gray-400 text-sm">
                      {member.description}
                    </p>
                  </motion.div>

                  {member.social_links && (
                    <div className="flex space-x-4">
                      {member.social_links.github && (
                        <a
                          href={member.social_links.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-gray-400 hover:text-green-400 transition-colors"
                        >
                          <i className="fab fa-github text-xl" />
                        </a>
                      )}
                      {member.social_links.linkedin && (
                        <a
                          href={member.social_links.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-gray-400 hover:text-green-400 transition-colors"
                        >
                          <i className="fab fa-linkedin text-xl" />
                        </a>
                      )}
                    </div>
                  )}

                  <motion.div
                    className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-green-400 to-emerald-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"
                    initial={{ scaleX: 0 }}
                    whileHover={{ scaleX: 1 }}
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {alumni.length > 0 && (
        <section className="py-24 relative">
          <div className="max-w-7xl mx-auto px-4">
            <motion.h2 
              className="text-4xl font-bold mb-16 text-center bg-gradient-to-r from-green-400 to-emerald-600 bg-clip-text text-transparent"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
            >
              Our Alumni
            </motion.h2>
            <AnimatedTestimonials
              testimonials={alumni.map(alum => ({
                name: alum.name,
                designation: alum.role,
                src: alum.image_url,
                quote: alum.description
              }))}
            />
          </div>
        </section>
      )}
    </div>
  );
}
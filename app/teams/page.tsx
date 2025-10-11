"use client";
import React from 'react';
import { motion } from 'framer-motion';
import { Meteors } from "@/components/ui/meteors";
import Navbar from "@/components/Navbar";
import Image from 'next/image';
import { AnimatedTestimonials } from "@/components/ui/animated-testimonials";

const generalSecretary = {
  name: "Ayaansh Churi",
  role: "General Secretary",
  description: "Leading Community of Coders with vision and dedication. Orchestrating initiatives to build a thriving tech community.",
  image: "/Senate/Ayaansh_Churi.jpg",
};

const teamMembers = [
  {
    name: "Zoher Vohra",
    role: "Joint General Secretary",
    description: "Supporting community operations and fostering collaboration. Ensuring smooth execution of events and initiatives.",
    image: "/Senate/Zoher_Vohra.jpg",
  },
  {
    name: "Harsh Jagtap",
    role: "Treasurer",
    description: "Managing community finances and resources. Ensuring transparent budgeting for all technical events and activities.",
    image: "/Senate/Harsh_Jagtap.jpg",
  },
  {
    name: "Soham Rane",
    role: "CP Head",
    description: "Leading competitive programming initiatives and contests. Mentoring students to excel in algorithmic problem-solving.",
    image: "/Senate/Soham_Rane.jpg",
  },
  {
    name: "Prathamesh Sankhe",
    role: "Development Head",
    description: "Driving web and app development projects. Empowering members to build real-world applications and learn modern tech stacks.",
    image: "/Senate/Prathamesh_Sankhe.png",
  },
  {
    name: "Mudit Jain",
    role: "X Head",
    description: "Spearheading cross-domain initiatives, open-source contributions, and special projects. Bridging multiple technical verticals within the community.",
    image: "/Senate/Mudit_Jain.jpg",
  },
  {
    name: "Karan Shah",
    role: "Eth Head",
    description: "Leading blockchain and Web3 education initiatives. Building the next generation of decentralized application developers.",
    image: "/Senate/Karan_Shah.jpg",
  },
  {
    name: "Khush Agrawal",
    role: "ML Head",
    description: "Championing machine learning and AI projects. Conducting workshops and hackathons to democratize ML knowledge.",
    image: "/Senate/Khush_Agrawal.jpg",
  },
  {
    name: "Diksha Thongire",
    role: "Design Head",
    description: "Leading UI/UX design initiatives for community projects. Creating engaging visual experiences and brand identity.",
    image: "/Senate/Diksha_Thongire.jpeg",
  },
  {
    name: "Aarya Pandey",
    role: "PR Head",
    description: "Managing community outreach and communications. Building partnerships and promoting COC VJTI's technical achievements.",
    image: "/Senate/Aarya_Pandey.jpg",
  },
];

const mentors = [
  {
    quote: "Guiding the next generation of developers to build impactful solutions.",
    name: "Jane Smith",
    designation: "Technical Advisor at Google",
    src: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=3540&auto=format&fit=crop&ixlib=rb-4.0.3",
  },
  {
    quote: "Empowering students with the tools and knowledge to innovate.",
    name: "Michael Chen",
    designation: "Senior Engineer at Microsoft",
    src: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=3560&auto=format&fit=crop&ixlib=rb-4.0.3",
  },
  // Add more mentors as needed
];

const MemberCard = ({ member, index }: { member: typeof teamMembers[0], index: number }) => (
  <motion.div
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
          src={member.image}
          alt={member.name}
          width={128}
          height={128}
          className="w-full h-full object-cover"
          style={{ objectPosition: member.name === 'Prathamesh Sankhe' ? '50% 15%' : member.name === 'Aarya Pandey' ? '50% 0%' : '50% 50%' }}
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

      <motion.div
        className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-green-400 to-emerald-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"
        initial={{ scaleX: 0 }}
        whileHover={{ scaleX: 1 }}
      />
    </div>
  </motion.div>
);

export default function TeamsPage() {
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
          
          {/* General Secretary - Centered */}
          <div className="flex justify-center mb-12">
            <div className="w-full max-w-md">
              <MemberCard member={generalSecretary} index={0} />
            </div>
          </div>

          {/* Other Team Members - 3x3 Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {teamMembers.map((member, index) => (
              <MemberCard key={member.name} member={member} index={index + 1} />
            ))}
          </div>
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
            Our Mentors & Advisors
          </motion.h2>
          <AnimatedTestimonials testimonials={mentors} />
        </div>
      </section>
    </div>
  );
} 
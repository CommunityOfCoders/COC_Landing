'use client';

import { motion } from 'framer-motion';
import { Linkedin, Code2 } from 'lucide-react';
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

interface TeamMember {
  name: string;
  role: string;
  cf: string;
  cf_link: string;
  linkedin: string;
}

const teamMembers: TeamMember[] = [
  { name: "Soham Rane", role: "Head", cf: "Expert", cf_link: "https://codeforces.com/profile/bingo", linkedin: "https://www.linkedin.com/in/sohamrane301/" },
  { name: "Siddhesh Pandey", role: "Co-Head", cf: "Expert", cf_link: "https://codeforces.com/profile/Sid_7905", linkedin: "https://www.linkedin.com/in/siddhesh-pandey-1223a6315/" },
  { name: "Abhay Upadhyay", role: "Technical Lead", cf: "Candidate Master", cf_link: "https://codeforces.com/profile/hewhocodes", linkedin: "https://www.linkedin.com/in/hewhocodes247/" },
  { name: "Amal Verma", role: "Consultant", cf: "Expert", cf_link: "https://codeforces.com/profile/amalverma", linkedin: "https://www.linkedin.com/in/amal-verma/" },
  { name: "Kartikay Pandey", role: "Content and Community Manager", cf: "Pupil", cf_link: "https://codeforces.com/profile/Chef-KTK", linkedin: "https://www.linkedin.com/in/kartikay7905/" },
  { name: "Mohnish Pathak", role: "Workshop Coordinator", cf: "Pupil", cf_link: "https://codeforces.com/profile/BoredAF1", linkedin: "https://www.linkedin.com/in/mohnish-p-027261281/" },
  { name: "Kartik Lande", role: "Core Member", cf: "Pupil", cf_link: "https://codeforces.com/profile/kartik70", linkedin: "https://www.linkedin.com/in/kartik-lande/" },
  { name: "Santrupt Potphode", role: "Core Member", cf: "Pupil", cf_link: "https://codeforces.com/profile/santrupt_29", linkedin: "https://www.linkedin.com/in/santrupt29/" },
  { name: "Ronit Choube", role: "Core Member", cf: "Pupil", cf_link: "https://codeforces.com/profile/RAIDxVIPER", linkedin: "https://www.linkedin.com/in/ronit-choube-a10a72286/" },
  { name: "Raj Kharkwal", role: "Core Member", cf: "Specialist", cf_link: "https://codeforces.com/profile/Ayanokojii", linkedin: "https://www.linkedin.com/in/raj-kharkwal-6097b9283/" },
];

export function TeamSection() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 border-t border-[hsl(0,0%,14.9%)]">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeInUp}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-green-400 to-emerald-600 bg-clip-text text-transparent">
            The Team
          </h2>
          <p className="text-gray-400 text-lg">Meet the leaders driving our community forward</p>
        </motion.div>

        <motion.div
          variants={staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, margin: "-100px" }}
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {teamMembers.map((member, index) => (
            <motion.div
              key={index}
              variants={fadeInUp}
            >
              <Card className="p-6 bg-[hsl(0,0%,8%)] border-[hsl(0,0%,14.9%)] rounded-2xl hover:border-green-500/50 transition-all duration-300 text-center group cursor-pointer">
                <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <span className="text-3xl font-bold text-white">
                    {member.name.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                <h3 className="text-xl text-white font-semibold mb-1 group-hover:text-green-400 transition-colors">
                  {member.name}
                </h3>
                <p className="text-green-400 font-medium mb-1">{member.role}</p>
                <p className="text-gray-400 text-sm mb-4">{member.cf}</p>
                <div className="flex items-center justify-center gap-3">
                  <a
                    href={member.linkedin}
                    className="p-2 text-white rounded-lg bg-[hsl(0,0%,14.9%)] hover:bg-green-500/20 hover:text-green-400 transition-all hover:scale-110"
                  >
                    <Linkedin className="h-4 w-4" />
                  </a>
                  <a
                    href={member.cf_link}
                    className="p-2 text-white rounded-lg bg-[hsl(0,0%,14.9%)] hover:bg-green-500/20 hover:text-green-400 transition-all hover:scale-110"
                  >
                    <Code2 className="h-4 w-4" />
                  </a>
                </div>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

"use client";
import React from 'react'
import { FaLinkedin } from "react-icons/fa"; 
const TeamSection = () => {


const teamMembers = [
  {
    name: "Sharan Poojari",
    role: "Dev Head",
    img: "/dev_head_sharan.jpeg",
    link: "https://www.linkedin.com/in/sharanpoojari",
  },
  {
    name: "Manas Bhavaskar",
    role: "Developer",
    img: "dev_team_manas.jpg",
    link: "https://www.linkedin.com/in/manas-bavaskar",
  },
  {
    name: "Sneha Menat",
    role: "Developer",
    img: "/dev_team_sneha.jpeg",
    link: "https://www.linkedin.com/in/sneha-menat-0766b9233/",
  },
  {
    name: "Moksh Shah",
    role: "Developer",
    img: "/dev_team_moksh.jpeg",
    link: "https://www.linkedin.com/in/mokshshah",
  },
  {
    name: "Nishit Kekane",
    role: "Developer",
    img: "/dev_team_nishit.jpeg",
    link: "https://www.linkedin.com/in/nishitkekane",
  },
];

  return (
    <section className="py-16 px-8 bg-black">
              <h2 className="text-6xl font-bold bg-gradient-to-b from-green-700 to-green-300 bg-clip-text text-transparent text-center mb-4r py-10">
                MEET THE TEAM
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 py-10">
                {teamMembers.map((member) => (
                  <div key={member.name} className="text-center team-member">
                    <img
                      src={member.img}
                      alt={member.name}
                      className="w-32 h-32 rounded-full mx-auto mb-4"
                    />
                    <h3 className="text-xl font-semibold text-green-300">
                      {member.name}
                    </h3>
                    <p className="text-sm text-neutral-400">{member.role}</p>
                    <a
                      href={member.link}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <FaLinkedin className="text-blue-600 hover:text-blue-500 text-2xl mt-2 inline-block transition-all duration-300" />
                    </a>
                  </div>
                ))}
              </div>
            </section>
  )
}

export default TeamSection

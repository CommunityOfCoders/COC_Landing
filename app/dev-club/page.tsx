import Navbar from "@/components/Navbar";
import { SectionHero } from "@/components/sections/SectionHero";
import { FeaturesSectionDemo } from "@/components/sections/EventsSection";

import { Suspense } from "react";
import { FaLinkedin } from "react-icons/fa"; 
import TeamSection from "@/components/sections/TeamSection";
import AchievementSection from "@/components/sections/AchievementSection";
import GallerySection from "@/components/sections/GallerySection";



const badges = [
  { label: "Web Development", color: "bg-green-500/10 text-green-300" },
  { label: "Mobile Apps", color: "bg-emerald-500/10 text-emerald-300" },
  { label: "Cloud Computing", color: "bg-green-500/10 text-green-300" },
  { label: "DevOps", color: "bg-emerald-500/10 text-emerald-300" },
  { label: "System Design", color: "bg-green-500/10 text-green-300" },
  { label: "Full Stack", color: "bg-emerald-500/10 text-emerald-300" },
];




export default function DevClubPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <main className="min-h-screen bg-black text-white">
        <Navbar />
        <SectionHero
          title="Dev Club"
          subtitle="Where Code Meets Innovation"
          description="Come join our vibrant community of developers who are all about learning, building, and growing together. Whether you're passionate about creating web apps, mobile experiences, or exploring new tech, we support each other every step of the way."
          badges={badges}
        />

        {/* Events Section */}
        <section className="py-0 px-0">
          <FeaturesSectionDemo />
        </section>

        {/* Team Members Section */}
        <TeamSection/>

        {/* Achievements Section */}
       <AchievementSection/>


        {/* Gallery Section */}
        <GallerySection/>
        
      </main>
    </Suspense>
  );
}

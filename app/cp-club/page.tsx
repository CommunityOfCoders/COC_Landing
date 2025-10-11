import Navbar from "@/components/Navbar";
import { SectionHero } from "@/components/sections/SectionHero";
import { AboutSection } from "./sections/about-section";
import AchievementsSection from "./sections/acheivements-section";
import { Events } from "./sections/events-section";
import { ResourcesSection } from "./sections/resources-section";
import { TeamSection } from "./sections/teams-section";
import { Suspense } from "react";
import { HeroSection } from "./sections/hero-section";

export default function CpClubPage() {

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Navbar />
      <main className="min-h-screen bg-neutral-950">
        <HeroSection />
        <AboutSection />
        <AchievementsSection />
        <Events />
        {/* <ResourcesSection /> */}
        <TeamSection />

      </main>
    </Suspense>
  );
}
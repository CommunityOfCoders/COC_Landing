import Navbar from "@/components/Navbar";
import { AboutSection } from "../../components/cp-club/sections/about-section";
import AchievementsSection from "../../components/cp-club/sections/acheivements-section";
import { Events } from "../../components/cp-club/sections/events-section";
import { TeamSection } from "../../components/cp-club/sections/teams-section";
import { Suspense } from "react";
import HeroSection from "../../components/cp-club/sections/hero-section";

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
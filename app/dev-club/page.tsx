import Navbar from "@/components/Navbar";
import { HeroSection } from "@/components/sections/HeroSection";
import { FeaturesSectionDemo } from "@/components/sections/EventsSection";
import { Suspense } from "react";

export default function DevClubPage() {
  const badges = [
    { label: "Web Development", className: "bg-green-500/10 text-green-300" },
    { label: "Mobile Apps", className: "bg-emerald-500/10 text-emerald-300" },
    { label: "Cloud Computing", className: "bg-green-500/10 text-green-300" },
    { label: "DevOps", className: "bg-emerald-500/10 text-emerald-300" },
    { label: "System Design", className: "bg-green-500/10 text-green-300" },
    { label: "Full Stack", className: "bg-emerald-500/10 text-emerald-300" },
  ];

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <main className="min-h-screen bg-neutral-950">
        <Navbar />
        <div>
          <HeroSection
          title="Dev Club"
          subtitle="Where Code Meets Innovation"
          description="Join a thriving community of developers who are passionate about crafting exceptional software solutions. From web applications to mobile experiences, we're building the digital future together."
          badges={badges}
        />
          <FeaturesSectionDemo />
          {/* Other sections will go here */}
          {/* <DevCore /> */}
        </div>
      </main>
    </Suspense>
  );
} 
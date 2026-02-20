import Navbar from "@/components/Navbar";
import { HeroSection } from "@/components/sections/HeroSection";

export default function ProjXPage() {
  const badges = [
    { label: "Artificial Intelligence", className: "bg-green-500/10 text-green-300" },
    { label: "Machine Learning", className: "bg-emerald-500/10 text-emerald-300" },
    { label: "OpenCV", className: "bg-green-500/10 text-green-300" },
    { label: "Open Source", className: "bg-emerald-500/10 text-emerald-300" },
    { label: "Computer Vision", className: "bg-green-500/10 text-green-300" },
    { label: "Deep Learning", className: "bg-emerald-500/10 text-emerald-300" },
  ];

  return (
    <main className="min-h-screen bg-neutral-950">
      <Navbar />
      <HeroSection
        title="Proj X"
        subtitle="Intelligence Through Open Source"
        description="Join a forward-thinking community dedicated to AI and Open Source innovation. From mastering Computer Vision with OpenCV to training advanced ML models, we are building the intelligent systems of tomorrow."
        badges={badges}
      />
      {/* Other sections will go here */}
    </main>
  );
}
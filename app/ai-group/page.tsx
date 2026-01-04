import Navbar from "@/components/Navbar";
import { SectionHero } from "@/components/sections/SectionHero";
import { TeamMembers } from "@/components/ai-group/TeamMembers";
import { Events } from "@/components/ai-group/Events";
import { Suspense } from "react";

export default function AIGroupPage() {
  const badges = [
    { label: "Machine Learning", color: "bg-green-500/10 text-green-300" },
    { label: "Deep Learning", color: "bg-emerald-500/10 text-emerald-300" },
    { label: "Computer Vision", color: "bg-green-500/10 text-green-300" },
    { label: "NLP", color: "bg-emerald-500/10 text-emerald-300" },
    { label: "Neural Networks", color: "bg-green-500/10 text-green-300" },
    { label: "Data Science", color: "bg-emerald-500/10 text-emerald-300" },
  ];

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <main className="min-h-screen bg-neutral-950">
        <Navbar />
        <SectionHero
          title="ML Club"
          subtitle="Shaping Tomorrow's Intelligence"
          description="Dive into the fascinating world of machine learning and artificial intelligence with our dedicated community. Explore cutting-edge ML technologies, deep learning algorithms, and innovative applications that are transforming industries."
          badges={badges}
        />
        <TeamMembers />
        <Events />
      </main>
    </Suspense>
  );
}
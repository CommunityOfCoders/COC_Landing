import { HeroSection } from '../../sections/HeroSection';

export default function CPClubPage() {
  const cpBadges = [
    { label: "Algorithms", className: "bg-green-500/10 text-green-300" },
    { label: "Data Structures", className: "bg-emerald-500/10 text-emerald-300" },
    { label: "Problem Solving", className: "bg-green-500/10 text-green-300" },
    { label: "Competitive Coding", className: "bg-emerald-500/10 text-emerald-300" },
    { label: "ICPC Training", className: "bg-green-500/10 text-green-300" },
  ];

  return (
    <HeroSection
      title="CP Club"
      subtitle="Where Algorithms Meet Excellence"
      description="Join a thriving community of competitive programmers who are passionate about solving challenging problems. From mastering algorithms to competing in ICPC, we're building the next generation of problem solvers."
      badges={cpBadges}
      ctaLink="https://chat.whatsapp.com/ITzWAJLkazz0XIJDZ5BZpv"
      ctaText="Join Us"
    />
  );
}
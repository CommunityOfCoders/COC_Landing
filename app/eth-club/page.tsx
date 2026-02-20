import Navbar from "@/components/Navbar";
import { HeroSection } from "@/components/sections/HeroSection";
import { TeamMembers } from "@/components/eth-club/TeamMembers";
import { Events } from "@/components/eth-club/Events";
import { Suspense } from "react";

export default function EthClubPage() {
  const badges = [
    { label: "Blockchain", className: "bg-green-500/10 text-green-300" },
    { label: "Smart Contracts", className: "bg-emerald-500/10 text-emerald-300" },
    { label: "Web3", className: "bg-green-500/10 text-green-300" },
    { label: "DeFi", className: "bg-emerald-500/10 text-emerald-300" },
    { label: "NFTs", className: "bg-green-500/10 text-green-300" },
    { label: "Solidity", className: "bg-emerald-500/10 text-emerald-300" },
  ];

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <main className="min-h-screen bg-neutral-950">
        <Navbar />
        <HeroSection
          title="ETH Club"
          subtitle="Building the Decentralized Future"
          description="Dive into the world of blockchain technology and Web3 development. Explore Ethereum, smart contracts, DeFi protocols, and the revolutionary potential of decentralized applications."
          badges={badges}
        />
        <TeamMembers />
        <Events />
      </main>
    </Suspense>
  );
} 
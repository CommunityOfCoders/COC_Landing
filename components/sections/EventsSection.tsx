"use client";
import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
// import { Boxes } from "../ui/background-boxes";
// import { Particles } from "../ui/particles";
import {OrbitingCircles} from "@/components/ui/orbiting-circles";
import { AnimatedList } from "@/components/ui/animated-list";
import DevCore from "@/components/dev_club/DevCore";
import EventsCarousel from "@/components/EventsCarousel";

const Icons = {
  python: () => (
    <svg viewBox="0 0 128 128" width="100" height="100">
      <linearGradient id="python-original-a" gradientUnits="userSpaceOnUse" x1="70.252" y1="1237.476" x2="170.659" y2="1151.089" gradientTransform="matrix(.563 0 0 -.568 -29.215 707.817)"><stop offset="0" stopColor="#5A9FD4"/><stop offset="1" stopColor="#306998"/></linearGradient><linearGradient id="python-original-b" gradientUnits="userSpaceOnUse" x1="209.474" y1="1098.811" x2="173.62" y2="1149.537" gradientTransform="matrix(.563 0 0 -.568 -29.215 707.817)"><stop offset="0" stopColor="#FFD43B"/><stop offset="1" stopColor="#FFE873"/></linearGradient><path fill="url(#python-original-a)" d="M63.391 1.988c-4.222.02-8.252.379-11.8 1.007-10.45 1.846-12.346 5.71-12.346 12.837v9.411h24.693v3.137H29.977c-7.176 0-13.46 4.313-15.426 12.521-2.268 9.405-2.368 15.275 0 25.096 1.755 7.311 5.947 12.519 13.124 12.519h8.491V67.234c0-8.151 7.051-15.34 15.426-15.34h24.665c6.866 0 12.346-5.654 12.346-12.548V15.833c0-6.693-5.646-11.72-12.346-12.837-4.244-.706-8.645-1.027-12.866-1.008zM50.037 9.557c2.55 0 4.634 2.117 4.634 4.721 0 2.593-2.083 4.69-4.634 4.69-2.56 0-4.633-2.097-4.633-4.69-.001-2.604 2.073-4.721 4.633-4.721z"/><path fill="url(#python-original-b)" d="M91.682 28.38v10.966c0 8.5-7.208 15.655-15.426 15.655H51.591c-6.756 0-12.346 5.783-12.346 12.549v23.515c0 6.691 5.818 10.628 12.346 12.547 7.816 2.297 15.312 2.713 24.665 0 6.216-1.801 12.346-5.423 12.346-12.547v-9.412H63.938v-3.138h37.012c7.176 0 9.852-5.005 12.348-12.519 2.578-7.735 2.467-15.174 0-25.096-1.774-7.145-5.161-12.521-12.348-12.521h-9.268zM77.809 87.927c2.561 0 4.634 2.097 4.634 4.692 0 2.602-2.074 4.719-4.634 4.719-2.55 0-4.633-2.117-4.633-4.719 0-2.595 2.083-4.692 4.633-4.692z"/><path opacity=".444" fill="url(#python-original-a)" enableBackground="new" d="M97.309 119.597c0 3.543-14.816 6.416-33.091 6.416-18.276 0-33.092-2.873-33.092-6.416 0-3.544 14.815-6.417 33.092-6.417 18.275 0 33.091 2.872 33.091 6.417z"/>
    </svg>
  ),
  javascript: () => (
    <svg viewBox="0 0 128 128" width="100" height="100">
      <path fill="#F0DB4F" d="M1.408 1.408h125.184v125.185H1.408z"/><path fill="#323330" d="M116.347 96.736c-.917-5.711-4.641-10.508-15.672-14.981-3.832-1.761-8.104-3.022-9.377-5.926-.452-1.69-.512-2.642-.226-3.665.821-3.32 4.784-4.355 7.925-3.403 2.023.678 3.938 2.237 5.093 4.724 5.402-3.498 5.391-3.475 9.163-5.879-1.381-2.141-2.118-3.129-3.022-4.045-3.249-3.629-7.676-5.498-14.756-5.355l-3.688.477c-3.534.893-6.902 2.748-8.877 5.235-5.926 6.724-4.236 18.492 2.975 23.335 7.104 5.332 17.54 6.545 18.873 11.531 1.297 6.104-4.486 8.08-10.234 7.378-4.236-.881-6.592-3.034-9.139-6.949-4.688 2.713-4.688 2.713-9.508 5.485 1.143 2.499 2.344 3.63 4.26 5.795 9.068 9.198 31.76 8.746 35.83-5.176.165-.478 1.261-3.666.38-8.581zM69.462 58.943H57.753l-.048 30.272c0 6.438.333 12.34-.714 14.149-1.713 3.558-6.152 3.117-8.175 2.427-2.059-1.012-3.106-2.451-4.319-4.485-.333-.584-.583-1.036-.667-1.071l-9.52 5.83c1.583 3.249 3.915 6.069 6.902 7.901 4.462 2.678 10.459 3.499 16.731 2.059 4.082-1.189 7.604-3.652 9.448-7.401 2.666-4.915 2.094-10.864 2.07-17.444.06-10.735.001-21.468.001-32.237z"/>
    </svg>
  ),
  react: () => (
    <svg viewBox="0 0 128 128" width="100" height="100">
      <g fill="#61DAFB"><circle cx="64" cy="64" r="11.4"/><path d="M107.3 45.2c-2.2-.8-4.5-1.6-6.9-2.3.6-2.4 1.1-4.8 1.5-7.1 2.1-13.2-.2-22.5-6.6-26.1-1.9-1.1-4-1.6-6.4-1.6-7 0-15.9 5.2-24.9 13.9-9-8.7-17.9-13.9-24.9-13.9-2.4 0-4.5.5-6.4 1.6-6.4 3.7-8.7 13-6.6 26.1.4 2.3.9 4.7 1.5 7.1-2.4.7-4.7 1.4-6.9 2.3C8.2 50 1.4 56.6 1.4 64s6.9 14 19.3 18.8c2.2.8 4.5 1.6 6.9 2.3-.6 2.4-1.1 4.8-1.5 7.1-2.1 13.2.2 22.5 6.6 26.1 1.9 1.1 4 1.6 6.4 1.6 7.1 0 16-5.2 24.9-13.9 9 8.7 17.9 13.9 24.9 13.9 2.4 0 4.5-.5 6.4-1.6 6.4-3.7 8.7-13 6.6-26.1-.4-2.3-.9-4.7-1.5-7.1 2.4-.7 4.7-1.4 6.9-2.3 12.5-4.8 19.3-11.4 19.3-18.8s-6.8-14-19.3-18.8zM92.5 14.7c4.1 2.4 5.5 9.8 3.8 20.3-.3 2.1-.8 4.3-1.4 6.6-5.2-1.2-10.7-2-16.5-2.5-3.4-4.8-6.9-9.1-10.4-13 7.4-7.3 14.9-12.3 21-12.3 1.3 0 2.5.3 3.5.9zM81.3 74c-1.8 3.2-3.9 6.4-6.1 9.6-3.7.3-7.4.4-11.2.4-3.9 0-7.6-.1-11.2-.4-2.2-3.2-4.2-6.4-6-9.6-1.9-3.3-3.7-6.7-5.3-10 1.6-3.3 3.4-6.7 5.3-10 1.8-3.2 3.9-6.4 6.1-9.6 3.7-.3 7.4-.4 11.2-.4 3.9 0 7.6.1 11.2.4 2.2 3.2 4.2 6.4 6 9.6 1.9 3.3 3.7 6.7 5.3 10zm8.3-3.3c1.5 3.5 2.7 6.9 3.8 10.3-3.4.8-7 1.4-10.8 1.9 1.2-1.9 2.5-3.9 3.6-6 1.2-2.1 2.3-4.2 3.4-6.2zM64 97.8c-2.4-2.6-4.7-5.4-6.9-8.3 2.3.1 4.6.2 6.9.2 2.3 0 4.6-.1 6.9-.2-2.2 2.9-4.5 5.7-6.9 8.3zm-18.6-15c-3.8-.5-7.4-1.1-10.8-1.9 1.1-3.3 2.3-6.8 3.8-10.3 1.1 2 2.2 4.1 3.4 6.1 1.2 2.2 2.4 4.1 3.6 6.1zm-7-25.5c-1.5-3.5-2.7-6.9-3.8-10.3 3.4-.8 7-1.4 10.8-1.9-1.2 1.9-2.5 3.9-3.6 6-1.2 2.1-2.3 4.2-3.4 6.2zM64 30.2c2.4 2.6 4.7 5.4 6.9 8.3-2.3-.1-4.6-.2-6.9-.2-2.3 0-4.6.1-6.9.2 2.2-2.9 4.5-5.7 6.9-8.3zm22.2 21l-3.6-6c3.8.5 7.4 1.1 10.8 1.9-1.1 3.3-2.3 6.8-3.8 10.3-1.1-2.1-2.2-4.2-3.4-6.2zM31.7 35c-1.7-10.5-.3-17.9 3.8-20.3 1-.6 2.2-.9 3.5-.9 6 0 13.5 4.9 21 12.3-3.5 3.8-7 8.2-10.4 13-5.8.5-11.3 1.4-16.5 2.5-.6-2.3-1-4.5-1.4-6.6zM7 64c0-4.7 5.7-9.7 15.7-13.4 2-.8 4.2-1.5 6.4-2.1 1.6 5 3.6 10.3 6 15.6-2.4 5.3-4.5 10.5-6 15.5C15.3 75.6 7 69.6 7 64zm28.5 49.3c-4.1-2.4-5.5-9.8-3.8-20.3.3-2.1.8-4.3 1.4-6.6 5.2 1.2 10.7 2 16.5 2.5 3.4 4.8 6.9 9.1 10.4 13-7.4 7.3-14.9 12.3-21 12.3-1.3 0-2.5-.3-3.5-.9zM96.3 93c1.7 10.5.3 17.9-3.8 20.3-1 .6-2.2.9-3.5.9-6 0-13.5-4.9-21-12.3 3.5-3.8 7-8.2 10.4-13 5.8-.5 11.3-1.4 16.5-2.5.6 2.3 1 4.5 1.4 6.6zm9-15.6c-2 .8-4.2 1.5-6.4 2.1-1.6-5-3.6-10.3-6-15.6 2.4-5.3 4.5-10.5 6-15.5 13.8 4 22.1 10 22.1 15.6 0 4.7-5.8 9.7-15.7 13.4z"/></g>
    </svg>
  ),
  typescript: () => (
    <svg viewBox="0 0 128 128" width="100" height="100">
      <path fill="#007acc" d="M2 63.91v62.5h125v-125H2zm100.73-5a15.56 15.56 0 017.82 4.5 20.58 20.58 0 013 4c0 .16-5.4 3.81-8.69 5.85-.12.08-.6-.44-1.13-1.23a7.09 7.09 0 00-5.87-3.53c-3.79-.26-6.23 1.73-6.21 5a4.58 4.58 0 00.54 2.34c.83 1.73 2.38 2.76 7.24 4.86 8.95 3.85 12.78 6.39 15.16 10 2.66 4 3.25 10.46 1.45 15.24-2 5.2-6.9 8.73-13.83 9.9a38.32 38.32 0 01-9.52-.1A23 23 0 0180 109.19c-1.15-1.27-3.39-4.58-3.25-4.82a9.34 9.34 0 011.15-.73l4.6-2.64 3.59-2.08.75 1.11a16.78 16.78 0 004.74 4.54c4 2.1 9.46 1.81 12.16-.62a5.43 5.43 0 00.69-6.92c-1-1.39-3-2.56-8.59-5-6.45-2.78-9.23-4.5-11.77-7.24a16.48 16.48 0 01-3.43-6.25 25 25 0 01-.22-8c1.33-6.23 6-10.58 12.82-11.87a31.66 31.66 0 019.49.26zm-29.34 5.24v5.12H57.16v46.23H45.65V69.26H29.38v-5a49.19 49.19 0 01.14-5.16c.06-.08 10.87-.12 22.81-.1l22.56.05z"/>
    </svg>
  ),

  nodejs: () => (
    <svg viewBox="0 0 128 128" width="100" height="100">
      <path fill="#83CD29" d="M112.678 30.334L68.535 4.729c-2.781-1.584-6.424-1.584-9.227 0L14.82 30.334C11.951 31.985 10 35.088 10 38.407v51.142c0 3.319 1.951 6.423 4.82 8.073l11.952 6.848c6.489 3.317 8.812 3.317 11.763 3.317 9.626 0 15.133-5.839 15.133-15.953V39.803c0-.758-.639-1.397-1.397-1.397h-6.065c-.759 0-1.398.639-1.398 1.397v52.031c0 4.051-4.193 8.124-10.964 4.691l-12.51-7.207c-.4-.201-.638-.641-.638-1.071V38.407c0-.43.239-.87.638-1.071l44.143-25.605c.378-.201.858-.201 1.237 0l44.143 25.605c.399.201.638.641.638 1.071v51.142c0 .43-.239.87-.638 1.071l-44.143 25.605c-.378.201-.858.201-1.237 0l-11.295-6.669c-.319-.201-.758-.28-1.117-.121-3.163 1.822-3.782 2.104-6.748 3.106-.719.241-1.797.646.418 1.505l14.713 8.743c1.391.799 2.966 1.192 4.541 1.192 1.575 0 3.15-.393 4.541-1.192l44.143-25.605c2.869-1.65 4.82-4.754 4.82-8.073V38.407c0-3.319-1.951-6.423-4.82-8.073zM77.727 69.227c-11.774 0-14.168-3.394-15.013-10.124-.117-.959-.878-1.68-1.838-1.68h-6.182c-1.039 0-1.877.839-1.877 1.877v.12c0 6.947 3.783 15.226 24.91 15.226 14.951 0 23.509-5.839 23.509-16.055 0-10.215-6.865-12.945-21.259-14.858-14.535-1.925-15.973-2.904-15.973-6.307 0-2.803 1.237-6.548 11.963-6.548 9.626 0 13.188 2.084 14.633 8.583.12.639.639 1.117 1.278 1.117h6.182c.479 0 .958-.24 1.198-.639.359-.399.479-.878.359-1.357-1.357-11.774-9.745-17.248-23.65-17.248-13.508 0-21.579 5.719-21.579 15.294 0 10.336 7.984 13.188 20.798 14.473 15.254 1.557 16.434 3.879 16.434 6.787-.001 5.12-4.193 7.289-13.793 7.289z"/>
    </svg>
  ),
  express: () => (
    <svg viewBox="0 0 128 128" width="100" height="100">
      <path fill="#ffffff" d="M126.67 98.44c-4.56 1.16-7.38.05-9.91-3.75-5.68-8.51-11.95-16.63-18-24.9-.78-1.07-1.59-2.12-2.6-3.45C89 76 81.85 85.2 75.14 94.77c-2.4 3.42-4.92 4.91-9.4 3.7l26.92-36.13L67.6 29.71c4.31-.84 7.29-.41 9.93 3.45 5.83 8.52 12.26 16.63 18.67 25.21 6.45-8.55 12.8-16.67 18.8-25.11 2.41-3.42 5-4.72 9.33-3.46-3.28 4.35-6.49 8.63-9.72 12.88-4.36 5.73-8.64 11.53-13.16 17.14-1.61 2-1.35 3.3.09 5.19C109.9 76 118.16 87.1 126.67 98.44zM1.33 61.74c.72-3.61 1.2-7.29 2.2-10.83 6-21.43 30.6-30.34 47.5-17.06C60.93 41.64 63.39 52.62 62.9 65H7.1c-.84 22.21 15.15 35.62 35.53 28.78 7.15-2.4 11.36-8 13.47-15 1.07-3.51 2.84-4.06 6.14-3.06-1.69 8.76-5.52 16.08-13.52 20.66-12 6.86-29.13 4.64-38.14-4.89C5.26 85.89 3 78.92 2 71.39c-.15-1.2-.46-2.38-.7-3.57q.03-3.04.03-6.08zm5.87-1.49h50.43c-.33-16.06-10.33-27.47-24-27.57-15-.12-25.78 11.02-26.43 27.57z"/>
    </svg>
  ),
  nextjs: () => (
    <svg viewBox="0 0 128 128" width="100" height="100">
      <path fill="#ffffff" d="M64 0C28.7 0 0 28.7 0 64s28.7 64 64 64c11.2 0 21.7-2.9 30.8-7.9L48.4 55.3v36.6h-6.8V41.8h6.8l50.5 75.8C116.4 106.2 128 86.5 128 64c0-35.3-28.7-64-64-64zm22.1 84.6l-7.5-11.3V41.8h7.5v42.8z"/>
    </svg>
  )
};

interface Event {
  name: string;
  description: string;
  icon: string;
  color: string;
  time: string;
}

let developerEvents = [
  {
    name: "Github Workshop",
    description: "Master Git and GitHub",
    time: "Every Weekend",
    icon: "💻",
    color: "#4285F4", // Google Blue
  },
  {
    name: "API Murder Mystery",
    description: "Solve API challenges",
    time: "Monthly",
    icon: "🕵️‍♂️",
    color: "#DB4437", // Google Red
  },
  {
    name: "Debugathon",
    description: "Fix and optimize code",
    time: "Quarterly",
    icon: "🐞",
    color: "#F4B400", // Google Yellow
  },
  {
    name: "Routequest",
    description: "Web-based Capture The Flag challenges",
    time: "Quarterly",
    icon: "🗺️",
    color: "#0F9D58", // Google Green
  },
  {
    name: "WebGenesis",
    description: "Web development mentoring program",
    time: "Quarterly",
    icon: "🌐",
    color: "#673AB7", // Deep Purple
  },
  {
    name: "HackXcelerate",
    description: "24-hour hackathon",
    time: "Coming Soon",
    icon: "🚀",
    color: "#FF6D00", // Vibrant Orange
  },
];


developerEvents = Array.from({ length: 10 }, () => developerEvents).flat();

const EventCard = ({ name, description, icon, color, time }: Event) => {
  return (
    <figure
      className={cn(
        "relative mx-auto w-full max-w-[400px] cursor-pointer overflow-hidden rounded-2xl p-4 mb-4",
        "transition-all duration-200 ease-in-out hover:scale-[103%]",
        "transform-gpu bg-transparent backdrop-blur-md",
        "[border:1px_solid_rgba(255,255,255,.1)]",
        "[box-shadow:0_-20px_80px_-20px_#ffffff1f_inset]"
      )}
    >
      <div className="flex flex-row items-center gap-3">
        <div
          className="flex size-10 items-center justify-center rounded-2xl"
          style={{
            backgroundColor: color,
          }}
        >
          <span className="text-lg">{icon}</span>
        </div>
        <div className="flex flex-col overflow-hidden">
          <figcaption className="flex flex-row items-center whitespace-pre text-lg font-medium text-white">
            <span className="text-sm sm:text-lg">{name}</span>
            {/* <span className="mx-1">·</span> */}
            {/* <span className="text-xs text-gray-400">{time}</span> */}
          </figcaption>
          <p className="text-sm font-normal text-white/60">
            {description}
          </p>
        </div>
      </div>
    </figure>
  );
};

function EventsListDemo({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "relative flex h-full w-full flex-col overflow-hidden rounded-lg",
        "backdrop-blur-md border border-white/10",
        className,
      )}
    >
      <div className="h-[500px] overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        <AnimatedList className="p-4">
          {developerEvents.map((event, idx) => (
            <EventCard {...event} key={idx} />
          ))}
        </AnimatedList>
      </div>
    </div>
  );
}

export function FeaturesSectionDemo() {
  // EXPANSION ANIMATION CODE - COMMENTED OUT
  // const [isTeamHovered, setIsTeamHovered] = useState(false);
  // const [isEventsHovered, setIsEventsHovered] = useState(false);
  
  const cards = [
    { 
      id: 1, 
      className: "col-span-12 lg:col-span-8 row-span-2 min-h-[500px]",
      showOrbits: true 
    },
    { 
      id: 2, 
      className: "col-span-12 lg:col-span-4 row-span-2 min-h-[500px]",
      showAnimatedList: true 
    },
    { 
      id: 5, 
      className: "col-span-12 min-h-[800px]", // Events expanded above
      keyword: "Events",
      subheading: "Learn & Grow",
      isEventsBox: true
    },
    { 
      id: 3, 
      className: "col-span-12 min-h-[800px]", // Team expanded below
      keyword: "Team",
      subheading: "Join Our Community",
      isTeamBox: true
    },
    // { id: 6, className: "col-span-12 lg:col-span-6 min-h-[300px]", showEvents: true },
    // { id: 7, className: "col-span-12 lg:col-span-3 min-h-[300px]" },
    // { id: 8, className: "col-span-12 lg:col-span-3 min-h-[300px]" },
  ];

  return (
    <section className="py-24 bg-neutral-950/0 relative overflow-hidden">
      {/* <Particles className="absolute inset-0" /> */}
      
      <div className="text-center mb-16 relative z-10">
        <h2 className="text-6xl font-bold bg-gradient-to-b from-green-700 to-green-300 bg-clip-text text-transparent  mb-4">
          WHAT WE DO
        </h2>
        <p className="text-xl text-gray-400 max-w-2xl mx-auto">
          Empowering students with technology through workshops, hackathons, and collaborative projects
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-12 gap-6 relative">
          {cards.map((card) => (
            <motion.div
              key={card.id}
              // EXPANSION ANIMATION PROPS - COMMENTED OUT
              // layout
              className={cn(
                "relative group rounded-3xl overflow-hidden",
                "border border-gray-500/20",
                "shadow-[0_2px_10px_rgba(0,0,0,0.1)]",
                "bg-[linear-gradient(to_right,rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.05)_1px,transparent_1px)]",
                "bg-[size:14px_14px]",
                "backdrop-blur-sm",
                card.className,
                // EXPANSION CLASSES - COMMENTED OUT
                // When Events box (id 5) is expanded, it takes full width
                // card.id === 5 && isEventsHovered ? "!col-span-12 !min-h-[800px] order-3" : "",
                // When Team box (id 3) is expanded, Events box goes full width below
                // card.id === 5 && isTeamHovered ? "!col-span-12 order-4" : "",
                // When Team box (id 3) is expanded, it takes full width and height
                // card.id === 3 && isTeamHovered ? "!col-span-12 !min-h-[800px] order-3" : "",
                // When Events box (id 5) is expanded, Team box goes full width below
                // card.id === 3 && isEventsHovered ? "!col-span-12 order-4" : ""
              )}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ 
                // EXPANSION TRANSITIONS - COMMENTED OUT
                // layout: { 
                //   duration: 0.8, 
                //   ease: [0.16, 1, 0.3, 1] // Smooth easing curve
                // },
                opacity: { duration: 0.6 },
                y: { duration: 0.6 }
              }}
              whileHover={
                card.id === 3 || card.id === 5 
                  ? undefined // HOVER DISABLED
                  : { 
                      scale: 1.02,
                      transition: { duration: 0.2 }
                    }
              }
              // ONCLICK HANDLERS - COMMENTED OUT
              // onClick={
              //   card.id === 3 
              //     ? () => {
              //         if (isEventsHovered) {
              //           setIsEventsHovered(false);
              //           setTimeout(() => setIsTeamHovered(true), 100);
              //         } else {
              //           setIsTeamHovered(!isTeamHovered);
              //         }
              //       }
              //     : card.id === 5 
              //     ? () => {
              //         if (isTeamHovered) {
              //           setIsTeamHovered(false);
              //           setTimeout(() => setIsEventsHovered(true), 100);
              //         } else {
              //           setIsEventsHovered(!isEventsHovered);
              //         }
              //       }
              //     : undefined
              // }
              style={{
                backgroundPosition: '0 0',
                // cursor: card.id === 3 || card.id === 5 ? 'pointer' : 'default' // CURSOR DISABLED
              }}
            >
              {card.showOrbits && (
                   <div className="relative flex h-[500px] border-none w-full flex-col items-center justify-center overflow-hidden rounded-lg border bg-transparent md:shadow-xl">
                   <span className="pointer-events-none whitespace-pre-wrap bg-gradient-to-b from-gray-500 to-gray-300 bg-clip-text text-center text-8xl font-semibold leading-none text-transparent dark:from-white dark:to-black">
                     DEV
                   </span>
              
                   {/* Inner Circles */}
                   <OrbitingCircles
                     className="size-[30px] border-none bg-transparent"
                     duration={20}
                     delay={0}
                     radius={80}
                   >
                     <Icons.python />
                   </OrbitingCircles>
                   <OrbitingCircles
                     className="size-[30px] border-none bg-transparent"
                     duration={20}
                     delay={5}
                     radius={80}
                   >
                     <Icons.typescript />
                   </OrbitingCircles>
                   <OrbitingCircles
                     className="size-[30px] border-none bg-transparent"
                     duration={20}
                     delay={10}
                     radius={80}
                   >
                     <Icons.javascript />
                   </OrbitingCircles>
                   <OrbitingCircles
                     className="size-[30px] border-none bg-transparent"
                     duration={20}
                     delay={15}
                     radius={80}
                   >
                     <Icons.nodejs />
                   </OrbitingCircles>
              
                   {/* Outer Circles (reverse) */}
                   <OrbitingCircles
                     className="size-[50px] border-none bg-transparent"
                     radius={190}
                     duration={20}
                     delay={0}
                     reverse
                   >
                     <Icons.react />
                   </OrbitingCircles>
                   
                   <OrbitingCircles
                     className="size-[50px] border-none bg-transparent"
                     radius={190}
                     duration={20}
                     delay={14}
                     reverse
                   >
                     <Icons.express />
                   </OrbitingCircles>
                   <OrbitingCircles
                     className="size-[45px] border-none bg-transparent"
                     radius={190}
                     duration={20}
                     delay={21}
                     reverse
                   >
                     <Icons.nextjs />
                   </OrbitingCircles>
                 </div>
              )}

              {card.showAnimatedList && (
                <EventsListDemo className="h-full" />
              )}

              {/* EXPANSION ANIMATION CONTENT - COMMENTED OUT */}
              {/* <AnimatePresence mode="wait">
                {card.keyword && !(card.id === 3 && isTeamHovered) && !(card.id === 5 && isEventsHovered) && (
                  <motion.div 
                    key="keyword-view"
                    className="relative z-40 h-full flex flex-col items-center justify-center space-y-4"
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    transition={{ 
                      duration: 0.4, 
                      ease: [0.16, 1, 0.3, 1],
                      delay: 0
                    }}
                  >
                    <motion.span
                      className="text-7xl font-bold uppercase tracking-wider bg-gradient-to-b from-gray-500 to-gray-300 bg-clip-text text-transparent drop-shadow-[0_0_8px_rgba(34,197,94,0.3)]"
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ 
                        opacity: [0.7, 1, 0.7],
                        scale: [0.98, 1.02, 0.98],
                        rotateX: [0, 10, 0],
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                    >
                      {card.keyword}
                    </motion.span>
                    {card.subheading && (
                      <motion.p 
                        className="text-xl text-gray-300 font-medium"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                      >
                        {card.subheading}
                      </motion.p>
                    )}
                    <motion.div
                      className="absolute bottom-6 left-0 right-0 flex justify-center"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: [0, 0.6, 0] }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                    >
                      <span className="text-sm text-green-400/70 font-light flex items-center gap-2">
                        <svg 
                          className="w-4 h-4" 
                          fill="none" 
                          stroke="currentColor" 
                          viewBox="0 0 24 24"
                        >
                          <path 
                            strokeLinecap="round" 
                            strokeLinejoin="round" 
                            strokeWidth={2} 
                            d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" 
                          />
                        </svg>
                        Click to explore
                      </span>
                    </motion.div>
                  </motion.div>
                )}

                {card.id === 3 && isTeamHovered && (
                  <motion.div 
                    key="team-view"
                    className="relative z-40 h-full overflow-y-auto"
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    transition={{ 
                      duration: 0.4, 
                      ease: [0.16, 1, 0.3, 1],
                      delay: 0
                    }}
                  >
                    <DevCore embedded={true} />
                  </motion.div>
                )}

                {card.id === 5 && isEventsHovered && (
                  <motion.div 
                    key="events-carousel-view"
                    className="relative z-40 h-full overflow-y-auto"
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    transition={{ 
                      duration: 0.4, 
                      ease: [0.16, 1, 0.3, 1],
                      delay: 0
                    }}
                  >
                    <EventsCarousel embedded={true} />
                  </motion.div>
                )}
              </AnimatePresence> */}

              {/* ALWAYS SHOW EXPANDED CONTENT */}
              {card.id === 5 && (
                <div className="relative z-40 h-full overflow-y-auto">
                  <EventsCarousel embedded={true} />
                </div>
              )}

              {card.id === 3 && (
                <div className="relative z-40 h-full overflow-y-auto">
                  <DevCore embedded={true} />
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

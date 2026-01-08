"use client"

import * as Tabs from "@radix-ui/react-tabs"
import { motion } from "framer-motion"
import { Calendar } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { AspectRatio } from "@/components/ui/aspect-ratio"

const fadeInUp = {
  initial: { opacity: 0, y: 60 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 }
};

const events = {
  Events: [
    {
      title: "CP Club Selections",
      date: "October",
      desc: "The CP Club Selection is the first step toward joining our community of problem solvers. Participants will be tested on logical thinking, problem-solving, and coding fundamentals through a timed online contest.",
      image: "/CP_selections.jpg",
    },
     {
      title: "CodeHunt",
      date: "April",
      desc: "CodeHunt is a flagship event for FYs.It is a two-part competition combining programming challenges with a creative hunt, encouraging problem-solving, teamwork, and quick thinking.",
      image: "/Codehunt.jpeg",
    },
     {
      title: "Grid of Doom",
      date: "January",
      desc: "An individual competitive programming contest organized by CP Club at Codeverse. It challenges participants with a series of algorithmic problems to solve within a set time limit.",
      image: "/Grid_of_Doom.jpg",
    },
     {
      title: "Travelling Coders",
      date: "January",
      desc: "A team contest organized by CP Club team at Codeverse.It checks your problem solving skills, coding skills as well as your ability to work in a team.",
      image: "/Travelling_Coder1.jpg",
    }
  ],
  Workshops: [
    {
      title: "Intro to Competitive Programming",
      date: "Sept 29, 2025",
      desc: "A comprehensive workshop designed to introduce participants to the world of competitive programming.Covering What is CP, Why CP, How to get started, Popular platforms, ICPC and more.",
      image: "/CP_Workshop.jpeg",
    }
  ],
}

export function Events() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-transparent via-emerald-950/5 to-transparent border-t border-[hsl(0,0%,14.9%)]">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial="initial"
              whileInView="animate"
              viewport={{ once: true, margin: "-100px" }}
              variants={fadeInUp}
              className="text-center mb-16"
            >
              <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-green-400 to-emerald-600 bg-clip-text text-transparent">
                Events & Workshops
              </h2>
              <p className="text-gray-400 text-lg">Experience coding challenges and collaborative learning.</p>
            </motion.div>

        {/* Tabs */}
        <Tabs.Root defaultValue="Events" className="w-full">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <Tabs.List className="flex justify-center mb-10 gap-3">
              {["Events", "Workshops"].map((k) => (
                <Tabs.Trigger
                  key={k}
                  value={k}
                  className={cn(
                    "rounded-full px-6 py-2 text-sm capitalize text-white font-medium transition-all duration-300 border border-emerald-600/30 bg-black/40 backdrop-blur-md",
                    "hover:border-emerald-500/50 hover:text-emerald-300",
                    "data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-600/60 data-[state=active]:to-teal-600/60",
                    "data-[state=active]:text-white data-[state=active]:shadow-[0_0_16px_rgba(16,185,129,0.4)]",
                  )}
                >
                  {k}
                </Tabs.Trigger>
              ))}
            </Tabs.List>
          </motion.div>

          {/* Tabs Content */}
          {Object.entries(events).map(([key, list]) => (
            <Tabs.Content key={key} value={key}>
              <div className="relative">
                {/* timeline line */}
                <div
                  className="absolute left-4 top-0 bottom-0 hidden w-px bg-emerald-500/20 md:left-6 md:block"
                  aria-hidden
                />

                <ul className="space-y-12">
                  {list.map((ev, i) => (
                    <motion.li
                      key={ev.title}
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: i * 0.1 }}
                      viewport={{ once: true, margin: "-120px" }}
                      className="relative pl-12 md:pl-16"
                    >
                      {/* glowing dot */}
                      <span
                        className="absolute left-[1.05rem] top-2 z-10 size-3 -translate-x-1/2 rounded-full bg-emerald-400 shadow-[0_0_12px_#10B981] md:left-[1.5rem]"
                        aria-hidden
                      />

                      {/* Card */}
                      <Card
                        className={cn(
                          "group overflow-hidden rounded-2xl border border-emerald-600/20 bg-black/40 shadow-[0_0_10px_rgba(16,185,129,0.1)] transition-all duration-500",
                          "hover:-translate-y-1 hover:shadow-[0_0_30px_rgba(16,185,129,0.3)] hover:border-emerald-500/40 backdrop-blur-md",
                        )}
                      >
                        <div className="flex flex-col md:flex-row items-center gap-6 p-4 md:p-6">
                          {/* Image */}
                          <div className="w-full md:w-1/3 rounded-xl overflow-hidden border border-emerald-600/20">
                            <AspectRatio ratio={16 / 9}>
                              <motion.img
                                src={ev.image}
                                alt={`${ev.title} image`}
                                className="h-full w-full object-cover rounded-xl transition-transform duration-500 group-hover:scale-105 opacity-90 group-hover:opacity-100"
                                loading="lazy"
                              />
                            </AspectRatio>
                          </div>

                          {/* Text */}
                          <div className="w-full md:w-2/3 space-y-3">
                            <CardHeader className="flex items-center gap-3 p-0">
                              <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-2">
                                <Calendar className="size-5 text-emerald-400" aria-hidden />
                              </div>
                              <CardTitle className="text-lg font-semibold text-white">
                                {ev.title}
                              </CardTitle>
                            </CardHeader>
                            <CardContent className="p-0 text-sm text-muted-foreground">
                              <p>{ev.desc}</p>
                              <p className="mt-2 text-emerald-400 font-medium">{ev.date}</p>
                            </CardContent>
                          </div>
                        </div>
                      </Card>
                    </motion.li>
                  ))}
                </ul>
              </div>
            </Tabs.Content>
          ))}
        </Tabs.Root>
      </div>
    </section>
  )
}

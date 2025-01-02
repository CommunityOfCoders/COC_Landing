"use client";
import React from 'react'

const AchievementSection = () => {

    const achievements = [
        {
          title: "Successful Git & GitHub Workshop",
          description:
            "Organized an interactive workshop to teach the basics of Git and GitHub, attended by 100+ participants.",
        },
        {
          title: "Inheritance Program",
          description:
            "A mentorship initiative where seniors guide juniors in building innovative projects and enhancing their skills.",
        },
        // {
        //   title: "Future Event Placeholder",
        //   description:
        //     "Keep an eye out for our upcoming events and achievements, showcasing our vibrant and dynamic community!",
        // },
      ];

  return (
    <section className="py-16 px-8 bg-black">
    <h2 className="text-6xl font-bold bg-gradient-to-b from-green-700 to-green-300 bg-clip-text text-transparent text-center mb-12">
      ACHIEVEMENTS
    </h2>
    <div className="relative space-y-12 max-w-4xl mx-auto">
      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 h-full w-1 bg-gradient-to-b from-green-700 to-green-300"></div>
      {achievements.map((achievement, index) => (
        <div
          key={index}
          className={`relative flex items-center justify-start ${
            index % 2 === 0 ? "flex-row-reverse" : ""
          }`}
        >
          <div className="w-6 h-6 bg-green-500 rounded-full absolute left-1/2 transform -translate-x-1/2 z-10"></div>
          <div
            className={`bg-neutral-800 p-6 rounded-lg shadow-lg max-w-md ${
              index % 2 === 0 ? "ml-12" : "mr-12"
            } hover:bg-green-700/10 transition-all duration-300`}
          >
            <h3 className="text-xl font-bold text-green-300 mb-2">
              {achievement.title}
            </h3>
            <p className="text-neutral-400">{achievement.description}</p>
          </div>
        </div>
      ))}
    </div>
  </section>
  )
}

export default AchievementSection

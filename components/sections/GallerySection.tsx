import React from 'react'

const GallerySection = () => {

    const galleryData = [
        {
          topic: "Git Together Workshop",
          description:
            "A hands-on workshop exploring Git and GitHub for version control and collaboration.",
          images: ["/git_together_2.png", "/git_together_3.png", "/git_together_1.png"],
        },
        // {
        //   topic: "Hackathon Highlights",
        //   description:
        //     "Snapshots from our award-winning projects and team moments at various hackathons.",
        //   images: ["/hackathon_1.png", "/hackathon_2.png"],
        // },
        // {
        //   topic: "Community Events",
        //   description:
        //     "Moments from community events that brought developers together.",
        //   images: ["/community_event_1.png", "/community_event_2.png", "/community_event_3.png"],
        // },
      ];
      
  return (
    <section className="py-16 px-8 bg-black">
  <h2 className="text-6xl font-bold bg-gradient-to-b from-green-700 to-green-300 bg-clip-text text-transparent text-center mb-4">
    GALLERY
  </h2>
  <div className="space-y-12">
    {galleryData.map((event, index) => (
      <div key={index}>
        <h3 className="text-2xl font-semibold text-white mb-4 text-center">
          {event.topic}
        </h3>
        <p className="text-neutral-400 mb-6 text-center">{event.description}</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {event.images.map((image, idx) => (
            <div
              key={idx}
              className="relative overflow-hidden rounded-lg"
            >
              <img
                src={image}
                alt={`${event.topic} Image ${idx + 1}`}
                className="w-full h-full object-cover transform transition-transform duration-500 hover:scale-110"
              />
            </div>
          ))}
        </div>
      </div>
    ))}
  </div>
</section>
  )
}

export default GallerySection

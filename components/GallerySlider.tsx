// import { useState } from "react";

// const GallerySlider = () => {
//   const [currentIndex, setCurrentIndex] = useState(0);

//   const images = [
//     "/images/slider1.jpg",
//     "/images/slider2.jpg",
//     "/images/slider3.jpg",
//     "/images/slider4.jpg",
//     "/images/slider5.jpg",
//   ];

//   const goToNext = () => {
//     setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
//   };

//   const goToPrevious = () => {
//     setCurrentIndex(
//       (prevIndex) => (prevIndex - 1 + images.length) % images.length
//     );
//   };

//   return (
//     <section className="py-16 px-8 bg-black">
//       <h2 className="text-4xl font-bold text-white mb-8 text-center">Gallery</h2>
//       <div className="relative bg-black"> {/* Ensure the background is black here */}
//         {/* Image container */}
//         <div
//           className="flex transition-transform duration-500 ease-in-out"
//           style={{
//             transform: `translateX(-${currentIndex * 100}%)`,
//           }}
//         >
//           {images.map((image, index) => (
//             <div key={index} className="flex-shrink-0 w-full">
//               <img
//                 src={image}
//                 alt={`Gallery Slide ${index + 1}`}
//                 className="rounded-lg mx-auto w-full h-96 object-cover"
//               />
//             </div>
//           ))}
//         </div>

//         {/* Navigation buttons */}
//         <button
//           onClick={goToPrevious}
//           className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-black text-white p-2 rounded-full opacity-75 hover:opacity-100 transition-opacity duration-300"
//         >
//           &lt;
//         </button>
//         <button
//           onClick={goToNext}
//           className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-black text-white p-2 rounded-full opacity-75 hover:opacity-100 transition-opacity duration-300"
//         >
//           &gt;
//         </button>
//       </div>
//     </section>
//   );
// };

// export default GallerySlider;

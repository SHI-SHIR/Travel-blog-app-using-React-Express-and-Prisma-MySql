import React, { useState, useEffect } from "react";

const slides = [
  {
    image: "/images/img1.jpg",
    quote:
      '"I photograph not to capture the place, but to feel its pulse long after I’ve left."',
    position: "center",
  },
  {
    image: "/images/img2.jpg",
    quote:
      '"I don’t want luxury. I want a story. I want a face I’ll remember in the quiet of my nights."',
    position: "bottom-right",
  },
  {
    image: "/images/img3.jpg",
    quote:
      '"No luxury, no toys—just one child holding another like the world depends on it."',
    position: "top-left",
  },
  {
    image: "/images/img4.jpg",
    quote:
      '"Through every dusty road and local laugh, I learn: the raw is more real than the polished ever was."',
    position: "top-right",
  },
  {
    image: "/images/img5.jpg",
    quote:
      `"I don’t capture what’s trending. I capture what’s real—the worn,
       the warm, the wildly human. These aren’t just photographs.
       These are the truths no map can mark."`,
    position: "bottom-left",
  },
];

const positionClasses = {
  "top-left": "top-60 left-40 text-left",
  "top-right": "top-40 right-20 text-right",
  "bottom-left": "bottom-40 left-20 text-left",
  "bottom-right": "bottom-36 right-20 text-right",
  center:  "top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center",
};

const HeroSlider = () => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative h-screen w-full overflow-hidden">
      {/* Images with fade */}
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            index === current ? "opacity-100 z-10" : "opacity-0 z-0"
          }`}
        >
          <div
            className="h-full w-full bg-center bg-cover"
            style={{ backgroundImage: `url(${slide.image})` }}
          >
            {/* Dark Overlay */}
            <div className="absolute inset-0 bg-black bg-opacity-40" />
            {/* Quote Text */}
            <div
              className={`absolute ${
                positionClasses[slide.position]
              } max-w-[80%] text-white text-sm font-playfair  whitespace-pre-line md:text-lg lg:text-3xl italic font-[500] font-[Playfair_Display]`}
            >
              {slide.quote}
            </div>
          </div>
        </div>
      ))}

      {/* Dots Navigation */}
      <div className="absolute bottom-6 w-full flex justify-center space-x-2 z-20">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`w-3 h-3 rounded-full ${
              i === current ? "bg-white" : "bg-gray-400"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default HeroSlider;

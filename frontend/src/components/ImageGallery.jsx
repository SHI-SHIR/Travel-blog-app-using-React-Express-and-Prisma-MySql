import React, { useEffect, useContext, useRef, useLayoutEffect, useState } from "react";
import Navbar from "./Navbar";
import blogContext from "../context/blogContext";

const ImageGallery = () => {
  const { images, getImages } = useContext(blogContext);
  const [navHeight, setNavHeight] = useState(64);
  const [loading, setLoading] = useState(true);
  const navRef = useRef(null);

  useEffect(() => {
    const fetchImages = async () => {
      await getImages();
      setLoading(false);
    };
    fetchImages();
  }, [getImages]);

  useLayoutEffect(() => {
    if (navRef.current) {
      setNavHeight(navRef.current.offsetHeight);
    }
  }, []);

  if (loading) {
    return (
      <>
        <div ref={navRef}>
          <Navbar />
        </div>
        <div className="flex justify-center items-center min-h-screen text-black text-xl">
          Loading images...
        </div>
      </>
    );
  }

  return (
    <>
      <div ref={navRef}>
        <Navbar />
      </div>

      <div className="p-6 mt-20" style={{ paddingTop: navHeight + 20 }}>
        <h1 className="text-3xl font-bold mb-3 mt-10">All Images:</h1>
        <hr className="mb-6 border-zinc-700" />

        {images.length === 0 ? (
          <p className="text-black text-lg">No images found.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-5">
            {images.map((image, idx) => (
              <img
                key={idx}
                src={image}
                alt={`image-${idx}`}
                className="w-full h-auto rounded shadow-lg"
                style={{ objectFit: "contain" }}
              />
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default ImageGallery;

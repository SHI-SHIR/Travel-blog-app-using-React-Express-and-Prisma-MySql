import React, { useEffect, useContext, useRef, useLayoutEffect, useState, useCallback } from "react";
import Navbar from "./Navbar";
import blogContext from "../context/blogContext";

const ImageGallery = () => {
  const {
    images, // This is an array of URL strings as per your last console.log
    loading,
    error,
    getImages,
    imagePagination,
  } = useContext(blogContext);

  const navRef = useRef(null);
  const [navHeight, setNavHeight] = useState(0);

  // --- New State for Fullscreen Modal ---
  const [selectedImageIndex, setSelectedImageIndex] = useState(null); // Stores the index of the image clicked
  const [isModalOpen, setIsModalOpen] = useState(false); // Controls modal visibility

  // Effect to fetch images when the component mounts or pagination changes
  useEffect(() => {
    getImages(imagePagination.currentPage, imagePagination.limit);
  }, [getImages, imagePagination.currentPage, imagePagination.limit]);

  // Use useLayoutEffect to measure Navbar height after DOM mutations
  useLayoutEffect(() => {
    if (navRef.current) {
      setNavHeight(navRef.current.offsetHeight);
    }
  }, []);

  // Fallback image URL for broken links
  const handleImageError = (e) => {
    e.target.onerror = null;
    e.target.src = "https://via.placeholder.com/400x300?text=Image+Not+Available";
  };

  // Handler for changing pagination page
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= imagePagination.totalPages) {
      getImages(newPage, imagePagination.limit);
      // Close modal if open when changing pages
      closeModal();
    }
  };

  // --- New Functions for Modal Control ---
  const openModal = useCallback((index) => {
    setSelectedImageIndex(index);
    setIsModalOpen(true);
    // Optional: Add overflow: hidden to body to prevent scrolling when modal is open
    document.body.style.overflow = 'hidden';
  }, []);

  const closeModal = useCallback(() => {
    setSelectedImageIndex(null);
    setIsModalOpen(false);
    // Restore body scrolling
    document.body.style.overflow = '';
  }, []);

  const showNextImage = useCallback(() => {
    if (selectedImageIndex < images.length - 1) {
      setSelectedImageIndex(selectedImageIndex + 1);
    }
  }, [selectedImageIndex, images.length]);

  const showPreviousImage = useCallback(() => {
    if (selectedImageIndex > 0) {
      setSelectedImageIndex(selectedImageIndex - 1);
    }
  }, [selectedImageIndex]);

  // Keyboard navigation for modal (Escape to close, arrows to navigate)
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (!isModalOpen) return;

      if (event.key === 'Escape') {
        closeModal();
      } else if (event.key === 'ArrowRight') {
        showNextImage();
      } else if (event.key === 'ArrowLeft') {
        showPreviousImage();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isModalOpen, closeModal, showNextImage, showPreviousImage]);


  // --- Conditional Rendering for Loading, Error, No Images ---
  if (loading) {
    return (
      <>
        <div ref={navRef}>
          <Navbar />
        </div>
        <div className="flex justify-center items-center min-h-screen text-black text-xl pt-24">
          Loading images...
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <div ref={navRef}>
          <Navbar />
        </div>
        <div className="flex justify-center items-center min-h-screen text-red-600 text-xl pt-24">
          Error: {error}
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
        <h1 className="text-3xl font-bold mb-3 mt-10 text-black">All Images:</h1>
        <hr className="mb-6 border-zinc-700" />

        {images.length === 0 ? (
          <p className="text-black text-lg">No images found.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-5">
            {images.map((imageURL, idx) => (
              <div
                key={idx}
                className="bg-gray-100 rounded shadow-lg overflow-hidden flex items-center justify-center cursor-pointer transform transition-transform duration-200 hover:scale-[1.02]"
                onClick={() => openModal(idx)} // <-- On click, open modal with image's index
              >
                <img
                  src={imageURL}
                  alt={`gallery-image-${idx}`}
                  className="w-full h-auto object-contain max-h-64 sm:max-h-80"
                  onError={handleImageError}
                />
              </div>
            ))}
          </div>
        )}

        {/* Pagination Controls */}
        {imagePagination.totalPages > 1 && (
          <div className="flex justify-center items-center mt-10 space-x-4">
            <button
              onClick={() => handlePageChange(imagePagination.currentPage - 1)}
              disabled={imagePagination.currentPage === 1}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
            >
              Previous
            </button>
            <span className="text-lg text-black">
              Page {imagePagination.currentPage} of {imagePagination.totalPages}
            </span>
            <button
              onClick={() => handlePageChange(imagePagination.currentPage + 1)}
              disabled={imagePagination.currentPage === imagePagination.totalPages}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}
      </div>

      {/* --- Fullscreen Image Modal (New Section) --- */}
      {isModalOpen && selectedImageIndex !== null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75 backdrop-filter backdrop-blur-md"
          onClick={(e) => { // Close modal if clicking on the backdrop
            if (e.target === e.currentTarget) closeModal();
          }}
        >
          {/* Close button */}
          <button
            onClick={closeModal}
            className="absolute top-4 right-4 text-white text-5xl font-thin leading-none z-50 hover:text-gray-300 transition-colors duration-200 focus:outline-none"
            aria-label="Close image viewer"
          >
            × {/* HTML entity for multiplication sign, often used for close */}
          </button>

          {/* Previous image button */}
          <button
            onClick={showPreviousImage}
            disabled={selectedImageIndex === 0}
            className="absolute left-4 p-2 text-white text-5xl z-50 opacity-70 hover:opacity-100 transition-opacity duration-200 disabled:opacity-30 disabled:cursor-not-allowed focus:outline-none"
            aria-label="Previous image"
          >
            ‹ {/* HTML entity for single left-pointing angle quotation mark */}
          </button>

          {/* Next image button */}
          <button
            onClick={showNextImage}
            disabled={selectedImageIndex === images.length - 1}
            className="absolute right-4 p-2 text-white text-5xl z-50 opacity-70 hover:opacity-100 transition-opacity duration-200 disabled:opacity-30 disabled:cursor-not-allowed focus:outline-none"
            aria-label="Next image"
          >
            › {/* HTML entity for single right-pointing angle quotation mark */}
          </button>

          {/* Full-sized image */}
          <img
            src={images[selectedImageIndex]} // Directly use the URL string from the images array
            alt={`Full screen image ${selectedImageIndex + 1}`}
            className="max-w-[90vw] max-h-[90vh] object-contain rounded-lg shadow-2xl"
            onError={handleImageError}
          />
        </div>
      )}
    </>
  );
};

export default ImageGallery;
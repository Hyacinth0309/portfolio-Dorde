"use client";

import React, { useState } from "react";

export default function ImageGallery({ images }: { images: string[] }) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  if (!images || images.length === 0) return null;

  return (
    <div className="space-y-6">
      <h3 className="text-2xl font-bold text-gray-100">Project Gallery</h3>
      
      {/* Thumbnail Grid - Fixed sizes */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {images.map((url, index) => (
          <div 
            key={index} 
            className="rounded-xl overflow-hidden border border-gray-800 bg-gray-900 h-48 cursor-pointer group"
            onClick={() => setSelectedImage(url)}
          >
            <img 
              src={url} 
              alt={`Screenshot ${index + 1}`} 
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 opacity-80 group-hover:opacity-100" 
            />
          </div>
        ))}
      </div>

      {/* Full Screen Lightbox / Modal */}
      {selectedImage && (
        <div 
          className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)} // Click anywhere to close
        >
          {/* Close Button */}
          <button 
            className="absolute top-6 right-6 text-white bg-gray-800 hover:bg-gray-700 rounded-full w-10 h-10 flex items-center justify-center transition-colors"
            onClick={(e) => {
              e.stopPropagation(); // Prevents the background click from firing twice
              setSelectedImage(null);
            }}
          >
            &#x2715; {/* X character */}
          </button>
          
          {/* Full Size Image */}
          <img 
            src={selectedImage} 
            alt="Full screen view" 
            className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl" 
          />
        </div>
      )}
    </div>
  );
}
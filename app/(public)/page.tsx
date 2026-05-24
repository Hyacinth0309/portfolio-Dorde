import React from "react";

export default function Home() {
  return (
    <section className="animate-fade-in-up flex flex-col justify-center min-h-[80vh] max-w-3xl">
      <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6">
        Hi, I'm <span className="bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">M&R.</span>
      </h1>
      
      <h2 className="text-2xl md:text-3xl font-medium text-gray-400 mb-8">
        BSIT Graduate & Software Developer
      </h2>
      
      <div className="space-y-6 text-lg text-gray-400 leading-relaxed">
        <p>
          I specialize in <strong className="text-gray-200">System Logic, AI-Assisted Development, and UI/UX</strong>. 
          I build scalable web applications, architect complex data flows, and bridge the gap between heavy technical systems and clean, user-friendly interfaces.
        </p>
        
        <p>
          I am a recent BSIT graduate passionate about translating complex system requirements into elegant, functional code. 
          Throughout my academic career, I focused on full-stack development and system architecture, ensuring that every 
          database query and UI component serves a specific, optimized purpose.
        </p>
      </div>
    </section>
  );
}
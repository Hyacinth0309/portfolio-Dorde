// app/page.tsx
import React from "react";
import { supabase } from "@/Lib/supabase";

export const revalidate = 0;

interface Project {
  id: number;
  title: string;
  category: string;
  description: string;
  tags: string[];
  image_url?: string; // New optional field for the image
}

export default async function Portfolio() {
  const { data: projects, error } = await supabase
    .from("projects")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) console.error("Error fetching projects:", error);
  const displayProjects: Project[] = projects || [];

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-gray-200 font-sans selection:bg-blue-500/30">
      
      {/* --- NAVIGATION HEADER --- */}
      <header className="sticky top-0 z-50 bg-[#0a0a0a]/80 backdrop-blur-md border-b border-gray-800">
        <div className="max-w-5xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="text-xl font-bold bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
            M&R.
          </div>
          <nav className="flex gap-6 text-sm font-medium text-gray-400">
            <a href="#home" className="hover:text-white transition-colors">Home</a>
            <a href="#projects" className="hover:text-white transition-colors">Projects</a>
            <a href="#about" className="hover:text-white transition-colors">About Me</a>
          </nav>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-16 md:py-24">
        
        {/* --- HERO SECTION --- */}
        <section id="home" className="mb-24 pt-10 animate-fade-in-up">
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6">
            Hi, I'm <span className="bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">M&R.</span>
          </h1>
          <h2 className="text-2xl md:text-3xl font-medium text-gray-400 mb-6">
            BSIT Graduate & Software Developer
          </h2>
          <p className="text-lg text-gray-500 max-w-2xl leading-relaxed">
            I specialize in <strong className="text-gray-300">System Logic, AI-Assisted Development, and UI/UX</strong>. 
            I build scalable web applications, architect complex data flows, and bridge the gap between heavy technical systems and clean, user-friendly interfaces.
          </p>
        </section>

        {/* --- PROJECTS SECTION --- */}
        <section id="projects" className="mb-24 pt-10">
          <div className="mb-10">
            <h3 className="text-3xl font-bold text-gray-100">Featured Projects</h3>
            <p className="text-gray-500 mt-2">Systems and applications I've engineered.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {displayProjects.map((project) => (
              <div
                key={project.id}
                className="group flex flex-col overflow-hidden bg-[#111111] border border-gray-800 rounded-2xl hover:border-blue-500/50 transition-all duration-300 hover:-translate-y-1"
              >
                {/* Image Display */}
                {project.image_url ? (
                  <div className="w-full h-48 bg-gray-900 overflow-hidden relative">
                    <img 
                      src={project.image_url} 
                      alt={project.title} 
                      className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                ) : (
                  <div className="w-full h-48 bg-gray-900 flex items-center justify-center text-gray-700">
                    <span className="text-sm font-medium">No Image Provided</span>
                  </div>
                )}

                <div className="p-8 flex-1 flex flex-col justify-between">
                  <div>
                    <span className="text-xs font-semibold tracking-wider text-blue-400 uppercase mb-3 block">
                      {project.category}
                    </span>
                    <h4 className="text-2xl font-bold text-gray-100 mb-3 group-hover:text-blue-400 transition-colors">
                      {project.title}
                    </h4>
                    <p className="text-gray-400 text-sm leading-relaxed mb-6">
                      {project.description}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {project.tags.map((tag, index) => (
                      <span key={index} className="px-3 py-1 text-xs font-medium bg-gray-900 border border-gray-700 text-gray-300 rounded-full">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* --- ABOUT SECTION --- */}
        <section id="about" className="mb-20 pt-10">
          <h3 className="text-3xl font-bold text-gray-100 mb-6">About Me</h3>
          <p className="text-gray-400 text-lg max-w-3xl leading-relaxed">
            I am a recent BSIT graduate passionate about translating complex system requirements into elegant, functional code. 
            Throughout my academic career, I focused on full-stack development and system architecture, ensuring that every 
            database query and UI component serves a specific, optimized purpose.
          </p>
        </section>

      </main>
    </div>
  );
}
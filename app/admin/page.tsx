"use client";

import React, { useState, useEffect } from "react";
import { supabase } from "@/Lib/supabase";

interface Project {
  id: number;
  title: string;
  category: string;
  description: string;
  tags: string[];
  image_url?: string;
}

export default function AdminDashboard() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null); // State for the file

  const [newProject, setNewProject] = useState({
    title: "",
    category: "",
    description: "",
    tags: "",
  });

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error) setProjects(data || []);
    setIsLoading(false);
  };

  const handleAddProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProject.title) return;
    setIsSubmitting(true);

    let uploadedImageUrl = null;

    // 1. Upload the image if one was selected
    if (imageFile) {
      // Create a unique file name so images don't overwrite each other
      const fileExt = imageFile.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('portfolio-images')
        .upload(fileName, imageFile, { upsert: false });

      if (uploadError) {
        alert("Error uploading image: " + uploadError.message);
        setIsSubmitting(false);
        return;
      }

      // Get the public URL to save to the database
      const { data: publicUrlData } = supabase.storage
        .from('portfolio-images')
        .getPublicUrl(fileName);
        
      uploadedImageUrl = publicUrlData.publicUrl;
    }

    // 2. Format tags and insert the database record
    const tagsArray = newProject.tags.split(",").map((tag) => tag.trim()).filter(Boolean);

    const { data, error } = await supabase
      .from("projects")
      .insert([{
          title: newProject.title,
          category: newProject.category || "Development",
          description: newProject.description,
          tags: tagsArray,
          image_url: uploadedImageUrl, // Save the URL we just generated
      }])
      .select();

    if (error) {
      alert("Error adding project: " + error.message);
    } else if (data) {
      setProjects([data[0], ...projects]);
      setNewProject({ title: "", category: "", description: "", tags: "" });
      setImageFile(null); // Reset the file input
      (document.getElementById('imageInput') as HTMLInputElement).value = '';
      alert("Project Successfully Added!");
    }
    
    setIsSubmitting(false);
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this project?")) return;
    const { error } = await supabase.from("projects").delete().eq("id", id);
    if (!error) setProjects(projects.filter((p) => p.id !== id));
  };

  return (
    <div className="min-h-screen bg-[#050505] text-gray-200 font-sans p-8">
      <div className="max-w-5xl mx-auto">
        <header className="mb-10 pb-6 border-b border-gray-800 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
          </div>
          <a href="/" className="text-sm text-blue-400 hover:text-blue-300">
            View Public Site &rarr;
          </a>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          
          <div className="lg:col-span-1">
            <div className="p-6 bg-[#111111] border border-gray-800 rounded-xl">
              <h2 className="text-xl font-semibold mb-6 text-blue-400">Add Project</h2>
              <form onSubmit={handleAddProject} className="space-y-4">
                
                {/* --- NEW FILE INPUT --- */}
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Project Screenshot</label>
                  <input
                    id="imageInput"
                    type="file"
                    accept="image/*"
                    onChange={(e) => setImageFile(e.target.files ? e.target.files[0] : null)}
                    className="w-full bg-gray-950 border border-gray-800 rounded-lg px-4 py-2 text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-500 cursor-pointer"
                  />
                </div>

                <div>
                  <label className="block text-xs text-gray-500 mb-1">Title</label>
                  <input type="text" required className="w-full bg-gray-950 border border-gray-800 rounded-lg px-4 py-2 text-sm" value={newProject.title} onChange={(e) => setNewProject({ ...newProject, title: e.target.value })} />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Category</label>
                  <input type="text" className="w-full bg-gray-950 border border-gray-800 rounded-lg px-4 py-2 text-sm" value={newProject.category} onChange={(e) => setNewProject({ ...newProject, category: e.target.value })} />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Tech Stack (comma separated)</label>
                  <input type="text" className="w-full bg-gray-950 border border-gray-800 rounded-lg px-4 py-2 text-sm" value={newProject.tags} onChange={(e) => setNewProject({ ...newProject, tags: e.target.value })} />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Description</label>
                  <textarea className="w-full bg-gray-950 border border-gray-800 rounded-lg px-4 py-2 text-sm h-24 resize-none" value={newProject.description} onChange={(e) => setNewProject({ ...newProject, description: e.target.value })} />
                </div>
                
                <button type="submit" disabled={isSubmitting} className="w-full py-2 bg-blue-600 hover:bg-blue-500 disabled:bg-gray-600 text-white rounded-md font-medium transition-colors mt-4">
                  {isSubmitting ? "Uploading & Publishing..." : "Publish to Portfolio"}
                </button>
              </form>
            </div>
          </div>

          <div className="lg:col-span-2">
            <h2 className="text-xl font-semibold mb-6 text-gray-100">Current Projects</h2>
            <div className="space-y-4">
              {isLoading ? (
                <p className="text-gray-500 text-sm animate-pulse">Loading...</p>
              ) : projects.map((project) => (
                <div key={project.id} className="flex justify-between items-center p-4 bg-[#111111] border border-gray-800 rounded-lg">
                  <div className="flex items-center gap-4">
                    {project.image_url && (
                       <img src={project.image_url} alt="thumbnail" className="w-12 h-12 object-cover rounded-md border border-gray-700" />
                    )}
                    <div>
                      <h4 className="font-medium text-white">{project.title}</h4>
                      <p className="text-xs text-gray-500 mt-1">{project.category}</p>
                    </div>
                  </div>
                  <button onClick={() => handleDelete(project.id)} className="text-xs text-red-500 hover:text-red-400 font-medium">
                    Delete
                  </button>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
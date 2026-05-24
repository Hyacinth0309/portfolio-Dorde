"use client";

import React, { useState, useEffect } from "react";
import { supabase } from "@/Lib/supabase"; // Correct relative path for admin folder

interface Project {
  id: number;
  title: string;
  category: string;
  description: string;
  tags: string[];
  image_urls?: string[];
}

export default function AdminDashboard() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // State for image uploads
  const [imageFiles, setImageFiles] = useState<File[]>([]); 
  
  // States for Edit Mode
  const [editingId, setEditingId] = useState<number | null>(null);
  const [existingImages, setExistingImages] = useState<string[]>([]);

  // Form State
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

  // Triggered when the "Edit" button is clicked on a project
  const handleEditClick = (project: Project) => {
    setEditingId(project.id);
    setNewProject({
      title: project.title,
      category: project.category,
      description: project.description,
      tags: project.tags.join(", "), // Convert array back to comma-separated string
    });
    setExistingImages(project.image_urls || []);
    setImageFiles([]); // Clear any selected files
    (document.getElementById('imageInput') as HTMLInputElement).value = '';
    
    // Smooth scroll to top so you can see the form
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Cancel edit mode
  const cancelEdit = () => {
    setEditingId(null);
    setNewProject({ title: "", category: "", description: "", tags: "" });
    setExistingImages([]);
    setImageFiles([]);
    (document.getElementById('imageInput') as HTMLInputElement).value = '';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProject.title) return;
    setIsSubmitting(true);

    let finalImageUrls = existingImages; // Default to existing images if editing

    // Process new file uploads if any are selected
    if (imageFiles.length > 0) {
      const uploadedUrls: string[] = [];
      const uploadPromises = imageFiles.map(async (file) => {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
        
        const { error: uploadError } = await supabase.storage
          .from('portfolio-images')
          .upload(fileName, file, { upsert: false });

        if (uploadError) throw uploadError;

        const { data: publicUrlData } = supabase.storage
          .from('portfolio-images')
          .getPublicUrl(fileName);
          
        return publicUrlData.publicUrl;
      });

      try {
        const results = await Promise.all(uploadPromises);
        finalImageUrls = results; // Replace old images with new ones
      } catch (error: any) {
        alert("Error uploading images: " + error.message);
        setIsSubmitting(false);
        return;
      }
    }

    const tagsArray = newProject.tags.split(",").map((tag) => tag.trim()).filter(Boolean);

    if (editingId) {
      // UPDATE EXISTING PROJECT
      const { data, error } = await supabase
        .from("projects")
        .update({
          title: newProject.title,
          category: newProject.category || "Development",
          description: newProject.description,
          tags: tagsArray,
          image_urls: finalImageUrls, 
        })
        .eq("id", editingId)
        .select();

      if (error) {
        alert("Error updating project: " + error.message);
      } else if (data) {
        // Update local state to reflect changes
        setProjects(projects.map(p => p.id === editingId ? data[0] : p));
        alert("Project Successfully Updated!");
        cancelEdit(); // Reset form
      }
    } else {
      // INSERT NEW PROJECT
      const { data, error } = await supabase
        .from("projects")
        .insert([{
            title: newProject.title,
            category: newProject.category || "Development",
            description: newProject.description,
            tags: tagsArray,
            image_urls: finalImageUrls, 
        }])
        .select();

      if (error) {
        alert("Error adding project: " + error.message);
      } else if (data) {
        setProjects([data[0], ...projects]);
        alert("Project Successfully Added!");
        cancelEdit(); // Reset form
      }
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
          <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
          <a href="/" className="text-sm text-blue-400 hover:text-blue-300">View Public Site &rarr;</a>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-1">
            <div className="p-6 bg-[#111111] border border-gray-800 rounded-xl sticky top-8">
              <h2 className="text-xl font-semibold mb-6 text-blue-400">
                {editingId ? "Edit Project" : "Add New Project"}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                
                <div>
                  <label className="block text-xs text-gray-500 mb-1">
                    Project Screenshots (Select Multiple)
                  </label>
                  <input
                    id="imageInput"
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={(e) => setImageFiles(Array.from(e.target.files || []))}
                    className="w-full bg-gray-950 border border-gray-800 rounded-lg px-4 py-2 text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-500 cursor-pointer"
                  />
                  {imageFiles.length > 0 ? (
                    <p className="text-xs text-blue-400 mt-2">{imageFiles.length} new file(s) selected</p>
                  ) : editingId && existingImages.length > 0 ? (
                    <p className="text-xs text-gray-500 mt-2">Keeping {existingImages.length} existing image(s)</p>
                  ) : null}
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
                
                <div className="flex gap-3 mt-6">
                  {editingId && (
                    <button type="button" onClick={cancelEdit} className="w-full py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-md font-medium transition-colors">
                      Cancel
                    </button>
                  )}
                  <button type="submit" disabled={isSubmitting} className="w-full py-2 bg-blue-600 hover:bg-blue-500 disabled:bg-gray-600 text-white rounded-md font-medium transition-colors">
                    {isSubmitting ? "Saving..." : editingId ? "Update Project" : "Publish to Portfolio"}
                  </button>
                </div>
              </form>
            </div>
          </div>

          <div className="lg:col-span-2">
            <h2 className="text-xl font-semibold mb-6 text-gray-100">Current Projects</h2>
            <div className="space-y-4">
              {isLoading ? (
                <p className="text-gray-500 text-sm animate-pulse">Loading...</p>
              ) : projects.map((project) => (
                <div key={project.id} className="flex justify-between items-center p-4 bg-[#111111] border border-gray-800 rounded-lg transition-colors hover:border-gray-700">
                  <div className="flex items-center gap-4">
                    {project.image_urls && project.image_urls.length > 0 ? (
                       <img src={project.image_urls[0]} alt="thumbnail" className="w-12 h-12 object-cover rounded-md border border-gray-700" />
                    ) : (
                       <div className="w-12 h-12 rounded-md border border-gray-800 bg-gray-900 flex items-center justify-center text-[10px] text-gray-600">No Img</div>
                    )}
                    <div>
                      <h4 className="font-medium text-white">{project.title}</h4>
                      <p className="text-xs text-gray-500 mt-1">{project.category}</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <button onClick={() => handleEditClick(project)} className="text-xs text-blue-400 hover:text-blue-300 font-medium">
                      Edit
                    </button>
                    <button onClick={() => handleDelete(project.id)} className="text-xs text-red-500 hover:text-red-400 font-medium">
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
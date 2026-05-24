import { supabase } from "@/Lib/supabase";
import Link from "next/link";
import { notFound } from "next/navigation";
import ImageGallery from "../../../Components/ImageGallery";

export const revalidate = 0;

export default async function ProjectDetail({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  
  const resolvedParams = await params;
  
  const { data: project, error } = await supabase
    .from("projects")
    .select("*")
    .eq("id", resolvedParams.id)
    .single();

  if (error || !project) {
    notFound(); 
  }

  return (
    <section className="animate-fade-in-up">
      <Link href="/Projects" className="text-blue-400 text-sm hover:underline mb-8 inline-block">
        &larr; Back to Projects
      </Link>

      <span className="text-sm font-semibold tracking-wider text-blue-400 uppercase mb-3 block">
        {project.category}
      </span>
      <h1 className="text-4xl md:text-5xl font-bold text-gray-100 mb-6">{project.title}</h1>
      
      <div className="flex flex-wrap gap-2 mb-8">
        {project.tags.map((tag: string, index: number) => (
          <span key={index} className="px-3 py-1 text-sm font-medium bg-gray-900 border border-gray-700 text-gray-300 rounded-full">
            {tag}
          </span>
        ))}
      </div>

      <p className="text-gray-400 text-lg leading-relaxed mb-12">
        {project.description}
      </p>

      {/* Dito natin ilalagay yung bagong Image Gallery Component */}
      <ImageGallery images={project.image_urls || []} />

    </section>
  );
}
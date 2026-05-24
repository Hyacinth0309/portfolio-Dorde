import { supabase } from "@/Lib/supabase";
import Link from "next/link";

export const revalidate = 0;

// Define what a Project looks like for TypeScript
interface Project {
  id: number;
  title: string;
  category: string;
  description: string;
  tags: string[];
  image_urls?: string[];
}

export default async function Projects() {
  const { data: projects, error } = await supabase
    .from("projects")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) console.error("Error fetching projects:", error);
  const displayProjects: Project[] = projects || [];

  return (
    <section className="animate-fade-in-up">
      <div className="mb-10">
        <h3 className="text-3xl font-bold text-gray-100">Featured Projects</h3>
        <p className="text-gray-500 mt-2">Systems and applications I've engineered.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {displayProjects.map((project: Project) => (
         <Link href={`/Projects/${project.id}`} key={project.id}>
            <div className="group flex flex-col overflow-hidden bg-[#111111] border border-gray-800 rounded-2xl hover:border-blue-500/50 transition-all duration-300 hover:-translate-y-1 h-full cursor-pointer">
              
              {project.image_urls && project.image_urls.length > 0 ? (
                <div className="w-full h-48 bg-gray-900 overflow-hidden relative">
                  <img src={project.image_urls[0]} alt={project.title} className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500" />
                </div>
              ) : (
                <div className="w-full h-48 bg-gray-900 flex items-center justify-center text-gray-700">
                  <span className="text-sm font-medium">No Images Provided</span>
                </div>
              )}

              <div className="p-8 flex-1 flex flex-col justify-between">
                <div>
                  <span className="text-xs font-semibold tracking-wider text-blue-400 uppercase mb-3 block">{project.category}</span>
                  <h4 className="text-2xl font-bold text-gray-100 mb-3 group-hover:text-blue-400 transition-colors">{project.title}</h4>
                </div>
                
                <div className="mt-6 flex justify-between items-center">
                    <span className="text-sm text-blue-400 font-medium group-hover:underline">View Full Project &rarr;</span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
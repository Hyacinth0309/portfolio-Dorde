import React from "react";

export default function Contact() {
  return (
    <section className="animate-fade-in-up flex flex-col justify-center min-h-[60vh]">
      <h3 className="text-4xl md:text-5xl font-bold text-gray-100 mb-6">Let's Connect</h3>
      <p className="text-gray-400 text-lg max-w-2xl leading-relaxed mb-12">
        I'm always open to discussing new projects, creative ideas, or opportunities. Feel free to reach out or check out my repositories!
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl">
        
        {/* Email Card */} 
<a href="https://mail.google.com/mail/?view=cm&fs=1&to=manueldorde0@gmail.com&su" target="_blank" rel="noopener noreferrer" className="flex flex-col items-center justify-center p-8 bg-[#111111] border border-gray-800 rounded-2xl hover:border-blue-500/50 hover:-translate-y-1 transition-all duration-300 group">          
<div className="w-12 h-12 mb-4 rounded-full bg-gray-900 flex items-center justify-center group-hover:bg-blue-500/20 transition-colors">
            <span className="text-xl">📧</span>
          </div>
          <h4 className="text-lg font-bold text-gray-100 mb-2">Email</h4>
          <p className="text-sm text-gray-500 text-center group-hover:text-blue-400 transition-colors">Send me a message</p>
        </a>

        {/* GitHub Card */}
        <a href="https://github.com/Hyacinth0309" target="_blank" rel="noopener noreferrer" className="flex flex-col items-center justify-center p-8 bg-[#111111] border border-gray-800 rounded-2xl hover:border-gray-500/50 hover:-translate-y-1 transition-all duration-300 group">
          <div className="w-12 h-12 mb-4 rounded-full bg-gray-900 flex items-center justify-center group-hover:bg-gray-500/20 transition-colors">
            <span className="text-xl">💻</span>
          </div>
          <h4 className="text-lg font-bold text-gray-100 mb-2">GitHub</h4>
          <p className="text-sm text-gray-500 text-center group-hover:text-gray-300 transition-colors">Check out my repos</p>
        </a>

        {/* LinkedIn Card */}
        <a href="https://www.linkedin.com/in/manuel-ken-dorde-7ab49940a" target="_blank" rel="noopener noreferrer" className="flex flex-col items-center justify-center p-8 bg-[#111111] border border-gray-800 rounded-2xl hover:border-blue-500/50 hover:-translate-y-1 transition-all duration-300 group">
          <div className="w-12 h-12 mb-4 rounded-full bg-gray-900 flex items-center justify-center group-hover:bg-blue-600/20 transition-colors">
            <span className="text-xl">🔗</span>
          </div>
          <h4 className="text-lg font-bold text-gray-100 mb-2">LinkedIn</h4>
          <p className="text-sm text-gray-500 text-center group-hover:text-blue-400 transition-colors">View my profile</p>
        </a>

      </div>
    </section>
  );
}
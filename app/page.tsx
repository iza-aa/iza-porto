'use client'

import Image from 'next/image';
import { useState, useEffect } from 'react';

import Marquee from './components/Marquee'
import Socialmedia from './components/Socialmedia';
import ContactForm from './components/contactform';
import InfiniteFormScroll from './components/infinite-scroll-animation';




export default function Home() {
  const [showAbout, setShowAbout] = useState(false);
  const [showContact, setShowContact] = useState(false);
  const [currentTime, setCurrentTime] = useState('');
  const [scrollProgress, setScrollProgress] = useState(0);
  const [contentScale, setContentScale] = useState(1);

  const projects = [
    {
      id: 1,
      thumbnail: '/images/Project1.png',
      status: 'Completed',
      title: 'IZA POS',
      date: 'November 15, 2024'
    },
    {
      id: 2,
      thumbnail: '/images/Project2.png',
      status: 'In Development',
      title: 'Portfolio 2.0',
      date: 'November 10, 2024'
    },
    {
      id: 3,
      thumbnail: '/images/Project1.png',
      status: 'Concept',
      title: 'E-Commerce Platform',
      date: 'October 20, 2024'
    },
    {
      id: 4,
      thumbnail: '/images/Project1.png',
      status: 'Completed',
      title: 'Mobile Banking App',
      date: 'September 5, 2024'
    },
    {
      id: 5,
      thumbnail: '/images/Project2.png',
      status: 'In Development',
      title: 'Restaurant Management',
      date: 'August 22, 2024'
    },
    {
      id: 6,
      thumbnail: '/images/Project1.png',
      status: 'Completed',
      title: 'Healthcare Dashboard',
      date: 'July 18, 2024'
    }
  ];

  useEffect(() => {
    const updateTime = () => {
      const jakartaTime = new Intl.DateTimeFormat('en-US', {
        timeZone: 'Asia/Jakarta',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      }).format(new Date());
      setCurrentTime(`Hello, it is currently ${jakartaTime} in my timezone`);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const projectSection = document.getElementById('projects-section');
      if (!projectSection) return;

      const rect = projectSection.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      
      // Calculate scale for content above projects - starts immediately when scrolling
      if (rect.top <= windowHeight && rect.top > 60) {
        const scaleProgress = Math.max(0, Math.min(1, (windowHeight - rect.top) / windowHeight));
        setContentScale(1 - (scaleProgress * 0.2)); // Scale from 1 to 0.8
        
        // Also set scroll progress for header to appear
        setScrollProgress(scaleProgress);
      } else if (rect.top <= 60) {
        setContentScale(0.8);
        
        // Calculate progress within the stuck/pinned section
        const scrollableHeight = rect.height - windowHeight;
        const scrolledAmount = Math.abs(rect.top - 60);
        const pinProgress = Math.min(1, scrolledAmount / scrollableHeight);
        setScrollProgress(1 + pinProgress); // Goes from 1 to 2
      } else {
        setContentScale(1);
        setScrollProgress(0);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial call

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <main className="min-h-screen">
      
      {/* Header Section - Always on top */}
      <section className="grid grid-cols-5 border-2 border-[var(--border-color)] sticky top-0 bg-[var(--background)] z-50">
        {/* Left Content */}
        <div className="pl-8 border-r-2 border-[var(--border-color)] col-span-1 justify-start flex items-center">
          <span className="relative flex mr-4 size-3">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-500 opacity-75"></span>
            <span className="relative inline-flex size-3 outline-[1px] rounded-full bg-green-500"></span>
          </span>
          <h3 className='text-lg text-stone-300'>Available for work!</h3>
        </div>

        {/* Middle Content */}
        <div className="pt-1 pl-5 border-r-2 border-[var(--border-color)] col-span-3 flex items-center justify-between">
          <Image src="/images/IZALogo.png" alt="Logo" width={100} height={100} />
          <p className="text-sm pr-8 text-stone-300">{currentTime}</p>
        </div>

        {/* Right Content */}
        <div className="pr-8 py-2 col-span-1 justify-end flex items-center">
          <div className="flex items-center gap-4">
            <h1 className="text-lg text-stone-300"></h1>
            <div className="w-[45px] h-[45px] relative">
            </div>
          </div>
        </div>

      </section>
      
      {/* Wrapper for content that scales */}
      <div 
        style={{ 
          transform: `scale(${contentScale})`,
          transformOrigin: 'top center',
          transition: 'transform 0.1s ease-out'
        }}
      >
      
      {/* Intro Section */}
      <section className="grid grid-cols-5 border-t-0 border-2 border-[var(--border-color)] ">

        <div className=" border-r-2 border-[var(--border-color)] col-span-1">
          

        </div>

        <div className="border-r-2  border-[var(--border-color)] col-span-3 relative">
          
          {/* Content layer */}
          <div className="relative z-10">
            <div className="p-20  relative animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
              
              <h1 className="text-stone-300 text-[80px] font-bold leading-none text-center">
                Fullstack Developer
              </h1>
              <div className="mt-4 text-stone-400 text-[48px] font-light text-center">
                Designing & Delivering Website, Application, and much more
              </div>
            </div>
          </div>
        </div>

        <div className="col-span-1">
        </div>

      </section>

      


      {/* Tech */}
      <section className="grid grid-cols-5 border-t-0 border-2 border-[var(--border-color)]">
        <div className="p-8 border-r-2 border-[var(--border-color)] col-span-1">
          <h2 className="text-3xl text-right text-red-500 font-light"></h2>
        </div>

        <div className="col-span-3 py-2 border-r-2 border-[var(--border-color)]">
          <InfiniteFormScroll />
        </div>

        <div className="col-span-1 ">

        </div>
      </section>

       {/* Intro Section */}
      <section className="grid grid-cols-5 border-t-0 border-2 border-[var(--border-color)] ">

        <div className=" border-r-2 border-[var(--border-color)] col-span-1">
          

        </div>

        <div className="border-r-2  border-[var(--border-color)] col-span-3 relative">
          
          {/* Content layer */}
          <div className="relative z-10 p-20">
            
            <div className="grid grid-cols-4 gap-6">
              {/* Step 1 */}
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full border border-blue-600 flex items-center justify-center">
                  <span className="text-2xl font-bold text-blue-700  mb-1">1</span>
                </div>
                <h3 className="text-xl font-bold text-stone-300 mb-3">Discovery & Planning</h3>
                <p className="text-sm text-stone-400">Understanding your requirements, defining project scope, and creating detailed technical specifications with timeline estimates.</p>
              </div>

              {/* Step 2 */}
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full border border-blue-600 flex items-center justify-center">
                  <span className="text-2xl font-bold text-blue-700  mb-1">2</span>
                </div>
                <h3 className="text-xl font-bold text-stone-300 mb-3">Design & Architecture</h3>
                <p className="text-sm text-stone-400">Creating UI/UX mockups, designing database schemas, and establishing the technical architecture for optimal performance.</p>
              </div>

              {/* Step 3 */}
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full border border-blue-600 flex items-center justify-center">
                  <span className="text-2xl font-bold text-blue-700  mb-1">3</span>
                </div>
                <h3 className="text-xl font-bold text-stone-300 mb-3">Development & Testing</h3>
                <p className="text-sm text-stone-400">Building features iteratively with clean code practices, conducting rigorous testing, and ensuring cross-platform compatibility.</p>
              </div>

              {/* Step 4 */}
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full border border-blue-600 flex items-center justify-center">
                  <span className="text-2xl font-bold text-blue-700 mb-1">4</span>
                </div>
                <h3 className="text-xl font-bold text-stone-300 mb-3">Deployment & Support</h3>
                <p className="text-sm text-stone-400">Deploying to production environments, providing documentation, training, and ongoing maintenance support as needed.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="col-span-1">
        </div>

      </section>
      
      </div>
      {/* End of scaling wrapper */}

      {/* Projects Container - Creates scroll space */}
      <div className="relative" id="projects-section" style={{ minHeight: '200vh' }}>
        
        {/* Sticky wrapper - pins the entire project section */}
        <div className="sticky top-0 min-h-screen">
          
          {/* Header Project - Sticky */}
          <section 
            className="bg-zinc-900 grid grid-cols-5 border-t border-2 border-[var(--border-color)] sticky top-[60px] bg-[var(--background)]/80 backdrop-blur-md z-40"
            style={{
              opacity: Math.min(1, scrollProgress * 10),
              transform: `translateY(${Math.max(0, (1 - scrollProgress * 31) * 100)}vh)`
            }}
          >
            <div className="p-8 border-r-2 border-[var(--border-color)] col-span-1">
              <h2 className="text-3xl text-right text-red-500 font-light"></h2>
            </div>

            <div className="col-span-3 py-4 border-r-2 border-[var(--border-color)]">
              <h1 className='text-center text-4xl font-bold text-stone-300'>Projects</h1>
            </div>

            <div className="col-span-1 ">

            </div>
          </section>

          {/* Project Cards Section */}
          <section 
            className="border-t-0 border-2 border-[var(--border-color)] p-20"
            style={{
              opacity: scrollProgress > 0.1 ? 1 : 0,
              transform: `translateY(${scrollProgress > 0.1 ? 0 : 30}px)`,
              transition: 'all 0.5s ease-out 0.2s'
            }}
          >
          {/* Grid 4 columns */}
          <div className="grid grid-cols-4 gap-8">
            {projects.map((project, index) => (
              <div 
                key={project.id} 
                className="group cursor-pointer transition-all duration-500"
                style={{ 
                  opacity: scrollProgress > 0.2 + (index * 0.1) ? 1 : 0,
                  transform: `translateY(${scrollProgress > 0.2 + (index * 0.1) ? 0 : 30}px)`,
                  transitionDelay: `${index * 150}ms`
                }}
              >
                {/* Thumbnail */}
                <div className="relative h-[250px] bg-neutral-900 overflow-hidden mb-4">
                  <Image
                    src={project.thumbnail}
                    alt={project.title}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                
                {/* Info */}
                <div className="space-y-2 bg-neutral-900 p-4">
                  <p className="text-sm text-stone-400">{project.status}</p>
                  <h3 className="text-2xl font-bold text-stone-300">{project.title}</h3>
                  <p className="text-sm text-stone-400">{project.date}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
        
        </div>
        {/* End sticky wrapper */}
      </div>




      {/* More Coming Soon Section */}
      <section className="grid grid-cols-5 border-t-0 border-2 border-[var(--border-color)]">
        <div className="p-8 border-r-2 border-[var(--border-color)] col-span-1">
          <h2 className="text-3xl text-right text-red-500 font-light"></h2>
        </div>

        <div className="col-span-3 border-r-2 border-[var(--border-color)]">
          <Marquee />
        </div>

        <div className="col-span-1 ">

        </div>
      </section>

      {/* About me Section */}
      <section className="grid grid-cols-5 border-t-0 border-2 border-[var(--border-color)]">
        <div className="p-8 border-r-2 border-[var(--border-color)] col-span-1">
          <h2 className="text-3xl text-right text-red-500 font-light"></h2>
        </div>

        <div className="col-span-3 border-r-2 border-[var(--border-color)] flex items-center ">
          {!showAbout ? (
            <button
              onClick={() => setShowAbout(true)}
              className="text-xl font-bold text-stone-300 hover:text-stone-400 pl-8 py-5 transition-colors duration-300"
            >
              About Me
            </button>
          ) : (
            <div className="animate-fade-in-up p-20 flex gap-2 items-start relative">
              <button
                onClick={() => setShowAbout(false)}
                className="absolute top-8 right-8 text-stone-300 hover:text-stone-400 transition-colors duration-300 text-4xl font-light"
              >
                ×
              </button>
              <div className="flex-1">
                <h2 className="text-4xl font-bold text-stone-300 mb-6 ">About Me</h2>
                <p className="text-lg text-stone-400 leading-relaxed text-justify">
                  I am a Fullstack Developer with strong technical capabilities and a clear focus on building intelligent, high-performance digital products. My expertise spans frontend and backend development, UI/UX implementation, and practical AI integration for real operational use cases.
                </p>
                <p className="text-lg text-stone-400 text-justify leading-relaxed mt-4">
                  I specialize in translating complex requirements into clean interfaces, reliable system architecture, and automation features that streamline workflows. I am highly passionate about combining modern web engineering with AI-driven insights to create products that are efficient, scalable, and impactful for users and businesses.
                </p>
              </div>
              <div className="flex-1 flex justify-end items-center">
                <div className="flex flex-col items-center gap-6">
                  <div className="w-[450px] h-[450px] relative rounded-xl overflow-hidden">
                    <Image
                      src="/images/Fotosaya.jpg"
                      alt="About Me"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <Socialmedia />
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="col-span-1 ">

        </div>
      </section>
      
       {/* Contact Section */}
      <section className="grid grid-cols-5 border-t-0 border-2 border-[var(--border-color)]">

        <div className="p-8 border-r-2 border-[var(--border-color)] col-span-1">
          <h2 className="text-3xl text-right text-red-500 font-light"></h2>
        </div>

        <div className="col-span-3 border-r-2 border-[var(--border-color)] flex items-center">
          {!showContact ? (
            <button
              onClick={() => setShowContact(true)}
              className="text-xl font-bold text-stone-300 hover:text-stone-400 pl-8 transition-colors duration-300"
            >
              Contact Us
            </button>
          ) : (
            <div className="animate-fade-in-up p-20 w-full relative">
              <button
                onClick={() => setShowContact(false)}
                className="absolute top-8 right-8 text-stone-300 hover:text-stone-400 transition-colors duration-300 text-4xl font-light"
              >
                ×
              </button>
              <div className="flex flex-col gap-8">
                <div>
                  <h2 className="text-4xl text-stone-300 font-bold mb-6">CONTACT US</h2>
                </div>

                <div>
                  <ContactForm />
                </div>

                <div>
                  <button
                    type="submit"
                    className="w-full px-6 py-2 border-2 border-stone-300 bg-stone-300 text-black hover:bg-black hover:text-stone-300 transition-all duration-300"
                  >
                    Send
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="col-span-1">

        </div>

      </section>

      {/* Footer Section */}

      <section className="grid grid-cols-5 border-t-0 border-2 border-[var(--border-color)] relative">

        <div className="p-8 border-r-2 border-[var(--border-color)] col-span-1 flex flex-col justify-between">
        </div>

        <div className="border-r-2 border-[var(--border-color)] col-span-3 relative h-[200px]">
          <div className="absolute inset-0 px-20 pt-4 overflow-hidden animate-fade-in-up" style={{ animationDelay: '1.1s' }}>
            <Image
              src="/images/about.png"
              alt="About Us"
              width={2000}
              height={800}
              className="w-full h-auto relative top-[10%]"
            />
          </div>
        </div>

        <div className="p-8 col-span-1">


        </div>

      </section>



    </main>
  );
}

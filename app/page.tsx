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
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const projectImages = [
    { src: '/images/Project1.png', alt: 'IZA POS Dashboard' },
    { src: '/images/Project2.png', alt: 'IZA POS Inventory' }
  ];

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % projectImages.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + projectImages.length) % projectImages.length);
  };

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

  return (
    <main className="min-h-screen">
      
      {/* Header Section */}
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

      <section>

      </section>

      {/* Intro Section */}
      <section className="grid grid-cols-5 border-t-0 border-2 border-[var(--border-color)]">

        <div className=" border-r-2 border-[var(--border-color)] col-span-1">
          

        </div>

        <div className="border-r-2 border-[var(--border-color)] col-span-3 relative">
          
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

      {/* Project 1 Section */}
      <section className="grid grid-cols-5 border-t-0 border-2 border-[var(--border-color)]">

        <div className="p-8 border-r-2 border-[var(--border-color)] col-span-1">
        </div>

        <div className="p-20 border-r-2 border-[var(--border-color)] col-span-3 flex gap-8 items-center" >
          {/* Left side - Title and Description */}
          <div className='flex-1 flex flex-col gap-6'>
            <h2 className="text-4xl text-stone-300 font-bold">IZA POS</h2>
            <p className="text-lg text-stone-400 mr-10 text-justify leading-relaxed">
              Smart AI Cashier System is a next-generation web-based point of sale platform designed to streamline business operations for cafés and retail stores. With IZA POS, we aimed to highlight intelligent automation, sleek design, and real-time analytics that empower business owners to make smarter decisions. To achieve this, I worked on the branding, interface design, and website development — focusing on clarity, usability, and modern presentation of IZA POS's innovative features.
            </p>
          </div>

          {/* Right side - Image Slider */}
          <div className='flex-1 flex justify-center items-center'>
            <div className='w-full max-w-[600px] relative ml-5'>
              {/* Image Stack */}
              <div className='relative h-[500px]'>
                {projectImages.map((image, index) => {
                  const isActive = index === currentImageIndex;
                  const isPrev = index === (currentImageIndex - 1 + projectImages.length) % projectImages.length;
                  const isNext = index === (currentImageIndex + 1) % projectImages.length;
                  
                  return (
                    <div
                      key={index}
                      className={`absolute inset-0 transition-all duration-500 ${
                        isActive 
                          ? 'z-20 scale-100 opacity-100' 
                          : isPrev
                          ? 'z-10 -translate-x-8 scale-95 opacity-40 blur-sm'
                          : isNext
                          ? 'z-10 translate-x-8 scale-95 opacity-40 blur-sm'
                          : 'z-0 opacity-0'
                      }`}
                    >
                      <div className='h-full w-full overflow-hidden relative rounded-lg'>
                        <Image
                          src={image.src}
                          alt={image.alt}
                          fill
                          className="object-contain"
                        />
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Navigation Buttons */}
              {currentImageIndex < projectImages.length - 1 && (
                <button
                  onClick={nextImage}
                  className='absolute left-0 top-1/2 -translate-y-1/2 z-30 text-stone-300 hover:text-stone-100 transition-colors text-5xl font-light px-4'
                >
                  ‹
                </button>
              )}
              {currentImageIndex > 0 && (
                <button
                  onClick={prevImage}
                  className='absolute right-0 top-1/2 -translate-y-1/2 z-30 text-stone-300 hover:text-stone-100 transition-colors text-5xl font-light px-4'
                >
                  ›
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="p-8 col-span-1 flex flex-col justify-between">
          <div></div>
          <div className="flex flex-col items-start gap-4">
          </div>
        </div>

      </section>




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

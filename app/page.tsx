'use client'

import Image from 'next/image';
import { useState, useEffect } from 'react';

import Marquee from './components/Marquee'
import Socialmedia from './components/Socialmedia';
import ContactForm from './components/contactform';
import InfiniteFormScroll from './components/infinite-scroll-animation';




export default function Home() {
  const [showAbout, setShowAbout] = useState(false);
  const [currentTime, setCurrentTime] = useState('');

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
            <h1 className="text-lg text-stone-300">Rezki Haikal Izami</h1>
            <div className="w-[45px] h-[45px] relative">
              <Image
                src="/images/WaterDragon.jpg"
                alt="Profile Photo"
                fill
                className="rounded-full object-cover"
              />
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
            <div className="p-8 py-10 relative animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
              
              <h1 className="text-stone-300 text-[80px] font-bold leading-none text-left">
                Fullstack AI Developer
              </h1>
              <div className="mt-4 text-stone-400 text-[48px] font-light text-left">
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
          <h2 className="text-3xl text-stone-300 font-semibold text-center">IZA POS</h2>
            <h2 className="text-lg mt-4 text-justify text-stone-400 ">Smart AI Cashier System is a next-generation web-based point of sale platform designed to streamline business operations for cafés and retail stores. With IZA POS, we aimed to highlight intelligent automation, sleek design, and real-time analytics that empower business owners to make smarter decisions. To achieve this, I worked on the branding, interface design, and website development — focusing on clarity, usability, and modern presentation of IZA POS's innovative features.</h2>
        </div>

        <div className="p-8 border-r-2 border-[var(--border-color)] col-span-3 flex flex-col gap-3">
          <div className='flex gap-8'>
            <div className='flex-1 animate-fade-in-up' style={{ animationDelay: '0.1s' }}>
              <div className='bg-neutral-900 h-[400px] w-full overflow-hidden relative rounded-lg group cursor-pointer'>
                <Image
                  src="/images/Project1.png"
                  alt="IZA POS Dashboard"
                  fill
                  className="object-cover transition-all duration-300 group-hover:brightness-50"
                />
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <h3 className="text-white text-4xl font-bold">Dashboard</h3>
                </div>
              </div>
        
            </div>
            <div className='flex-1 animate-fade-in-up' style={{ animationDelay: '0.3s' }}>
              <div className='bg-neutral-900 h-[400px] w-full overflow-hidden relative rounded-lg group cursor-pointer'>
                <Image
                  src="/images/Project2.png"
                  alt="IZA POS Stock Management"
                  fill
                  className="object-cover transition-all duration-300 group-hover:brightness-50"
                />
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <h3 className="text-white text-4xl font-bold">Inventory</h3>
                </div>
              </div>
  
            </div>
          </div>
          <div className='animate-fade-in-up px-10' style={{ animationDelay: '0.5s' }}>
  
          </div>
        </div>

        <div className="p-8 col-span-1 flex flex-col justify-between">
          <div></div> {/* Empty div to push content down */}
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
              className="text-xl font-bold text-stone-300 hover:text-stone-400 pl-8 transition-colors duration-300"
            >
              About Me
            </button>
          ) : (
            <div className="animate-fade-in-up p-8">
              <h2 className="text-4xl font-bold text-stone-300 mb-6">About Me</h2>
              <p className="text-lg text-stone-400 leading-relaxed">
                I am a passionate Fullstack AI Developer with expertise in building modern web applications 
                and intelligent systems. With a strong foundation in both frontend and backend technologies, 
                I specialize in creating seamless user experiences powered by cutting-edge AI solutions.
              </p>
              <p className="text-lg text-stone-400 leading-relaxed mt-4">
                My journey in tech has led me to work on diverse projects ranging from AI-powered cashier systems 
                to sophisticated web platforms. I believe in combining elegant design with robust functionality 
                to deliver solutions that make a real impact.
              </p>
              <button
                onClick={() => setShowAbout(false)}
                className="mt-6 px-6 py-2 border-2 border-stone-300 text-stone-300 hover:bg-stone-300 hover:text-black transition-all duration-300"
              >
                Close
              </button>
            </div>
          )}
        </div>

        <div className="col-span-1 ">

        </div>
      </section>      {/* Contact Section */}
      <section className="grid grid-cols-5 border-t-0 border-2 border-[var(--border-color)]">

        <div className="p-8 border-r-2 border-[var(--border-color)] col-span-1 flex flex-col justify-between animate-fade-in-up" style={{ animationDelay: '0.7s' }}>
          <div>
            <h2 className="text-3xl text-right text-stone-300 font-bold">CONTACT US</h2>
            <h2 className="text-lg mt-4 text-right text-stone-400 font-light">Feel free to reach out for collaborations or just a friendly hello!</h2>
          </div>
          <div className="mt-auto">
            <Socialmedia />
          </div>
        </div>

        <div className="p-8 py-9 border-r-2 border-[var(--border-color)] col-span-3 animate-fade-in-up" style={{ animationDelay: '0.9s' }}>
          <ContactForm />

        </div>

        <div className="col-span-1">

        </div>

      </section>

      {/* Footer Section */}

      <section className="grid grid-cols-5 border-t-0 border-2 border-[var(--border-color)]">

        <div className="p-8 border-r-2 border-[var(--border-color)] col-span-1 flex flex-col justify-between">
        </div>

        <div className="px-8 h-[250px] overflow-hidden border-r-2 border-[var(--border-color)] col-span-3 animate-fade-in-up" style={{ animationDelay: '1.1s' }}>
          <Image
            src="/images/about.png"
            alt="About Us"
            width={1200}
            height={800}
            className="w-full h-auto relative top-[10%]"
          />
        </div>

        <div className="p-8 col-span-1">


        </div>

      </section>



    </main>
  );
}

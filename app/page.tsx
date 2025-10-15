'use client'

import Image from 'next/image';

import Marquee from './components/Marquee' 
import Socialmedia from './components/Socialmedia';
import ContactForm from './components/contactform';
import InfiniteFormScroll from './components/infinite-scroll-animation';
import BinaryBackground from './components/binarybackground';



export default function Home() {
  return (
    <main className="min-h-screen">

      {/* Header Section */}
      <section className="grid grid-cols-5 border-2 border-[var(--border-color)]">
        {/* Left Content */}
        <div className="p-2 border-r-2 border-[var(--border-color)] col-span-1 justify-start flex items-center">
          <span className="relative flex mr-4 size-3">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-500 opacity-75"></span>
            <span className="relative inline-flex size-3 outline-[1px] rounded-full bg-green-500"></span>
          </span>
          <h3 className='text-lg font-[300]'>Available for work!</h3>
        </div>

        {/* Middle Content */}
        <div className="pt-3 pl-3 border-r-2 border-[var(--border-color)] col-span-3">
          <Image src="/images/IZALogo.png" alt="Logo" width={100} height={100} />
        </div>

        {/* Right Content */}
        <div className="p-2 col-span-1 justify-end flex items-center">
         <div className="flex items-center gap-4">
            <h1 className="text-lg font-[300]">Rezki Haikal Izami</h1>
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

      {/* Intro Section */}
      <section className="grid grid-cols-5 border-t-0 border-2 border-[var(--border-color)]">

        <div className=" border-r-2 border-[var(--border-color)] col-span-1">

        </div>

        <div className="p-8 py-10 border-r-2 border-[var(--border-color)] col-span-3 relative">
          {/* Binary background layer */}
          <div className="absolute inset-0">
          </div>
          
          {/* Content layer */}
          <div className="relative z-10">
            <div className="relative w-full h-[350px] flex items-center justify-center">
              {/* Binary background, exclude area di sekitar tulisan */}
              <BinaryBackground
                excludeRects={[
                  { x: 60, y: 60, width: 900, height: 180 } // Atur sesuai posisi/ukuran tulisan
                ]}
              />
              <div className="relative z-10 text-center">
                <h1 className="text-white text-[80px] font-bold leading-none">
                  Fullstack AI Developer
                </h1>
                <div className="mt-4 text-white text-[48px] font-light">
                  Designing & Delivering Website, Application, and much more
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-span-1">
        </div>

      </section>

      
      {/* More Coming Soon Section */}
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
      <section className="grid grid-cols-5 border-t-0 border-2 border-[var(--border-color)] bg-red-500">

        <div className="p-8 border-r-2 border-[var(--border-color)] col-span-1">
          <h2 className="text-3xl text-right text-white-500 font-bold">IZA POS</h2>
          <h2 className="text-lg mt-4 text-right text-white-500 font-light">Smart AI Cashier System is a next-generation web-based point of sale platform designed to streamline business operations for cafés and retail stores. With IZA POS, we aimed to highlight intelligent automation, sleek design, and real-time analytics that empower business owners to make smarter decisions. To achieve this, I worked on the branding, interface design, and website development — focusing on clarity, usability, and modern presentation of IZA POS’s innovative features.</h2>
        </div>

        <div className="p-8 border-r-2 border-[var(--border-color)] col-span-3 flex items-center justify-center gap-8">
          <div className='rounded-2xl bg-white h-[500px] w-[550px]'></div>
          <div className='rounded-2xl bg-white h-[500px] w-[550px]'></div>
        </div>
    
        <div className="p-8 col-span-1 flex flex-col justify-between">
          <div></div> {/* Empty div to push content down */}
          <div className="flex flex-col items-start gap-4">
            <p className="text-white-400 text-left">
              Interested in this project?{' '}
              <a 
                href="https://iza-pos.vercel.app" 
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center font-medium text-blue-500 hover:text-blue-600 transition-colors"
              >
                View live demo
                <svg 
                  className="w-4 h-4 ms-2 rtl:rotate-180" 
                  aria-hidden="true" 
                  xmlns="http://www.w3.org/2000/svg" 
                  fill="none" 
                  viewBox="0 0 14 10"
                >
                  <path 
                    stroke="currentColor" 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth="2" 
                    d="M1 5h12m0 0L9 1m4 4L9 9"
                  />
                </svg>
              </a>
            </p>
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

      {/* Contact Section */}
      <section className="grid grid-cols-5 border-t-0 border-2 border-[var(--border-color)]">
     
        <div className="p-8 border-r-2 border-[var(--border-color)] col-span-1 flex flex-col justify-between">
          <div>
            <h2 className="text-3xl text-right text-white-500 font-bold">CONTACT US</h2>
            <h2 className="text-lg mt-4 text-right text-white-500 font-light">Feel free to reach out for collaborations or just a friendly hello!</h2>
          </div>
          <div className="mt-auto">
            <Socialmedia />
          </div>
        </div>

        <div className="p-8 py-9 border-r-2 border-[var(--border-color)] col-span-3">
          <ContactForm />
  
        </div>

        <div className="col-span-1">

        </div>

      </section>

      {/* About Section */}

      <section className="grid grid-cols-5 border-t-0 border-2 border-[var(--border-color)]">
     
        <div className="p-8 border-r-2 border-[var(--border-color)] col-span-1 flex flex-col justify-between">
        </div>

        <div className="px-8 h-[250px] overflow-hidden border-r-2 border-[var(--border-color)] col-span-3">
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
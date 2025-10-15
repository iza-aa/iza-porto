// components/InfiniteLogoScroll.tsx

import Image from "next/image"; // Menggunakan Next.js Image untuk optimisasi

// Daftar logo yang akan ditampilkan
// Pastikan path ke gambar sudah benar dan letakkan gambar di folder /public
const logos = [
  { src: "/images/icons/react.svg", alt: "React" },
  { src: "/images/icons/js.svg", alt: "Next.js" },
  { src: "/images/icons/python.svg", alt: "Tailwind CSS" },
  { src: "/images/icons/swift.svg", alt: "TypeScript" },
  { src: "/images/icons/js.svg", alt: "JavaScript" },
  { src: "/images/icons/html.svg", alt: "HTML5" },
  { src: "/images/icons/css.svg", alt: "CSS3" },
  { src: "/images/icons/docker.svg", alt: "Node.js" },
  { src: "/images/icons/php.svg", alt: "PHP" },
];

function InfiniteLogoScroll() {
  return (
    <div className="w-full  flex overflow-hidden 
                    [mask-image:_linear-gradient(to_right,transparent_0,_black_128px,_black_calc(100%-128px),transparent_100%)]">
      <ul className="flex items-center justify-center md:justify-start [&_li]:mx-8 [&_img]:max-w-none animate-infinite-scroll">
        {logos.map((logo, index) => (
          <li key={index}>
            <Image 
              src={logo.src} 
              alt={logo.alt} 
              width={80} // Atur lebar ikon
              height={80} // Atur tinggi ikon
              className="h-14 w-auto object-contain" // Styling untuk menjaga rasio aspek
            />
          </li>
        ))}
      </ul>
      {/* Bagian ini untuk menciptakan efek looping yang mulus */}
      <ul className="flex items-center justify-center md:justify-start [&_li]:mx-8 [&_img]:max-w-none animate-infinite-scroll" aria-hidden="true">
        {logos.map((logo, index) => (
          <li key={index}>
            <Image 
              src={logo.src} 
              alt={logo.alt} 
              width={80}
              height={80}
              className="h-14 w-auto object-contain"
            />
          </li>
        ))}
      </ul>
    </div>
  );
}

export default InfiniteLogoScroll;
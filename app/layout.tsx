import type { Metadata } from "next";
import { Source_Serif_4, Anton, Pinyon_Script, Archivo_Black } from "next/font/google";
import "./globals.css";
import Navbar from "./layout/navbar";
import { LoadingProvider } from "./context/LoadingContext";
import SmoothScrolling from "../app/components/smoothscrolling"; // <-- 1. Impor wrapper Lenis

const inknutAntiqua = Source_Serif_4({
  subsets: ["latin"],
  weight: ['300', '400', '500', '600', '700', '800', '900'],
  variable: "--font-inknut-antiqua",
  display: "swap",
});

const anton = Anton({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-anton",
  display: "swap",
});

const pinyonScript = Pinyon_Script({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-pinyon-script",
  display: "swap",
});

const archivoBlack = Archivo_Black({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-archivo-black",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://iza-porto.vercel.app"),
  title: {
    default: "Rezky Haikal Izami — Software Engineer",
    template: "%s — Rezky Haikal Izami",
  },
  description:
    "Portfolio of Rezky Haikal Izami, a software engineer based in Yogyakarta, Indonesia. Explore projects, skills, and experience in web development.",
  keywords: [
    "Rezky Haikal Izami",
    "software engineer",
    "web developer",
    "portfolio",
    "Next.js",
    "Indonesia",
  ],
  authors: [{ name: "Rezky Haikal Izami", url: "https://github.com/iza-aa" }],
  creator: "Rezky Haikal Izami",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://iza-porto.vercel.app",
    siteName: "Rezky Haikal Izami — Portfolio",
    title: "Rezky Haikal Izami — Software Engineer",
    description:
      "Portfolio of Rezky Haikal Izami, a software engineer based in Yogyakarta, Indonesia.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Rezky Haikal Izami — Software Engineer",
    description:
      "Portfolio of Rezky Haikal Izami, a software engineer based in Yogyakarta, Indonesia.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        {/* Prevent flash of wrong theme on load */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){var t=localStorage.getItem('theme');if(t==='light'){document.documentElement.classList.remove('dark')}else{document.documentElement.classList.add('dark')}})()`,
          }}
        />
      </head>
      <body className={`${inknutAntiqua.variable} ${anton.variable} ${pinyonScript.variable} ${archivoBlack.variable} ${inknutAntiqua.className}`}>
        {/* 2. Bungkus aplikasi dengan SmoothScrolling */}
        <SmoothScrolling>
          <LoadingProvider>
            <Navbar />
            {children}
          </LoadingProvider>
        </SmoothScrolling>
      </body>
    </html>
  );
}
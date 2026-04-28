import Image from 'next/image'

export default function LeopardBg() {
  return (
    <div className="absolute inset-0 w-full h-full">
      <Image
        src="/asset/project-section/projectbg/leopardbg.jpeg"
        alt="Leopard Background"
        fill
        className="object-cover"
        priority
      />
      {/* Dark gradient overlay — keeps text readable */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-black/20" />
    </div>
  )
}

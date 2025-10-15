import Image from 'next/image';

export default function Socialmedia() {
  const socials = [
    {
      id: 'instagram',
      icon: '/images/icons/instagram.svg',
      url: 'https://instagram.com/yourusername'
    },
    {
      id: 'tiktok',
      icon: '/images/icons/tiktok.svg',
      url: 'https://tiktok.com/@yourusername'
    },
    {
      id: 'linkedin',
      icon: '/images/icons/linkedin.svg',
      url: 'https://linkedin.com/in/yourusername'
    },
    {
      id: 'github',
      icon: '/images/icons/github.svg',
      url: 'https://github.com/yourusername'
    },
    {
      id: 'whatsapp',
      icon: '/images/icons/whatsapp.svg',
      url: 'mailto:youremail@example.com'
    }
  ];

  return (
    <div className="flex flex-row  gap-7 justify-end mt-auto" >
      {socials.map((social) => (
        <a
          key={social.id}
          href={social.url}
          target="_blank"
          rel="noopener noreferrer"
          className="hover:opacity-70 transition-opacity"
        >
          <Image
            src={social.icon}
            alt={`${social.id} icon`}
            width={50}
            height={50}
          />
        </a>
      ))}
    </div>
  );
}
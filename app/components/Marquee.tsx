
  const texts = [
    "MORE PROJECT COMING SOON",
    "MORE PROJECT COMING SOON",
    "MORE PROJECT COMING SOON",
    "MORE PROJECT COMING SOON",
    "MORE PROJECT COMING SOON",
    "MORE PROJECT COMING SOON",
    "MORE PROJECT COMING SOON",
    "MORE PROJECT COMING SOON",
    "MORE PROJECT COMING SOON",
    "MORE PROJECT COMING SOON",
    "MORE PROJECT COMING SOON",
  ];

function Marquee() {  
  return (
    <div className="w-full [&_li]:mx-8 flex overflow-hidden mt-[10px]
                    [mask-image:_linear-gradient(to_right,transparent_0,_black_128px,_black_calc(100%-128px),transparent_100%)]">
      <ul className="flex [&_img]:max-w-none animate-infinite-scroll">
        {texts.map((text, index) => (
          <li key={index}>
            <span className="text-4xl font-bold whitespace-nowrap text-stone-300">{text}</span>
          </li>
        ))}
      </ul>

      <ul className="flex  [&_li]:mx-8 [&_img]:max-w-none animate-infinite-scroll" aria-hidden="true">
        {texts.map((text, index) => (
          <li key={index}>
            <span className="text-4xl font-bold whitespace-nowrap text-stone-300">{text}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Marquee;

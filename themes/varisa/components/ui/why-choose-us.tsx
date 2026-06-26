import { clientConfig } from '@/config/client-config';
export default function WhyChooseUs() {
  const envBgColor = clientConfig().branding.colors.accentForeground;
  const bgColor = envBgColor ? (envBgColor.startsWith('#') ? envBgColor : `#${envBgColor}`) : '#FCFBF8';

  const envTextColor = clientConfig().branding.colors.accent;
  const textColor = envTextColor ? (envTextColor.startsWith('#') ? envTextColor : `#${envTextColor}`) : '#222222';

  const benefits = [
    "Authentic Flavors",
    "Freshness Guaranteed",
    "Effortless Convenience",
    "Premium Quality Ingredients",
    "Crafted with Passion",
    "Delivered to Your Door"
  ];

  // Duplicate to ensure seamless looping
  const scrollItems = [...benefits, ...benefits, ...benefits];

  return (
    <section className="py-6 border-y border-black/5 overflow-hidden flex whitespace-nowrap" style={{ backgroundColor: bgColor }}>
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes scrollMarquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-33.333333%); }
        }
        .animate-marquee {
          animation: scrollMarquee 25s linear infinite;
        }
      `}} />
      <div className="flex animate-marquee hover:[animation-play-state:paused] min-w-max items-center">
        {scrollItems.map((item, idx) => (
          <div key={idx} className="flex items-center gap-6 px-6 md:px-10">
            <span 
              className="text-lg md:text-2xl font-serif font-medium whitespace-nowrap tracking-wide" 
              style={{ color: textColor }}
            >
              {item}
            </span>
            <span className="text-lg md:text-2xl opacity-20" style={{ color: textColor }}>
              ✦
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}

import Image from 'next/image';
import Link from 'next/link';

export default function QuickCategoryPills() {
  const categories = [
    { name: 'Soups', bg: 'bg-[#F2EAD3]', image: '/category_soups_1779923083280.png', link: '/shop?category=soups' },
    { name: 'Stews', bg: 'bg-[#EAE4F2]', image: '/category_stews_1779923152340.png', link: '/shop?category=stews' },
    { name: 'Rice Dishes', bg: 'bg-[#F0F4EC]', image: '/category_rice_1779923098621.png', link: '/shop?category=rice' },
    { name: 'Proteins', bg: 'bg-[#E3EAF4]', image: '/category_proteins_1779923126020.png', link: '/shop?category=proteins' },
    { name: 'Small Chops', bg: 'bg-[#EBF3ED]', image: '/category_chops_1779923165944.png', link: '/shop?category=chops' },
    { name: 'Combos', bg: 'bg-[#E3F2EF]', image: '/category_bundles_1779923196026.png', link: '/shop?category=combos' }
  ];

  return (
    <section className="w-full px-4 lg:px-10 pt-4 md:pt-6 pb-2 max-w-[1600px] mx-auto animate-in fade-in slide-in-from-top-4 duration-500">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-1.5 md:gap-4 pb-2">
        {categories.map((cat, index) => (
          <Link 
            key={index} 
            href={cat.link}
            className={`flex items-center justify-between px-3 py-2 md:px-4 md:py-3 rounded-xl shadow-sm cursor-pointer ${cat.bg}`}
          >
            <span className="font-bold text-[#1C1917] text-[13px] md:text-[14px] tracking-tight">{cat.name}</span>
            <div className="relative w-8 h-8 md:w-10 md:h-10 shrink-0">
              <Image 
                src={cat.image} 
                alt={cat.name} 
                fill 
                className="object-contain mix-blend-multiply" 
              />
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

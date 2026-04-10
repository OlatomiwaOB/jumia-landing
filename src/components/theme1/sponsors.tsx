const BrandLogos = () => {
  const brands = [
    { name: "NCR", logo: "NCR" },
    { name: "Analog", logo: "analog" },
    { name: "Buffalo", logo: "🐃" },
    { name: "Street", logo: "STREET" },
    { name: "LCN", logo: "LCN" },
    { name: "Gear", logo: "⚙️" },
    { name: "Bike", logo: "🚲" },
    { name: "IKK", logo: "IKK" },
  ];

  return (
    <section className="py-16 bg-[#f7f7f7]">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-8 items-center">
          {brands.map((brand) => (
            <div 
              key={brand.name} 
              className="flex items-center justify-center grayscale hover:grayscale-0 transition-all cursor-pointer"
            >
              <span className="text-2xl font-bold opacity-60 hover:opacity-100 transition-opacity">
                {brand.logo}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BrandLogos;

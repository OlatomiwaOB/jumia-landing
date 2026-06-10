'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChefHat, Star, Truck, Heart, ShieldCheck, CheckCircle2, ArrowRight } from 'lucide-react';

export default function AboutPage() {
  const accentColor = '#F97316';
  const bgColor = '#FAFAF9';
  const hoverColor = '#111827';

  return (
    <div className="min-h-screen font-sans pb-20" style={{ backgroundColor: bgColor }}>

      {/* 1. Hero Section */}
      <section className="relative w-full h-[60vh] min-h-[400px] max-h-[600px] flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 z-0 bg-cover bg-center brightness-[0.4]"
          style={{ backgroundImage: 'url("/nigerian-food-banner.png")' }}
        />
        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto mt-12">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 tracking-tight leading-tight">
            Bringing the Taste of <span style={{ color: accentColor }}>Nigeria</span> to Your Doorstep
          </h1>
          <p className="text-lg md:text-xl text-gray-200 mb-8 max-w-2xl mx-auto font-medium">
            Authentic, freshly cooked Nigerian meals delivered anywhere in the UK. Because no matter how far you go, home is always where the food is.
          </p>
        </div>
      </section>

      {/* 2. Key Stats */}
      <section className="w-full -mt-10 relative z-20 px-4 md:px-8">
        <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col md:flex-row divide-y md:divide-y-0 md:divide-x divide-gray-100 border border-gray-100">

          <div className="flex-1 p-8 flex flex-col items-center text-center hover:bg-gray-50 transition-colors">
            <div className="w-16 h-16 rounded-full flex items-center justify-center mb-4" style={{ backgroundColor: `${accentColor}15`, color: accentColor }}>
              <ChefHat size={32} />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Freshly Cooked Meals</h3>
            <p className="text-gray-600 text-sm">Prepared from scratch using authentic recipes and the finest local and imported ingredients.</p>
          </div>

          <div className="flex-1 p-8 flex flex-col items-center text-center hover:bg-gray-50 transition-colors">
            <div className="w-16 h-16 rounded-full flex items-center justify-center mb-4" style={{ backgroundColor: `${accentColor}15`, color: accentColor }}>
              <Star size={32} />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">5-Star Rated Service</h3>
            <p className="text-gray-600 text-sm">Trusted by hundreds of happy customers across the UK who crave the true taste of home.</p>
          </div>

          <div className="flex-1 p-8 flex flex-col items-center text-center hover:bg-gray-50 transition-colors">
            <div className="w-16 h-16 rounded-full flex items-center justify-center mb-4" style={{ backgroundColor: `${accentColor}15`, color: accentColor }}>
              <Truck size={32} />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">UK-Wide Delivery</h3>
            <p className="text-gray-600 text-sm">We carefully package and ship our meals every Wednesday to reach you perfectly fresh.</p>
          </div>

        </div>
      </section>

      {/* 3. Who We Are */}
      <section className="py-20 px-6 max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16">
        <div className="w-full lg:w-1/2 relative h-[500px] rounded-3xl overflow-hidden shadow-2xl">
          <Image
            src="/three-soups-semo-white-cloth.png"
            alt="Authentic Nigerian Soups and Semo"
            fill
            className="object-cover"
          />
          <div className="absolute bottom-6 left-6 right-6 bg-white/90 backdrop-blur-sm p-6 rounded-2xl border border-white/20">
            <p className="text-gray-800 font-bold text-lg">"We don't just cook food; we craft memories of home."</p>
          </div>
        </div>

        <div className="w-full lg:w-1/2 flex flex-col justify-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-100 text-sm font-bold text-gray-600 w-max mb-6">
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: accentColor }}></span>
            Our Story
          </div>
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-6 leading-tight">
            Sharing Our Passion for Nigerian Cuisine
          </h2>
          <div className="space-y-5 text-gray-600 text-lg">
            <p>
              Craving a taste of home? At Traditional Taste, our <span className="font-bold text-[#F97316] bg-orange-50 px-2 py-0.5 rounded-md border border-orange-100">homemade</span> local meals are crafted with love, bringing you the authentic flavours that remind you of family dinners and cherished memories. Every dish is tailored to your unique taste, ensuring a personalised experience with every bite.
            </p>
            <p>
              We deliver fresh, heartfelt meals across the UK — wherever you are, comfort food is just a click away. With a 5-star rating, you can trust that our meals are not only delicious but also healthy and made with the utmost care.
            </p>
            <p>
              Try Traditional Taste today and discover why a trial is all it takes to fall in love with food made just for you.
            </p>
            <p>
              Experience the warmth of home-cooked goodness. Order now and let Traditional Taste bring a little piece of home to your doorstep.
            </p>
          </div>
        </div>
      </section>

      {/* 4. What We Stand For */}
      <section className="py-20 bg-gray-50 border-y border-gray-200">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-6">What We Stand For</h2>
            <p className="text-gray-600 text-lg">We are built on four core pillars that guide every meal we cook and every box we ship.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">

            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex gap-6 hover:shadow-md transition-shadow">
              <div className="flex-shrink-0 w-14 h-14 rounded-xl flex items-center justify-center bg-orange-100 text-orange-600">
                <CheckCircle2 size={28} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Authenticity</h3>
                <p className="text-gray-600">No shortcuts. We use authentic spices, traditional cooking methods, and real ingredients to ensure every bite tastes exactly like home.</p>
              </div>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex gap-6 hover:shadow-md transition-shadow">
              <div className="flex-shrink-0 w-14 h-14 rounded-xl flex items-center justify-center bg-blue-100 text-blue-600">
                <ShieldCheck size={28} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Uncompromising Quality</h3>
                <p className="text-gray-600">From the freshest produce to premium meats, we source only the highest quality ingredients. We prepare our food in pristine, hygienic environments.</p>
              </div>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex gap-6 hover:shadow-md transition-shadow">
              <div className="flex-shrink-0 w-14 h-14 rounded-xl flex items-center justify-center bg-pink-100 text-pink-600">
                <Heart size={28} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Made with Love</h3>
                <p className="text-gray-600">Cooking Nigerian food takes time, patience, and love. We don't mass-produce; we cook every batch with the same care we would for our own families.</p>
              </div>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex gap-6 hover:shadow-md transition-shadow">
              <div className="flex-shrink-0 w-14 h-14 rounded-xl flex items-center justify-center bg-green-100 text-green-600">
                <Truck size={28} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Reliability</h3>
                <p className="text-gray-600">You can count on us. With our strict Wednesday shipping schedule, you know exactly when your meals will arrive, securely packaged and ready to enjoy.</p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 5. Mission Statement */}
      <section className="py-24 px-6 text-center max-w-4xl mx-auto">
        <div className="w-20 h-20 mx-auto mb-8 rounded-full flex items-center justify-center" style={{ backgroundColor: `${accentColor}15`, color: accentColor }}>
          <Heart size={40} fill="currentColor" />
        </div>
        <h2 className="text-3xl md:text-5xl font-extrabold text-gray-900 mb-8 leading-tight">
          Our Mission
        </h2>
        <blockquote className="text-2xl md:text-3xl font-medium text-gray-600 italic leading-snug">
          "To provide Nigerians and Africans across the UK with a reliable, delicious, and heartwarming connection to their roots through the universal language of food."
        </blockquote>
      </section>

      {/* 6. Call to Action */}
      <section className="py-16 px-6">
        <div className="max-w-5xl mx-auto rounded-3xl p-12 md:p-16 text-center shadow-2xl relative overflow-hidden" style={{ backgroundColor: accentColor }}>
          {/* Background pattern overlay */}
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white to-transparent"></div>

          <div className="relative z-10">
            <h2 className="text-3xl md:text-5xl font-extrabold text-gray-900 mb-6 tracking-tight">
              Ready to Taste Home?
            </h2>
            <p className="text-lg md:text-xl text-gray-800 mb-10 max-w-2xl mx-auto">
              Explore our menu of freshly prepared authentic meals. Place your order today and we'll ship it to you.
            </p>
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 font-bold text-lg px-8 py-4 rounded-full shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1"
              style={{ backgroundColor: '#FFFFFF', color: '#111827' }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = hoverColor;
                e.currentTarget.style.color = '#FFFFFF';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#FFFFFF';
                e.currentTarget.style.color = '#111827';
              }}
            >
              Explore Our Menu
              <ArrowRight size={20} />
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}

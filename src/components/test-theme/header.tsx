'use client';
import Link from 'next/link';

export default function Header() {
  return (
    <header className="w-full bg-white border-b border-gray-100 py-6 px-8 flex items-center justify-between sticky top-0 z-50">
      {/* Left Navigation */}
      <nav className="flex space-x-8 text-xs font-semibold tracking-widest text-[#555]">
        <Link href="#" className="hover:text-black transition-colors">HOME</Link>
        <Link href="#" className="hover:text-black transition-colors">SHOP</Link>
        <Link href="#" className="hover:text-black transition-colors">PAGES</Link>
        <Link href="#" className="hover:text-black transition-colors">ELEMENTS</Link>
      </nav>

      {/* Center Logo */}
      <div className="absolute left-1/2 transform -translate-x-1/2">
        <Link href="#">
          <h1 className="text-2xl font-bold tracking-[0.3em] text-black">DEPOT</h1>
        </Link>
      </div>

      {/* Right Navigation */}
      <div className="flex items-center space-x-6 text-xs font-semibold tracking-widest text-[#555]">
        <Link href="#" className="flex items-center hover:text-black transition-colors">
          CART ($0)
        </Link>
        <Link href="#" className="flex items-center hover:text-black transition-colors gap-2">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
            <circle cx="12" cy="7" r="4"></circle>
          </svg>
          LOGIN
        </Link>
        <button className="hover:text-black transition-colors">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
        </button>
        <button className="hover:text-black transition-colors">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="3" y1="12" x2="21" y2="12"></line>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <line x1="3" y1="18" x2="21" y2="18"></line>
          </svg>
        </button>
      </div>
    </header>
  );
}

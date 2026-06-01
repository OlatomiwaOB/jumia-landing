import Link from 'next/link';
import Image from 'next/image';

const navigation = {
  quickLinks: [
    { name: 'Shop All', href: '#' },
    { name: 'About Us', href: '#' },
    { name: 'Contact', href: '#' },
    { name: 'FAQs', href: '#' },
  ],
  categories: [
    { name: 'Groceries', href: '#' },
    { name: 'Meat & Seafood', href: '#' },
    { name: 'Oil & Seasoning', href: '#' },
    { name: 'Dried Foods', href: '#' },
  ],
  customerService: [
    { name: 'Delivery Info', href: '#' },
    { name: 'Returns Policy', href: '#' },
    { name: 'Privacy Policy', href: '#' },
    { name: 'Terms & Conditions', href: '#' },
  ],
  social: [
    {
      name: 'Facebook',
      href: '#',
      colorClass: 'bg-[#1877F2] hover:bg-[#166fe5]',
      icon: (props: any) => (
        <svg fill="currentColor" viewBox="0 0 24 24" {...props}>
          <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
        </svg>
      ),
    },
    {
      name: 'Instagram',
      href: '#',
      colorClass: 'bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] hover:opacity-90',
      icon: (props: any) => (
        <svg fill="currentColor" viewBox="0 0 24 24" {...props}>
          <path d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" />
        </svg>
      ),
    },
    {
      name: 'TikTok',
      href: '#',
      colorClass: 'bg-black hover:bg-[#333333]',
      icon: (props: any) => (
        <svg fill="currentColor" viewBox="0 0 24 24" {...props}>
          <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 2.63-1.1 5.21-3.08 7.03-1.92 1.76-4.48 2.62-7.07 2.45-2.8-.2-5.46-1.64-7.14-3.85-1.74-2.28-2.42-5.32-1.7-8.1.75-2.92 2.72-5.43 5.42-6.67 1.57-.73 3.33-.94 5.04-.67V11.2c-.89-.13-1.82-.08-2.67.24-1.32.48-2.44 1.55-2.93 2.87-.51 1.34-.45 2.9.22 4.17.65 1.22 1.82 2.15 3.19 2.5.95.24 1.98.24 2.91 0 1.73-.44 3.03-1.9 3.29-3.66.07-.46.06-.93.06-1.4V.02h.4z" />
        </svg>
      ),
    },
    {
      name: 'WhatsApp',
      href: '#',
      colorClass: 'bg-[#25D366] hover:bg-[#128C7E]',
      icon: (props: any) => (
        <svg fill="currentColor" viewBox="0 0 448 512" {...props}>
          <path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7 .9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z" />
        </svg>
      ),
    },
  ],
};

const PaymentIcons = () => {
  return (
    <div className="flex items-center gap-3">
      {/* Visa */}
      <div className="w-[60px] h-[40px] bg-[#94A3B8] rounded flex items-center justify-center transition-all hover:bg-white cursor-pointer shadow-sm">
        <span className="font-black italic text-[#0f172a] text-[16px] tracking-tight">VISA</span>
      </div>
      {/* Mastercard */}
      <div className="w-[60px] h-[40px] bg-[#94A3B8] rounded flex flex-col items-center justify-center transition-all hover:bg-white cursor-pointer shadow-sm pt-1">
        <svg viewBox="0 0 24 15" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-[20px] mb-[1px]">
          <circle cx="7.5" cy="7.5" r="7.5" fill="#0f172a" opacity="0.8"/>
          <circle cx="16.5" cy="7.5" r="7.5" fill="#0f172a" opacity="0.6"/>
        </svg>
        <span className="text-[#0f172a] text-[6px] font-bold tracking-tight">mastercard</span>
      </div>
      {/* Amex */}
      <div className="w-[60px] h-[40px] bg-[#94A3B8] rounded flex items-center justify-center transition-all hover:bg-white cursor-pointer shadow-sm">
        <div className="flex flex-col items-center leading-none text-[#0f172a] font-black tracking-tighter" style={{ fontSize: '11px', transform: 'scaleY(1.1)' }}>
          <span className="leading-[10px]">AM</span>
          <span className="leading-[10px]">EX</span>
        </div>
      </div>
      {/* PayPal */}
      <div className="w-[60px] h-[40px] bg-[#94A3B8] rounded flex items-center justify-center transition-all hover:bg-white cursor-pointer shadow-sm">
        <span className="font-bold italic text-[#0f172a] text-[13px] tracking-tight">PayPal</span>
      </div>
    </div>
  );
};

export default function Footer() {
  return (
    <footer className="bg-[#111111]">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        
        {/* Main Footer Content */}
        <div className="py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8">
          
          {/* Brand Column */}
          <div className="lg:col-span-4">
            <Link href="/" className="flex items-center gap-3">
              {/* Note: User should replace this with their actual logo Image component if they have one */}
              <div className="w-10 h-10 bg-white rounded flex items-center justify-center overflow-hidden p-1">
                 <Image src="/traditional-taste-logo.jpg" alt="Logo" width={40} height={40} className="object-cover" />
              </div>
              <span className="text-xl font-bold tracking-wide text-white font-serif">Traditional Taste</span>
            </Link>
            <p className="mt-6 text-[15px] leading-relaxed text-gray-400 max-w-sm">
              Bringing authentic Nigerian and African foods to your doorstep across the UK. Quality products, competitive prices, fast delivery.
            </p>
            {/* Social Links */}
            <div className="mt-8 flex gap-3">
              {navigation.social.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className={`w-10 h-10 rounded-xl flex items-center justify-center text-white hover:scale-110 transition-all duration-300 shadow-md ${item.colorClass}`}
                  aria-label={item.name}
                >
                  <item.icon aria-hidden="true" className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Spacer on large screens */}
          <div className="hidden lg:block lg:col-span-2"></div>

          {/* Quick Links Column */}
          <div className="lg:col-span-2">
            <h3 className="text-base font-semibold text-white">Quick Links</h3>
            <ul className="mt-6 space-y-4">
              {navigation.quickLinks.map((item) => (
                <li key={item.name}>
                  <a
                    href={item.href}
                    className="text-[15px] text-gray-400 hover:text-white hover:translate-x-1 inline-block transition-all"
                  >
                    {item.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories Column */}
          <div className="lg:col-span-2">
            <h3 className="text-base font-semibold text-white">Categories</h3>
            <ul className="mt-6 space-y-4">
              {navigation.categories.map((item) => (
                <li key={item.name}>
                  <a
                    href={item.href}
                    className="text-[15px] text-gray-400 hover:text-white hover:translate-x-1 inline-block transition-all"
                  >
                    {item.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Service Column */}
          <div className="lg:col-span-2">
            <h3 className="text-base font-semibold text-white">Customer Service</h3>
            <ul className="mt-6 space-y-4">
              {navigation.customerService.map((item) => (
                <li key={item.name}>
                  <a
                    href={item.href}
                    className="text-[15px] text-gray-400 hover:text-white hover:translate-x-1 inline-block transition-all"
                  >
                    {item.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

        </div>

        {/* Bottom Copyright and Payments Bar */}
        <div className="border-t border-white/10 py-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <p className="text-[14px] text-gray-400">
            &copy; {new Date().getFullYear()} Traditional Taste. All rights reserved.
          </p>
          
          <div className="flex items-center gap-2">
            <PaymentIcons />
          </div>
        </div>
        
      </div>
    </footer>
  );
}

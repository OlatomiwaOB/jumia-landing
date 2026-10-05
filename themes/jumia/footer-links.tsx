import React from 'react';

// Main (lighter grey) part of the Jumia footer: link columns, contact details, socials,
// payment methods and the JumiaPay / Jumia Delivery marks.
// Icon images are cropped with the footer colour (#535357) baked in — keep the background in sync.

const USEFUL_LINKS = [
  'Service Center',
  'How to shop on Jumia?',
  'Delivery options and timelines',
  'How to return a product on Jumia?',
  'Corporate and bulk purchases',
  'Report a Product',
  'Dispute Resolution Policy',
  'Returns & Refund Timeline',
  'Return Policy',
  'Pickup Stations',
  'Jumia Delivery',
];

const ABOUT_LINKS = [
  'About us',
  'Jumia careers',
  'Corporate Website',
  'Terms and Conditions',
  'Jumia Payment Information Guidelines',
  'Official Stores',
  'Flash Sales',
  'Black Friday',
  'Jumia Blog',
];

const PRIVACY_LINKS = ['Privacy Notice', 'Cookie Notice', 'Cookie Preferences'];

const MAKE_MONEY_LINKS = ['Sell on Jumia', 'Vendor hub', 'Become a Sales Consultant'];

const INTERNATIONAL = [
  ['Egypt', 'Ghana', 'Ivory Coast', 'Kenya'],
  ['Morocco', 'Senegal', 'Uganda'],
];

const CONTACT = [
  { label: 'Business Name', value: 'Jumia Nigeria' },
  { label: 'Address', value: '9 Canal View Layout, Ajao Estate, Lagos' },
  { label: 'Phone Number', value: '02018881106' },
  { label: 'WhatsApp', value: '2349139368685' },
];

// width/height are the icons' display size in CSS px (half the 2x crop)
const SOCIALS = [
  { name: 'Facebook', src: '/images/footer/social_facebook.png', w: 12, h: 23 },
  { name: 'YouTube', src: '/images/footer/social_youtube.png', w: 25, h: 19 },
  { name: 'Instagram', src: '/images/footer/social_instagram.png', w: 25, h: 25 },
  { name: 'X', src: '/images/footer/social_x.png', w: 25, h: 23 },
  { name: 'TikTok', src: '/images/footer/social_tiktok.png', w: 22, h: 25 },
];

const PAYMENT_METHODS = [
  { name: 'Cash on delivery', src: '/images/footer/pay_cash.png', w: 25, h: 23 },
  { name: 'Mastercard', src: '/images/footer/pay_mastercard.png', w: 31, h: 25 },
  { name: 'Visa', src: '/images/footer/pay_visa.png', w: 26, h: 11 },
  { name: 'Verve', src: '/images/footer/pay_verve.png', w: 37, h: 15 },
];

function Heading({ children }: { children: React.ReactNode }) {
  return <h3 className="font-bold uppercase text-[13px] md:text-sm mb-3">{children}</h3>;
}

function LinkList({ links }: { links: string[] }) {
  return (
    <ul className="space-y-1">
      {links.map(link => (
        <li key={link}>
          <a href="#" className="hover:underline">{link}</a>
        </li>
      ))}
    </ul>
  );
}

export default function FooterLinks() {
  return (
    <div className="w-full bg-[#535357] text-[#f5f5f5] text-[13px] md:text-sm leading-snug">
      <div className="max-w-7xl mx-auto px-4 md:px-8 pt-6 md:pt-8 pb-4">
        {/* Link columns */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-8">
          <div>
            <Heading>Need Help?</Heading>
            <ul className="space-y-1">
              <li><a href="#" className="hover:underline text-[15px] md:text-base">Chat with us</a></li>
              <li><a href="#" className="hover:underline">Help Center</a></li>
              <li><a href="#" className="hover:underline">Contact Us</a></li>
            </ul>

            <div className="mt-6">
              <Heading>Useful Links</Heading>
              <LinkList links={USEFUL_LINKS} />
            </div>
          </div>

          <div>
            <Heading>About Jumia</Heading>
            <LinkList links={ABOUT_LINKS} />

            <div className="mt-6">
              <Heading>Privacy</Heading>
              <LinkList links={PRIVACY_LINKS} />
            </div>
          </div>

          <div>
            <Heading>Make Money With Jumia</Heading>
            <LinkList links={MAKE_MONEY_LINKS} />
          </div>

          <div>
            <Heading>Jumia International</Heading>
            <div className="grid grid-cols-2 gap-x-4 max-w-[200px]">
              {INTERNATIONAL.map((column, i) => (
                <LinkList key={i} links={column} />
              ))}
            </div>
          </div>
        </div>

        {/* Contact */}
        <div className="mt-10">
          <Heading>Contact Us</Heading>
          <dl className="space-y-1">
            {CONTACT.map(item => (
              <div key={item.label} className="flex gap-2.5">
                <dt className="text-[#a3a3a6] shrink-0">{item.label}</dt>
                <dd>{item.value}</dd>
              </div>
            ))}
          </dl>
        </div>

        {/* Socials + payment methods */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-8 mt-6">
          <div>
            <Heading>Join Us On</Heading>
            <div className="flex items-center gap-7 mt-6">
              {SOCIALS.map(social => (
                <a key={social.name} href="#" aria-label={social.name} className="hover:opacity-75 transition-opacity">
                  <img src={social.src} alt={social.name} width={social.w} height={social.h} />
                </a>
              ))}
            </div>
          </div>

          <div>
            <Heading>Payment Methods</Heading>
            <div className="flex items-center gap-6 mt-6">
              {PAYMENT_METHODS.map(method => (
                <img key={method.name} src={method.src} alt={method.name} title={method.name} width={method.w} height={method.h} />
              ))}
            </div>
          </div>
        </div>

        {/* Brand links */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-6 mt-10">
          <div className="grid grid-cols-2">
            <a href="#" className="hover:underline">ADIDAS</a>
            <a href="#" className="hover:underline">Nike</a>
          </div>
          <div>
            <a href="#" className="hover:underline">Samsung</a>
          </div>
        </div>

        {/* JumiaPay / Jumia Delivery */}
        <div className="border-t border-[#75757a] mt-16 pt-4 flex items-center justify-center gap-6">
          <a href="#" aria-label="JumiaPay">
            <img src="/images/footer/jumia_pay.png" alt="JumiaPay" width={47} height={15} />
          </a>
          <a href="#" aria-label="Jumia Delivery">
            <img src="/images/footer/jumia_delivery.png" alt="Jumia Delivery" width={92} height={13} />
          </a>
        </div>
      </div>
    </div>
  );
}

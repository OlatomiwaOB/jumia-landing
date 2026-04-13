'use client';
import Link from "next/link"
import Image from "next/image"
import { Facebook, Twitter, Linkedin, Instagram, Mail, Phone, MapPin, ArrowRight } from "lucide-react"
import logo from "@/components/images/direct-white-logo.png"
import { useState } from "react"
import playstore from "@/components/images/playstore.png"
import appstore from "@/components/images/appstore.png"

export default function Footer() {
  const currentYear = new Date().getFullYear()
  const quickLinks = [
    { name: "Home", href: "/home" },
    { name: "About Us", href: "/about" },
    { name: "Shop", href: "/shop" },
    // { name: "Blogs", href: "/blogs" },
    { name: "Privacy Policy", href: "/privacy" },
    { name: 'Terms and Conditions', href: '/terms-and-conditions'},
    { name: "Contact", href: "/contact" }
  ]
  
  const socialLinks = [
    { icon: Facebook, href: "https://web.facebook.com/profile.php?id=61575904361487", label: "Facebook" },
    { icon: Twitter, href: "https://x.com/fortitude", label: "Twitter" },
    { icon: Linkedin, href: "https://www.linkedin.com/in/fortitude-limited-21831a36b/", label: "LinkedIn" },
    { icon: Instagram, href: "https://www.instagram.com/fortitude/", label: "Instagram" },
  ]
  
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // console.log("Subscribed with:", email);
  };

  return (
    <footer className="bg-[#535357] text-white border-t border-gray-200 relative pt-24 px-6 md:px-8 lg:px-12 mt-14">
      <div className="absolute -top-24 left-0 right-0 mx-auto px-4">
        <div className="max-w-6xl md:flex gap-4 mx-auto p-6 bg-[#313133] items-center justify-center rounded-xl shadow-lg z-10">
          <div className="text-start mb-8 max-w-lg">
            <h2 className="text-xl md:text-2xl font-bold mb-3">
              Subscribe to our newsletter
            </h2>
            <p className="text-sm">
              Subscribe to our newsletter for exclusive updates, promotions, and exciting news delivered straight to your inbox!
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <div className="relative space-y-3 md:flex items-center gap-4">
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full md:w-[250px] lg:w-[450px] py-3 md:py-4 pl-12 pr-4 border border-gray-300 rounded-full bg-gray-100 focus:outline-none focus:ring-2 focus:ring-[#d8480b] text-black mt-2"
                  required
                />
                <button className="font-semibold hover:underline flex items-center gap-1 bg-[#d8480b] text-white py-3 md:py-4 px-7 rounded-3xl transition">
                  Subscribe <ArrowRight className="ml-1 h-4 w-4" />
                </button>
              </div>
            </div>
            
          </form>
        </div>
      </div>

      <div className="container mx-auto py-16 relative z-0">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 mt-20 md:mt-0">
          {/* Company Info */}
          <div className="space-y-6 ">
            <Link href="/" className="inline-block">
              <Image
                src={logo}
                alt="Fortitude Logo"
                width={100}
                height={60}
                className="h-10 w-auto"
                priority
              />
            </Link>
            <p className="text-gray-300">
              Fortitude is a leading ecommerce platform designed to help you shop better through seamless shopping experience, connecting you with the best 
              products and services available online.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-bold mb-6">Quick Links</h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link 
                    href={link.href} 
                    className="text-gray-300 hover:text-[#d8480b] transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-bold mb-6">Contact Us</h3>
            <ul className="space-y-4">
              <li className="flex items-start">
                <MapPin className="h-5 w-5 text-[#d8480b] mr-3 mt-1 flex-shrink-0" />
                <span className="text-gray-300">1706B Olubosi close, off akin adesola street via Bishop Oluwole Street, Victoria Island, Lagos state, Nigeria.</span>
              </li>
              <li className="flex items-center">
                <Phone className="h-5 w-5 text-[#d8480b] mr-3 flex-shrink-0" />
                <a 
                  href="tel:+2347078553444" 
                  className="text-gray-300 hover:text-[#d8480b] transition-colors"
                >
                  +234 707-855-3444
                </a>
              </li>
              <li className="flex items-center">
                <Mail className="h-5 w-5 text-[#d8480b] mr-3 flex-shrink-0" />
                <a 
                  href="mailto:info@fortitudeiot.com" 
                  className="text-gray-300 hover:text-[#d8480b] transition-colors"
                >
                  info@fortitudeiot.com
                </a>
              </li>
            </ul>
          </div>

          {/* Mobile App */}
          <div>
            <h3 className="text-lg font-bold mb-6">Get the App</h3>
            <p className="text-gray-300 mb-4">
              The best e-commerce app of the century for your daily needs!
            </p>
            <div className="space-y-3">
              <Image src={playstore} alt="Google Play Store" />
              <Image src={appstore} alt="Apple App Store"   />
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-[#646467] mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            Copyright &copy; {currentYear} Fortitude. All rights reserved.
          </p>
          
          <div className="mt-4 md:mt-0">
            <div className="flex space-x-4">
              {socialLinks.map((social) => (
                <Link 
                  key={social.label}
                  target="_blank" 
                  rel="noopener noreferrer"
                  href={social.href} 
                  className="text-gray-300 hover:text-[#d8480b] transition-colors"
                  aria-label={social.label}
                >
                  <social.icon className="h-5 w-5" />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
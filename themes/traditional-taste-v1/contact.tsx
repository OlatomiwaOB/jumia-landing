'use client';

import { useState, useEffect } from 'react';
import { Mail, Phone, MapPin, Send, Check, ChevronRight, Clock, Facebook, Instagram, Twitter } from 'lucide-react';
import Link from 'next/link';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setShowToast(true);
      setFormData({ name: '', phone: '', email: '', subject: '', message: '' });
    }, 1000);
  };

  useEffect(() => {
    if (showToast) {
      const timer = setTimeout(() => {
        setShowToast(false);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [showToast]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen bg-white">
      
      {/* Hero Section with Curved Bottom */}
      <div className="relative bg-[#111111] pt-24 pb-32 px-6">
        <div className="max-w-7xl mx-auto text-center relative z-10 flex flex-col items-center">
          <h1 className="text-5xl md:text-6xl font-serif font-bold text-white mb-6">Contact Us</h1>
          <p className="text-white/90 text-lg md:text-xl max-w-2xl mx-auto mb-8 font-light">
            Get in touch with Traditional Taste for a meal that takes you home
          </p>
          
          <div className="flex items-center gap-2 text-sm">
            <Link href="/" className="text-[#E35920] hover:text-[#ff7a45] transition-colors">Home</Link>
            <ChevronRight size={14} className="text-white/70" />
            <span className="text-white/70">Contact</span>
          </div>
        </div>
        
        {/* SVG Curved Wave at the bottom */}
        <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-[0] transform translate-y-[1px]">
          <svg viewBox="0 0 1440 120" className="w-full h-[60px] md:h-[120px] block" preserveAspectRatio="none">
            <path d="M0,60 C480,140 960,-20 1440,60 L1440,120 L0,120 Z" fill="#ffffff"></path>
          </svg>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-12 lg:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          
          {/* Contact Information (Left Column) */}
          <div className="bg-white rounded-3xl border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-8 md:p-12">
            <h2 className="text-4xl font-serif font-bold text-[#111] mb-12">Our Information</h2>
            
            <div className="space-y-10">
              <div className="flex items-start gap-6">
                <div className="w-14 h-14 rounded-xl bg-[#E35920]/10 flex items-center justify-center shrink-0">
                  <MapPin className="text-[#E35920] w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-[#111] text-lg mb-2">Address</h3>
                  <p className="text-gray-500 leading-relaxed">
                    123 High Street<br/>
                    London<br/>
                    United Kingdom
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-6">
                <div className="w-14 h-14 rounded-xl bg-[#E35920]/10 flex items-center justify-center shrink-0">
                  <Phone className="text-[#E35920] w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-[#111] text-lg mb-2">Phone</h3>
                  <p className="text-gray-500 leading-relaxed">
                    +1 (555) 123-4567
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-6">
                <div className="w-14 h-14 rounded-xl bg-[#E35920]/10 flex items-center justify-center shrink-0">
                  <Mail className="text-[#E35920] w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-[#111] text-lg mb-2">Email</h3>
                  <p className="text-gray-500 leading-relaxed">
                    hello@example.com
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-6">
                <div className="w-14 h-14 rounded-xl bg-[#E35920]/10 flex items-center justify-center shrink-0">
                  <Clock className="text-[#E35920] w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-[#111] text-lg mb-2">Business Hours</h3>
                  <p className="text-gray-500 leading-relaxed">
                    Mon - Fri: 9:00 AM - 6:00 PM<br/>
                    Saturday: 10:00 AM - 4:00 PM<br/>
                    Sunday: Closed
                  </p>
                </div>
              </div>
            </div>

            {/* Follow Us Section */}
            <div className="mt-12 pt-8 border-t border-gray-100">
              <h3 className="font-bold text-[#111] text-lg mb-4">Follow Us</h3>
              <div className="flex items-center gap-3">
                {/* Facebook */}
                <a href="#" className="w-12 h-12 rounded-xl bg-[#1877F2] text-white flex items-center justify-center hover:bg-[#166fe5] hover:-translate-y-1 transition-all duration-300 shadow-[0_4px_10px_rgba(24,119,242,0.2)]">
                  <Facebook size={20} />
                </a>
                
                {/* Instagram */}
                <a href="#" className="w-12 h-12 rounded-xl bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] text-white flex items-center justify-center hover:opacity-90 hover:-translate-y-1 transition-all duration-300 shadow-[0_4px_10px_rgba(220,39,67,0.2)]">
                  <Instagram size={20} />
                </a>
                
                {/* TikTok (Custom SVG) */}
                <a href="#" className="w-12 h-12 rounded-xl bg-black text-white flex items-center justify-center hover:bg-[#333333] hover:-translate-y-1 transition-all duration-300 shadow-[0_4px_10px_rgba(0,0,0,0.2)]">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1.04-.1z"/>
                  </svg>
                </a>
                
                {/* WhatsApp (Custom SVG) */}
                <a href="#" className="w-12 h-12 rounded-xl bg-[#25D366] text-white flex items-center justify-center hover:bg-[#128C7E] hover:-translate-y-1 transition-all duration-300 shadow-[0_4px_10px_rgba(37,211,102,0.2)]">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>

          {/* Contact Form (Right Column) */}
          <div className="bg-white rounded-3xl border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-8 md:p-12">
            <h2 className="text-4xl font-serif font-bold text-[#111] mb-10">Send Us a Message</h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label htmlFor="name" className="text-[15px] font-bold text-[#111] ml-1">Full Name *</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Your full name"
                    className="w-full bg-[#fafafa] border border-gray-100 text-gray-900 rounded-xl px-5 py-4 focus:outline-none focus:bg-white focus:border-[#E35920] focus:ring-1 focus:ring-[#E35920] transition-all placeholder:text-gray-400"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="phone" className="text-[15px] font-bold text-[#111] ml-1">Phone Number</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Your phone number"
                    className="w-full bg-[#fafafa] border border-gray-100 text-gray-900 rounded-xl px-5 py-4 focus:outline-none focus:bg-white focus:border-[#E35920] focus:ring-1 focus:ring-[#E35920] transition-all placeholder:text-gray-400"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="email" className="text-[15px] font-bold text-[#111] ml-1">Email Address *</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  className="w-full bg-[#fafafa] border border-gray-100 text-gray-900 rounded-xl px-5 py-4 focus:outline-none focus:bg-white focus:border-[#E35920] focus:ring-1 focus:ring-[#E35920] transition-all placeholder:text-gray-400"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="subject" className="text-[15px] font-bold text-[#111] ml-1">Subject *</label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  required
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder="What is this regarding?"
                  className="w-full bg-[#fafafa] border border-gray-100 text-gray-900 rounded-xl px-5 py-4 focus:outline-none focus:bg-white focus:border-[#E35920] focus:ring-1 focus:ring-[#E35920] transition-all placeholder:text-gray-400"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="message" className="text-[15px] font-bold text-[#111] ml-1">Message</label>
                <textarea
                  id="message"
                  name="message"
                  required
                  rows={5}
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Write your message here..."
                  className="w-full bg-[#fafafa] border border-gray-100 text-gray-900 rounded-xl px-5 py-4 focus:outline-none focus:bg-white focus:border-[#E35920] focus:ring-1 focus:ring-[#E35920] transition-all placeholder:text-gray-400 resize-none"
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full mt-4 bg-[#E35920] text-white font-bold px-10 py-4 rounded-full shadow-[0_10px_20px_rgba(227,89,32,0.3)] hover:bg-[#c44920] hover:shadow-[0_15px_30px_rgba(227,89,32,0.4)] transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                  <>
                    <span>Send Message</span>
                    <Send size={18} />
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Find Us Map Section */}
        <div className="mt-20">
          <h2 className="text-4xl font-serif font-bold text-[#111] text-center mb-10">Find Us</h2>
          <div className="w-full h-[450px] rounded-3xl overflow-hidden border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] relative bg-gray-50">
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d158858.47340002624!2d-0.24168120610998394!3d51.5285582!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47d8a00baf21de75%3A0x52963a5addd52a99!2sLondon%2C%20UK!5e0!3m2!1sen!2sus!4v1700000000000!5m2!1sen!2sus" 
              width="100%" 
              height="100%" 
              style={{ border: 0 }} 
              allowFullScreen={false} 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade"
              title="Find Us Map"
              className="absolute inset-0"
            ></iframe>
          </div>
        </div>
      </div>

      {/* Success Toast Notification */}
      <div 
        className={`fixed bottom-10 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 bg-[#111111] text-white px-8 py-4 rounded-full shadow-[0_20px_50px_rgba(0,0,0,0.15)] border border-white/10 transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${
          showToast ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-90 translate-y-8 pointer-events-none'
        }`}
      >
        <div className="bg-[#25D366] text-white p-1.5 rounded-full">
          <Check size={16} strokeWidth={4} />
        </div>
        <span className="font-bold text-base">Message sent successfully! We'll be in touch soon.</span>
      </div>

    </div>
  );
}

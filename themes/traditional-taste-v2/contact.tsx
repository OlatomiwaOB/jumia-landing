'use client';


import { clientConfig, getClientIdentifiers } from '@/config/client-config';
import React, { useState } from 'react';
import Link from 'next/link';
import { MapPin, Phone, Mail, Clock, Navigation, Loader2 } from 'lucide-react';

export default function ContactPage() {
  const envColor = clientConfig().branding.colors.accentForeground;
  const bgColor = envColor ? (envColor.startsWith('#') ? envColor : `#${envColor}`) : '#FAFAF9';
  const primaryColor = clientConfig().branding.colors.accent
    ? `#${clientConfig().branding.colors.accent}`
    : "#F97316";

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    subject: '',
    message: ''
  });
  const [privacyAgreed, setPrivacyAgreed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!privacyAgreed) {
      alert('Please agree to the Privacy Policy before sending your message.');
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      const payload = {
        ...formData,
        entityCode: getClientIdentifiers().entityCode
      };

      const endpoint = `${process.env.NEXT_PUBLIC_REACT_APP_API_URL}/customer-info/send-contactus-mail`;

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        setSubmitStatus('success');
        setFormData({ fullName: '', email: '', phoneNumber: '', subject: '', message: '' });
        setPrivacyAgreed(false);
      } else {
        setSubmitStatus('error');
      }
    } catch (err) {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen font-sans pt-8 md:pt-12 pb-16 md:pb-24" style={{ backgroundColor: bgColor }}>
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">

        {/* Top Header Section */}
        <div className="flex flex-col items-center text-center mb-12">

          <h1 className="text-3xl md:text-5xl font-extrabold text-gray-900 mb-4 tracking-tight leading-tight">
            Contact Us
          </h1>

          <p id="contact-instructions" className="text-[15px] md:text-[16px] text-gray-600 max-w-2xl mx-auto scroll-mt-24">
            Please use the below form. You can also call customer service on 07721542823.
          </p>
        </div>

        {/* Map Section */}
        <div className="w-full h-[250px] md:h-[450px] rounded-[20px] overflow-hidden shadow-sm border border-gray-100 mb-12 md:mb-16 relative group">
          <iframe
            src="https://maps.google.com/maps?q=87+Barn+Meadow,+Bamber+Bridge,+Preston+PR5+8EA&t=&z=13&ie=UTF8&iwloc=&output=embed"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen={true}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Location Map"
            className="absolute inset-0"
          ></iframe>

          {/* Get Directions Button Overlay */}
          <a
            href="https://www.google.com/maps/dir/?api=1&destination=87+Barn+Meadow,+Bamber+Bridge,+Preston+PR5+8EA"
            target="_blank"
            rel="noopener noreferrer"
            className="absolute bottom-4 right-4 md:bottom-6 md:right-6 bg-[var(--color-primary)] text-white font-bold px-4 py-2.5 md:px-6 md:py-3 text-[14px] md:text-[16px] rounded-lg md:rounded-xl shadow-xl hover:opacity-90 flex items-center gap-2 transition-transform hover:scale-105 z-10"
          >
            <Navigation className="w-5 h-5" />
            Get Directions
          </a>
        </div>

        {/* Two Column Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">

          {/* Left Column: Support Info */}
          <div className="flex flex-col bg-gray-50/50 p-6 md:p-12 rounded-2xl md:rounded-3xl border border-gray-100 shadow-sm">
            <h2 className="text-[24px] md:text-[28px] font-extrabold text-gray-900 mb-3 md:mb-4">Get In Touch</h2>
            <p className="text-[15px] text-gray-600 mb-10 leading-relaxed">
              Have a question about our menu, a catering order, or just want to say hi? We're always here to help.
            </p>

            {/* Support Items */}
            <div className="space-y-8">
              <div className="flex gap-5">
                <div className="w-12 h-12 rounded-full bg-[var(--color-primary)]/10 flex items-center justify-center shrink-0">
                  <Phone className="w-5 h-5 text-[var(--color-primary)]" />
                </div>
                <div>
                  <h3 className="text-[16px] font-bold text-gray-900 mb-1">Customer Care</h3>
                  <div className="text-[15px] text-gray-600 space-y-1.5">
                    <p className="hover:text-[var(--color-primary)] cursor-pointer transition-colors">07721542823</p>
                    <p className="hover:text-[var(--color-primary)] cursor-pointer transition-colors">Traditionaltasteuk@gmail.com</p>
                  </div>
                </div>
              </div>

              <div className="flex gap-5">
                <div className="w-12 h-12 rounded-full bg-[var(--color-primary)]/10 flex items-center justify-center shrink-0">
                  <Clock className="w-5 h-5 text-[var(--color-primary)]" />
                </div>
                <div>
                  <h3 className="text-[16px] font-bold text-gray-900 mb-1">Opening Hours</h3>
                  <div className="text-[15px] text-gray-600 space-y-1.5">
                    <p>Everyday: 9:00 AM - 5:00 PM</p>
                  </div>
                </div>
              </div>

              <div className="flex gap-5">
                <div className="w-12 h-12 rounded-full bg-[var(--color-primary)]/10 flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5 text-[var(--color-primary)]" />
                </div>
                <div>
                  <h3 className="text-[16px] font-bold text-gray-900 mb-1">Our Location</h3>
                  <div className="text-[15px] text-gray-600 space-y-1.5">
                    <p>87 Barn Meadow, Bamber Bridge</p>
                    <p>Preston PR5 8EA</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Contact Form */}
          <div className="flex flex-col pt-4 md:pt-8 lg:px-6">
            <h2 className="text-[28px] font-extrabold text-gray-900 mb-4">Send a Message</h2>
            <p className="text-[15px] text-gray-600 mb-8 leading-relaxed">
              Please submit all general enquiries in the contact form below and we will get back to you as soon as possible.
            </p>

            <form className="flex flex-col space-y-5" onSubmit={handleSubmit}>
              {submitStatus === 'success' && (
                <div className="p-4 bg-green-50 text-green-700 rounded-xl border border-green-200 text-[14px]">
                  Thank you! Your message has been sent successfully.
                </div>
              )}
              {submitStatus === 'error' && (
                <div className="p-4 bg-red-50 text-red-700 rounded-xl border border-red-200 text-[14px]">
                  Oops! Something went wrong. Please try again later.
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <input
                  type="text"
                  placeholder="Your Full Name"
                  required
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="w-full px-5 py-4 rounded-xl border border-gray-200 text-[14px] text-gray-800 focus:outline-none focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)] transition-all placeholder:text-gray-400 bg-gray-50/50 hover:bg-white"
                />
                <input
                  type="email"
                  placeholder="Your Email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-5 py-4 rounded-xl border border-gray-200 text-[14px] text-gray-800 focus:outline-none focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)] transition-all placeholder:text-gray-400 bg-gray-50/50 hover:bg-white"
                />
                <input
                  type="tel"
                  placeholder="Your Phone Number"
                  required
                  value={formData.phoneNumber}
                  onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                  className="w-full px-5 py-4 rounded-xl border border-gray-200 text-[14px] text-gray-800 focus:outline-none focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)] transition-all placeholder:text-gray-400 bg-gray-50/50 hover:bg-white"
                />
                <input
                  type="text"
                  placeholder="Subject"
                  required
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="w-full px-5 py-4 rounded-xl border border-gray-200 text-[14px] text-gray-800 focus:outline-none focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)] transition-all placeholder:text-gray-400 bg-gray-50/50 hover:bg-white"
                />
              </div>

              <textarea
                placeholder="How can we help you?"
                rows={6}
                required
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="w-full px-5 py-4 rounded-xl border border-gray-200 text-[14px] text-gray-800 focus:outline-none focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)] transition-all placeholder:text-gray-400 resize-none bg-gray-50/50 hover:bg-white"
              ></textarea>

              <div className="flex items-center gap-3 pt-2">
                <div className="relative flex items-center">
                  <input
                    type="checkbox"
                    id="privacy-policy"
                    checked={privacyAgreed}
                    onChange={(e) => setPrivacyAgreed(e.target.checked)}
                    className="w-[18px] h-[18px] border-gray-300 rounded-[4px] text-gray-800 focus:ring-[var(--color-primary)] cursor-pointer appearance-none border checked:bg-[var(--color-primary)] checked:border-[var(--color-primary)] relative transition-all peer"
                  />
                  <svg className="absolute w-[12px] h-[12px] left-[3px] top-[3px] text-white pointer-events-none opacity-0 peer-checked:opacity-100" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <label htmlFor="privacy-policy" className="text-[14px] text-gray-600 cursor-pointer select-none">
                  I agree to the <a href="#contact-instructions" onClick={(e) => e.stopPropagation()} className="font-bold text-[var(--color-primary)] hover:underline underline-offset-2 transition-all">Privacy Policy</a>.
                </label>
              </div>

              <div className="pt-6">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full md:w-auto px-10 py-4 bg-[var(--color-primary)] hover:opacity-90 text-white font-bold text-[15px] rounded-xl transition-all duration-300 shadow-md hover:shadow-lg flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <Mail className="w-5 h-5" />
                  )}
                  {isSubmitting ? 'Sending...' : 'Send Message'}
                </button>
              </div>
            </form>
          </div>

        </div>

      </div>
    </div>
  );
}

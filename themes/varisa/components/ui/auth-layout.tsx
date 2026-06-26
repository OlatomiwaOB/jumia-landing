import React from 'react';
import Image from 'next/image';
import { AuthLayoutProps } from '@/components/shared/default-auth-layout';
import { clientConfig } from '@/config/client-config';

export default function VarisaAuthLayout({
  children,
  title,
  subtitle,
  footerNode,
  leftPanelTitle,
  leftPanelSubtitle,
}: AuthLayoutProps) {
  const currentYear = new Date().getFullYear();
  const clientName = clientConfig().branding.clientName || 'Varisa';
  const logo =
    clientConfig().branding.logos.primary ||
    'https://mmcpdocs.s3.eu-west-2.amazonaws.com/80254_varisa.jpeg';

  return (
    <div className="min-h-screen relative flex items-center justify-center bg-[#FAFAFA] overflow-hidden p-4 sm:p-8">
      {/* CSS Pattern Background for Varisa (Elegant radial gradients / mesh) */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-20%] left-[-10%] w-[70%] h-[70%] rounded-full opacity-[0.15] blur-[100px] bg-[var(--accent)]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] rounded-full opacity-[0.1] blur-[120px] bg-[var(--accent)]" />
        <div 
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `radial-gradient(#000 1px, transparent 1px)`,
            backgroundSize: '30px 30px'
          }}
        />
      </div>

      <div className="relative z-10 w-full max-w-[1000px] bg-white/80 backdrop-blur-xl border border-white/40 shadow-2xl rounded-3xl overflow-hidden flex flex-col lg:flex-row">
        
        {/* Left Side Branding */}
        <div className="lg:w-5/12 bg-[var(--accent)]/5 border-r border-gray-100 p-10 flex flex-col justify-between hidden lg:flex relative overflow-hidden">
          {/* Subtle accent overlay */}
          <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-b from-white/20 to-transparent pointer-events-none" />
          
          <div className="relative z-10">
            <Image
              src={logo}
              alt="Logo"
              width={180}
              height={60}
              className="max-w-[180px] h-auto object-contain filter drop-shadow-sm mb-12"
            />
            {leftPanelTitle ? (
              <h2 className="text-4xl font-light text-gray-800 mb-4 leading-tight">
                {leftPanelTitle}
              </h2>
            ) : (
              <h2 className="text-4xl font-light text-gray-800 mb-4 leading-tight">
                Welcome to <span className="font-semibold text-[var(--accent)]">{clientName}.</span>
              </h2>
            )}
            {leftPanelSubtitle && (
              <p className="text-gray-500 text-lg leading-relaxed">{leftPanelSubtitle}</p>
            )}
          </div>

          <div className="relative z-10 text-xs text-gray-400 mt-12">
            © {currentYear} {clientName}. All Rights Reserved.
          </div>
        </div>

        {/* Right Side Form */}
        <div className="flex-1 p-8 sm:p-12 flex flex-col justify-center bg-white relative">
          {/* Mobile Logo */}
          <div className="lg:hidden flex justify-center mb-8">
            <Image
              src={logo}
              alt="Logo"
              width={140}
              height={50}
              className="max-w-[140px] h-auto object-contain filter drop-shadow-sm"
            />
          </div>

          <div className="w-full max-w-sm mx-auto space-y-8">
            {(title || subtitle) && (
              <div className="space-y-2 text-left mb-8">
                {title && <h1 className="text-3xl font-bold text-gray-900 tracking-tight">{title}</h1>}
                {subtitle && <p className="text-gray-500 text-sm">{subtitle}</p>}
              </div>
            )}

            <div>{children}</div>

            {footerNode && <div className="pt-6 border-t border-gray-50 mt-8 text-center">{footerNode}</div>}
          </div>
          
          {/* Mobile Footer */}
          <div className="lg:hidden mt-8 text-center text-xs text-gray-400">
            © {currentYear} {clientName}. All Rights Reserved.
          </div>
        </div>
      </div>
    </div>
  );
}

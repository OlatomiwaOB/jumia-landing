import React from 'react';
import Image from 'next/image';
import { AuthLayoutProps } from '@/components/shared/default-auth-layout';
import { clientConfig } from '@/config/client-config';

export default function TraditionalTasteAuthLayout({
  children,
  title,
  subtitle,
  footerNode,
  leftPanelTitle,
  leftPanelSubtitle,
}: AuthLayoutProps) {
  const currentYear = new Date().getFullYear();
  const clientName = clientConfig().branding.clientName || 'Traditional Taste';
  const logo =
    clientConfig().branding.logos.primary ||
    'https://mmcpdocs.s3.eu-west-2.amazonaws.com/80254_varisa.jpeg';

  return (
    <div className="min-h-screen flex flex-col-reverse lg:flex-row bg-[#FFFDF9]">
      {/* Left Side Form */}
      <div className="flex-1 flex items-center justify-center py-10 px-6 sm:px-12 bg-white relative shadow-[10px_0_30px_rgba(0,0,0,0.02)] z-10">
        <div className="w-full max-w-md space-y-8 relative">
          {/* Logo on mobile only */}
          <div className="lg:hidden mb-8 flex justify-center">
            <Image src={logo} alt="Logo" width={140} height={50} className="object-contain" />
          </div>

          {(title || subtitle) && (
            <div className="space-y-3 text-left">
              {title && <h1 className="text-3xl font-serif text-[#333] tracking-tight">{title}</h1>}
              {subtitle && <p className="text-[#666] text-base">{subtitle}</p>}
            </div>
          )}

          <div>{children}</div>

          {footerNode && <div className="text-center pt-8">{footerNode}</div>}

          <div className="text-center w-full text-xs text-[#A0A0A0] pt-10">
            © {currentYear} {clientName}. All Rights Reserved.
          </div>
        </div>
      </div>

      {/* Right Side Pattern Background (Traditional Taste Vibe) */}
      <div className="h-[30vh] lg:min-h-screen lg:sticky lg:top-0 lg:bottom-0 lg:w-1/2 relative overflow-hidden bg-[var(--accent)] flex flex-col justify-center p-12">
        {/* CSS Pattern: Subtle Diagonal Lines / Tartan-esque feel or soft waves */}
        <div
          className="absolute inset-0 opacity-10 pointer-events-none"
          style={{
            backgroundImage: `repeating-linear-gradient(45deg, #000 0, #000 2px, transparent 2px, transparent 12px)`
          }}
        />
        <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-b from-black/20 to-transparent pointer-events-none" />

        <div className="relative z-10 max-w-lg hidden lg:block">
          <div className="bg-white p-4 rounded-xl inline-block mb-10 shadow-lg">
            <Image
              src={logo}
              alt="Logo"
              width={160}
              height={50}
              className="max-w-[160px] h-auto object-contain filter drop-shadow-sm"
            />
          </div>

          {leftPanelTitle ? (
            <h2 className="text-5xl font-serif text-white mb-6 leading-tight drop-shadow-md">
              {leftPanelTitle}
            </h2>
          ) : (
            <h2 className="text-5xl font-serif text-white mb-6 leading-tight drop-shadow-md">
              Welcome to <br /><span className="font-bold">{clientName}.</span>
            </h2>
          )}
          {leftPanelSubtitle && (
            <p className="text-white/90 text-xl font-light leading-relaxed drop-shadow-sm">{leftPanelSubtitle}</p>
          )}
        </div>
      </div>
    </div>
  );
}

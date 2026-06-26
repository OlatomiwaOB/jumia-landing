import React from 'react';
import Image from 'next/image';
import { clientConfig } from '@/config/client-config';

export interface AuthLayoutProps {
  children: React.ReactNode;
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  footerNode?: React.ReactNode;
  leftPanelTitle?: React.ReactNode;
  leftPanelSubtitle?: React.ReactNode;
}

export default function DefaultAuthLayout({
  children,
  title,
  subtitle,
  footerNode,
  leftPanelTitle,
  leftPanelSubtitle,
}: AuthLayoutProps) {
  const currentYear = new Date().getFullYear();
  const { branding } = clientConfig();
  const clientName = branding.clientName;
  const logo = branding.logos.primary;

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-white">
      {/* Left Side: Creative Brand-Agnostic Graphic */}
      <div className="h-screen hidden lg:flex lg:w-1/2 relative overflow-hidden bg-[#1A1D23]">
        {/* Abstract shapes using the accent color */}
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full opacity-20 blur-3xl bg-[var(--accent)] pointer-events-none" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] rounded-full opacity-30 blur-3xl bg-[var(--accent)] pointer-events-none" />

        {/* Subtle grid pattern overlay */}
        <div
          className="absolute inset-0 opacity-10 pointer-events-none"
          style={{
            backgroundImage: `linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)`,
            backgroundSize: '40px 40px',
          }}
        />

        <div className="relative z-10 p-10 flex flex-col h-full justify-between w-full">
          <div>
            <Image
              src={logo}
              alt="Logo"
              width={150}
              height={50}
              className="max-w-[200px] h-auto object-contain filter drop-shadow-md"
            />
          </div>

          <div className="max-w-md">
            {leftPanelTitle ? (
              <h2 className="text-4xl font-light text-white mb-4 leading-tight">
                {leftPanelTitle}
              </h2>
            ) : (
              <h2 className="text-4xl font-light text-white mb-4 leading-tight">
                Welcome to <span className="font-semibold text-[var(--accent)]">{clientName}.</span>
              </h2>
            )}
            {leftPanelSubtitle && (
              <p className="text-gray-400 text-lg">{leftPanelSubtitle}</p>
            )}
          </div>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center py-6 sm:px-6 lg:px-12 bg-white">
        <div className="w-full max-w-md space-y-10 relative">
          {(title || subtitle) && (
            <div className="space-y-2 text-left">
              {title && <h1 className="text-3xl font-semibold text-dark-gray tracking-tight">{title}</h1>}
              {subtitle && <p className="text-medium-gray text-base">{subtitle}</p>}
            </div>
          )}

          <div>{children}</div>

          {footerNode && <div className="text-center pt-6">{footerNode}</div>}
        </div>

        <div className="fixed bottom-4 text-center w-full lg:w-1/2 right-0 text-xs text-[#9E9E9E] pointer-events-none">
          © {currentYear} {clientName}. All Right Reserved
        </div>
      </div>
    </div>
  );
}

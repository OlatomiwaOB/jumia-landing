import Header from "./components/layout/header"
import Footer from "./components/layout/footer";
import Providers from './providers'
import { Suspense } from "react";
import { clientConfig } from '@/config/client-config';

export default function TraditionalTasteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div 
      className="min-h-screen font-sans"
      style={{
        '--color-primary': clientConfig().branding.colors.accent ? `#${clientConfig().branding.colors.accent}` : '#F97316',
        '--color-foreground': clientConfig().branding.colors.accentForeground ? `#${clientConfig().branding.colors.accentForeground}` : '#FFFFFF',
        '--color-text': clientConfig().branding.colors.accent ? `#${clientConfig().branding.colors.accent}` : '#1C1917',
        '--color-bg-main': clientConfig().branding.colors.accentForeground ? `#${clientConfig().branding.colors.accentForeground}` : '#FAFAF9',
        '--color-bg-secondary': clientConfig().branding.colors.accentColor2 ? `#${clientConfig().branding.colors.accentColor2}` : '#FFEDD5',
        backgroundColor: 'var(--color-bg-main)',
        color: 'var(--color-text)'
      } as React.CSSProperties}
    >
      <Providers>
        <div className="pb-[65px] lg:pb-0">
          <Suspense fallback={<div className="h-20 bg-[var(--color-bg-main)]"></div>}>
            <Header />
            {children}
            <Footer />
          </Suspense>
        </div>
      </Providers>
    </div>
  );
}

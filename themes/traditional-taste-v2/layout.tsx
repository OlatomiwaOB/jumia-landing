import Header from "./components/layout/header"
import Footer from "./components/layout/footer";
import Providers from './providers'
import { Suspense } from "react";

export default function TraditionalTasteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div 
      className="min-h-screen font-sans"
      style={{
        '--color-primary': process.env.NEXT_PUBLIC_ACCENT_COLOR ? `#${process.env.NEXT_PUBLIC_ACCENT_COLOR}` : '#F97316',
        '--color-foreground': process.env.NEXT_PUBLIC_ACCENT_FOREGROUND_COLOR ? `#${process.env.NEXT_PUBLIC_ACCENT_FOREGROUND_COLOR}` : '#FFFFFF',
        '--color-text': process.env.NEXT_PUBLIC_TEXT_CHARCOAL ? `#${process.env.NEXT_PUBLIC_TEXT_CHARCOAL}` : '#1C1917',
        '--color-bg-main': process.env.NEXT_PUBLIC_BG_OFF_WHITE ? `#${process.env.NEXT_PUBLIC_BG_OFF_WHITE}` : '#FAFAF9',
        '--color-bg-secondary': process.env.NEXT_PUBLIC_BG_PEACH ? `#${process.env.NEXT_PUBLIC_BG_PEACH}` : '#FFEDD5',
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

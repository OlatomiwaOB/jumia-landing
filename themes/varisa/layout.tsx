import Header from "./components/layout/header"
import Footer from "./components/layout/footer";
import Providers from './providers'
import { Suspense } from "react";
export default function VarisaLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="bg-accent-foreground min-h-screen font-sans">
      <Providers>
        <div className="flex flex-col min-h-screen">
          <Suspense fallback={<div className="h-16 bg-white shadow-sm w-full"></div>}>
            <Header />
            <main className="flex-grow">
              {children}
            </main>
            <Footer />
          </Suspense>
        </div>
      </Providers>
    </div>
  );
}

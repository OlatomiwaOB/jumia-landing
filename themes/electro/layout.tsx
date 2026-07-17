import Header from "./components/layout/header"
import Footer from "./components/layout/footer";
import Providers from './providers'
import { Suspense } from "react";

export default function ElectroLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="bg-black min-h-screen font-sans">
      <Providers>
        <div>
          <Suspense fallback={<div className="h-20 bg-white"></div>}>
            <Header />
            {children}
            <Footer />
          </Suspense>
        </div>
      </Providers>
    </div>
  );
}

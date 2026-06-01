import Header from "./components/layout/header"
import Footer from "./components/layout/footer";
import FloatingWhatsApp from "./components/layout/floating-whatsapp";
import Providers from './providers'
import { Suspense } from "react";

export default function DepotLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="bg-[#f9f9f9] min-h-screen font-sans">
      <Providers>
        <div>
          <Suspense fallback={<div className="h-20 bg-white"></div>}>
            <Header />
            {children}
            <Footer />
            <FloatingWhatsApp />
          </Suspense>
        </div>
      </Providers>
    </div>
  );
}

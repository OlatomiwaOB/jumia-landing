import Footer from "./components/layout/footer";
import Providers from '../depot/providers' // Reusing the same providers
import { Suspense } from "react";
import Header from "./components/layout/header";

export default function FortitudeLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="bg-white min-h-screen font-sans">
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

import Header from "./layout/header"
import Footer from "./layout/footer"
import Providers from './providers'
import { Suspense } from "react";

export default function AppLayoutFortitude({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
      <Providers>
        <div>
          <Suspense fallback={<div className="h-20 bg-white"></div>}>
            <Header />
          </Suspense>
          {children}
          <Footer />
        </div>
      </Providers>
    </div>
  );
}
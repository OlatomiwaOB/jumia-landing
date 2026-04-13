import Header from "./components/header"
import Footer from "./components/footer";
import { ReactNode, Suspense } from "react";

export default function FortitudeLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="bg-[#f3f4f6] min-h-screen">
      <Suspense fallback={<div className="h-20 bg-[#313133]"></div>}>
        <Header />
        {children}
        <Footer />
      </Suspense>
    </div>
  );
}

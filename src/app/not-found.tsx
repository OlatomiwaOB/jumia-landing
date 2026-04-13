import { Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
// import Header from '@/../fortitude-app/layout/header';
// import Footer from '@/../fortitude-app/layout/footer';
import notFound from "@/components/images/not-found.png"


function NotFoundContent() {
  return (
    <>
      {/* <Header /> */}
      <div className="min-h-screen flex items-center justify-center bg-gray-50 mb-8">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">page not found/being cooked 🧑‍🍳</h2>
          <Image
            src={notFound || "/placeholder-image.png"}
            alt="404 Image"
            className="h-[400px] w-auto"
          />
          <p className="text-gray-600 mt-4">
            Sorry, we couldn't find the page you're looking for.
          </p>
          <div className='my-8'>
            <Link
              href="/"
              className="bg-[#d8480b] text-white px-6 py-3 rounded-lg hover:bg-accent/80 transition-colors"
            >
              Go Back Home
            </Link>
          </div>
        </div>
      </div>
      {/* <Footer /> */}
    </>
  );
}

export default function NotFound() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse">Loading...</div>
      </div>
    }>
      <NotFoundContent />
    </Suspense>
  );
}
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Shield, Users2, Award, Target, Handshake, ShoppingCart, CreditCard, Zap, Globe, BarChart3, Users, BriefcaseBusiness } from "lucide-react";
// import FadeIn from "@/components/animations/fade-in";
import About from "@/components/images/about-fortitude.jpg"; // You'll need to add an appropriate image
import About2 from "@/components/images/about2-fortitude.jpg";
import Header from "../../../fortitude-app/layout/header";
import Footer from "../../../fortitude-app/layout/footer";
import { Suspense } from "react";
import Link from "next/link";

export default function AboutPage() {
  return (
    <>
      <Suspense>
        <Header />


        {/* Hero Section */}
        <section className="text-accent-foreground bg-gray-100 py-10 px-5">
          <div className="container-custom">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                About Fortitude Direct
              </h1>
              <p className="text-xl">
                Revolutionizing ecommerce with innovative shopping experiences and seamless payment solutions
              </p>
            </div>
          </div>
        </section>

        {/* Company Overview */}
        <section className="px-5 py-20 bg-white">
          <div className="container mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                {/* <FadeIn direction="left"> */}
                <div className="">
                  <h2 className="text-3xl font-bold mb-6">Our Story</h2>
                  <p className="text-lg text-gray-600 leading-relaxed">
                    Fortitude Direct was founded with a vision to transform the ecommerce landscape in Africa and beyond.
                    We recognized the need for a comprehensive digital marketplace that not only offers a wide range of products
                    but also integrates financial services and innovative payment solutions.
                  </p>
                  <p className="text-lg text-gray-600 leading-relaxed mt-4">
                    Our platform brings together the best of online shopping, financial services, and digital solutions
                    in one seamless experience. From everyday goods to flight tickets, from crypto payments to buy now,
                    pay later options - we're building the future of commerce today.
                  </p>
                </div>
                {/* </FadeIn> */}
              </div>
              {/* <FadeIn direction="right"> */}
              <div className="relative h-[300px] md:h-[500px] rounded-lg overflow-hidden shadow-lg">
                <Image
                  src={About}
                  alt="Fortitude Direct Ecommerce Platform"
                  fill
                  className="object-cover"
                />
              </div>
              {/* </FadeIn> */}
            </div>
          </div>
        </section>


        {/* Mission & Vision */}
        <section className="px-5 py-20 bg-gray-100">
          <div className="container mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="bg-white rounded-lg shadow-lg p-8 border border-gray-100">
                <div className="flex items-center mb-4">
                  <Target className="h-8 w-8 text-accent mr-3" />
                  <h2 className="text-3xl font-bold">Our Vision</h2>
                </div>
                <p className="text-lg text-gray-600">
                  To become Africa's leading digital marketplace that seamlessly integrates ecommerce,
                  financial services, and innovative payment solutions for everyone.
                </p>
              </div>

              <div className="bg-white rounded-lg shadow-lg p-8 border border-gray-100">
                <div className="flex items-center mb-4">
                  <Zap className="h-8 w-8 text-accent mr-3" />
                  <h2 className="text-3xl font-bold">Our Mission</h2>
                </div>
                <p className="text-lg text-gray-600">
                  To empower businesses and consumers with a comprehensive platform that simplifies online shopping,
                  financial transactions, and digital service access through cutting-edge technology and user-friendly experiences.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* What We Offer */}
        <section className="py-20 px-5 bg-white">
          <div className="container mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">What We Offer</h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Fortitude Direct provides a comprehensive ecosystem designed to meet all your shopping and financial needs
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  icon: <ShoppingCart className="h-10 w-10 text-accent" />,
                  title: "Digital Marketplace",
                  description: "A vast selection of products across categories with seamless shopping experience and fast delivery options."
                },
                {
                  icon: <CreditCard className="h-10 w-10 text-accent" />,
                  title: "Financial Services",
                  description: "Airtime top-ups, bill payments, money transfers, and withdrawals all in one convenient platform."
                },
                {
                  icon: <Globe className="h-10 w-10 text-accent" />,
                  title: "Digital Services",
                  description: "Flight tickets, event bookings, and other digital services accessible from anywhere at any time."
                },
                {
                  icon: <BarChart3 className="h-10 w-10 text-accent" />,
                  title: "Crypto Payments",
                  description: "Secure cryptocurrency payment options for modern shoppers who prefer digital currency transactions."
                },
                {
                  icon: <Handshake className="h-10 w-10 text-accent" />,
                  title: "BNPL Solutions",
                  description: "Flexible buy now, pay later options that make shopping more accessible and budget-friendly."
                },
                {
                  icon: <Users className="h-10 w-10 text-accent" />,
                  title: "Dual Dashboards",
                  description: "Customized interfaces for both customers and store owners with analytics, inventory management, and sales tracking."
                }
              ].map((feature, index) => (
                //   <FadeIn key={index} direction="up" delay={index * 0.1}>
                <div className="bg-white rounded-lg shadow-md p-6 border border-gray-100 hover:shadow-lg transition-all duration-300 h-full">
                  <div className="mb-4">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
                //   </FadeIn>
              ))}
            </div>
          </div>
        </section>

        {/* Our Values */}
        <section className="px-5 py-20 bg-gray-100">
          <div className="container mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Values</h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                The principles that guide everything we do at Fortitude Direct
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-8">
              {[
                {
                  icon: <Users className="h-8 w-8 text-accent" />,
                  title: "Customer First",
                  description: "We prioritize our customers' needs and continuously innovate to enhance their shopping and payment experience."
                },
                {
                  icon: <Shield className="h-8 w-8 text-accent" />,
                  title: "Security & Trust",
                  description: "We implement robust security measures to protect our users' data and transactions, building trust through transparency."
                },
                {
                  icon: <Award className="h-8 w-8 text-accent" />,
                  title: "Innovation",
                  description: "We embrace cutting-edge technology to deliver forward-thinking solutions that anticipate market needs."
                },
                {
                  icon: <Handshake className="h-8 w-8 text-accent" />,
                  title: "Accessibility",
                  description: "We believe in making ecommerce and financial services accessible to everyone, regardless of their technical expertise."
                }
              ].map((value, index) => (
                //   <FadeIn key={index} direction="up" delay={index * 0.1}>
                <div className="flex bg-accent-foreground rounded-2xl shadow-md p-6 border border-accent hover:shadow-lg transition-all duration-300 h-full">
                  <div className="flex-shrink-0 mt-1">{value.icon}</div>
                  <div className="ml-4">
                    <h3 className="text-xl font-bold mb-2 text-white">{value.title}</h3>
                    <p className="text-gray-600 text-white">{value.description}</p>
                  </div>
                </div>
                //   </FadeIn>
              ))}
            </div>
          </div>
        </section>


        {/* Technology Section */}
        <section className="px-5 py-20 bg-white">
          <div className="container mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              {/* <FadeIn direction="left"> */}
              <div className="relative h-[250px] md:h-[500px] rounded-lg overflow-hidden shadow-lg">
                <Image
                  src={About2} // Replace with actual tech image
                  alt="Fortitude Direct Technology"
                  fill
                  className="object-cover"
                />
              </div>
              {/* </FadeIn> */}

              {/* <FadeIn direction="right"> */}
              <div className="space-y-6">
                <h2 className="text-3xl font-bold">Our Technology</h2>
                <p className="text-lg text-gray-600">
                  Fortitude Direct is built on a robust, scalable technology stack that ensures:
                </p>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <div className="flex-shrink-0 h-5 w-5 text-accent mt-1">•</div>
                    <p className="ml-2 text-gray-600">Lightning-fast page loads and seamless navigation</p>
                  </li>
                  <li className="flex items-start">
                    <div className="flex-shrink-0 h-5 w-5 text-accent mt-1">•</div>
                    <p className="ml-2 text-gray-600">Bank-level security for all transactions</p>
                  </li>
                  <li className="flex items-start">
                    <div className="flex-shrink-0 h-5 w-5 text-accent mt-1">•</div>
                    <p className="ml-2 text-gray-600">Intuitive dashboards for both customers and store owners</p>
                  </li>
                  <li className="flex items-start">
                    <div className="flex-shrink-0 h-5 w-5 text-accent mt-1">•</div>
                    <p className="ml-2 text-gray-600">Seamless integration of crypto and BNPL payment options</p>
                  </li>
                  <li className="flex items-start">
                    <div className="flex-shrink-0 h-5 w-5 text-accent mt-1">•</div>
                    <p className="ml-2 text-gray-600">Mobile-first design for shopping on any device</p>
                  </li>
                </ul>
              </div>
              {/* </FadeIn> */}
            </div>
          </div>
        </section>

        <section className="bg-white py-24 sm:py-20">

          <div className="mx-auto max-w-7xl px-6 lg:px-8 py-4">
            <div className="mx-auto lg:mx-0">
              <h2 className="text-4xl font-semibold tracking-tight text-pretty text-gray-900 sm:text-5xl max-w-lg">
                Shop, Pay, Send Money & Restock with Ease
              </h2>
              <p className="mt-6 text-lg/8 text-gray-600">
                Fortitude Direct is an all-in-one shopping, payments and retail marketplace app that helps consumers and businesses buy products, pay bills, send money, and manage transactions securely — all from one fast and reliable mobile platform.

                Designed for everyday life and growing businesses, Fortitude Direct combines e-commerce, digital payments, wallet services, and wholesale supply into one seamless experience.
              </p>
            </div>
          </div>

          <div className="mx-auto max-w-7xl px-6 lg:px-8 mt-7">
            <div className="mx-auto grid max-w-2xl grid-cols-1 lg:mx-0 lg:max-w-none lg:grid-cols-2">
              <div className="flex flex-col pb-10 sm:pb-16 lg:pr-8 lg:pb-0 xl:pr-20">
                <div className="flex items-center gap-4">
                  <Users className="h-10 w-10 text-accent" />
                  <h2 className="text-2xl font-semibold leading-8 text-gray-900">
                    Consumer
                  </h2>
                </div>
                <figure className="mt-7 flex flex-auto flex-col justify-between">
                  <blockquote className="text-lg/8 text-gray-900">
                    <p>
                      <span className="text-accent font-semibold leading-8">Shop smarter and manage your money with ease. {''}</span>
                      Browse products, buy essentials, pay bills, send and receive money, track orders, access exclusive discounts, and view your wallet and purchase history — all in one secure app.
                      From daily shopping to travel bookings and quick payments, Fortitude Direct makes every transaction simple, safe and convenient.
                    </p>
                  </blockquote>
                  <figcaption className="mt-10 flex items-center gap-x-6">
                    <div className="text-base">
                      <div className="font-semibold text-gray-900"><span className="text-accent font-semibold leading-8">Perfect for: {''}</span> online shopping, airtime & bill payments, money transfers, deals & promos, and everyday spending.</div>
                    </div>
                  </figcaption>
                </figure>
              </div>
              <div className="flex flex-col border-t border-gray-900/10 pt-10 sm:pt-16 lg:border-t-0 lg:border-l lg:pt-0 lg:pl-8 xl:pl-20">
                <div className="flex items-center gap-4">
                  <BriefcaseBusiness className="h-10 w-10 text-accent" />
                  <h2 className="text-2xl font-semibold leading-8 text-gray-900">
                    Retailers & SMEs
                  </h2>
                </div>
                <figure className="mt-7 flex flex-auto flex-col justify-between">
                  <blockquote className="text-lg/8 text-gray-900">
                    <p>
                      <span className="text-accent font-semibold leading-8">Restock faster. Sell more. Grow your business. {''}</span>
                      Access wholesale prices, place bulk orders, reorder inventory instantly, track deliveries, manage invoices, unlock trade promotions, and gain simple sales insights.
                      Fortitude Direct helps retailers reduce stock-outs, improve margins, and maintain predictable supply with a dependable B2B marketplace built for business efficiency.
                    </p>
                  </blockquote>
                  <figcaption className="mt-10 flex items-center gap-x-6">
                    <div className="text-base">
                      <div className="font-semibold text-gray-900"><span className="text-accent font-semibold leading-8">Perfect for: {''}</span>bulk buying, wholesale sourcing, inventory restocking, retailer tools, and trade support.</div>
                    </div>
                  </figcaption>
                </figure>
              </div>
            </div>
          </div>
        </section>

        <section>
          <div className="bg-white">
            <div className="mx-auto max-w-7xl py-24 sm:px-6 sm:py-32 lg:px-8">
              <div className="relative isolate overflow-hidden bg-accent px-6 py-24 text-center shadow-2xl sm:rounded-3xl sm:px-16">
                <h2 className="text-4xl font-semibold tracking-tight text-balance text-white sm:text-5xl">
                  Join the Fortitude Direct Community
                </h2>
                <p className="mx-auto mt-6 max-w-xl text-lg/8 text-pretty text-gray-300">
                  Experience the future of ecommerce with innovative features, secure payments, and exceptional service.
                </p>
                <div className="mt-10 flex items-center justify-center gap-x-6">
                  <a
                    href="/shop"
                    target="_blank" rel="noopener noreferrer"
                    className="rounded-md bg-white px-3.5 py-2.5 text-sm font-semibold text-gray-900 shadow-xs hover:bg-gray-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                  >
                    {' '}
                    Start Shopping{' '}
                  </a>
                  <a href="/admin-login" className="text-sm/6 font-semibold text-white" target="_blank" rel="noopener noreferrer">
                    Become a Seller
                    <span aria-hidden="true" className="ml-2">→</span>
                  </a>
                </div>
                <svg
                  viewBox="0 0 1024 1024"
                  aria-hidden="true"
                  className="absolute top-1/2 left-1/2 -z-10 size-256 -translate-x-1/2 mask-[radial-gradient(closest-side,white,transparent)]"
                >
                  <circle r={512} cx={512} cy={512} fill="url(#827591b1-ce8c-4110-b064-7cb85a0b1217)" fillOpacity="0.7" />
                  <defs>
                    <radialGradient id="827591b1-ce8c-4110-b064-7cb85a0b1217">
                      <stop stopColor="#585f68" />
                      <stop offset={1} stopColor="#FFFFFF" />
                    </radialGradient>
                  </defs>
                </svg>
              </div>
            </div>
          </div>
        </section>
        <Footer />
      </Suspense>
    </>
  );
}
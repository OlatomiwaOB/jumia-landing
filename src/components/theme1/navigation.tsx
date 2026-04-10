'use client'
import { useState } from "react";
import { Heart, User, Search, Smartphone, Watch, Headphones, Tablet, Gamepad2, Laptop, MonitorSpeaker, Menu, X, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import Link from "next/link";
import { useCategories } from "@/app/hooks/useCategories";
import categories_placeholder from '@/assets/categories_placeholder.jpg'
import Image from "next/image";
import { getAuthCredentials, logout } from "@/utils/auth-utils-customer";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "../ui/dropdown-menu";

  const categories = [
    { name: "Smartphones", icon: Smartphone },
    { name: "Smartwatches", icon: Watch },
    { name: "Headphones", icon: Headphones },
    { name: "Tablets", icon: Tablet },
    { name: "Consoles & Gaming", icon: Gamepad2 },
    { name: "Laptops", icon: Laptop },
    { name: "PCs & Peripherals", icon: MonitorSpeaker },
  ];

  const topLinks = [
    { name: "About", href: "#" },
    { name: "Lender Portal", href: "/lender-portal" },
    { name: "Apply BNPL", href: '/apply-bnpl' },
    { name: "Warranty", href: "#" },
    { name: "Location", href: "#" },
    { name: "Contacts", href: "#" },
  ];
 
  const logo = process?.env?.NEXT_PUBLIC_LOGO_URL!

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const {data,isLoading} = useCategories()
  const { token, permissions } = getAuthCredentials();
  const isUserAuthenticated = !!token && Array.isArray(permissions) && permissions.length > 0;
  

  return (
    <nav className="border-b bg-background sticky top-0 z-50">
      <div className="container mx-auto px-4">
        {/* Top Bar */}
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-8">

            <Link href={`/`} className="rounded-md bg-gray-300">
                <img src={logo} alt="store Logo" className="h-12 w-auto"/>
            </Link>
            
            {/* Desktop Top Links */}
            <div className="hidden lg:flex items-center gap-6">
              {topLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="text-sm font-medium hover:text-accent transition-colors"
                >
                  {link.name}
                </a>
              ))}
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="flex items-center gap-2 sm:gap-4">
            {/* <Button variant="ghost" size="icon">
              <Search className="h-5 w-5" />
            </Button> */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="sm:flex">
                  <User className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {
                  isUserAuthenticated ? (
                    <div className="flex flex-col gap-2">
                    <Link href={`/dashboard`} target="_blank"><span>Dashboard</span></Link>
                    <Button onClick={logout}>
                      <span>Logout</span>
                    </Button>
                    </div>
                  )
                  :(
                    <div className="flex flex-col gap-2">
                      <Link href={`/customer-onboarding`} target="_blank"><span>Login / Sign Up</span></Link>
                      <Link href={`/admin-login`} target="_blank"><span>Admin Login</span></Link>
                    </div>
                  )
                }
              </DropdownMenuContent>
            </DropdownMenu>
            <Button variant="ghost" size="icon" className="sm:flex">
              <ShoppingCart className="h-5 w-5" />
            </Button>
              {/* Mobile Menu Button */}
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild className="lg:hidden">
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[300px] sm:w-[400px] overflow-y-auto">
                <SheetHeader>
                  <Link href={`/`} className="rounded-md bg-gray-300">
                    <img src={logo} alt="store Logo" className="h-8 w-auto"/>
                </Link>
                </SheetHeader>
                <div className="mt-8 flex flex-col gap-6 px-3">
                  {/* Categories in Mobile Menu */}
                  <div>
                    <h3 className="mb-4 text-sm font-semibold text-muted-foreground uppercase tracking-wider">Categories</h3>
                    <div className="flex flex-col gap-y-5">
                  { data?.categories?.map((category:any) => {
                    const IconComponent = category?.logo || categories_placeholder?.src;
                    const categorySlug = category.name.toLowerCase().replace(/ & /g, "-").replace(/ /g, "-");
                    return (
                      <a
                        key={category.name}
                        href={`/category/${categorySlug}`}
                        className="flex gap-x-2 items-center hover:text-accent transition-colors group"
                      >
                        <Image
                          src={IconComponent}
                          alt={category.name}
                          width={24}
                          height={24}
                          className="h-6 w-6"
                        />
                        <span className="text-xs font-medium text-center">{category.name}</span>
                      </a>
                    );
                  })}
                    </div>
                  </div>

                  {/* Links in Mobile Menu */}
                  <div>
                    <h3 className="mb-4 text-sm font-semibold text-muted-foreground uppercase tracking-wider">Information</h3>
                    <div className="flex flex-col gap-2">
                      {topLinks.map((link) => (
                        <a
                          key={link.name}
                          href={link.href}
                          className="py-2 text-sm font-medium hover:text-accent transition-colors"
                          onClick={() => setIsOpen(false)}
                        >
                          {link.name}
                        </a>
                      ))}
                    </div>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>

        {/* Category Bar - Desktop Only */}
        <div className="hidden lg:block border-t py-3">
          <div className="flex items-center justify-around">
            {
                isLoading ? (
                  <div className="w-full flex justify-center py-2">
                    <div className="animate-pulse h-4 w-32 bg-gray-200 rounded"></div>
                </div>
                ) : (
                  data?.categories?.map((category:any) => {
                    const IconComponent = category?.logo || categories_placeholder?.src;
                    const categorySlug = category.name.toLowerCase().replace(/ & /g, "-").replace(/ /g, "-");
                    return (
                      <a
                        key={category.name}
                        href={`/category/${categorySlug}`}
                        className="flex flex-col items-center gap-1 hover:text-accent transition-colors group"
                      >
                        <Image
                          src={IconComponent}
                          alt={category.name}
                          width={24}
                          height={24}
                          className="h-6 w-6"
                        />
                        <span className="text-xs font-medium text-center">{category.name}</span>
                      </a>
                    );
                  })
                )
            }
            {/* {categories.map((category) => {
              const IconComponent = category.icon;
              const categorySlug = category.name.toLowerCase().replace(/ & /g, "-").replace(/ /g, "-");
              return (
                <a
                  key={category.name}
                  href={`/category/${categorySlug}`}
                  className="flex flex-col items-center gap-1 hover:text-accent transition-colors group"
                >
                  <IconComponent className="h-6 w-6" />
                  <span className="text-xs font-medium text-center">{category.name}</span>
                </a>
              );
            })} */}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;

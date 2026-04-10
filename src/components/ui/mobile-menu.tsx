"use client"

import { X } from "lucide-react"
import Image from "next/image"
interface MobileMenuProps {
  isOpen: boolean
  onClose: () => void
}

const logo = process?.env?.NEXT_PUBLIC_LOGO_URL || '/placeholder.svg'
export function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 md:hidden">
      <div className="fixed inset-0 bg-black/20" onClick={onClose} />
      <div className="fixed left-0 top-0 h-full w-80 bg-white shadow-xl">
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center gap-2">
            <Image
              src={logo}
              alt="BFPAY Logo"
              width={80}
              height={80}
              className="object-contain"
            />
            {/* <span className="text-xl font-bold text-gray-900">PickBazar</span> */}
          </div>
          <button onClick={onClose} className="p-2">
            <X className="h-6 w-6" />
          </button>
        </div>

        <nav className="p-4">
          <div className="space-y-6 text-md">
            <a href="#" className="block text-gray-700 hover:text-gray-900">
              Shops
            </a>
            <a href="/lender-portal" className="block text-gray-700 hover:text-gray-900">
              Lender Portal
            </a>
            <a href="#" className="block text-gray-700 hover:text-gray-900">
              Contact
            </a>
            <a href="#" className="block text-gray-700 hover:text-gray-900">
              Flash Sale
            </a>
            <a href="#" className="block text-gray-700 hover:text-gray-900">
              Manufacturers/Publishers
            </a>
            <a href="#" className="block text-gray-700 hover:text-gray-900">
              Authors
            </a>
            <a href="#" className="block text-gray-700 hover:text-gray-900">
              FAQ
            </a>
            <a href="#" className="block text-gray-700 hover:text-gray-900">
              Terms & Conditions
            </a>
            <a href="#" className="block text-gray-700 hover:text-gray-900">
              Customer Refund Policy
            </a>
            <a href="#" className="block text-gray-700 hover:text-gray-900">
              Vendor Refund Policy
            </a>
          </div>
        </nav>
      </div>
    </div>
  )
}

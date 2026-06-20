'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import { Fragment } from 'react'

const formatSegment = (segment: string): string => {
  return segment
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

export const BreadcrumbNav = () => {
  const pathname = usePathname()
  const segments = pathname.split('/').filter(Boolean)

  if (segments.length <= 1) return null

  const crumbs = segments.map((segment, index) => ({
    label: formatSegment(segment),
    href: '/' + segments.slice(0, index + 1).join('/'),
    isLast: index === segments.length - 1,
  }))

  return (
    <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs">
      {crumbs.map((crumb, index) => (
        <Fragment key={crumb.href}>
          {index > 0 && <ChevronRight className="w-3 h-3 text-gray-300 flex-shrink-0" />}
          {crumb.isLast ? (
            <span className="text-gray-500 font-medium truncate">{crumb.label}</span>
          ) : (
            <Link
              href={crumb.href}
              className="text-gray-400 hover:text-gray-600 transition-colors truncate"
            >
              {crumb.label}
            </Link>
          )}
        </Fragment>
      ))}
    </nav>
  )
}

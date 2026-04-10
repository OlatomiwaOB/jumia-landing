'use client'

import { usePathname, useSearchParams } from "next/navigation";

export const useFullPath = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const queryString = searchParams.toString();
  return queryString ? `${pathname}?${queryString}` : pathname;
}
'use client'

import useCustomer from "@/store/customerStore";
import { useRouter } from "next/navigation";
import { ReactNode, useEffect } from "react";
import { useFullPath } from "./hooks/useFullPath";

const TwoFaWrapper = ({children}: {children:ReactNode}) => {
    const {customer} = useCustomer()
    const router = useRouter()
    const fullPath = useFullPath();
    const fallbackPath = '/twofa_setup/customer'
    
    useEffect(()=>{
      if (customer && customer?.twoFaSetupRequired === 'Y') {
        const returnUrl = encodeURIComponent(fullPath);
        router.replace(`${fallbackPath}?returnUrl=${returnUrl}`);
        return;
      }
      return
    },[router, fullPath, customer])

    return children
}

export default TwoFaWrapper

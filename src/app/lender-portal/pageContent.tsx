'use client'

import DashboardOverview from "@/components/lender-portal/dashboard-overvies"
import NotConnected from "@/components/lender-portal/not-connected"
import { useAccount } from "wagmi"

const LenderPortalContent = () => {
    const {isConnected} = useAccount()
  return (
    <div className="flex-1 h-full overflow-y-auto relative">
        {
            !isConnected
            ?
            <NotConnected/>
            :
            <DashboardOverview/>
        }
    </div>
  )
}

export default LenderPortalContent
import { Button } from '@/components/ui/button'
import { Camera } from 'lucide-react'
import { useRouter } from 'next/navigation'
import React from 'react'

const LivenessTrigger = ({livenessSessionId}:{livenessSessionId:string}) => {
  const router = useRouter()

  return (
    <>
        {/* Liveness check */}
        <div className="p-4 bg-muted rounded-lg">
        <h4 className="text-sm font-medium text-muted-foreground mb-2">Identity Verification</h4>
        <Button 
            type="button" 
            variant="outline" 
            className="w-full"
            onClick={()=>router?.push(`/liveness?id=${livenessSessionId}`)}
        >
            <>
                <Camera className="w-4 h-4 mr-2" />
                Start Liveness Check
            </>
        </Button>
        <p className="text-xs text-muted-foreground mt-1">Take a quick selfie to verify your identity</p>
        </div>
    </>
  )
}

export default LivenessTrigger
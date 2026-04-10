import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ArrowLeft, CheckCircle, RefreshCcw } from "lucide-react"
import { useMutation } from "@tanstack/react-query"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import useOperations from "@/store/operationsStore"
import axiosInstance from "@/utils/fetch-function";
import QRCode from "react-qr-code"

export function OtpVerification() {
  const [otp, setOtp] = useState(["", "", "", "", "", ""])
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])
  const router = useRouter()
  const [regenerateRef,setRegenerateRef] = useState(false)
  const {operations,setOperations} = useOperations()
  // console.log(user);
  
  const {isPending,mutate} = useMutation({
    mutationFn: ()=>axiosInstance.request({
        url: `/usermanager/validate-2fa-setup`,
        method: 'POST',
        params: {
            referenceNo: operations?.twoFaReferenceNo,
            otp: otp.join(''),
            username: operations?.username,
            // language: user?.language?.toUpperCase()
        }
    }),
    onSuccess: (data)=>{
        if(data?.data?.code!=='000'){
            if (data?.data?.code==='EE1') {
                toast.error(data?.data?.desc)
                setRegenerateRef(true)
                return
            }
            toast.error(data?.data?.desc)
            return
        }
        // console.log(operations);

        setOperations({...operations,twoFaSetupRequired:'N'})
        toast?.success(data?.data?.desc)
        router?.push(`/operations/dashboard`)
        return
    },
    onError: (error) =>{
        // console.log(error);
        toast.error('Something went wrong!')
    }
  })

  const {mutate:regenerateMutation, isPending:regenerating,data} = useMutation({
    mutationFn: ()=>axiosInstance.request({
        url: `/usermanager/refresh-2fa-setup`,
        method: 'POST',
        params: {
            referenceNo: operations?.twoFaReferenceNo,
            username: operations?.username
        }
    }),
    onSuccess: (data)=>{
        if (data?.data?.code!=='000') {
            toast?.error(data?.data?.desc)
            return
        }
        toast?.success(data?.data?.desc)
        return
    },
    onError: (error)=>{
        toast?.error('Something went wrong!')
    }
  })



   const handleChange = (element: HTMLInputElement, index: number) => {
    if (isNaN(Number(element.value))) return false

    const newOtp = [...otp]
    newOtp[index] = element.value
    setOtp(newOtp)

    if (element.value && index < 5) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData("text/plain").slice(0, 6)
    
    if (/^\d+$/.test(pastedData)) {
      const newOtp = Array.from(pastedData.padEnd(6, "")).slice(0, 6)
      setOtp(newOtp)

      const nextEmptyIndex = newOtp.findIndex(digit => digit === "")
      const focusIndex = nextEmptyIndex === -1 ? 5 : nextEmptyIndex
      inputRefs.current[focusIndex]?.focus()
    }
  }


  const isOtpComplete = otp.every(digit => digit !== "")

  return (
    <>
        <div className='w-full p-3 border rounded-md'>
           {regenerating
           ?
           <div className="w-30 h-30 mx-auto bg-gray-100 animate-pulse"></div>
           :
            <QRCode
            value={data?.data?.refNo || operations?.twoFaLinkData as string}
            className='w-30 h-30 mx-auto'
        />
        }
        </div>
    <div className="w-full max-w-md space-y-3">
      <h3 className='font-semibold'>Verification Code</h3>
      <div className="space-y-4">
         <div className="flex gap-2">
            {otp.map((digit, index) => (
              <Input
                key={index}
                ref={(el) => (inputRefs.current[index] = el) as any}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(e.target, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                className="w-12 h-12 text-center text-lg font-semibold"
                disabled={isPending}
              />
            ))}
         </div>

        <div className="space-y-4">
          <Button
            disabled={!isOtpComplete || isPending}
            onClick={()=>mutate()}
            className="w-full bg-accent hover:bg-accent-foreground text-white py-3 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isPending ? "Verifying..." : "Verify Code"}
          </Button>

          {regenerateRef && <button 
            className="flex text-[14px] items-center justify-center w-full text-accent cursor-pointer gap-1"
            onClick={()=>regenerateMutation()}
            disabled = {regenerating}
            >
                {regenerating ? `Please wait..`:<>Refresh <RefreshCcw className="h-4 w-4"/></>}
            </button>}
        </div>
      </div>
    </div>
    </>
  )
}
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { User, CheckCircle2 } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"
import { useMutation } from "@tanstack/react-query"
import axiosInstance from "@/utils/fetch-function"

// interface IdentityDetailsFormProps {
//     initialData?: {
//         bvn: string
//         nin: string
//     }
//     onUpdateBvn: (bvn: string) => void
//     onUpdateNin: (nin: string) => void
// }

export function IdentityDetailsForm() {
    const [bvn, setBvn] = useState("")
    const [nin, setNin] = useState("")
    const [bvnOrNin, setBvnOrNin] = useState<'bvn' | 'nin'>("bvn")
    const [isEditingBvn, setIsEditingBvn] = useState(false)
    const [isEditingNin, setIsEditingNin] = useState(false)

    const { mutate, isPending } = useMutation({
        mutationFn: () => axiosInstance.request({
            method: "GET",
            url: "/corporate/update-info",
            params: {
                bvnOrNin,
                idValue: bvnOrNin === "bvn" ? bvn : nin
            }
        }),
        onSuccess: (data) => {
            if (data?.data?.desc !== '000') {
                toast?.error(data?.data?.desc)
                return
            }
            toast?.success(data?.data?.desc)

        },
        onError: (error) => {
            toast?.error("Something went wrong")
        }
    })

    const handleBvnSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        setBvnOrNin("bvn")
        mutate()
        setIsEditingBvn(false)
    }

    const handleNinSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        setBvnOrNin("nin")
        mutate()
        setIsEditingNin(false)
    }

    return (
        <Card className="w-full border-none shadow-sm">
            <CardHeader className="pb-4">
                <div className="flex items-center gap-2 text-accent font-medium">
                    <User className="h-5 w-5" />
                    <CardTitle className="text-base text-gray-900">Identity Details</CardTitle>
                </div>
            </CardHeader>
            <CardContent className="space-y-6">
                {/* BVN Section */}
                <form onSubmit={handleBvnSubmit}>
                    <div className="space-y-2">
                        {/* <div className="flex items-center justify-between">
                            <Label htmlFor="bvn" className="text-gray-700 font-medium">BVN (Bank Verification Number)</Label>
                            {isEditingBvn && bvn && (
                                <div className="flex items-center gap-1 text-xs text-green-600">
                                    <CheckCircle2 className="h-3 w-3" />
                                    <span>Saved</span>
                                </div>
                            )}
                        </div> */}
                        <div className="flex gap-3">
                            <Input
                                id="bvn"
                                value={bvn}
                                onChange={(e) => setBvn(e.target.value)}
                                placeholder="Enter your BVN"
                                disabled={!isEditingBvn && !!bvn}
                                className="bg-gray-50 border-gray-200 flex-1"
                            />
                            <Button
                                type="submit"
                                className="bg-accent/50 hover:bg-accent text-white"
                                disabled={!bvn || isPending}
                            >
                                Save
                            </Button>

                        </div>
                    </div>
                </form>

                {/* Separator */}
                <div className="h-px bg-gray-100 w-full" />

                {/* NIN Section */}
                <form onSubmit={handleNinSubmit}>
                    <div className="space-y-2">
                        {/* <div className="flex items-center justify-between">
                            <Label htmlFor="nin" className="text-gray-700 font-medium">NIN (National Identity Number)</Label>
                            {!isEditingNin && nin && (
                                <div className="flex items-center gap-1 text-xs text-green-600">
                                    <CheckCircle2 className="h-3 w-3" />
                                    <span>Saved</span>
                                </div>
                            )}
                        </div> */}
                        <div className="flex gap-3">
                            <Input
                                id="nin"
                                value={nin}
                                onChange={(e) => setNin(e.target.value)}
                                placeholder="Enter your NIN"
                                disabled={!isEditingNin && !!nin}
                                className="bg-gray-50 border-gray-200 flex-1"
                            />

                            <Button
                                type="submit"
                                className="bg-accent/50 hover:bg-accent text-white"
                                disabled={!nin || isPending}
                            >
                                Save
                            </Button>

                        </div>
                    </div>
                </form>
            </CardContent>
        </Card>
    )
}

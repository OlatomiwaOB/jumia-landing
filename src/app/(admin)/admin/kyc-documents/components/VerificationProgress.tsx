import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { ShieldCheck } from "lucide-react"

interface VerificationProgressProps {
    verifiedCount: number
    uploadedCount: number
    totalCount: number
}

export function VerificationProgress({ verifiedCount, uploadedCount, totalCount }: VerificationProgressProps) {
    const progress = (verifiedCount / totalCount) * 100

    return (
        <Card className="w-full bg-[#f8fafc]/50 border-none shadow-sm">
            <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                    <div className="flex gap-4">
                        <div className="mt-1 p-2 bg-white rounded-lg border border-gray-100 shadow-sm">
                            <ShieldCheck className={`h-6 w-6 ${verifiedCount === totalCount ? 'text-accent' : 'text-gray-400'}`} />
                        </div>
                        <div>
                            <h3 className="font-semibold text-gray-900">Verification Progress</h3>
                            <p className="text-sm text-gray-500 mt-1">
                                {verifiedCount} of {totalCount} required documents verified
                            </p>
                        </div>
                    </div>
                    <div>
                        {verifiedCount === totalCount ? (
                            <Badge className="bg-green-100 text-accent hover:bg-green-100 border-none">
                                Verified
                            </Badge>
                        ) : uploadedCount === totalCount ? (
                            <Badge className="bg-orange-100 text-orange-700 hover:bg-orange-100 border-none">
                                Pending Review
                            </Badge>
                        ) : (
                            <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200 hover:bg-yellow-50 hover:text-yellow-700">
                                In Progress
                            </Badge>
                        )}
                    </div>
                </div>
                <Progress value={progress} className="h-2" />
            </CardContent>
        </Card>
    )
}

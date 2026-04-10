
import { AlertCircle, CheckCircle2, ChevronRight } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"

export interface KycPendingItem {
    actionCode: string
    message: string
    title: string
    url: string
}

interface PendingRequirementsListProps {
    items: KycPendingItem[]
    isLoading?: boolean
}

export function PendingRequirementsList({ items, isLoading }: PendingRequirementsListProps) {
    if (isLoading) {
        return (
            <Card className="w-full border-none shadow-sm animate-pulse">
                <CardHeader>
                    <div className="h-6 w-1/3 bg-gray-100 rounded"></div>
                </CardHeader>
                <CardContent className="space-y-4">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="h-16 w-full bg-gray-100 rounded-lg"></div>
                    ))}
                </CardContent>
            </Card>
        )
    }

    if (!items?.length) {
        return null;
    }

    return (
        <Card className="w-full border-none shadow-sm bg-orange-50/30">
            <CardHeader>
                <CardTitle className="text-base text-gray-900 flex items-center gap-2">
                    <AlertCircle className="h-5 w-5 text-orange-600" />
                    Pending Requirements
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
                {items.map((item, index) => (
                    <div
                        key={`${item.actionCode}-${index}`}
                        className="flex items-center justify-between p-3 bg-white rounded-lg border border-orange-100 shadow-sm"
                    >
                        <div className="flex items-center gap-3">
                            <div className="h-8 w-8 rounded-full bg-orange-100 flex items-center justify-center shrink-0">
                                <span className="text-orange-700 font-semibold text-xs">{index + 1}</span>
                            </div>
                            <div>
                                <h4 className="font-medium text-gray-900 text-sm">{item.title}</h4>
                                <p className="text-xs text-gray-500">{item.message}</p>
                            </div>
                        </div>
                        {/* 
                        <div className="flex items-center text-orange-600 text-xs font-medium">
                           Required <ChevronRight className="h-4 w-4" />
                        </div>
                         */}
                    </div>
                ))}
            </CardContent>
        </Card>
    )
}

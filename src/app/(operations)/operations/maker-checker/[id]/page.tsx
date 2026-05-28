'use client'
import React, { useState } from 'react'
import { useQuery, useMutation } from '@tanstack/react-query'
import axiosOperations from '@/utils/fetch-function-op-auth'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'
import { usePageMetadata } from '@/hooks/usePageMetadata'
import { Loader2 } from 'lucide-react'

interface MakerCheckerItem {
    id: number
    entityCode: string
    activityCode: string
    activityRef: string
    domainType: string
    oldData: string
    newData: string
    verifyStatus: string
    verifyDate: string | null
    verifyBy: string
    activityTitle: string
    activityValue: string
    comment: string
    createdDate: string
    createdBy: string
}

const getStatusColor = (status: string): string => {
    switch (status?.toUpperCase()) {
        case 'Y': return 'bg-green-100 text-green-700 border-green-200'
        case 'N': return 'bg-red-100 text-red-700 border-red-200'
        default: return 'bg-yellow-100 text-yellow-700 border-yellow-200'
    }
}

const Field = ({ label, value }: { label: string; value: string }) => (
    <div className="space-y-0.5">
        <p className="text-xs text-medium-gray">{label}</p>
        <p className="text-xs font-semibold text-dark-gray bg-gray-50 p-2 rounded-lg">{value || 'N/A'}</p>
    </div>
)

const MakerCheckerDetailsPage = () => {
    usePageMetadata('Maker Checker Details', 'Review and approve changes')

    const { id } = useParams()
    const [reviewComment, setReviewComment] = useState('')
    const [otp, setOtp] = useState('')
    const [showCommentBox, setShowCommentBox] = useState(false)
    const [pendingAction, setPendingAction] = useState<'approve' | 'reject' | null>(null)

    const { data, isLoading } = useQuery({
        queryKey: ['maker-checker-detail', id],
        queryFn: () => axiosOperations.request({
            url: `/makerChecker/getById/${id}`,
            method: 'GET'
        })
    })

    const makerChecker: MakerCheckerItem | undefined = data?.data?.[0]

    const { mutate: authorizeReject, isPending: isSubmitting } = useMutation({
        mutationFn: (payload: any) => axiosOperations.request({
            url: 'makerChecker/authorizeMakerCheckerUserUpdate',
            method: 'POST',
            params: { otp },
            data: payload
        }),
        onSuccess: (data) => {
            if (data?.data?.code !== '000') {
                toast.error(data?.data?.desc)
                return
            }
            toast.success(pendingAction === 'approve' ? 'Approved successfully' : 'Rejected successfully')
            setShowCommentBox(false)
            setPendingAction(null)
            setReviewComment('')
            setOtp('')
        },
        onError: (error: any) => {
            console.log(error)
            toast.error('Error completing this request')
        }
    })

    const handleAction = (action: 'approve' | 'reject') => {
        if (!showCommentBox) {
            setShowCommentBox(true)
            setPendingAction(action)
            return
        }
        handleSubmit()
    }

    const handleSubmit = () => {
        if (!otp || (pendingAction === 'reject' && !reviewComment.trim())) {
            toast.error(pendingAction === 'reject' ? 'Comment is required for rejection' : 'OTP is required')
            return
        }

        const payload = [{
            id: Number(id),
            verifyStatus: pendingAction === 'approve' ? 'Y' : 'N',
            requestType: 'USER',
            referenceNo: `REF${Math.random().toString().slice(2, 17)}`,
            comment: reviewComment,
        }]

        authorizeReject(payload)
    }

    const handleCancelComment = () => {
        setShowCommentBox(false)
        setPendingAction(null)
        setReviewComment('')
        setOtp('')
    }

    const parseJsonSafely = (jsonString: string) => {
        try {
            if (!jsonString || jsonString.trim() === '') return jsonString
            const parsed = JSON.parse(jsonString)
            return parsed
        } catch (error) {
            return jsonString
        }
    }

    const formatDataForDisplay = (data: any) => {
        if (typeof data === 'string') return data
        return JSON.stringify(data, null, 2)
    }

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="w-8 h-8 animate-spin text-orange-500 mx-auto mb-4" />
                    <p className="text-medium-gray">Loading...</p>
                </div>
            </div>
        )
    }

    if (!makerChecker) {
        return (
            <div className="min-h-screen">
                <div className="max-w-5xl mx-auto">
                    <div className="mb-4 px-2 pt-4">
                        <Link href='/operations/maker-checker' className="flex items-center gap-1">
                            <Button variant="link"><ArrowLeft className="h-4 w-4" /> Back</Button>
                        </Link>
                    </div>
                    <div className="flex flex-col items-center justify-center py-20 gap-3">
                        <p className="text-base font-semibold text-dark-gray">No data found</p>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen">
            <div className="max-w-5xl mx-auto">
                <div className="mb-4 px-2 pt-4">
                    <Link href='/operations/maker-checker' className="flex items-center gap-1">
                        <Button variant="link"><ArrowLeft className="h-4 w-4" /> Back</Button>
                    </Link>
                </div>

                <div className='px-2 pb-6'>
                    <div className="mb-6">
                        <h1 className="text-md lg:text-lg font-medium text-dark-gray">Maker Checker Details</h1>
                    </div>

                    <div className="space-y-4">
                        {/* Activity Details */}
                        <div className="bg-white rounded-2xl p-4">
                            <p className="text-sm font-semibold text-dark-gray mb-3">Activity Details</p>
                            <div className="grid grid-cols-2 gap-x-6 gap-y-4">
                                <Field label="Activity Code" value={makerChecker.activityCode} />
                                <Field label="Activity Ref No" value={makerChecker.activityRef} />
                                <Field label="Activity Title" value={makerChecker.activityTitle} />
                                <Field label="Activity Value" value={makerChecker.activityValue} />
                                <Field label="Entity Code" value={makerChecker.entityCode} />
                                <Field label="Domain Type" value={makerChecker.domainType} />
                                <Field label="Created By" value={makerChecker.createdBy} />
                                <Field label="Created Date" value={makerChecker.createdDate} />
                                <div className="space-y-0.5">
                                    <p className="text-xs text-medium-gray">Status</p>
                                    <Badge className={`text-xs px-3 py-0.5 border font-medium rounded-full ${getStatusColor(makerChecker.verifyStatus)}`}>
                                        {makerChecker.verifyStatus === 'Y' ? 'Approved' : makerChecker.verifyStatus === 'N' ? 'Rejected' : 'Pending'}
                                    </Badge>
                                </div>
                                {makerChecker.comment && <Field label="Comment" value={makerChecker.comment} />}
                            </div>
                        </div>

                        {/* Data Comparison */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                            <div className="bg-white rounded-2xl p-4">
                                <p className="text-sm font-semibold text-dark-gray mb-3">New Details</p>
                                <pre className="text-xs bg-green-50 p-4 rounded-xl border border-green-200 overflow-auto max-h-96 font-mono text-dark-gray">
                                    {formatDataForDisplay(parseJsonSafely(makerChecker.newData)) || 'No new data'}
                                </pre>
                            </div>

                            <div className="bg-white rounded-2xl p-4">
                                <p className="text-sm font-semibold text-dark-gray mb-3">Previous Details</p>
                                <pre className="text-xs bg-red-50 p-4 rounded-xl border border-red-200 overflow-auto max-h-96 font-mono text-dark-gray">
                                    {formatDataForDisplay(parseJsonSafely(makerChecker.oldData)) || 'No previous data'}
                                </pre>
                            </div>
                        </div>

                        {/* Approval Actions */}
                        {makerChecker.verifyStatus !== 'Y' && makerChecker.verifyStatus !== 'N' && (
                            <>
                                {showCommentBox && (
                                    <div className="bg-white rounded-2xl p-4 space-y-4">
                                        <div className="flex items-center gap-3 pb-3 border-b border-gray-100">
                                            <div className={`w-3 h-3 rounded-full ${pendingAction === 'approve' ? 'bg-green-500' : 'bg-red-500'}`} />
                                            <p className="text-sm font-semibold text-dark-gray">Add Review Comment</p>
                                        </div>

                                        <div className="space-y-4">
                                            <div className="space-y-1.5">
                                                <Label>Enter OTP <span className="text-red-500">*</span></Label>
                                                <Input
                                                    value={otp}
                                                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                                                    placeholder="Enter 6-digit OTP"
                                                    maxLength={6}
                                                />
                                            </div>

                                            <div className="space-y-1.5">
                                                <Label>
                                                    Review Comment {pendingAction === 'reject' && <span className="text-red-500">*</span>}
                                                </Label>
                                                <Textarea
                                                    value={reviewComment}
                                                    onChange={(e) => setReviewComment(e.target.value)}
                                                    placeholder={`Please provide a ${pendingAction === 'approve' ? 'note' : 'reason'}...`}
                                                    rows={3}
                                                    maxLength={500}
                                                />
                                                <div className="flex justify-between text-xs text-medium-gray">
                                                    <span>{pendingAction === 'reject' ? 'Required for rejection' : 'Optional comment'}</span>
                                                    <span>{reviewComment.length}/500</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                <div className="flex justify-end gap-4 pt-4">
                                    {showCommentBox ? (
                                        <>
                                            <Button variant="outline" onClick={handleCancelComment} disabled={isSubmitting}>Cancel</Button>
                                            <Button
                                                onClick={handleSubmit}
                                                disabled={isSubmitting || !otp || (pendingAction === 'reject' && !reviewComment.trim())}
                                                className={pendingAction === 'approve' ? 'bg-green-600 hover:bg-green-700 text-white' : 'bg-red-600 hover:bg-red-700 text-white'}
                                            >
                                                {isSubmitting ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Processing...</> : `Confirm ${pendingAction}`}
                                            </Button>
                                        </>
                                    ) : (
                                        <>
                                            <Button variant="outline" onClick={() => handleAction('reject')} className="text-red-600 border-red-200 hover:bg-red-50">Reject Changes</Button>
                                            <Button onClick={() => handleAction('approve')} className="bg-orange-500 hover:bg-orange-600 text-white">Approve Changes</Button>
                                        </>
                                    )}
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default MakerCheckerDetailsPage
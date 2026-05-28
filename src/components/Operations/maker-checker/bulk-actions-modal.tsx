'use client'
import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { useMutation } from '@tanstack/react-query'
import axiosInstance from '@/utils/fetch-function'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'

interface BulkActionModalProps {
  action: 'approve' | 'reject'
  selectedCount: number
  selectedItems: string[]
  itemsData: any[]
  onSuccess?: () => void
  onClose: () => void
  isOpen: boolean
}

const BulkActionModal: React.FC<BulkActionModalProps> = ({
  action,
  selectedCount,
  selectedItems,
  itemsData,
  onSuccess,
  onClose,
  isOpen
}) => {
  const [comment, setComment] = useState('')
  const [otp, setOtp] = useState('')

  const authorizeMutation = useMutation({
    mutationFn: (payload: any[]) =>
      axiosInstance.request({
        method: 'POST',
        url: '/makerChecker/authorizeMakerCheckerUserUpdate',
        data: payload
      }),
    onSuccess: (data) => {
      if (data?.data?.responseCode === '000' || data?.data?.code === '000') {
        toast.success(`${action === 'approve' ? 'Approved' : 'Rejected'} ${selectedCount} item${selectedCount > 1 ? 's' : ''} successfully!`)
        setComment('')
        setOtp('')
        onSuccess?.()
        onClose()
      } else {
        toast.error(data?.data?.responseMessage || data?.data?.desc || `Failed to ${action} items`)
      }
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || `Error ${action}ing items`)
    }
  })

  const handleSubmit = async () => {
    if (!otp) { toast.error('OTP is required'); return }
    if (action === 'reject' && !comment.trim()) { toast.error('Comment is required for rejection'); return }

    const payload = selectedItems.map(id => {
      const item = itemsData.find(item => item.id.toString() === id)
      return {
        id: parseInt(id),
        referenceNo: item?.activityRef || '000000000',
        requestType: item?.domainType || '',
        verifyStatus: action === 'approve' ? 'Y' : 'N',
        comment: comment.trim(),
        otp: otp
      }
    })

    authorizeMutation.mutate(payload)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md rounded-2xl border-0 shadow-xl bg-[#F5F5F5] p-0 gap-0">
        <DialogTitle className="sr-only">
          {action === 'approve' ? 'Approve' : 'Reject'} Items
        </DialogTitle>

        <div className="px-6 pt-5 pb-2">
          <h2 className="text-base font-bold text-dark-gray flex items-center gap-2">
            <span className={`inline-block w-3 h-3 rounded-full ${action === 'approve' ? 'bg-green-500' : 'bg-red-500'}`} />
            {action === 'approve' ? 'Approve' : 'Reject'} {selectedCount} Item{selectedCount > 1 ? 's' : ''}
          </h2>
          <p className="text-xs text-medium-gray mt-0.5">
            You are about to {action} {selectedCount} pending item{selectedCount > 1 ? 's' : ''}.
          </p>
        </div>

        <div className="p-6 space-y-4">
          <div className="bg-white rounded-2xl p-4 space-y-4">
            <div className="space-y-1.5">
              <Label className="text-dark-gray">
                Comment {action === 'reject' && <span className="text-red-500">*</span>}
              </Label>
              <Textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder={action === 'approve' ? 'Optional comment...' : 'Reason for rejection (required)'}
                rows={3}
                maxLength={500}
              />
              <div className="flex justify-between text-xs text-medium-gray">
                <span>{action === 'reject' ? 'Required for rejection' : 'Optional'}</span>
                <span>{comment.length}/500</span>
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-dark-gray">OTP Verification <span className="text-red-500">*</span></Label>
              <Input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                placeholder="Enter 6-digit OTP"
                maxLength={6}
              />
            </div>
          </div>

          <div className="flex gap-3 justify-end pt-1">
            <Button variant="outline" onClick={onClose} disabled={authorizeMutation.isPending}>Cancel</Button>
            <Button
              onClick={handleSubmit}
              disabled={authorizeMutation.isPending || !otp || (action === 'reject' && !comment.trim())}
              className={action === 'approve' ? 'bg-green-600 hover:bg-green-700 text-white' : 'bg-red-600 hover:bg-red-700 text-white'}
            >
              {authorizeMutation.isPending ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Processing...</> : `Confirm ${action === 'approve' ? 'Approval' : 'Rejection'}`}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default BulkActionModal
'use client'
import React from 'react'
import { Button } from '@/components/ui/button'
import { CheckCircle2, XCircle } from 'lucide-react'

interface BulkActionButtonsProps {
  selectedCount: number
  onApprove: () => void
  onReject: () => void
}

const BulkActionButtons: React.FC<BulkActionButtonsProps> = ({
  selectedCount,
  onApprove,
  onReject
}) => {
  return (
    <div className="flex items-center justify-between p-4 bg-[#FFF6F0] border-2 border-[#FEE1CD] rounded-2xl mb-4">
      <div className="flex items-center gap-2">
        <span className="text-sm font-semibold text-dark-gray">
          {selectedCount} item{selectedCount > 1 ? 's' : ''} selected
        </span>
      </div>
      <div className="flex gap-3">
        <Button
          onClick={onReject}
          variant="outline"
          className="text-red-600 border-red-200 hover:bg-red-50 gap-2"
        >
          <XCircle className="h-4 w-4" />
          Reject Selected
        </Button>
        <Button
          onClick={onApprove}
          className="bg-green-600 hover:bg-green-700 text-white gap-2"
        >
          <CheckCircle2 className="h-4 w-4" />
          Approve Selected
        </Button>
      </div>
    </div>
  )
}

export default BulkActionButtons
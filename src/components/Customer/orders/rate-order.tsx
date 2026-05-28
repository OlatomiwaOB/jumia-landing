'use client'
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Star } from 'lucide-react';
import { Label } from '@/components/ui/label';

export interface RateOrderModalProps {
  open: boolean;
  onClose: () => void;
  orderId: string | null;
  onSubmit: (payload: { orderId: string; rating: number; comment: string }) => Promise<void> | void;
}

const RateOrderModal: React.FC<RateOrderModalProps> = ({ open, onClose, orderId, onSubmit }) => {
  const [rating, setRating] = useState(0);
  const [hovered, setHovered] = useState(0);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const reset = () => { setRating(0); setHovered(0); setComment(''); };
  const handleClose = () => { reset(); onClose(); };

  const handleSubmit = async () => {
    if (!orderId || rating === 0) return;
    setIsSubmitting(true);
    try { await onSubmit({ orderId, rating, comment }); handleClose(); }
    finally { setIsSubmitting(false); }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md p-0 overflow-y-auto rounded-2xl gap-0 border-0 shadow-xl bg-[#F5F5F5]">
        <DialogTitle className="sr-only">Rate Order</DialogTitle>

        <div className="mx-6 pt-6">
          <h2 className="text-md font-bold text-dark-gray">Rate Order</h2>
        </div>

        <div className="mx-6 my-2 rounded-2xl bg-white px-2 pb-6 pt-4 space-y-4">
          <div className="text-center space-y-0.5">
            <p className="text-sm font-medium text-medium-gray">Rate your experience with order:</p>
            <p className="text-sm font-bold text-dark-gray">{orderId ?? '—'}</p>
          </div>

          <div className="flex items-center justify-center gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button key={star} type="button" onClick={() => setRating(star)}
                onMouseEnter={() => setHovered(star)} onMouseLeave={() => setHovered(0)}
                className="focus:outline-none transition-transform hover:scale-110 active:scale-95">
                <Star className={`w-10 h-10 transition-colors ${star <= (hovered || rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-200 fill-gray-100'
                  }`} />
              </button>
            ))}
          </div>

          <div className="space-y-1.5 px-3">
            <Label>
              Comment <span className="text-medium-gray font-normal">(Optional)</span>
            </Label>
            <Textarea value={comment} onChange={(e) => setComment(e.target.value)}
              placeholder="Add a comment"
              className="min-h-[90px] resize-none rounded-xl text-sm bg-white border-gray-200" />
          </div>
        </div>

        <div className="flex items-center justify-end bg-white p-4 border-t border-gray-100">
          <Button onClick={handleSubmit} disabled={rating === 0 || isSubmitting}>
            {isSubmitting ? 'Submitting…' : 'Submit Rating'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RateOrderModal;
import React from "react";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { Dialog, DialogContent } from "@/components/ui/dialog";

interface StoryReviewDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  rating: number;
  content: string;
  reviewLoading: boolean;
  onRatingChange: (rating: number) => void;
  onContentChange: (content: string) => void;
  onSubmitReview: () => void;
}

export function StoryReviewDialog({
  isOpen,
  onOpenChange,
  rating,
  content,
  reviewLoading,
  onRatingChange,
  onContentChange,
  onSubmitReview,
}: StoryReviewDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="bg-surface-brand border border-border-brand/40 text-text-primary rounded-2xl max-w-sm w-[90%] shadow-xl p-6 overflow-hidden">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-linear-to-br from-accent-brand/20 to-accent-brand/10 flex items-center justify-center">
            <Star size={24} className="text-accent-brand" fill="currentColor" />
          </div>
          <h2 className="text-xl font-black text-text-primary">Đánh giá</h2>
          <p className="text-sm text-text-muted">Chọn số sao và gửi đánh giá</p>

          <div className="flex items-center justify-center gap-3">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => onRatingChange(star)}
                className={cn(
                  "rounded-lg p-2 transition-transform duration-150",
                  star <= rating ? "scale-110" : "hover:scale-105"
                )}
              >
                <Star
                  size={34}
                  className={cn(
                    "transition-colors",
                    star <= rating ? "text-accent-brand" : "text-border-brand/50"
                  )}
                  fill={star <= rating ? "currentColor" : "none"}
                />
              </button>
            ))}
          </div>

          <textarea
            placeholder="Chia sẻ cảm nghĩ của bạn về truyện (tùy chọn)..."
            className="w-full bg-surface-elevated border border-border-brand rounded-xl p-3 text-text-primary focus:outline-none focus:ring-1 focus:ring-primary-brand text-sm resize-none min-h-[100px]"
            value={content}
            onChange={(e) => onContentChange(e.target.value)}
          />

          <button
            onClick={onSubmitReview}
            disabled={reviewLoading}
            className="w-full h-12 bg-primary-brand hover:bg-primary-light text-white font-black rounded-xl shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {reviewLoading ? "ĐANG GỬI..." : "GỬI ĐÁNH GIÁ"}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

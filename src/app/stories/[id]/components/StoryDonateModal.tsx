import React from "react";
import { Heart } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

interface StoryDonateModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  donateAmount: number;
  donateMessage: string;
  donateLoading: boolean;
  onDonateAmountChange: (amount: number) => void;
  onDonateMessageChange: (message: string) => void;
  onSubmitDonate: () => void;
}

export function StoryDonateModal({
  isOpen,
  onOpenChange,
  donateAmount,
  donateMessage,
  donateLoading,
  onDonateAmountChange,
  onDonateMessageChange,
  onSubmitDonate,
}: StoryDonateModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="bg-surface-brand/95 backdrop-blur-3xl border-border-brand text-text-primary rounded-4xl max-w-md w-[95%] shadow-2xl">
        <DialogHeader className="items-center text-center pb-4">
          <div className="w-20 h-20 bg-rose-500/10 rounded-full flex items-center justify-center mb-4 border border-rose-500/20">
            <Heart size={40} className="text-rose-500 animate-pulse" fill="currentColor" />
          </div>
          <DialogTitle className="text-2xl font-black tracking-tight text-text-primary">
            Ủng Hộ Truyện
          </DialogTitle>
          <DialogDescription className="text-text-muted font-bold">
            Tiếp sức để tác giả có thêm động lực ra chương mới nhé!
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="space-y-3">
            <label className="text-xs font-black text-text-muted uppercase tracking-widest pl-1">
              Chọn số xu
            </label>
            <div className="grid grid-cols-3 gap-3">
              {[100, 500, 1000, 5000, 10000].map((amt) => (
                <button
                  key={amt}
                  type="button"
                  onClick={() => onDonateAmountChange(amt)}
                  className={cn(
                    "py-3 rounded-xl border-2 font-black transition-all",
                    donateAmount === amt
                      ? "bg-primary-brand border-primary-brand text-white shadow-lg shadow-primary-glow"
                      : "bg-surface-elevated border-border-brand text-text-secondary hover:border-primary-brand/30"
                  )}
                >
                  {amt}
                </button>
              ))}
              <div className="relative">
                <input
                  type="number"
                  placeholder="Số khác"
                  className="w-full h-full bg-surface-elevated border-2 border-border-brand rounded-xl px-3 text-center text-sm font-black focus:outline-none focus:ring-1 focus:ring-primary-brand appearance-none text-text-primary"
                  onChange={(e) => onDonateAmountChange(Number(e.target.value))}
                />
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-xs font-black text-text-muted uppercase tracking-widest pl-1">
              Lời nhắn động viên
            </label>
            <textarea
              rows={3}
              placeholder="Viết lời nhắn gửi đến tác giả..."
              className="w-full bg-surface-elevated border border-border-brand rounded-2xl p-4 text-text-primary focus:outline-none focus:ring-1 focus:ring-primary-brand transition-all resize-none text-sm shadow-inner"
              value={donateMessage}
              onChange={(e) => onDonateMessageChange(e.target.value)}
            />
          </div>
        </div>

        <DialogFooter className="sm:justify-center pt-2">
          <Button
            onClick={onSubmitDonate}
            disabled={donateLoading || donateAmount <= 0}
            className="w-full h-14 bg-rose-500 hover:bg-rose-600 text-white font-black text-lg rounded-2xl shadow-[0_10px_25px_rgba(244,63,94,0.3)] transition-all hover:scale-[1.02] active:scale-95"
          >
            {donateLoading ? "ĐANG XỬ LÝ..." : `ỦNG HỘ ${donateAmount} XU`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

import React from "react";
import Image from "next/image";
import { Star, PenTool } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Story, Review } from "../types/story-detail.types";

interface StoryReviewFeedProps {
  story: Story | null;
  reviews: Review[];
  reviewLoading: boolean;
  reviewsPage: number;
  reviewsTotalPages: number;
  onPageChange: (page: number) => void;
}

export function StoryReviewFeed({
  story,
  reviews,
  reviewLoading,
  reviewsPage,
  reviewsTotalPages,
  onPageChange,
}: StoryReviewFeedProps) {
  return (
    <div className="space-y-4">
      {/* Reviews List */}
      <div className="space-y-3">
        {reviews.length === 0 ? (
          <div className="py-12 text-center border-2 border-dashed border-border-brand rounded-2xl">
            <Star size={40} className="mx-auto mb-4 text-text-muted opacity-30" />
            <p className="text-text-muted font-medium">
              Chưa có đánh giá nào. Hãy là người đầu tiên!
            </p>
          </div>
        ) : (
          reviews.map((review) => {
            const authorName = review.user?.isAnonymous
              ? "Người dùng"
              : review.user?.displayName ||
                review.user?.username ||
                review.user?.name ||
                "Người dùng";
            const isReviewAuthor =
              !review.user?.isAnonymous &&
              Boolean(
                review.user?.id &&
                  (review.user.id === story?.author?.id ||
                    review.user.id === (story as any)?.authorId)
              );
            const initial = authorName[0].toUpperCase();

            return (
              <div key={review.id} className="group">
                <div className="bg-surface-elevated/95 border border-border-brand/60 p-3 rounded-lg group-hover:bg-surface-brand transition-all shadow-sm">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-linear-to-tr from-primary-brand to-secondary-brand flex items-center justify-center text-white font-black text-xs shadow-md border-2 border-white overflow-hidden shrink-0">
                        {review.user?.avatar && !review.user?.isAnonymous ? (
                          <div className="w-full h-full relative">
                            <Image
                              src={review.user.avatar}
                              alt={authorName}
                              fill
                              className="object-cover"
                              unoptimized
                            />
                          </div>
                        ) : (
                          initial
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <p className="font-bold text-text-primary text-xs">{authorName}</p>
                          {isReviewAuthor && (
                            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[9px] font-extrabold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 shadow-xs">
                              <PenTool size={9} className="stroke-[2.5]" /> Tác giả
                            </span>
                          )}
                          <div className="flex gap-1">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                size={12}
                                className={
                                  i < review.rating ? "text-accent-brand" : "text-border-brand/30"
                                }
                                fill={i < review.rating ? "currentColor" : "none"}
                              />
                            ))}
                          </div>
                        </div>
                        <p className="text-[9px] text-text-muted font-bold">
                          {new Intl.DateTimeFormat("vi").format(new Date(review.createdAt))}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="border-t border-border-brand my-1.5" />
                  {review.content && (
                    <p className="text-text-secondary font-medium text-xs leading-relaxed mt-1">
                      {review.content}
                    </p>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Reviews Pagination */}
      {!reviewLoading && reviews.length > 0 && reviewsTotalPages > 1 && (
        <div className="mt-8">
          <Pagination>
            <PaginationContent className="bg-surface-brand border border-border-brand p-1 rounded-md gap-1">
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    if (reviewsPage > 1) onPageChange(reviewsPage - 1);
                  }}
                  className={cn(
                    "text-text-muted hover:text-text-primary border-transparent rounded-md",
                    reviewsPage <= 1 && "pointer-events-none opacity-20"
                  )}
                />
              </PaginationItem>
              {Array.from({ length: reviewsTotalPages }).map((_, i) => (
                <PaginationItem key={i}>
                  <PaginationLink
                    href="#"
                    isActive={reviewsPage === i + 1}
                    onClick={(e) => {
                      e.preventDefault();
                      onPageChange(i + 1);
                    }}
                    className={cn(
                      "w-9 h-9 rounded-md transition-all text-sm",
                      reviewsPage === i + 1
                        ? "bg-emerald-500 text-white border-emerald-500"
                        : "text-text-muted hover:text-text-primary border-transparent hover:bg-surface-elevated"
                    )}
                  >
                    {i + 1}
                  </PaginationLink>
                </PaginationItem>
              ))}
              <PaginationItem>
                <PaginationNext
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    if (reviewsPage < reviewsTotalPages) onPageChange(reviewsPage + 1);
                  }}
                  className={cn(
                    "text-text-muted hover:text-text-primary border-transparent rounded-md",
                    reviewsPage >= reviewsTotalPages && "pointer-events-none opacity-20"
                  )}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  );
}

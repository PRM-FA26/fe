import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { apiFetch, ApiRequestError } from "@/lib/api";
import { isLoggedIn } from "@/lib/auth";
import { useToast } from "@/components/Toast";
import { Review } from "../types/story-detail.types";

export function useStoryReviews(storyId: string) {
  const router = useRouter();
  const { showToast } = useToast();

  const [reviews, setReviews] = useState<Review[]>([]);
  const [reviewLoading, setReviewLoading] = useState(false);
  const [reviewsPage, setReviewsPage] = useState(1);
  const [reviewsTotalPages, setReviewsTotalPages] = useState(1);

  const [newReviewRating, setNewReviewRating] = useState(5);
  const [newReviewContent, setNewReviewContent] = useState("");
  const [showReviewDialog, setShowReviewDialog] = useState(false);

  const fetchReviews = useCallback(async (page: number) => {
    if (!storyId) return;
    setReviewLoading(true);
    try {
      const res = await apiFetch<any>(`/reviews/story/${storyId}?page=${page}&limit=5`);
      setReviews(res.data || []);
      if (res.pagination) {
        setReviewsTotalPages(res.pagination.totalPages || 1);
      }
    } catch (err) {
      console.error("Failed to fetch reviews", err);
    } finally {
      setReviewLoading(false);
    }
  }, [storyId]);

  useEffect(() => {
    fetchReviews(reviewsPage);
  }, [fetchReviews, reviewsPage]);

  const handleReview = useCallback(async () => {
    if (!isLoggedIn()) {
      router.push("/login");
      return;
    }
    setReviewLoading(true);
    try {
      const review = await apiFetch<Review>("/reviews", {
        method: "POST",
        body: JSON.stringify({
          storyId,
          rating: newReviewRating,
          content: newReviewContent.trim() || undefined,
        }),
      });
      setReviews((prev) => [review, ...prev]);
      setNewReviewRating(5);
      setNewReviewContent("");
      setShowReviewDialog(false);
      showToast("Gửi đánh giá thành công!", "success");
    } catch (err) {
      console.error("Review submission error:", err);
      const message =
        err instanceof ApiRequestError
          ? `${err.message} (${err.statusCode})`
          : (err as Error).message || "Đã có lỗi xảy ra khi gửi đánh giá.";
      showToast(message, "error");
    } finally {
      setReviewLoading(false);
    }
  }, [newReviewContent, newReviewRating, router, showToast, storyId]);

  return {
    reviews,
    reviewLoading,
    reviewsPage,
    setReviewsPage,
    reviewsTotalPages,
    newReviewRating,
    setNewReviewRating,
    newReviewContent,
    setNewReviewContent,
    showReviewDialog,
    setShowReviewDialog,
    handleReview,
  };
}

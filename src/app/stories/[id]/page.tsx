"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { MessageCircle, Star } from "lucide-react";
import { Button } from "@/components/ui/button";

import { useStoryDetail } from "./hooks/useStoryDetail";
import { useStoryComments } from "./hooks/useStoryComments";
import { useStoryReviews } from "./hooks/useStoryReviews";
import { useStoryDonation } from "./hooks/useStoryDonation";

import { StoryDetailSkeleton } from "./components/StoryDetailSkeleton";
import { StoryNotFound } from "./components/StoryNotFound";
import { StoryHeader } from "./components/StoryHeader";
import { StoryChapterList } from "./components/StoryChapterList";
import { StoryCommentFeed } from "./components/StoryCommentFeed";
import { StoryReviewFeed } from "./components/StoryReviewFeed";
import { StoryDonateModal } from "./components/StoryDonateModal";
import { StoryReviewDialog } from "./components/StoryReviewDialog";

export default function StoryDetailPage() {
  const params = useParams();
  const router = useRouter();
  const storyId = params.id as string;

  const [feedTab, setFeedTab] = useState<"comments" | "reviews">("comments");

  // Custom Domain Hooks
  const {
    story,
    chapters,
    loading,
    bookmarked,
    currentUserProfile,
    readChapterIds,
    authorFollowing,
    authorFollowingLoading,
    authorName,
    markAsRead,
    handleBookmark,
    handleAuthorFollow,
  } = useStoryDetail(storyId);

  const {
    commentLoading,
    newComment,
    setNewComment,
    newReply,
    setNewReply,
    replyTo,
    replyTargetUser,
    expandedComments,
    setExpandedComments,
    likedComments,
    originalLikes,
    likingIds,
    commentsPage,
    setCommentsPage,
    commentsTotalPages,
    rootComments,
    childComments,
    handleComment,
    toggleLike,
    setReplyTo,
    setReplyTargetUser,
  } = useStoryComments(storyId);

  const {
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
  } = useStoryReviews(storyId);

  const {
    showDonate,
    setShowDonate,
    donateAmount,
    setDonateAmount,
    donateMessage,
    setDonateMessage,
    donateLoading,
    handleDonate,
  } = useStoryDonation(storyId, story);

  if (loading) {
    return <StoryDetailSkeleton />;
  }

  if (!story) {
    return <StoryNotFound />;
  }

  return (
    <div className="min-h-screen transition-colors duration-400 bg-bg-brand pb-20 overflow-x-hidden">
      {/* Story Header & Metadata */}
      <StoryHeader
        story={story}
        chapters={chapters}
        authorName={authorName}
        bookmarked={bookmarked}
        authorFollowing={authorFollowing}
        authorFollowingLoading={authorFollowingLoading}
        currentUserProfile={currentUserProfile}
        onBookmark={handleBookmark}
        onAuthorFollow={handleAuthorFollow}
        onReadFirstChapter={() => {
          if (chapters[0]?.id) markAsRead(chapters[0].id);
          router.push(
            `/stories/${story.id}/chapters/${chapters[0]?.chapterNumber || 1}`
          );
        }}
        onOpenDonate={() => setShowDonate(true)}
        onSelectFeedTab={setFeedTab}
      />

      {/* Main Content Area */}
      <div className="container max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row gap-8 md:gap-12">
          {/* Spacer for aligning with header's left column on desktop */}
          <div className="w-full md:w-56 lg:w-64 shrink-0 hidden md:block" />

          {/* Right Column Content - Chapters */}
          <div className="flex-1 min-w-0">
            <StoryChapterList
              storyId={story.id}
              chapters={chapters}
              readChapterIds={readChapterIds}
              onMarkAsRead={markAsRead}
            />
          </div>
        </div>

        {/* Community & Comments/Reviews Feed */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-16 space-y-6 max-w-5xl mx-auto scroll-mt-32"
          id="reviews-section"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 bg-surface-elevated p-1 rounded-xl border border-border-brand/50">
              <button
                onClick={() => setFeedTab("comments")}
                className={`px-4 py-2 rounded-lg text-sm font-black transition-all flex items-center gap-1.5 ${
                  feedTab === "comments"
                    ? "bg-primary-brand text-slate-950 shadow-md"
                    : "text-text-muted hover:text-text-primary"
                }`}
              >
                <MessageCircle size={14} /> Bình luận ({rootComments.length})
              </button>
              <button
                onClick={() => setFeedTab("reviews")}
                className={`px-4 py-2 rounded-lg text-sm font-black transition-all flex items-center gap-1.5 ${
                  feedTab === "reviews"
                    ? "bg-primary-brand text-slate-950 shadow-md"
                    : "text-text-muted hover:text-text-primary"
                }`}
              >
                <Star
                  size={14}
                  className={feedTab === "reviews" ? "text-slate-950" : "text-accent-brand"}
                />{" "}
                Đánh giá ({reviews.length})
              </button>
            </div>
            <Button
              onClick={() => setShowReviewDialog(true)}
              variant="ghost"
              className="text-primary-brand hover:text-primary-light font-bold gap-2"
            >
              <Star size={18} />
              Đánh giá ngay
            </Button>
          </div>

          {/* Feed Content */}
          {feedTab === "comments" ? (
            <StoryCommentFeed
              story={story}
              currentUserProfile={currentUserProfile}
              rootComments={rootComments}
              childComments={childComments}
              commentLoading={commentLoading}
              newComment={newComment}
              newReply={newReply}
              replyTo={replyTo}
              replyTargetUser={replyTargetUser}
              expandedComments={expandedComments}
              likedComments={likedComments}
              originalLikes={originalLikes}
              likingIds={likingIds}
              commentsPage={commentsPage}
              commentsTotalPages={commentsTotalPages}
              onCommentChange={setNewComment}
              onReplyChange={setNewReply}
              onSetReplyTo={(cId, targetUser) => {
                setReplyTo(cId);
                setNewReply("");
                setReplyTargetUser(targetUser || null);
              }}
              onToggleExpandComment={(cId) =>
                setExpandedComments((prev) =>
                  prev.includes(cId) ? prev.filter((id) => id !== cId) : [...prev, cId]
                )
              }
              onToggleLike={toggleLike}
              onSubmitComment={handleComment}
              onPageChange={setCommentsPage}
            />
          ) : (
            <StoryReviewFeed
              story={story}
              reviews={reviews}
              reviewLoading={reviewLoading}
              reviewsPage={reviewsPage}
              reviewsTotalPages={reviewsTotalPages}
              onPageChange={setReviewsPage}
            />
          )}
        </motion.div>
      </div>

      {/* Donation Modal */}
      <StoryDonateModal
        isOpen={showDonate}
        onOpenChange={setShowDonate}
        donateAmount={donateAmount}
        donateMessage={donateMessage}
        donateLoading={donateLoading}
        onDonateAmountChange={setDonateAmount}
        onDonateMessageChange={setDonateMessage}
        onSubmitDonate={handleDonate}
      />

      {/* Review Rating Dialog */}
      <StoryReviewDialog
        isOpen={showReviewDialog}
        onOpenChange={setShowReviewDialog}
        rating={newReviewRating}
        content={newReviewContent}
        reviewLoading={reviewLoading}
        onRatingChange={setNewReviewRating}
        onContentChange={setNewReviewContent}
        onSubmitReview={handleReview}
      />
    </div>
  );
}

import React from "react";
import Image from "next/image";
import { MessageCircle, ThumbsUp, PenTool } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { isLoggedIn } from "@/lib/auth";
import { Story, Comment, UserProfile } from "../types/story-detail.types";

interface StoryCommentFeedProps {
  story: Story | null;
  currentUserProfile: UserProfile | null;
  rootComments: Comment[];
  childComments: Comment[];
  commentLoading: boolean;
  newComment: string;
  newReply: string;
  replyTo: string | null;
  replyTargetUser: string | null;
  expandedComments: string[];
  likedComments: string[];
  originalLikes: string[];
  likingIds: string[];
  commentsPage: number;
  commentsTotalPages: number;
  onCommentChange: (val: string) => void;
  onReplyChange: (val: string) => void;
  onSetReplyTo: (commentId: string | null, targetUser?: string | null) => void;
  onToggleExpandComment: (commentId: string) => void;
  onToggleLike: (commentId: string) => void;
  onSubmitComment: () => void;
  onPageChange: (page: number) => void;
}

export function StoryCommentFeed({
  story,
  currentUserProfile,
  rootComments,
  childComments,
  commentLoading,
  newComment,
  newReply,
  replyTo,
  replyTargetUser,
  expandedComments,
  likedComments,
  originalLikes,
  likingIds,
  commentsPage,
  commentsTotalPages,
  onCommentChange,
  onReplyChange,
  onSetReplyTo,
  onToggleExpandComment,
  onToggleLike,
  onSubmitComment,
  onPageChange,
}: StoryCommentFeedProps) {
  return (
    <div className="space-y-4">
      {/* Comment Input Form */}
      <div className="bg-surface-elevated/95 border border-border-brand/60 p-3 rounded-lg">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-8 h-8 rounded-full bg-linear-to-tr from-primary-brand to-secondary-brand flex items-center justify-center text-white font-black text-xs shadow-md border-2 border-white overflow-hidden shrink-0">
            {currentUserProfile?.avatar ? (
              <div className="w-full h-full relative">
                <Image
                  src={currentUserProfile.avatar}
                  alt="Avatar"
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>
            ) : (
              currentUserProfile?.displayName?.[0]?.toUpperCase() ||
              currentUserProfile?.username?.[0]?.toUpperCase() ||
              "B"
            )}
          </div>
          <p className="font-black text-text-primary text-xs">
            {isLoggedIn()
              ? currentUserProfile?.displayName || "Bạn"
              : "Đăng nhập để bình luận"}
          </p>
        </div>
        <textarea
          disabled={!isLoggedIn()}
          placeholder={
            isLoggedIn()
              ? "Chia sẻ ý kiến của bạn..."
              : "Vui lòng đăng nhập để bình luận"
          }
          className="w-full bg-surface-brand border border-border-brand rounded-lg p-2.5 text-xs text-text-secondary focus:outline-none focus:ring-2 focus:ring-primary-brand/30 min-h-[50px] resize-none disabled:opacity-50"
          value={newComment}
          onChange={(e) => onCommentChange(e.target.value)}
        />
        <div className="flex justify-end gap-2 mt-2">
          {newComment.trim() && (
            <Button
              variant="ghost"
              size="sm"
              className="text-text-muted hover:text-text-primary text-xs font-bold"
              onClick={() => onCommentChange("")}
            >
              Hủy
            </Button>
          )}
          <Button
            size="sm"
            className="bg-[#10b981] text-[#020617] hover:bg-[#10b981]/80 transition-colors font-black px-4 rounded-lg text-xs"
            onClick={onSubmitComment}
            disabled={!newComment.trim() || commentLoading || !isLoggedIn()}
          >
            {commentLoading ? "Đang gửi..." : "Gửi bình luận"}
          </Button>
        </div>
      </div>

      {/* Comments List */}
      <div className="space-y-3">
        {rootComments.length === 0 ? (
          <div className="py-12 text-center border-2 border-dashed border-border-brand rounded-2xl">
            <MessageCircle size={40} className="mx-auto mb-4 text-text-muted opacity-30" />
            <p className="text-text-muted font-medium">
              Chưa có bình luận nào. Hãy là người đầu tiên!
            </p>
          </div>
        ) : (
          rootComments.map((comment) => {
            const authorName = comment.user?.isAnonymous
              ? "Người dùng"
              : comment.user?.displayName ||
                comment.user?.username ||
                comment.user?.name ||
                "Người dùng";
            const isAuthor =
              !comment.user?.isAnonymous &&
              Boolean(
                comment.user?.id &&
                  (comment.user.id === story?.author?.id ||
                    comment.user.id === (story as any)?.authorId)
              );
            const initial = authorName[0].toUpperCase();
            const repliesForThisComment = childComments
              .filter((c: Comment) => c.parentId === comment.id)
              .sort(
                (a: Comment, b: Comment) =>
                  new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
              );
            const isExpanded = expandedComments.includes(comment.id);

            return (
              <div key={comment.id} className="group">
                <div className="bg-surface-elevated/95 border border-border-brand/60 p-3 rounded-lg group-hover:bg-surface-brand transition-all shadow-sm">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 rounded-full bg-linear-to-tr from-primary-brand to-secondary-brand flex items-center justify-center text-white font-black text-xs shadow-md border-2 border-white overflow-hidden shrink-0">
                      {comment.user?.avatar && !comment.user?.isAnonymous ? (
                        <div className="w-full h-full relative">
                          <Image
                            src={comment.user.avatar}
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
                    <div>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <p className="font-bold text-text-primary text-xs">{authorName}</p>
                        {isAuthor && (
                          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[9px] font-extrabold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 shadow-xs">
                            <PenTool size={9} className="stroke-[2.5]" /> Tác giả
                          </span>
                        )}
                      </div>
                      <p className="text-[9px] text-text-muted font-bold">
                        {new Intl.DateTimeFormat("vi").format(new Date(comment.createdAt))}
                      </p>
                    </div>
                  </div>
                  <div className="border-t border-border-brand my-1.5" />
                  <p className="text-text-secondary leading-relaxed font-medium text-xs">
                    {comment.content}
                  </p>
                  <div className="mt-2 flex items-center gap-3">
                    <button
                      className={cn(
                        "flex items-center gap-1 text-xs font-bold transition-colors",
                        likedComments.includes(comment.id)
                          ? "text-red-500 scale-110"
                          : "text-text-muted hover:text-red-500"
                      )}
                      onClick={() => onToggleLike(comment.id)}
                      disabled={likingIds.includes(comment.id)}
                    >
                      <ThumbsUp
                        size={14}
                        fill={likedComments.includes(comment.id) ? "#ef4444" : "none"}
                        stroke={likedComments.includes(comment.id) ? "#ef4444" : "currentColor"}
                      />
                      <span className="ml-1">
                        {(comment._count?.likes || 0) +
                          (originalLikes.includes(comment.id) &&
                          !likedComments.includes(comment.id)
                            ? -1
                            : !originalLikes.includes(comment.id) &&
                              likedComments.includes(comment.id)
                            ? 1
                            : 0)}
                      </span>
                    </button>
                    <button
                      className="flex items-center gap-1 text-xs font-bold text-text-muted hover:text-primary-brand transition-colors"
                      onClick={() => onSetReplyTo(comment.id, authorName)}
                    >
                      <MessageCircle size={12} fill="currentColor" /> Trả lời
                    </button>
                    {repliesForThisComment.length > 0 && (
                      <button
                        className="flex items-center gap-1 text-xs font-bold text-[#10b981] hover:underline transition-all ml-auto"
                        onClick={() => onToggleExpandComment(comment.id)}
                      >
                        <MessageCircle size={12} />{" "}
                        {isExpanded ? "Ẩn" : `${repliesForThisComment.length}`} phản hồi
                      </button>
                    )}
                  </div>

                  {isExpanded && (
                    <div className="pl-8 mt-4 space-y-3 border-t border-border-brand/50 pt-3">
                      {repliesForThisComment.map((reply) => {
                        const replyAuthorName = reply.user?.isAnonymous
                          ? "Người dùng"
                          : reply.user?.displayName ||
                            reply.user?.username ||
                            reply.user?.name ||
                            "Người dùng";
                        const isReplyAuthor =
                          !reply.user?.isAnonymous &&
                          Boolean(
                            reply.user?.id &&
                              (reply.user.id === story?.author?.id ||
                                reply.user.id === (story as any)?.authorId)
                          );
                        const match = reply.content.match(/^\[@([^\]]+)\]\s*(.*)/);
                        const taggedName = match ? match[1] : null;
                        const actualContent = match ? match[2] : reply.content;
                        return (
                          <div
                            key={reply.id}
                            className="group/reply bg-surface-brand border border-border-brand/30 p-3 rounded-lg transition-all hover:bg-surface-elevated shadow-sm"
                          >
                            <div className="flex items-center gap-2 mb-2">
                              <div className="font-bold text-xs text-text-primary flex items-center gap-1.5 flex-wrap">
                                <span>{replyAuthorName}</span>
                                {isReplyAuthor && (
                                  <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[9px] font-extrabold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 shadow-xs">
                                    <PenTool size={9} className="stroke-[2.5]" /> Tác giả
                                  </span>
                                )}
                                {taggedName && (
                                  <span className="text-text-muted font-medium text-[10px] flex items-center gap-1">
                                    trả lời{" "}
                                    <span className="text-emerald-500">@{taggedName}</span>
                                  </span>
                                )}
                              </div>
                              <p className="text-[9px] text-text-muted font-bold">
                                •{" "}
                                {new Intl.DateTimeFormat("vi").format(
                                  new Date(reply.createdAt)
                                )}
                              </p>
                            </div>
                            <p className="text-text-secondary text-xs font-medium mb-2">
                              {actualContent}
                            </p>
                            <div className="flex items-center gap-2">
                              <button
                                className={cn(
                                  "flex items-center gap-0.5 text-[10px] font-bold transition-all duration-200",
                                  likedComments.includes(reply.id)
                                    ? "text-red-500 scale-110"
                                    : "text-text-muted hover:text-red-500"
                                )}
                                onClick={() => onToggleLike(reply.id)}
                                disabled={likingIds.includes(reply.id)}
                              >
                                <ThumbsUp
                                  size={12}
                                  fill={likedComments.includes(reply.id) ? "#ef4444" : "none"}
                                  stroke={
                                    likedComments.includes(reply.id) ? "#ef4444" : "currentColor"
                                  }
                                />
                                <span className="ml-0.5">
                                  {(reply._count?.likes || 0) +
                                    (originalLikes.includes(reply.id) &&
                                    !likedComments.includes(reply.id)
                                      ? -1
                                      : !originalLikes.includes(reply.id) &&
                                        likedComments.includes(reply.id)
                                      ? 1
                                      : 0)}
                                </span>
                              </button>
                              <button
                                className="flex items-center gap-1 text-[10px] font-bold text-text-muted hover:text-primary-brand transition-colors"
                                onClick={() => onSetReplyTo(comment.id, replyAuthorName)}
                              >
                                <MessageCircle size={10} fill="currentColor" /> Trả lời
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {replyTo === comment.id && (
                    <div className="mt-4 pt-3 border-t border-slate-200/50 pl-8">
                      {replyTargetUser && (
                        <div className="flex items-center gap-1.5 mb-2.5">
                          <span className="text-xs text-text-muted">Trả lời</span>
                          <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-500 text-xs font-bold border border-emerald-500/20">
                            @{replyTargetUser}
                          </span>
                        </div>
                      )}
                      <textarea
                        autoFocus
                        placeholder="Viết câu trả lời..."
                        className="w-full bg-surface-brand border border-border-brand rounded-lg p-2 text-text-secondary text-sm focus:outline-none focus:ring-2 focus:ring-primary-brand/30 min-h-[50px] resize-none"
                        value={newReply}
                        onChange={(e) => onReplyChange(e.target.value)}
                      />
                      <div className="flex justify-end gap-2 mt-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-text-muted hover:text-text-secondary text-xs font-bold"
                          onClick={() => onSetReplyTo(null, null)}
                        >
                          Hủy
                        </Button>
                        <Button
                          size="sm"
                          className="bg-[#10b981] text-white hover:bg-[#10b981]/80 transition-colors font-black px-3 rounded-lg text-xs"
                          onClick={onSubmitComment}
                          disabled={!newReply.trim() || commentLoading}
                        >
                          {commentLoading ? "..." : "Gửi"}
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Comments Pagination */}
      {!commentLoading && rootComments.length > 0 && commentsTotalPages > 1 && (
        <div className="mt-8">
          <Pagination>
            <PaginationContent className="bg-surface-brand border border-border-brand p-1 rounded-md gap-1">
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    if (commentsPage > 1) onPageChange(commentsPage - 1);
                  }}
                  className={cn(
                    "text-text-muted hover:text-text-primary border-transparent rounded-md",
                    commentsPage <= 1 && "pointer-events-none opacity-20"
                  )}
                />
              </PaginationItem>
              {Array.from({ length: commentsTotalPages }).map((_, i) => (
                <PaginationItem key={i}>
                  <PaginationLink
                    href="#"
                    isActive={commentsPage === i + 1}
                    onClick={(e) => {
                      e.preventDefault();
                      onPageChange(i + 1);
                    }}
                    className={cn(
                      "w-9 h-9 rounded-md transition-all text-sm",
                      commentsPage === i + 1
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
                    if (commentsPage < commentsTotalPages) onPageChange(commentsPage + 1);
                  }}
                  className={cn(
                    "text-text-muted hover:text-text-primary border-transparent rounded-md",
                    commentsPage >= commentsTotalPages && "pointer-events-none opacity-20"
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

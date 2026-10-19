import { useEffect, useState, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api";
import { isLoggedIn } from "@/lib/auth";
import { useToast } from "@/components/Toast";
import { Comment } from "../types/story-detail.types";

export function useStoryComments(storyId: string) {
  const router = useRouter();
  const { showToast } = useToast();

  const [comments, setComments] = useState<Comment[]>([]);
  const [commentLoading, setCommentLoading] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [newReply, setNewReply] = useState("");
  const [replyTo, setReplyTo] = useState<string | null>(null);
  const [replyTargetUser, setReplyTargetUser] = useState<string | null>(null);

  const [expandedComments, setExpandedComments] = useState<string[]>([]);
  const [likedComments, setLikedComments] = useState<string[]>([]);
  const [originalLikes, setOriginalLikes] = useState<string[]>([]);
  const [likingIds, setLikingIds] = useState<string[]>([]);

  const [commentsPage, setCommentsPage] = useState(1);
  const [commentsTotalPages, setCommentsTotalPages] = useState(1);

  const fetchComments = useCallback(async (page: number) => {
    if (!storyId) return;
    setCommentLoading(true);
    try {
      const res = await apiFetch<any>(`/stories/${storyId}/comments?page=${page}&limit=10`);
      const rawComments = Array.isArray(res) ? res : res.data || [];
      const pagination = res.pagination;

      if (pagination) {
        setCommentsTotalPages(pagination.totalPages || 1);
      } else {
        setCommentsTotalPages(1);
      }

      const flatComments: Comment[] = [];
      const likedIds: string[] = [];

      rawComments.forEach((c: Comment) => {
        flatComments.push(c);
        if (c.isLiked) likedIds.push(c.id);
        if (c.replies && Array.isArray(c.replies)) {
          c.replies.forEach((r: Comment) => {
            flatComments.push({ ...r, parentId: c.id });
            if (r.isLiked) likedIds.push(r.id);
          });
        }
      });

      setComments(flatComments);
      setLikedComments(likedIds);
      setOriginalLikes(likedIds);
    } catch (err) {
      console.error("Failed to fetch comments", err);
    } finally {
      setCommentLoading(false);
    }
  }, [storyId]);

  useEffect(() => {
    fetchComments(commentsPage);
  }, [fetchComments, commentsPage]);

  const handleComment = useCallback(async () => {
    if (!isLoggedIn()) {
      router.push("/login");
      return;
    }
    const contentToSubmit =
      replyTo && replyTargetUser
        ? `[@${replyTargetUser}] ${newReply}`
        : replyTo
        ? newReply
        : newComment;
    if (!contentToSubmit.trim()) return;

    setCommentLoading(true);
    try {
      const comment = await apiFetch<Comment>(`/stories/${storyId}/comments`, {
        method: "POST",
        body: JSON.stringify({ content: contentToSubmit, parentId: replyTo }),
      });

      setComments((prev) => [comment, ...prev]);
      if (replyTo) {
        setNewReply("");
        setReplyTo(null);
        setReplyTargetUser(null);
      } else {
        setNewComment("");
      }
    } catch (err) {
      showToast((err as Error).message || "Không thể gửi bình luận", "error");
    } finally {
      setCommentLoading(false);
    }
  }, [newComment, newReply, replyTargetUser, replyTo, router, showToast, storyId]);

  const toggleLike = useCallback(async (commentId: string) => {
    if (!isLoggedIn()) {
      showToast("Vui lòng đăng nhập để thực hiện hành động này", "error");
      router.push("/login");
      return;
    }

    if (likingIds.includes(commentId)) return;

    setLikingIds((prev) => [...prev, commentId]);
    const isLiked = likedComments.includes(commentId);

    // Optimistic update
    if (isLiked) {
      setLikedComments((prev) => prev.filter((id) => id !== commentId));
    } else {
      setLikedComments((prev) => [...prev, commentId]);
    }

    try {
      if (isLiked) {
        await apiFetch(`/comments/${commentId}/like`, { method: "DELETE" });
      } else {
        await apiFetch(`/comments/${commentId}/like`, { method: "POST" });
      }
    } catch {
      // Revert optimistic update
      if (isLiked) {
        setLikedComments((prev) => [...prev, commentId]);
      } else {
        setLikedComments((prev) => prev.filter((id) => id !== commentId));
      }
      showToast("Không thể thực hiện hành động. Vui lòng thử lại.", "error");
    } finally {
      setLikingIds((prev) => prev.filter((id) => id !== commentId));
    }
  }, [likedComments, likingIds, router, showToast]);

  const rootComments = useMemo(
    () => comments.filter((c) => !c.parentId),
    [comments]
  );
  const childComments = useMemo(
    () => comments.filter((c) => c.parentId),
    [comments]
  );

  return {
    comments,
    commentLoading,
    newComment,
    setNewComment,
    newReply,
    setNewReply,
    replyTo,
    setReplyTo,
    replyTargetUser,
    setReplyTargetUser,
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
  };
}

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api";
import { isLoggedIn } from "@/lib/auth";
import { useToast } from "@/components/Toast";
import { Story, Chapter, UserProfile } from "../types/story-detail.types";

export function useStoryDetail(storyId: string) {
  const router = useRouter();
  const { showToast } = useToast();

  const [story, setStory] = useState<Story | null>(null);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [loading, setLoading] = useState(true);
  const [bookmarked, setBookmarked] = useState(false);
  const [currentUserProfile, setCurrentUserProfile] = useState<UserProfile | null>(null);
  const [readChapterIds, setReadChapterIds] = useState<string[]>([]);
  const [authorFollowing, setAuthorFollowing] = useState(false);
  const [authorFollowingLoading, setAuthorFollowingLoading] = useState(false);

  const authorName =
    story?.author?.displayName ||
    story?.author?.username ||
    story?.author?.name ||
    "Unknown";

  useEffect(() => {
    if (!storyId) return;

    Promise.allSettled([
      apiFetch<Story>(`/stories/${storyId}`),
      apiFetch<Chapter[]>(`/stories/${storyId}/chapters`),
      Promise.resolve(null),
      isLoggedIn() ? apiFetch<UserProfile>("/users/me") : Promise.resolve(null),
      isLoggedIn() ? apiFetch<string[]>(`/reading-history/story/${storyId}`) : Promise.resolve([] as string[])
    ])
      .then(([storyResult, chaptersResult, , profileResult, historyResult]) => {
        if (storyResult.status === "fulfilled") {
          const storyData = storyResult.value;
          setStory(storyData);
          if (isLoggedIn() && storyData.author?.id) {
            apiFetch<{ isFollowing: boolean }>(`/follow/check/${storyData.author.id}`)
              .then((res) => setAuthorFollowing(res.isFollowing))
              .catch(() => {});
          }
        } else {
          setLoading(false);
          return;
        }

        if (chaptersResult.status === "fulfilled") {
          setChapters(Array.isArray(chaptersResult.value) ? chaptersResult.value : []);
        }

        if (profileResult.status === "fulfilled" && profileResult.value) {
          setCurrentUserProfile(profileResult.value);
        }

        if (historyResult.status === "fulfilled") {
          setReadChapterIds(historyResult.value || []);
        }

        setLoading(false);
      })
      .catch(() => setLoading(false));

    if (isLoggedIn()) {
      apiFetch<{ isBookmarked: boolean }>(`/bookmarks/check/${storyId}`)
        .then((res) =>
          setBookmarked(
            res.isBookmarked || (res as unknown as boolean) === true
          )
        )
        .catch(() => {});
    }
  }, [storyId]);

  const markAsRead = useCallback(async (chapterId: string) => {
    if (!isLoggedIn() || readChapterIds.includes(chapterId)) return;
    setReadChapterIds((prev) => [...prev, chapterId]);
    try {
      await apiFetch("/reading-history", {
        method: "POST",
        body: JSON.stringify({ storyId, chapterId }),
      });
    } catch (err) {
      console.error("Failed to save reading history optimistically:", err);
    }
  }, [readChapterIds, storyId]);

  const handleBookmark = useCallback(async () => {
    if (!isLoggedIn()) {
      router.push("/login");
      return;
    }
    const prev = bookmarked;
    setBookmarked(!prev);
    try {
      if (prev) {
        await apiFetch(`/bookmarks/${storyId}`, { method: "DELETE" });
      } else {
        await apiFetch(`/bookmarks/${storyId}`, { method: "POST" });
      }
    } catch {
      setBookmarked(prev);
    }
  }, [bookmarked, router, storyId]);

  const handleAuthorFollow = useCallback(async () => {
    if (!isLoggedIn()) {
      router.push("/login");
      return;
    }
    if (!story?.author?.id || authorFollowingLoading) return;

    const prev = authorFollowing;
    setAuthorFollowing(!prev);
    setAuthorFollowingLoading(true);

    try {
      if (prev) {
        await apiFetch(`/follow/${story.author.id}`, { method: "DELETE" });
        showToast(`Đã bỏ theo dõi ${authorName}`, "success");
      } else {
        await apiFetch(`/follow/${story.author.id}`, { method: "POST" });
        showToast(`Đang theo dõi ${authorName}`, "success");
      }
    } catch (err) {
      setAuthorFollowing(prev);
      showToast((err as Error).message || "Thao tác thất bại", "error");
    } finally {
      setAuthorFollowingLoading(false);
    }
  }, [authorFollowing, authorFollowingLoading, authorName, router, showToast, story?.author?.id]);

  return {
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
  };
}

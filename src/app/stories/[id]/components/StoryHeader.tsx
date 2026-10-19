import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  BookOpen,
  Star,
  User,
  Eye,
  BookmarkCheck,
  MessageCircle,
  Heart,
  Clock,
  Share2,
  ChevronLeft,
  UserPlus,
  UserMinus,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { isLoggedIn } from "@/lib/auth";
import { Story, Chapter, UserProfile, DEFAULT_COVER } from "../types/story-detail.types";

interface StoryHeaderProps {
  story: Story;
  chapters: Chapter[];
  authorName: string;
  bookmarked: boolean;
  authorFollowing: boolean;
  authorFollowingLoading: boolean;
  currentUserProfile: UserProfile | null;
  onBookmark: () => void;
  onAuthorFollow: () => void;
  onReadFirstChapter: () => void;
  onOpenDonate: () => void;
  onSelectFeedTab: (tab: "comments" | "reviews") => void;
}

export function StoryHeader({
  story,
  chapters,
  authorName,
  bookmarked,
  authorFollowing,
  authorFollowingLoading,
  currentUserProfile,
  onBookmark,
  onAuthorFollow,
  onReadFirstChapter,
  onOpenDonate,
  onSelectFeedTab,
}: StoryHeaderProps) {
  const router = useRouter();

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    const target = e.currentTarget;
    if (target.src !== DEFAULT_COVER) {
      target.src = DEFAULT_COVER;
    } else {
      target.style.display = "none";
      if (target.parentElement) {
        target.parentElement.innerHTML =
          '<div class="w-full h-full flex flex-col items-center justify-center text-text-muted bg-surface-elevated"><svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-book-open mb-4 opacity-20"><path d="M2 3h6a2 2 0 0 1 2 2v14a2 2 0 0 0-2-2H2z"/><path d="M22 3h-6a2 2 0 0 0-2 2v14a2 2 0 0 1 2-2h6z"/></svg></div>';
      }
    }
  };

  return (
    <>
      {/* Immersive Background Header */}
      <div className="relative h-[20vh] md:h-[25vh] w-full overflow-hidden">
        {story.coverImage && (
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat scale-110 blur-3xl opacity-20 transition-opacity duration-1000"
            style={{ backgroundImage: `url(${story.coverImage})` }}
          />
        )}
        <div className="absolute inset-0 bg-linear-to-b from-bg-brand/0 via-bg-brand/80 to-bg-brand" />
      </div>

      <div className="container max-w-7xl mx-auto px-6 -mt-20 md:-mt-28 relative z-10">
        <div className="mb-6">
          <button
            onClick={() => router.push("/")}
            className="flex items-center gap-2 text-text-muted hover:text-emerald-500 transition-colors font-bold text-xs group"
          >
            <div className="p-1.5 rounded-lg bg-surface-elevated group-hover:bg-emerald-500/10 transition-colors">
              <ChevronLeft size={14} />
            </div>
            Quay lại trang chủ
          </button>
        </div>

        <div className="flex flex-col md:flex-row gap-8 md:gap-12">
          {/* Left Sidebar - Cover Image & Actions */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full md:w-56 lg:w-64 shrink-0"
          >
            <div className="relative group rounded-3xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-border-brand aspect-2/3 bg-surface-elevated">
              {story.coverImage ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={story.coverImage}
                  alt={story.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  onError={handleImageError}
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-text-muted bg-surface-elevated">
                  <BookOpen size={64} className="mb-4 opacity-20" />
                  <span className="text-sm font-medium opacity-40">Không có ảnh bìa</span>
                </div>
              )}
            </div>

            <div className="mt-6 space-y-3">
              <Button
                variant="outline"
                onClick={onOpenDonate}
                className="w-full h-10 border-rose-500/20 bg-surface-elevated text-rose-500 hover:bg-rose-500/10 transition-all rounded-lg gap-1.5 font-bold cursor-pointer text-xs"
              >
                <Heart size={14} fill="currentColor" />
                Ủng hộ tác giả
              </Button>
              <Button
                variant="outline"
                className="w-full h-10 border-border-brand bg-surface-elevated text-text-primary hover:bg-surface-brand transition-all rounded-lg gap-1.5 font-bold cursor-pointer text-xs"
              >
                <Share2 size={14} />
                Chia sẻ truyện
              </Button>
            </div>
          </motion.div>

          {/* Right Content - Info */}
          <div className="flex-1 min-w-0">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="space-y-6"
            >
              <div className="space-y-4">
                <div className="flex flex-wrap items-center gap-3">
                  {story.status && (
                    <Badge
                      className={cn(
                        "px-3 py-1 rounded-full text-xs font-bold tracking-wider",
                        story.status === "COMPLETED"
                          ? "bg-blue-500/20 text-blue-400 border-blue-500/30"
                          : story.status === "ONGOING"
                          ? "bg-[#10b981]/20 text-[#10b981] border-[#10b981]/30"
                          : "bg-yellow-500/20 text-yellow-500 border-yellow-500/30"
                      )}
                    >
                      {story.status === "ONGOING"
                        ? "ĐANG RA"
                        : story.status === "COMPLETED"
                        ? "HOÀN THÀNH"
                        : "TẠM DỪNG"}
                    </Badge>
                  )}
                  {story.type && (
                    <Badge
                      variant="outline"
                      className="px-3 py-1 rounded-full text-xs font-bold tracking-wider border-border-brand text-text-muted"
                    >
                      {story.type}
                    </Badge>
                  )}
                </div>

                <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-text-primary leading-[1.2] tracking-tight">
                  {story.title}
                </h1>

                {/* Genres */}
                {story.genres && story.genres.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {story.genres.map((g) => (
                      <Link
                        key={g.genre?.id || g.id}
                        href={`/stories?genre=${g.genre?.id || g.id}`}
                        className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-500 text-xs font-medium border border-emerald-500/20 hover:bg-emerald-500 hover:text-white transition-all duration-300"
                      >
                        {g.genre?.name || g.name}
                      </Link>
                    ))}
                  </div>
                )}

                <div className="flex flex-wrap items-center gap-4 text-xs text-text-muted font-bold">
                  {story.author?.id ? (
                    <div className="flex items-center gap-3">
                      <Link
                        href={`/users/${story.author.id}`}
                        className="flex items-center gap-2 hover:text-primary-brand transition-colors group text-sm"
                      >
                        <div className="w-8 h-8 rounded-full bg-primary-brand/10 flex items-center justify-center text-primary-brand group-hover:bg-primary-brand group-hover:text-white transition-all shadow-sm border border-border-brand/40 overflow-hidden ring-1 ring-emerald-500/10">
                          {story.author.avatar ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={story.author.avatar}
                              alt={authorName}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <User size={14} />
                          )}
                        </div>
                        <span className="text-text-primary whitespace-nowrap">{authorName}</span>
                      </Link>

                      {isLoggedIn() && currentUserProfile?.id !== story.author.id && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.preventDefault();
                            onAuthorFollow();
                          }}
                          disabled={authorFollowingLoading}
                          className={cn(
                            "h-7 px-3 text-[10px] font-black rounded-full transition-all gap-1.5 border uppercase tracking-wider",
                            authorFollowing
                              ? "bg-[#10b981]/10 text-[#10b981] border-[#10b981]/30 hover:bg-[#10b981]/20"
                              : "bg-surface-elevated text-text-muted border-border-brand/60 hover:text-[#10b981] hover:border-[#10b981]/50 hover:bg-[#10b981]/5"
                          )}
                        >
                          {authorFollowing ? (
                            <>
                              <UserMinus size={12} />
                              Đang theo dõi
                            </>
                          ) : (
                            <>
                              <UserPlus size={12} />
                              Theo dõi
                            </>
                          )}
                        </Button>
                      )}
                    </div>
                  ) : (
                    <span className="flex items-center gap-2">
                      <User size={14} />
                      {authorName}
                    </span>
                  )}

                  <div className="flex items-center gap-1.5">
                    <Star className="text-accent-brand" size={14} fill="currentColor" />
                    <span className="text-text-primary font-black">
                      {story.rating?.toFixed(1) || "5.0"}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <Eye size={14} className="text-primary-brand" />
                    <span>{Intl.NumberFormat("vi").format(story.viewCount || 0)} lượt xem</span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <Clock size={14} className="text-secondary-brand" />
                    <span>
                      {story.updatedAt
                        ? new Intl.DateTimeFormat("vi").format(new Date(story.updatedAt))
                        : "Vừa xong"}
                    </span>
                  </div>
                </div>
              </div>

              <Separator className="bg-border-brand" />

              <div className="space-y-3">
                <h3 className="text-lg font-black text-text-primary flex items-center gap-2">
                  <div className="w-1.5 h-5 bg-primary-brand rounded-full shadow-lg shadow-primary-glow" />
                  Cốt truyện
                </h3>
                <p className="text-text-secondary leading-relaxed text-sm md:text-base line-clamp-4 hover:line-clamp-none transition-all duration-500 cursor-pointer italic">
                  {story.description || "Chưa có mô tả cho bộ truyện này."}
                </p>
              </div>

              <div className="pt-2 flex flex-wrap gap-2">
                {chapters.length > 0 && (
                  <Button
                    onClick={onReadFirstChapter}
                    className="h-10 px-6 bg-[#8ac94e] hover:bg-[#7ab343] text-white font-black rounded-lg gap-2 shadow-md transition-all hover:scale-105 active:scale-95 text-xs border-none"
                  >
                    <BookOpen size={16} />
                    Đọc từ đầu
                  </Button>
                )}

                <Button
                  onClick={onBookmark}
                  className={cn(
                    "h-10 px-6 font-black rounded-lg gap-2 shadow-md transition-all hover:scale-105 active:scale-95 text-xs border-none",
                    bookmarked
                      ? "bg-primary-brand text-slate-950"
                      : "bg-[#ff3b5c] hover:bg-[#e63250] text-white"
                  )}
                >
                  {bookmarked ? <BookmarkCheck size={16} /> : "Theo dõi"}
                </Button>

                <Button
                  onClick={() => {
                    onSelectFeedTab("comments");
                    document.getElementById("reviews-section")?.scrollIntoView({ behavior: "smooth" });
                  }}
                  variant="outline"
                  className="h-10 px-4 border-border-brand bg-surface-elevated text-text-primary hover:bg-surface-brand font-bold rounded-lg gap-2 text-xs"
                >
                  <MessageCircle size={16} />
                  Bình luận
                </Button>

                <Button
                  onClick={() => {
                    onSelectFeedTab("reviews");
                    document.getElementById("reviews-section")?.scrollIntoView({ behavior: "smooth" });
                  }}
                  variant="outline"
                  className="h-10 px-4 border-border-brand bg-surface-elevated text-text-primary hover:bg-surface-brand font-bold rounded-lg gap-2 text-xs"
                >
                  <Star size={16} className="text-accent-brand" />
                  Đánh giá
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </>
  );
}

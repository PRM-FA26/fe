import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { BookOpen, Clock, Eye, Crown, ChevronRight, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Chapter, CHAPTERS_INITIAL } from "../types/story-detail.types";

interface StoryChapterListProps {
  storyId: string;
  chapters: Chapter[];
  readChapterIds: string[];
  onMarkAsRead: (chapterId: string) => void;
}

export function StoryChapterList({
  storyId,
  chapters,
  readChapterIds,
  onMarkAsRead,
}: StoryChapterListProps) {
  const [activeTab, setActiveTab] = useState("chapters");
  const [showAllChapters, setShowAllChapters] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="mt-12 scroll-mt-24"
      id="chapters-section"
    >
      <Tabs defaultValue="chapters" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="bg-surface-elevated p-1 h-auto rounded-xl border border-border-brand backdrop-blur-xl mb-6 flex-wrap justify-start">
          <TabsTrigger
            value="chapters"
            className="rounded-lg px-4 py-2 text-xs data-[state=active]:bg-primary-brand data-[state=active]:text-slate-950 text-text-muted font-black transition-all gap-1.5"
          >
            <BookOpen size={14} />
            CHƯƠNG ({chapters.length})
          </TabsTrigger>
        </TabsList>

        {/* Chapters Content */}
        <TabsContent value="chapters" className="mt-0 outline-none">
          <div className="space-y-3">
            {chapters.length > 0 ? (
              <>
                {(showAllChapters ? chapters : chapters.slice(0, CHAPTERS_INITIAL)).map((ch, idx) => (
                  <motion.div
                    key={ch.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.05 * Math.min(idx, 15) }}
                  >
                    <Link
                      href={`/stories/${storyId}/chapters/${ch.chapterNumber}`}
                      onClick={() => onMarkAsRead(ch.id)}
                      className={cn(
                        "group block relative p-3 bg-surface-brand/40 border border-border-brand/50 rounded-xl hover:bg-surface-elevated hover:border-primary-brand/30 transition-all duration-300 backdrop-blur-sm overflow-hidden",
                        readChapterIds.includes(ch.id) && "opacity-60 bg-surface-brand/20"
                      )}
                    >
                      <div className="flex items-center gap-4">
                        {/* Chapter Number Badge */}
                        <div className="w-10 h-10 shrink-0 rounded-xl bg-surface-elevated border border-border-brand flex flex-col items-center justify-center group-hover:bg-primary-brand group-hover:border-primary-brand transition-all duration-300 shadow-sm relative overflow-hidden">
                          <span className="text-[8px] font-black text-text-muted uppercase tracking-tighter group-hover:text-slate-900 leading-none mb-0.5">
                            CH
                          </span>
                          <span className="text-sm font-black text-text-primary group-hover:text-slate-950 leading-none">
                            {ch.chapterNumber}
                          </span>
                          <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>

                        {/* Title and Info section */}
                        <div className="flex-1 min-w-0 flex flex-col md:flex-row md:items-center justify-between gap-2">
                          <div className="space-y-0.5">
                            <h4
                              className={cn(
                                "text-sm font-black transition-colors truncate",
                                readChapterIds.includes(ch.id)
                                  ? "text-text-muted"
                                  : "text-text-primary group-hover:text-primary-brand"
                              )}
                            >
                              {ch.title}
                            </h4>
                            <div className="flex items-center gap-3 text-[11px] font-bold text-text-muted">
                              <div className="flex items-center gap-1">
                                <Clock size={11} className="text-secondary-brand" />
                                <span>
                                  {ch.createdAt
                                    ? new Intl.DateTimeFormat("vi").format(new Date(ch.createdAt))
                                    : "Vừa xong"}
                                </span>
                              </div>
                              <div className="hidden sm:flex items-center gap-1">
                                <Eye size={11} className="text-primary-brand" />
                                <span>Mới</span>
                              </div>
                            </div>
                          </div>

                          {/* Right Actions/Badges */}
                          <div className="flex items-center gap-3 shrink-0">
                            {ch.isPremium && (
                              <Badge className="bg-accent-brand/20 text-accent-brand border border-accent-brand/20 gap-1 px-2 py-0.5 font-black text-[9px]">
                                <Crown size={10} fill="currentColor" />
                                PREMIUM
                              </Badge>
                            )}
                            <div className="flex items-center gap-1.5 group-hover:translate-x-1 transition-transform">
                              <span className="text-[9px] font-black text-primary-brand opacity-0 group-hover:opacity-100 transition-opacity uppercase tracking-widest hidden sm:block">
                                ĐỌC NGAY
                              </span>
                              <div className="w-7 h-7 rounded-full border border-border-brand flex items-center justify-center group-hover:border-primary-brand group-hover:bg-primary-brand transition-all">
                                <ChevronRight
                                  size={14}
                                  className="text-text-muted group-hover:text-slate-950"
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Visual Glow Effect on Hover */}
                      <div className="absolute top-0 right-0 w-32 h-full bg-linear-to-l from-primary-brand/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                    </Link>
                  </motion.div>
                ))}

                {chapters.length > CHAPTERS_INITIAL && (
                  <button
                    onClick={() => {
                      const next = !showAllChapters;
                      setShowAllChapters(next);
                      if (!next) {
                        setTimeout(() => {
                          document
                            .getElementById("chapters-section")
                            ?.scrollIntoView({ behavior: "smooth", block: "start" });
                        }, 50);
                      }
                    }}
                    className="w-full mt-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border border-dashed border-border-brand/60 bg-surface-brand/40 hover:bg-surface-elevated hover:border-primary-brand/40 text-text-muted hover:text-primary-brand transition-all duration-300 text-xs font-black"
                  >
                    <span>{showAllChapters ? "Thu gọn" : "Xem thêm"}</span>
                    <ChevronDown
                      size={15}
                      className={cn(
                        "transition-transform duration-300",
                        showAllChapters && "rotate-180"
                      )}
                    />
                  </button>
                )}
              </>
            ) : (
              <div className="py-32 text-center bg-surface-brand/40 border-2 border-dashed border-border-brand rounded-3xl">
                <BookOpen size={48} className="mx-auto mb-4 text-text-muted opacity-20" />
                <h5 className="text-xl font-black text-text-muted">Chưa có chương nào</h5>
                <p className="text-text-muted/60 font-bold mt-2">
                  Dường như tác giả đang tích cực chuẩn bị nội dung mới!
                </p>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </motion.div>
  );
}

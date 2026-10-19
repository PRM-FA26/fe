export function StoryDetailSkeleton() {
  return (
    <div className="min-h-screen bg-bg-brand pt-0 pb-20">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="w-full md:w-72 aspect-2/3 bg-surface-elevated rounded-2xl animate-pulse" />
          <div className="flex-1 space-y-4">
            <div className="h-10 bg-surface-elevated rounded-lg animate-pulse w-2/3" />
            <div className="h-6 bg-surface-elevated rounded-lg animate-pulse w-1/3" />
            <div className="h-32 bg-surface-elevated rounded-lg animate-pulse w-full" />
          </div>
        </div>
      </div>
    </div>
  );
}

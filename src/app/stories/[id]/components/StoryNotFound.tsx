import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export function StoryNotFound() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-bg-brand flex items-center justify-center text-text-primary">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-4">Không tìm thấy truyện</h2>
        <Button
          onClick={() => router.push("/")}
          variant="outline"
          className="border-border-brand hover:bg-surface-elevated text-text-primary"
        >
          Quay lại trang chủ
        </Button>
      </div>
    </div>
  );
}

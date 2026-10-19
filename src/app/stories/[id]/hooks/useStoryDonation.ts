import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api";
import { isLoggedIn } from "@/lib/auth";
import { useToast } from "@/components/Toast";
import { Story } from "../types/story-detail.types";

export function useStoryDonation(storyId: string, story: Story | null) {
  const router = useRouter();
  const { showToast } = useToast();

  const [showDonate, setShowDonate] = useState(false);
  const [donateAmount, setDonateAmount] = useState<number>(100);
  const [donateMessage, setDonateMessage] = useState("");
  const [donateLoading, setDonateLoading] = useState(false);

  const handleDonate = useCallback(async () => {
    if (!isLoggedIn()) {
      router.push("/login");
      return;
    }
    if (donateAmount <= 0) return;
    setDonateLoading(true);
    try {
      await apiFetch("/wallet/donate", {
        method: "POST",
        body: JSON.stringify({
          toUserId: story?.author?.id,
          storyId,
          amount: donateAmount,
          message: donateMessage,
        }),
      });
      showToast("Ủng hộ thành công! Cảm ơn bạn.", "success");
      setShowDonate(false);
      setDonateMessage("");
    } catch (err) {
      showToast(
        (err as Error).message || "Ủng hộ thất bại. Vui lòng kiểm tra số dư.",
        "error"
      );
    } finally {
      setDonateLoading(false);
    }
  }, [donateAmount, donateMessage, router, showToast, story?.author?.id, storyId]);

  return {
    showDonate,
    setShowDonate,
    donateAmount,
    setDonateAmount,
    donateMessage,
    setDonateMessage,
    donateLoading,
    handleDonate,
  };
}

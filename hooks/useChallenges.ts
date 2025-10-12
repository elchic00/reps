import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Challenge, UserChallenge } from "@/lib/types";

export function useChallenges() {
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchChallenges();
  }, []);

  const fetchChallenges = async () => {
    try {
      const { data, error } = await supabase
        .from("challenges")
        .select("*")
        .order("order_index", { ascending: true });

      if (error) throw error;
      setChallenges(data || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getTodaysChallenge = () => {
    // For now, return first challenge
    // Later: can use date-based logic or randomization
    return challenges[0];
  };

  return {
    challenges,
    loading,
    error,
    getTodaysChallenge,
    refetch: fetchChallenges,
  };
}

export function useUserProgress() {
  const [progress, setProgress] = useState<UserChallenge[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProgress();
  }, []);

  const fetchProgress = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from("user_challenges")
        .select("*, challenge:challenges(*)")
        .eq("user_id", user.id);

      if (error) throw error;
      setProgress(data || []);
    } catch (err) {
      console.error("Error fetching progress:", err);
    } finally {
      setLoading(false);
    }
  };

  const markAsStarted = async (challengeId: string) => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase.from("user_challenges").upsert({
        user_id: user.id,
        challenge_id: challengeId,
        status: "attempted",
        attempts: 1,
      });

      if (error) throw error;
      await fetchProgress();
    } catch (err) {
      console.error("Error marking as started:", err);
    }
  };

  return {
    progress,
    loading,
    refetch: fetchProgress,
    markAsStarted,
  };
}

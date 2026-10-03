import { useEffect, useState } from "react";
import {
  getPublishedReviewCatalogue,
  type ApprovedReview,
  type PublishedReview,
} from "@/lib/review-catalog";

export function usePublishedReviews() {
  const [reviews, setReviews] = useState<PublishedReview[]>(() => getPublishedReviewCatalogue());
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    fetch("/api/reviews")
      .then((response) => {
        if (!response.ok) throw new Error("Review request failed");
        return response.json() as Promise<ApprovedReview[]>;
      })
      .then((data) => {
        if (!active) return;
        setError("");
        setReviews(getPublishedReviewCatalogue(Array.isArray(data) ? data : []));
      })
      .catch(() => {
        if (!active) return;
        setError(
          "Recent submitted reviews are temporarily unavailable. Verified patient reviews are still shown below.",
        );
      });

    return () => {
      active = false;
    };
  }, []);

  return { reviews, error };
}
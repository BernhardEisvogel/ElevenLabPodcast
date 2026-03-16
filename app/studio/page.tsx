import { Suspense } from "react";
import type { Metadata } from "next";

import { PodcastStudio } from "@/components/podcast-studio";

export const metadata: Metadata = {
  title: "Studio",
  description: "Create grounded voice output from a URL or topic inside Sourcewave Studio.",
};

export default function StudioPage() {
  return (
    <Suspense fallback={null}>
      <PodcastStudio />
    </Suspense>
  );
}

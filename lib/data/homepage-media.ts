import "server-only";
import { unstable_cache } from "next/cache";
import { cache } from "react";
import { getAdminSupabase } from "@/lib/supabase/admin";
import { DEFAULT_HOMEPAGE_MEDIA, resolveHomepageMedia, type HomepageMedia } from "@/lib/data/homepage-media.shared";

const loadHomepageMedia = unstable_cache(
  async (): Promise<HomepageMedia> => {
    const supabase = getAdminSupabase();
    if (!supabase) return DEFAULT_HOMEPAGE_MEDIA;

    const { data, error } = await supabase
      .from("site_settings")
      .select("payload")
      .eq("key", "homepage")
      .maybeSingle();

    if (error || !data) return DEFAULT_HOMEPAGE_MEDIA;
    return resolveHomepageMedia(data.payload);
  },
  ["homepage-media"],
  { revalidate: 180, tags: ["homepage-media"] },
);

export const getHomepageMedia = cache(() => loadHomepageMedia());

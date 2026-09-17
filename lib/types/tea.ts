export type TeaType = "matcha" | "hojicha" | "sencha" | "other";

export type TeaBrand = {
  id: string;
  slug: string;
  name: string;
  japanese_name: string | null;
  description_vi: string | null;
  description_en: string | null;
  origin_country: string | null;
  origin_region: string | null;
  logo_url: string | null;
  is_visible: boolean;
  sort_order: number;
  created_at?: string;
  updated_at?: string;
};

export type TeaProduct = {
  id: string;
  slug: string;
  name: string;
  japanese_name: string | null;
  brand_id: string;
  tea_type: TeaType;
  origin_country: string | null;
  origin_region: string | null;
  description_vi: string | null;
  description_en: string | null;
  tasting_summary_vi: string | null;
  tasting_summary_en: string | null;
  aroma: string | null;
  body_score: number | null;
  umami_score: number | null;
  sweetness_score: number | null;
  bitterness_score: number | null;
  creaminess_score: number | null;
  finish: string | null;
  tasting_notes: string[];
  recommended_for: string[];
  brewing_matcha_grams: number | null;
  brewing_water_ml: number | null;
  brewing_temperature: string | null;
  brewing_time: string | null;
  price: number | null;
  price_unit: string | null;
  price_note: string | null;
  is_featured: boolean;
  is_visible: boolean;
  sort_order: number;
  image_url: string | null;
  gallery: string[];
  source_page: number | null;
  created_at?: string;
  updated_at?: string;
  brand?: TeaBrand | null;
};

export type SiteContentRecord = {
  key: string;
  title: string | null;
  body: string | null;
  payload: Record<string, unknown>;
};

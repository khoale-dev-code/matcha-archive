export type HomepageMediaKey =
  | "heroMain"
  | "heroRitual"
  | "heroOrigin"
  | "spectrumBowl"
  | "spectrumLeaves"
  | "storyBowl"
  | "storyLandscape"
  | "ritualPoster"
  | "journalFeature"
  | "tasteUmami"
  | "tasteSweet"
  | "tasteFloral"
  | "tasteDaily"
  | "ritualSift"
  | "ritualWater"
  | "ritualWhisk"
  | "ritualEnjoy";

export type HomepageMediaSlot = {
  url: string;
  altVi: string;
  altEn: string;
  position: string;
};

export type HomepageMedia = Record<HomepageMediaKey, HomepageMediaSlot>;

export const DEFAULT_HOMEPAGE_MEDIA: HomepageMedia = {
  heroMain: {
    url: "/images/home/hero/ceremony.png",
    altVi: "Chawan, chasen, bột matcha và dụng cụ trà Nhật Bản",
    altEn: "Japanese chawan, chasen, matcha powder and tea tools",
    position: "50% 54%",
  },
  heroRitual: {
    url: "/images/home/hero/pour.jpg",
    altVi: "Khoảnh khắc rót matcha trong quá trình pha trà",
    altEn: "Pouring matcha during tea preparation",
    position: "50% 43%",
  },
  heroOrigin: {
    url: "/images/home/hero/origin.jpg",
    altVi: "Bộ hộp trà Nhật Bản dưới cành hoa",
    altEn: "Japanese tea tins styled beneath blossom branches",
    position: "50% 52%",
  },
  spectrumBowl: {
    url: "/images/home/tasting/powder.png",
    altVi: "Bề mặt bột matcha tạo thành những lớp vân xanh",
    altEn: "Matcha powder texture forming layered green curves",
    position: "50% 47%",
  },
  spectrumLeaves: {
    url: "/images/home/tasting/package.jpg",
    altVi: "Gói matcha Nhật Bản với typography truyền thống",
    altEn: "Japanese matcha package with traditional typography",
    position: "50% 58%",
  },
  storyBowl: {
    url: "/images/home/story/drink.jpg",
    altVi: "Ly matcha xanh trong ánh nắng tự nhiên",
    altEn: "Green matcha drink in natural sunlight",
    position: "50% 47%",
  },
  storyLandscape: {
    url: "/images/home/story/cafe.jpg",
    altVi: "Quầy pha matcha với dụng cụ và các hộp trà",
    altEn: "Matcha counter with tea tools and tea tins",
    position: "50% 50%",
  },
  ritualPoster: {
    url: "/images/home/ritual/whisk.webp",
    altVi: "Chasen trên bát matcha xanh trong ánh sáng tự nhiên",
    altEn: "Bamboo whisk over a bowl of green matcha in natural light",
    position: "48% 58%",
  },
  journalFeature: {
    url: "/images/home/journal/powder.jpg",
    altVi: "Bột matcha mịn cạnh hộp trà xanh dưới ánh sáng",
    altEn: "Fine matcha powder beside a green tea tin in daylight",
    position: "50% 46%",
  },
  tasteUmami: {
    url: "/images/home/ritual/whisk.webp",
    altVi: "Chasen đặt trên bát matcha xanh đậm",
    altEn: "Bamboo whisk resting over a deep green bowl of matcha",
    position: "48% 60%",
  },
  tasteSweet: {
    url: "/images/home/ritual/powder.webp",
    altVi: "Bột matcha, chasen và chashaku trong ánh sáng tự nhiên",
    altEn: "Matcha powder, chasen and chashaku in natural light",
    position: "50% 66%",
  },
  tasteFloral: {
    url: "/images/home/hero/origin.jpg",
    altVi: "Hộp trà Nhật Bản dưới cành hoa trắng",
    altEn: "Japanese tea tins beneath white blossom branches",
    position: "50% 46%",
  },
  tasteDaily: {
    url: "/images/home/ritual/latte.webp",
    altVi: "Ly matcha latte xanh nhạt với lớp sữa mịn",
    altEn: "Pale green matcha latte with a soft milk pattern",
    position: "63% 52%",
  },
  ritualSift: {
    url: "/images/home/ritual/powder.webp",
    altVi: "Bột matcha mịn cùng chasen và chashaku",
    altEn: "Fine matcha powder with chasen and chashaku",
    position: "50% 64%",
  },
  ritualWater: {
    url: "/images/home/hero/pour.jpg",
    altVi: "Matcha đang được rót trong quá trình pha",
    altEn: "Matcha being poured during preparation",
    position: "50% 42%",
  },
  ritualWhisk: {
    url: "/images/home/ritual/whisk.webp",
    altVi: "Chasen trong bát matcha vừa đánh",
    altEn: "Bamboo whisk in freshly whisked matcha",
    position: "48% 57%",
  },
  ritualEnjoy: {
    url: "/images/home/ritual/latte.webp",
    altVi: "Ly matcha hoàn thiện sẵn sàng thưởng thức",
    altEn: "Finished matcha ready to enjoy",
    position: "64% 52%",
  },
};

const LEGACY_DEFAULT_URLS = new Set([
  "/images/home/hero-matcha.webp",
  "/images/home/hero-ritual-photo.webp",
  "/images/home/hero-origin.webp",
  "/images/home/tasting-bowl.webp",
  "/images/home/tasting-leaves.webp",
  "/images/home/story-bowl.webp",
  "/images/home/uji-hills.webp",
  "/images/home/ritual-photo.webp",
  "/images/home/journal-matcha.webp",
  "/images/home/user/ritual-shelf.jpg",
]);

function isObject(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function resolveSlot(input: unknown, fallback: HomepageMediaSlot): HomepageMediaSlot {
  if (!isObject(input)) return fallback;

  const rawUrl = typeof input.url === "string" ? input.url.trim() : "";
  const url = rawUrl && !LEGACY_DEFAULT_URLS.has(rawUrl) ? rawUrl : fallback.url;

  return {
    url,
    altVi: typeof input.altVi === "string" && input.altVi.trim() ? input.altVi : fallback.altVi,
    altEn: typeof input.altEn === "string" && input.altEn.trim() ? input.altEn : fallback.altEn,
    position:
      typeof input.position === "string" && input.position.trim()
        ? input.position.trim()
        : fallback.position,
  };
}

export function resolveHomepageMedia(payload: unknown): HomepageMedia {
  const root = isObject(payload) ? payload : {};
  const media = isObject(root.media) ? root.media : {};

  return {
    heroMain: resolveSlot(media.heroMain, DEFAULT_HOMEPAGE_MEDIA.heroMain),
    heroRitual: resolveSlot(media.heroRitual, DEFAULT_HOMEPAGE_MEDIA.heroRitual),
    heroOrigin: resolveSlot(media.heroOrigin, DEFAULT_HOMEPAGE_MEDIA.heroOrigin),
    spectrumBowl: resolveSlot(media.spectrumBowl, DEFAULT_HOMEPAGE_MEDIA.spectrumBowl),
    spectrumLeaves: resolveSlot(media.spectrumLeaves, DEFAULT_HOMEPAGE_MEDIA.spectrumLeaves),
    storyBowl: resolveSlot(media.storyBowl, DEFAULT_HOMEPAGE_MEDIA.storyBowl),
    storyLandscape: resolveSlot(media.storyLandscape, DEFAULT_HOMEPAGE_MEDIA.storyLandscape),
    ritualPoster: resolveSlot(media.ritualPoster, DEFAULT_HOMEPAGE_MEDIA.ritualPoster),
    journalFeature: resolveSlot(media.journalFeature, DEFAULT_HOMEPAGE_MEDIA.journalFeature),
    tasteUmami: resolveSlot(media.tasteUmami, DEFAULT_HOMEPAGE_MEDIA.tasteUmami),
    tasteSweet: resolveSlot(media.tasteSweet, DEFAULT_HOMEPAGE_MEDIA.tasteSweet),
    tasteFloral: resolveSlot(media.tasteFloral, DEFAULT_HOMEPAGE_MEDIA.tasteFloral),
    tasteDaily: resolveSlot(media.tasteDaily, DEFAULT_HOMEPAGE_MEDIA.tasteDaily),
    ritualSift: resolveSlot(media.ritualSift, DEFAULT_HOMEPAGE_MEDIA.ritualSift),
    ritualWater: resolveSlot(media.ritualWater, DEFAULT_HOMEPAGE_MEDIA.ritualWater),
    ritualWhisk: resolveSlot(media.ritualWhisk, DEFAULT_HOMEPAGE_MEDIA.ritualWhisk),
    ritualEnjoy: resolveSlot(media.ritualEnjoy, DEFAULT_HOMEPAGE_MEDIA.ritualEnjoy),
  };
}

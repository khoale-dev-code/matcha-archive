import type { CSSProperties } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { getT } from "@/i18n.server";
import { getTeaBrands, getTeaProducts } from "@/lib/data/repository";
import { getHomepageMedia } from "@/lib/data/homepage-media";
import type { HomepageMediaKey, HomepageMediaSlot } from "@/lib/data/homepage-media.shared";
import { getHomepageFeaturedMatcha, resolveProductMedia } from "@/lib/data/product-media";
import { withLocalePath } from "@/lib/i18n/routing";
import type { TeaProduct } from "@/lib/types/tea";
import styles from "./HomePage.module.css";
import { HeroCollectionCarousel } from "./interactive/HeroCollectionCarousel";

type ScoreKey = "body_score" | "umami_score" | "sweetness_score" | "bitterness_score";

type Copy = {
  heroEyebrow: string;
  heroTitle: string;
  heroDescription: string;
  explore: string;
  discoverOrigin: string;
  collectionEyebrow: string;
  collectionTitle: string;
  collectionDescription: string;
  exploreProfile: string;
  referencePrice: string;
  discoveryEyebrow: string;
  discoveryTitle: string;
  discoveryDescription: string;
  discoveryCards: Array<{ title: string; description: string }>;
  spectrumTitle: string;
  spectrumEmpty: string;
  scoreLabels: Record<ScoreKey, { title: string; low: string; high: string }>;
  storyEyebrow: string;
  storyTitle: string;
  storyDescription: string;
  brandsTitle: string;
  viewBrand: string;
  ritualEyebrow: string;
  ritualTitle: string;
  ritualDescription: string;
  ritualSteps: Array<{ title: string; description: string }>;
  journalEyebrow: string;
  journalTitle: string;
  journalDescription: string;
  journalFeatureTitle: string;
  readGuide: string;
  journalCards: Array<{ title: string; description: string }>;
};

const COPY: Record<"vi" | "en", Copy> = {
  vi: {
    heroEyebrow: "MIE MATCHA / THƯ VIỆN TRÀ NHẬT",
    heroTitle: "Nghệ thuật của sự tĩnh tâm.",
    heroDescription:
      "Một chén matcha không chỉ bắt đầu từ màu xanh. Đó là câu chuyện về vùng trà, người làm trà, cấu trúc vị và nhịp pha đủ chậm để cảm nhận rõ hơn.",
    explore: "Khám phá MIE MATCHA",
    discoverOrigin: "Từ Mie, bằng sự chăm chút",
    collectionEyebrow: "TUYỂN CHỌN HỒ SƠ VỊ",
    collectionTitle: "Bộ sưu tập đang được khám phá",
    collectionDescription: "Sáu hồ sơ vị tiêu biểu để bắt đầu đọc matcha như một tasting archive, không phải một kệ hàng.",
    exploreProfile: "Khám phá hồ sơ",
    referencePrice: "Giá tham khảo",
    discoveryEyebrow: "KHÁM PHÁ THEO VỊ",
    discoveryTitle: "Bắt đầu từ cảm giác bạn muốn tìm trong chén trà.",
    discoveryDescription: "Chọn một hướng vị trước, rồi đi sâu vào những profile phù hợp.",
    discoveryCards: [
      { title: "Umami sâu", description: "Dày vị, tròn miệng và hậu vị kéo dài." },
      { title: "Ngọt dịu", description: "Mềm, dễ tiếp cận và ít gắt." },
      { title: "Hương hoa", description: "Hoa trắng, cỏ non và hương thơm thanh." },
      { title: "Daily ritual", description: "Cân bằng cho usucha và nhịp uống mỗi ngày." },
    ],
    spectrumTitle: "Phổ hương vị",
    spectrumEmpty: "Đang bổ sung dữ liệu tasting",
    scoreLabels: {
      body_score: { title: "Body", low: "Nhẹ", high: "Dày" },
      umami_score: { title: "Umami", low: "Thấp", high: "Cao" },
      sweetness_score: { title: "Độ ngọt", low: "Mềm", high: "Rõ" },
      bitterness_score: { title: "Độ đắng", low: "Dịu", high: "Đậm" },
    },
    storyEyebrow: "VĂN HÓA TRÀ",
    storyTitle: "Từ vùng trà đến một chén matcha có chiều sâu.",
    storyDescription:
      "Nguồn gốc, nhà trà, dụng cụ và cách pha cùng tạo nên bối cảnh để mỗi profile trở nên dễ hiểu hơn.",
    brandsTitle: "Những nhà trà trong thư viện",
    viewBrand: "Xem nhà trà",
    ritualEyebrow: "NGHI THỨC PHA",
    ritualTitle: "Craftsmanship — năm bước, một nhịp pha.",
    ritualDescription: "Một cách pha hiện đại, rõ ràng và dễ lặp lại: đúng lượng trà, đúng nhiệt độ, đúng chuyển động rồi mới biến tấu theo gu của bạn.",
    ritualSteps: [
      { title: "Đong matcha", description: "Dùng khoảng 1–2 g matcha cho một chén hoặc một ly." },
      { title: "Thêm nước", description: "Rót 60–80 ml nước ở khoảng 70–80°C để giữ vị trà cân bằng." },
      { title: "Đánh trà", description: "Đánh theo chuyển động zigzag đến khi matcha mịn và có lớp bọt nhẹ." },
      { title: "Thưởng thức nguyên bản", description: "Nếm hương đầu, thân vị và hậu vị trước khi thêm thành phần khác." },
      { title: "Pha theo cách bạn thích", description: "Thêm đá hoặc sữa nếu muốn một ly matcha hiện đại hơn." },
    ],
    journalEyebrow: "NHẬT KÝ TRÀ",
    journalTitle: "Bí quyết cho một chén trà chánh niệm.",
    journalDescription: "Những hướng dẫn ngắn về vị giác, pha chế và bảo quản để mỗi chén matcha dễ hiểu và dễ cảm nhận hơn.",
    journalFeatureTitle: "Lắng nghe matcha, cảm nhận từng nốt hương chậm rãi.",
    readGuide: "Đọc hướng dẫn",
    journalCards: [
      { title: "Hiểu vị Umami", description: "Cảm nhận vị ngọt tự nhiên, độ tròn và chiều sâu thay vì chỉ gọi là vị mạnh." },
      { title: "Bí quyết bảo quản Matcha", description: "Cách hạn chế ánh sáng, nhiệt và không khí để giữ hương vị ổn định hơn." },
      { title: "Hiểu về Usucha và Koicha", description: "Hai phong cách đánh trà với tỷ lệ và kết cấu khác nhau, cho hai cách đọc profile." },
      { title: "Nhiệt độ và hương vị", description: "Nhiệt độ nước ảnh hưởng trực tiếp đến độ đắng, độ mềm và độ rõ của hương." },
    ],
  },
  en: {
    heroEyebrow: "MIE MATCHA / JAPANESE TEA ARCHIVE",
    heroTitle: "The art of mindfulness.",
    heroDescription:
      "A bowl of matcha begins with more than color. It carries place, maker, flavor structure and a pace slow enough to notice what is really there.",
    explore: "Discover MIE MATCHA",
    discoverOrigin: "From Mie, with care",
    collectionEyebrow: "SELECTED TASTING PROFILES",
    collectionTitle: "A collection worth exploring",
    collectionDescription: "Six tasting profiles to begin reading matcha as an archive, not a storefront.",
    exploreProfile: "Explore profile",
    referencePrice: "Reference price",
    discoveryEyebrow: "DISCOVER BY TASTE",
    discoveryTitle: "Start with the feeling you want in the bowl.",
    discoveryDescription: "Choose a taste direction first, then go deeper into profiles that fit.",
    discoveryCards: [
      { title: "Deep umami", description: "Round, layered and lingering." },
      { title: "Gentle sweet", description: "Soft, approachable and less sharp." },
      { title: "Floral lift", description: "White florals, young greens and a clean aroma." },
      { title: "Daily ritual", description: "Balanced for usucha and everyday drinking." },
    ],
    spectrumTitle: "Tasting spectrum",
    spectrumEmpty: "Tasting data is being added",
    scoreLabels: {
      body_score: { title: "Body", low: "Light", high: "Rich" },
      umami_score: { title: "Umami", low: "Low", high: "High" },
      sweetness_score: { title: "Sweetness", low: "Soft", high: "Clear" },
      bitterness_score: { title: "Bitterness", low: "Gentle", high: "Bold" },
    },
    storyEyebrow: "TEA CULTURE",
    storyTitle: "From growing place to a bowl with context.",
    storyDescription:
      "Origin, tea houses, tools and brewing practice create the context that makes each profile easier to understand.",
    brandsTitle: "Tea houses in the archive",
    viewBrand: "View tea house",
    ritualEyebrow: "BREWING RITUAL",
    ritualTitle: "Craftsmanship — five steps, one rhythm.",
    ritualDescription: "A modern, repeatable ritual: measure well, use the right temperature, whisk with purpose, taste first, then make it yours.",
    ritualSteps: [
      { title: "Measure matcha", description: "Use about 1–2 g of matcha for one bowl or glass." },
      { title: "Add water", description: "Pour 60–80 ml of water at around 70–80°C for a balanced extraction." },
      { title: "Whisk", description: "Whisk in a quick zigzag motion until smooth with a light foam." },
      { title: "Taste it pure", description: "Notice the opening aroma, body and finish before adding anything else." },
      { title: "Make it yours", description: "Add ice or milk when you want a more modern matcha drink." },
    ],
    journalEyebrow: "TEA JOURNAL",
    journalTitle: "Guidance for a more mindful bowl.",
    journalDescription: "Concise notes on flavor, brewing and storage to make every bowl easier to understand and enjoy.",
    journalFeatureTitle: "Listen to the tea and notice each flavor note at a slower pace.",
    readGuide: "Read the guide",
    journalCards: [
      { title: "Understanding umami", description: "Notice natural sweetness, roundness and depth instead of simply calling it strong." },
      { title: "Storing matcha well", description: "Limit light, heat and air to help preserve aroma and flavor." },
      { title: "Understanding Usucha and Koicha", description: "Two whisked-tea styles with different ratios, textures and ways of revealing a profile." },
      { title: "Temperature and flavor", description: "Water temperature directly changes bitterness, softness and aromatic clarity." },
    ],
  },
};

const DISCOVERY_MEDIA_KEYS = ["tasteUmami", "tasteSweet", "tasteFloral", "tasteDaily"] as const satisfies readonly HomepageMediaKey[];
const RITUAL_MEDIA_KEYS = ["ritualSift", "ritualWater", "ritualWhisk", "ritualEnjoy"] as const satisfies readonly HomepageMediaKey[];
const SCORE_KEYS: ScoreKey[] = ["body_score", "umami_score", "sweetness_score", "bitterness_score"];

function scoreAverage(products: TeaProduct[], key: ScoreKey): number | null {
  const values = products
    .map((product) => product[key])
    .filter((value): value is number => typeof value === "number" && Number.isFinite(value));
  if (!values.length) return null;
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function getProductSummary(product: TeaProduct, vi: boolean): string {
  return (
    (vi ? product.tasting_summary_vi : product.tasting_summary_en) ||
    (vi ? product.description_vi : product.description_en) ||
    ""
  );
}

function formatPrice(product: TeaProduct, vi: boolean): string | null {
  if (typeof product.price !== "number") return null;
  const formatted = new Intl.NumberFormat(vi ? "vi-VN" : "en-US").format(product.price);
  return product.price_unit ? `${formatted}đ / ${product.price_unit}` : `${formatted}đ`;
}

function mediaAlt(slot: HomepageMediaSlot, vi: boolean) {
  return vi ? slot.altVi : slot.altEn;
}

function scorePosition(score: number) {
  return Math.min(100, Math.max(0, ((score - 1) / 4) * 100));
}

export async function HomePage() {
  const [{ lng }, media, brands, matcha] = await Promise.all([
    getT("common"),
    getHomepageMedia(),
    getTeaBrands(),
    getTeaProducts({ teaType: "matcha" }),
  ]);

  const vi = lng === "vi" || lng.startsWith("vi-");
  const c = COPY[vi ? "vi" : "en"];
  const featured = getHomepageFeaturedMatcha(matcha, 6);
  const scoreItems = featured.length ? featured : matcha.slice(0, 6);
  const visibleBrands = brands.filter((brand) => brand.is_visible).slice(0, 6);

  const heroCollectionSlides = [
    {
      src: media.heroMain.url,
      alt: mediaAlt(media.heroMain, vi),
      position: media.heroMain.position,
      eyebrow: c.heroEyebrow,
      title: c.heroTitle,
      description: c.heroDescription,
    },
    {
      src: "/images/home/featured/matcha-pour.webp",
      alt: vi ? "Matcha được rót trong một khoảnh khắc pha trà hiện đại" : "Matcha being poured in a modern brewing moment",
      position: "50% 45%",
      eyebrow: vi ? "NGHI THỨC HIỆN ĐẠI" : "MODERN RITUAL",
      title: vi ? "Một nhịp pha tĩnh, rõ và hiện đại." : "A quieter, clearer modern ritual.",
      description: c.ritualDescription,
    },
    {
      src: "/images/home/featured/matcha-origin-table.webp",
      alt: vi ? "Matcha và dụng cụ tại bàn pha trà" : "Matcha and tea tools on a preparation table",
      position: "50% 48%",
      eyebrow: vi ? "NGUỒN GỐC / CÂU CHUYỆN" : "ORIGIN / STORY",
      title: vi ? "Từ nhà trà đến từng hồ sơ vị." : "From tea houses to each tasting profile.",
      description: c.collectionDescription,
    },
  ];

  const heroCollectionProducts = featured.map((product) => {
    const productMedia = resolveProductMedia(product);
    return {
      id: String(product.id),
      href: withLocalePath(`/matcha/${product.slug}`, lng),
      name: product.name,
      japaneseName: product.japanese_name || "",
      brandName: product.brand?.name || "Japanese Tea",
      summary: getProductSummary(product, vi),
      origin: product.origin_region || product.origin_country || "Japan",
      price: formatPrice(product, vi),
      image: productMedia
        ? {
            src: productMedia.src,
            alt: vi ? productMedia.altVi : productMedia.altEn,
            position: productMedia.position,
            fit: productMedia.fit,
          }
        : undefined,
    };
  });

  return (
    <main className={styles.root}>
      <div className={styles.folio}>
              <HeroCollectionCarousel
        heroSlides={heroCollectionSlides}
        products={heroCollectionProducts}
        exploreHref={withLocalePath("/matcha", lng)}
        exploreLabel={c.explore}
        collectionEyebrow={c.collectionEyebrow}
        collectionTitle={c.collectionTitle}
        collectionDescription={c.collectionDescription}
        exploreProfileLabel={c.exploreProfile}
        referencePriceLabel={c.referencePrice}
        autoSwitchLabel={vi ? "Ảnh giới thiệu" : "Introduction image"}
        previousLabel={vi ? "Hồ sơ matcha trước" : "Previous matcha profile"}
        nextLabel={vi ? "Hồ sơ matcha tiếp theo" : "Next matcha profile"}
        dragLabel={vi ? "Kéo để xem hồ sơ tiếp theo" : "Drag to view the next profile"}
      />

        <section className={styles.tasteSpectrum} aria-labelledby="taste-title">
          <div className={styles.tasteIntro}>
            <p className={styles.eyebrow}>{c.discoveryEyebrow}</p>
            <h2 id="taste-title">{c.discoveryTitle}</h2>
            <p>{c.discoveryDescription}</p>
          </div>

          <ul className={styles.tasteList}>
            {c.discoveryCards.map((card, index) => {
              const slot = media[DISCOVERY_MEDIA_KEYS[index]];
              return (
                <li key={card.title}>
                  <Link href={withLocalePath("/matcha", lng)} className={styles.tasteCard}>
                    <figure>
                      <Image src={slot.url} alt={mediaAlt(slot, vi)} fill quality={90} sizes="(max-width: 720px) 42vw, 240px" className={styles.coverImage} style={{ objectPosition: slot.position }} />
                    </figure>
                    <div>
                      <h3>{card.title}</h3>
                      <p>{card.description}</p>
                    </div>
                    <ArrowUpRight aria-hidden="true" size={14} />
                  </Link>
                </li>
              );
            })}
          </ul>

          <figure className={styles.spectrumPlate} aria-labelledby="spectrum-title">
            <figcaption className={styles.spectrumCaption}>
              <span className={styles.spectrumKanji}>味</span>
              <div>
                <p className={styles.eyebrow}>{vi ? "ĐỌC PROFILE" : "READ THE PROFILE"}</p>
                <h2 id="spectrum-title">{c.spectrumTitle}</h2>
              </div>
            </figcaption>
            <dl className={styles.axisList}>
              {SCORE_KEYS.map((key) => {
                const score = scoreAverage(scoreItems, key);
                const labels = c.scoreLabels[key];
                const position = score === null ? 50 : scorePosition(score);
                return (
                  <div className={styles.axisRow} key={key}>
                    <dt>
                      <strong>{labels.title}</strong>
                      <span>{labels.low} — {labels.high}</span>
                    </dt>
                    <dd>
                      <div
                        className={`${styles.axisTrack} ${score === null ? styles.axisTrackEmpty : ""}`}
                        style={score === null ? undefined : ({ "--axis-x": `${position}%` } as CSSProperties)}
                        aria-hidden="true"
                      >
                        <i className={styles.axisStart} />
                        <i className={styles.axisMid} />
                        <i className={styles.axisEnd} />
                        {score === null ? (
                          <span className={styles.axisMissing} />
                        ) : (
                          <span className={styles.axisDot} />
                        )}
                      </div>
                      <div className={styles.axisLabels}><span>{labels.low}</span><span>{labels.high}</span></div>
                      <span className={styles.axisValue}>{score === null ? c.spectrumEmpty : `${score.toFixed(1)} / 5`}</span>
                    </dd>
                  </div>
                );
              })}
            </dl>
          </figure>
        </section>

        <section className={styles.originStrip} aria-labelledby="origin-title">
          <div className={styles.originCopy}>
            <p className={styles.eyebrow}>{c.storyEyebrow}</p>
            <h2 id="origin-title">{c.storyTitle}</h2>
            <p>{c.storyDescription}</p>
            <Link href={withLocalePath("/brands", lng)} className={styles.textLink}>
              {c.discoverOrigin}<ArrowUpRight aria-hidden="true" size={14} />
            </Link>
          </div>
          <div className={styles.originMosaic}>
            <figure className={styles.originLarge}>
              <Image src={media.storyLandscape.url} alt={mediaAlt(media.storyLandscape, vi)} fill quality={90} sizes="(max-width: 1050px) 100vw, 520px" className={styles.coverImage} style={{ objectPosition: media.storyLandscape.position }} />
            </figure>
            <figure>
              <Image src={media.spectrumBowl.url} alt={mediaAlt(media.spectrumBowl, vi)} fill quality={90} sizes="260px" className={styles.coverImage} style={{ objectPosition: media.spectrumBowl.position }} />
            </figure>
            <figure>
              <Image src={media.ritualPoster.url} alt={mediaAlt(media.ritualPoster, vi)} fill quality={90} sizes="260px" className={styles.coverImage} style={{ objectPosition: media.ritualPoster.position }} />
            </figure>
          </div>
        </section>

        <section className={styles.brandSection} aria-labelledby="brands-title">
          <header>
            <p className={styles.eyebrow}>{vi ? "TEA HOUSES" : "TEA HOUSES"}</p>
            <h2 id="brands-title">{c.brandsTitle}</h2>
          </header>
          <ul className={styles.brandList}>
            {visibleBrands.map((brand, index) => (
              <li key={brand.id}>
                <Link href={withLocalePath(`/brands/${brand.slug}`, lng)} className={styles.brandRow}>
                  <span className={styles.brandIndex}>{String(index + 1).padStart(2, "0")}</span>
                  <div>
                    {brand.japanese_name ? <span>{brand.japanese_name}</span> : null}
                    <strong>{brand.name}</strong>
                  </div>
                  <span>{brand.origin_region || brand.origin_country || "Japan"}</span>
                  <span className={styles.brandAction}>{c.viewBrand}<ArrowUpRight aria-hidden="true" size={13} /></span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
        <section className={styles.modernRitualSection} aria-labelledby="ritual-title">
          <header className={styles.modernRitualHeader}>
            <div>
              <p className={styles.eyebrow}>{c.ritualEyebrow}</p>
              <h2 id="ritual-title">{c.ritualTitle}</h2>
            </div>
            <p>{c.ritualDescription}</p>
          </header>

          <div className={styles.modernRitualVisualScroller} tabIndex={0} aria-label={vi ? "Minh họa cách pha matcha hiện đại" : "Modern matcha preparation illustration"}>
            <figure className={styles.modernRitualVisual}>
              <Image
                src="/images/home/ritual/modern-matcha-ritual.webp"
                alt={vi ? "Minh họa các bước pha matcha hiện đại" : "Illustrated modern matcha preparation steps"}
                fill
                quality={90}
                sizes="(max-width: 720px) 900px, (max-width: 1050px) 100vw, 1320px"
                className={styles.modernRitualArtwork}
              />
            </figure>
          </div>

          <ol className={styles.modernRitualSteps}>
            {c.ritualSteps.map((step, index) => (
              <li key={step.title} className={styles.modernRitualStep}>
                <span className={styles.modernRitualNumber}>{String(index + 1).padStart(2, "0")}</span>
                <div>
                  <h3>{step.title}</h3>
                  <p>{step.description}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>
        <section className={styles.journalSection} aria-labelledby="journal-title">
          <div className={styles.journalMagazine}>
            <div className={styles.journalCopyColumn}>
              <header className={styles.journalHeading}>
                <p className={styles.eyebrow}>{c.journalEyebrow}</p>
                <h2 id="journal-title">{c.journalTitle}</h2>
                <p>{c.journalDescription}</p>
              </header>

              <article className={styles.journalFeatureNote}>
                <p className={styles.eyebrow}>{vi ? "GHI CHÚ VỀ TRÀ" : "TEA NOTES"}</p>
                <h3>{c.journalFeatureTitle}</h3>
                <p>{vi ? "Chậm lại một nhịp để nhận ra độ ngọt, umami, hương và hậu vị trong từng chén trà." : "Slow the pace and notice sweetness, umami, aroma and finish in every bowl."}</p>
                <Link href={withLocalePath("/guide", lng)} className={styles.textLink}>
                  {c.readGuide}<ArrowUpRight aria-hidden="true" size={14} />
                </Link>
              </article>
            </div>

            <figure className={styles.journalHeroMedia}>
              <Image
                src="/images/home/journal/journal-mindful-whisk.webp"
                alt={vi ? "Chén matcha và chasen trong một khoảnh khắc pha trà tĩnh lặng" : "A matcha bowl and chasen in a quiet brewing moment"}
                fill
                quality={90}
                sizes="(max-width: 720px) 100vw, (max-width: 1050px) 56vw, 760px"
                className={styles.journalHeroImage}
              />
              <figcaption className={styles.journalHeroCaption}>
                <span>MIE MATCHA</span>
                <span>{vi ? "Một chén trà tĩnh hơn" : "A quieter cup"}</span>
              </figcaption>
            </figure>
          </div>

          <ul className={styles.journalReadingGrid} aria-label={vi ? "Ghi chú hướng dẫn về matcha" : "Matcha guide notes"}>
            {c.journalCards.map((card, index) => {
              const slot = [media.spectrumBowl, media.heroOrigin, media.storyBowl, media.tasteDaily][index];
              return (
                <li key={card.title}>
                  <Link href={withLocalePath("/guide", lng)} className={styles.journalReadingCard}>
                    <figure className={styles.journalReadingThumb}>
                      <Image
                        src={slot.url}
                        alt={mediaAlt(slot, vi)}
                        fill
                        quality={75}
                        sizes="(max-width: 720px) 92px, 112px"
                        className={styles.coverImage}
                        style={{ objectPosition: slot.position }}
                      />
                    </figure>
                    <div className={styles.journalReadingCopy}>
                      <span className={styles.journalReadingIndex}>{String(index + 1).padStart(2, "0")}</span>
                      <h3>{card.title}</h3>
                      <p>{card.description}</p>
                    </div>
                    <ArrowUpRight className={styles.journalReadingArrow} aria-hidden="true" size={14} />
                  </Link>
                </li>
              );
            })}
          </ul>
        </section>
      </div>
    </main>
  );
}

"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";
import styles from "./HeroCollectionCarousel.module.css";

type HeroSlide = {
  src: string;
  alt: string;
  position?: string;
  eyebrow: string;
  title: string;
  description: string;
};

type ProductSlide = {
  id: string;
  href: string;
  name: string;
  japaneseName?: string;
  brandName: string;
  summary: string;
  origin: string;
  price?: string | null;
  image?: {
    src: string;
    alt: string;
    position?: string;
    fit?: "contain" | "cover";
  };
};

type Props = {
  heroSlides: HeroSlide[];
  products: ProductSlide[];
  exploreHref: string;
  exploreLabel: string;
  collectionEyebrow: string;
  collectionTitle: string;
  collectionDescription: string;
  exploreProfileLabel: string;
  referencePriceLabel: string;
  autoSwitchLabel: string;
  dragLabel: string;
};

function AutoSwitch(interval = 4800) {
  return (slider: any) => {
    let timeout: ReturnType<typeof setTimeout> | undefined;
    let paused = false;

    const clear = () => {
      if (timeout) clearTimeout(timeout);
      timeout = undefined;
    };

    const schedule = () => {
      clear();
      if (paused) return;
      if (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      timeout = setTimeout(() => slider.next(), interval);
    };

    const onEnter = () => {
      paused = true;
      clear();
    };

    const onLeave = () => {
      paused = false;
      schedule();
    };

    slider.on("created", () => {
      slider.container.addEventListener("mouseenter", onEnter);
      slider.container.addEventListener("mouseleave", onLeave);
      slider.container.addEventListener("focusin", onEnter);
      slider.container.addEventListener("focusout", onLeave);
      schedule();
    });
    slider.on("dragStarted", clear);
    slider.on("animationEnded", schedule);
    slider.on("updated", schedule);
    slider.on("destroyed", () => {
      clear();
      slider.container.removeEventListener("mouseenter", onEnter);
      slider.container.removeEventListener("mouseleave", onLeave);
      slider.container.removeEventListener("focusin", onEnter);
      slider.container.removeEventListener("focusout", onLeave);
    });
  };
}

export function HeroCollectionCarousel({
  heroSlides,
  products,
  exploreHref,
  exploreLabel,
  collectionEyebrow,
  collectionTitle,
  collectionDescription,
  exploreProfileLabel,
  referencePriceLabel,
  autoSwitchLabel,
  dragLabel,
}: Props) {
  const [heroIndex, setHeroIndex] = useState(0);
  const [productIndex, setProductIndex] = useState(0);
  const [productMax, setProductMax] = useState(0);
  const autoplay = useMemo(() => AutoSwitch(4800), []);

  const [heroRef, heroInstance] = useKeenSlider<HTMLDivElement>(
    {
      loop: true,
      rubberband: false,
      renderMode: "performance",
      slides: { perView: 1, spacing: 0 },
      created(slider) {
        setHeroIndex(slider.track.details.rel);
      },
      slideChanged(slider) {
        setHeroIndex(slider.track.details.rel);
      },
    },
    [autoplay]
  );

  const [productRef, productInstance] = useKeenSlider<HTMLDivElement>({
    mode: "free-snap",
    rubberband: true,
    renderMode: "performance",
    slides: { perView: 1.08, spacing: 14 },
    breakpoints: {
      "(min-width: 720px)": {
        slides: { perView: 1.18, spacing: 16 },
      },
      "(min-width: 1050px)": {
        slides: { perView: 1.38, spacing: 18 },
      },
      "(min-width: 1500px)": {
        slides: { perView: 1.88, spacing: 20 },
      },
    },
    created(slider) {
      setProductIndex(slider.track.details.rel);
      setProductMax(slider.track.details.maxIdx);
    },
    slideChanged(slider) {
      setProductIndex(slider.track.details.rel);
      setProductMax(slider.track.details.maxIdx);
    },
    updated(slider) {
      setProductIndex(slider.track.details.rel);
      setProductMax(slider.track.details.maxIdx);
    },
  });

  return (
    <section className={styles.showcase} aria-labelledby="home-title">
      <div className={styles.heroSide}>
        <div ref={heroRef} className={`keen-slider ${styles.heroSlider}`} aria-roledescription="carousel">
          {heroSlides.map((slide, index) => (
            <article key={`${slide.src}-${index}`} className={`keen-slider__slide ${styles.heroSlide}`}>
              <Image
                src={slide.src}
                alt={slide.alt}
                fill
                priority={index === 0}
                quality={90}
                sizes="(max-width: 1049px) 100vw, 42vw"
                className={styles.heroImage}
                style={{ objectPosition: slide.position || "50% 50%" }}
              />
              <div className={styles.heroShade} aria-hidden="true" />
              <div className={styles.heroCopy}>
                <p className={styles.heroEyebrow}>{slide.eyebrow}</p>
                <h1 id={index === 0 ? "home-title" : undefined}>{slide.title}</h1>
                <p>{slide.description}</p>
                <Link href={exploreHref} className={styles.heroCta} aria-label={exploreLabel}>
                  {exploreLabel}<ArrowUpRight size={15} aria-hidden="true" />
                </Link>
              </div>
            </article>
          ))}
        </div>

        <div className={styles.heroControls}>
          <div className={styles.heroDots} aria-label={autoSwitchLabel}>
            {heroSlides.map((_, index) => (
              <button
                key={index}
                type="button"
                className={`${styles.heroDot} ${heroIndex === index ? styles.heroDotActive : ""}`}
                onClick={() => heroInstance.current?.moveToIdx(index)}
                aria-label={`${autoSwitchLabel} ${index + 1}`}
                aria-current={heroIndex === index ? "true" : undefined}
              />
            ))}
          </div>
          <span>{autoSwitchLabel}</span>
        </div>
      </div>

      <aside className={styles.collectionSide} aria-labelledby="collection-title">
        <header className={styles.collectionHeader}>
          <div>
            <p className={styles.collectionEyebrow}>{collectionEyebrow}</p>
            <h2 id="collection-title">{collectionTitle}</h2>
          </div>
          <div className={styles.collectionIntro}>
            <p>{collectionDescription}</p>
            <div className={styles.collectionTools}>
              <span>{dragLabel}</span>
              <div className={styles.navButtons}>
                <button
                  type="button"
                  onClick={() => productInstance.current?.prev()}
                  disabled={productIndex <= 0}
                  aria-label="Previous matcha profiles"
                >
                  <ArrowLeft size={16} />
                </button>
                <button
                  type="button"
                  onClick={() => productInstance.current?.next()}
                  disabled={productIndex >= productMax}
                  aria-label="Next matcha profiles"
                >
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>
          </div>
        </header>

        <div ref={productRef} className={`keen-slider ${styles.productSlider}`} aria-roledescription="carousel">
          {products.map((product) => (
            <div key={product.id} className={`keen-slider__slide ${styles.productSlide}`}>
              <Link href={product.href} className={styles.productCard} aria-label={`${exploreProfileLabel}: ${product.name}`}>
                <figure className={styles.productMedia}>
                  <div className={styles.productStage}>
                    {product.image ? (
                      <Image
                        src={product.image.src}
                        alt={product.image.alt}
                        fill
                        quality={90}
                        sizes="(max-width: 719px) 86vw, (max-width: 1049px) 70vw, (max-width: 1499px) 38vw, 28vw"
                        className={product.image.fit === "cover" ? styles.productImageCover : styles.productImageContain}
                        style={{ objectPosition: product.image.position || "50% 50%" }}
                      />
                    ) : (
                      <span className={styles.productFallback}>{product.japaneseName || product.name}</span>
                    )}
                  </div>
                </figure>

                <div className={styles.productCopy}>
                  <p className={styles.productBrand}>{product.brandName}</p>
                  <div className={styles.productHeading}>
                    <div>
                      {product.japaneseName ? <span>{product.japaneseName}</span> : null}
                      <h3>{product.name}</h3>
                    </div>
                    <ArrowUpRight size={16} aria-hidden="true" />
                  </div>
                  {product.summary ? <p className={styles.productSummary}>{product.summary}</p> : null}
                  <div className={styles.productFooter}>
                    <span>{product.origin}</span>
                    {product.price ? <strong>{referencePriceLabel}: {product.price}</strong> : null}
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>

        <div className={styles.productProgress} aria-hidden="true">
          <span>{String(Math.min(productIndex + 1, Math.max(products.length, 1))).padStart(2, "0")}</span>
          <i><b style={{ width: `${products.length > 1 ? ((productIndex + 1) / products.length) * 100 : 100}%` }} /></i>
          <span>{String(products.length).padStart(2, "0")}</span>
        </div>
      </aside>
    </section>
  );
}

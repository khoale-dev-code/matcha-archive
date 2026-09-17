import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { TeaBrand } from "@/lib/types/tea";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { getT } from "@/i18n.server";
import { withLocalePath } from "@/lib/i18n/routing";
import styles from "./BrandArchive.module.css";

export async function BrandArchive({ brands }: { brands: TeaBrand[] }) {
  const { t, lng } = await getT("common");

  return (
    <section className={`section-block ${styles.section}`}>
      <div className="section-shell">
        <SectionHeading
          eyebrow={t("home.brandEyebrow")}
          title={
            <>
              {t("home.brandTitleA")} {t("home.brandTitleB")}
            </>
          }
          aside={<p>{t("home.brandAside")}</p>}
        />

        <div className={`mt-10 ${styles.archive}`}>
          {brands.map((brand, index) => (
            <Reveal key={brand.id} className={styles.row} delay={index * 0.04}>
              <span className={styles.index}>{String(index + 1).padStart(2, "0")}</span>

              <div className={styles.name}>
                <span className={styles.japanese}>{brand.japanese_name ?? "茶"}</span>
                <h3>{brand.name}</h3>
              </div>

              <div className={styles.region}>
                {brand.origin_region ?? t("brandsPage.rowRegionPending")}
              </div>

              <div className={styles.logo}>
                {brand.logo_url ? (
                  <Image
                    src={brand.logo_url}
                    alt={`${brand.name} logo from source document`}
                    width={150}
                    height={70}
                    className="max-h-12 w-auto object-contain"
                  />
                ) : (
                  <span>ARCHIVE</span>
                )}
              </div>

              <Link
                href={withLocalePath(`/brands/${brand.slug}`, lng)}
                className={styles.link}
                aria-label={t("brandsPage.openBrand", { name: brand.name })}
              >
                <ArrowUpRight size={20} />
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

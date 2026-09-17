import { cn } from "@/lib/utils";

export function TastingMeter({
  label,
  value,
  compact = false,
}: {
  label: string;
  value: number | null;
  compact?: boolean;
}) {
  return (
    <div className={cn("tasting-meter", compact && "tasting-meter--compact")}>
      <div className="tasting-meter__label">
        <span>{label}</span>
        <span>{value == null ? "Not scored" : `${value}/5`}</span>
      </div>
      <div className="tasting-meter__dots" aria-label={value == null ? `${label}: not scored` : `${label}: ${value} out of 5`}>
        {[1, 2, 3, 4, 5].map((dot) => (
          <span key={dot} className={cn("tasting-dot", value != null && dot <= value && "tasting-dot--active")} />
        ))}
      </div>
    </div>
  );
}

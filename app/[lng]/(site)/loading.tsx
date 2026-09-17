export default function SiteLoading() {
  return (
    <div className="route-loading" role="status" aria-live="polite" aria-busy="true">
      <span className="sr-only">Loading page</span>
      <div className="route-loading__hero">
        <div className="route-loading__copy">
          <div className="route-skeleton route-skeleton--eyebrow" />
          <div className="route-skeleton route-skeleton--title" />
          <div className="route-skeleton route-skeleton--title route-skeleton--title-short" />
          <div className="route-skeleton route-skeleton--text" />
          <div className="route-skeleton route-skeleton--text route-skeleton--text-short" />
        </div>
        <div className="route-skeleton route-skeleton--visual" />
      </div>
    </div>
  );
}

export default function AdminLoading() {
  return (
    <div className="admin-page admin-route-loading" role="status" aria-live="polite" aria-busy="true">
      <span className="sr-only">Loading admin page</span>
      <div className="admin-route-loading__head">
        <div>
          <div className="route-skeleton route-skeleton--admin-title" />
          <div className="route-skeleton route-skeleton--admin-subtitle" />
        </div>
      </div>
      <div className="admin-route-loading__cards">
        <div className="route-skeleton route-skeleton--admin-card" />
        <div className="route-skeleton route-skeleton--admin-card" />
        <div className="route-skeleton route-skeleton--admin-card" />
      </div>
      <div className="route-skeleton route-skeleton--admin-panel" />
    </div>
  );
}

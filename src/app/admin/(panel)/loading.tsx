/** Shown instantly while an admin screen loads, so clicks (e.g. "Düzenle") always give feedback. */
export default function AdminLoading() {
  return (
    <div className="flex min-h-[50vh] items-center justify-center" role="status" aria-live="polite">
      <div className="flex items-center gap-3 text-sm text-ash">
        <span aria-hidden className="size-4 animate-spin rounded-full border-2 border-line border-t-brand" />
        Yükleniyor…
      </div>
    </div>
  );
}

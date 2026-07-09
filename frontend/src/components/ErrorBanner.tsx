type ErrorBannerProps = {
  error: string
}

export function ErrorBanner({ error }: ErrorBannerProps) {
  return (
    <section className="rounded-xl border border-red-200 bg-red-50 p-5 text-red-800">
      <p className="font-semibold">Fehler</p>
      <p className="mt-1 text-sm">{error}</p>
      <p className="mt-3 text-sm text-red-700">
      </p>
    </section>
  )
}

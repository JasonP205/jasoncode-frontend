/**
 * A product-style mock of the TOTDigi work: a dashboard card holding a few
 * e-paper shelf labels. One is on sale — its strip and badge are the pink.
 * Decorative (aria-hidden); the job card next to it carries the facts.
 */
const LABELS = [
  { name: "Cà phê sữa đá", price: 29000 },
  { name: "Gạo ST25 5kg", price: 189000, sale: 20 },
  { name: "Sữa tươi 1L", price: 36000 },
  { name: "Táo Envy", price: 129000 },
] as const;

const fmt = (n: number) => n.toLocaleString("vi-VN");

export default function EslMock() {
  return (
    <div aria-hidden className="card overflow-hidden">
      <div className="flex items-center justify-between border-b border-border px-5 py-3">
        <span className="window-dots">
          <i />
          <i />
          <i />
        </span>
        <span className="mono-tag text-muted-foreground">ESL · TOTDigi</span>
      </div>
      <div className="grid grid-cols-2 gap-3 bg-band p-4 sm:gap-4 sm:p-5">
        {LABELS.map((l) => {
          const sale = "sale" in l ? l.sale : 0;
          const now = sale ? Math.round((l.price * (100 - sale)) / 100000) * 1000 : l.price;
          return (
            <div
              key={l.name}
              className="overflow-hidden rounded-lg bg-paper text-brand shadow-[0_1px_0_rgb(0_0_0/0.04),0_6px_14px_-8px_rgb(9_49_141/0.3)]"
            >
              <div className={sale ? "bg-pop px-3 py-1.5 text-pop-ink" : "bg-brand px-3 py-1.5 text-paper"}>
                <p className="truncate text-[0.6875rem] font-semibold sm:text-xs">{l.name}</p>
              </div>
              <div className="px-3 pt-2 pb-3">
                <p className="text-xl font-extrabold tracking-tight sm:text-2xl">
                  {fmt(now)}
                  <span className="ml-0.5 text-xs font-semibold">₫</span>
                </p>
                <div className="mt-1 flex h-4 items-center justify-between">
                  {sale ? (
                    <>
                      <span className="text-[0.625rem] text-brand/60 line-through">{fmt(l.price)} ₫</span>
                      <span className="rounded-full bg-pop px-1.5 text-[0.625rem] font-bold text-pop-ink">-{sale}%</span>
                    </>
                  ) : (
                    // A barcode, drawn with a repeating gradient.
                    <span className="h-3 w-20 bg-[repeating-linear-gradient(90deg,var(--brand)_0_2px,transparent_2px_4px,var(--brand)_4px_5px,transparent_5px_8px)]" />
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

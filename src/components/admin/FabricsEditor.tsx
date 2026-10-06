"use client";

import Link from "next/link";
import { useState, type KeyboardEvent, type ReactNode } from "react";
import { FabricSwatch } from "@/components/site/FabricSwatch";
import type { Weave } from "@/content/fabrics";
import type { ActionState } from "@/lib/admin";
import type { ImageRef } from "@/lib/content-types";
import { cn, slugify } from "@/lib/utils";
import { FormShell } from "./FormShell";
import { ImageField } from "./ImageField";

type L = "tr" | "en" | "fr";
type Fabric = { slug: string; weave: Weave; title: string; materials: string[] };
type Group = { id: string; label: string; fabrics: Fabric[] };
type Lang = {
  meta: { title: string; description: string };
  eyebrow: string;
  title: string;
  lead: string;
  groupsLabel: string;
  countLabel: string;
  materialsLabel: string;
  groups: Group[];
  ctaTitle: string;
  ctaText: string;
  cta: string;
  [k: string]: unknown;
};
type Data = { tr: Lang; en: Lang; fr: Lang; images: { hero: ImageRef; swatches?: Record<string, ImageRef | null> }; [k: string]: unknown };
type Detail = { structure: string; lead: string; body: string[]; features: { title: string; text: string }[]; uses: string[]; materialNotes: string[]; finishes: string[] };
type Details = { tr: Record<string, Detail>; en: Record<string, Detail>; fr: Record<string, Detail>; [k: string]: unknown };

const LANGS: { key: L; label: string; prefix: string }[] = [
  { key: "tr", label: "TR", prefix: "/tr" },
  { key: "en", label: "EN", prefix: "" },
  { key: "fr", label: "FR", prefix: "/fr" },
];

const WEAVES: { key: Weave; label: string }[] = [
  { key: "check", label: "Ekose" },
  { key: "twill", label: "Twill" },
  { key: "mesh", label: "File" },
  { key: "dobby", label: "Dobby" },
  { key: "canvas", label: "Kanvas" },
  { key: "drape", label: "Döküm" },
  { key: "zebra", label: "Zebra" },
  { key: "pinstripe", label: "İnce çizgi" },
  { key: "knit", label: "Örme" },
  { key: "velvet", label: "Kadife" },
  { key: "quilt", label: "Kapitone" },
  { key: "ripstop", label: "Ripstop" },
];

const EMPTY_DETAIL: Detail = { structure: "", lead: "", body: [], features: [], uses: [], materialNotes: [], finishes: [] };

/* ——————————————————————————— small building blocks */

function Card({ title, hint, children }: { title: string; hint?: string; children: ReactNode }) {
  return (
    <section className="rounded-xl border border-line bg-coal/60">
      <header className="border-b border-line px-5 py-4">
        <h3 className="text-sm font-semibold">{title}</h3>
        {hint && <p className="mt-1 text-xs text-ash">{hint}</p>}
      </header>
      <div className="space-y-4 p-5">{children}</div>
    </section>
  );
}

function Text({
  label,
  value,
  onChange,
  area,
  rows = 3,
  hint,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  area?: boolean;
  rows?: number;
  hint?: string;
  placeholder?: string;
}) {
  return (
    <label className="block">
      <span className="admin-label">{label}</span>
      {area ? (
        <textarea className="admin-input leading-relaxed" rows={rows} value={value} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} />
      ) : (
        <input className="admin-input" value={value} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} />
      )}
      {hint && <p className="admin-hint">{hint}</p>}
    </label>
  );
}

const MiniBtn = ({ onClick, label, children, danger }: { onClick: () => void; label: string; children: ReactNode; danger?: boolean }) => (
  <button
    type="button"
    onClick={onClick}
    title={label}
    aria-label={label}
    className={cn("rounded px-1.5 py-0.5 text-xs text-ash hover:bg-white/5", danger ? "hover:text-brand" : "hover:text-bone")}
  >
    {children}
  </button>
);

/** Removable chips; type and press Enter (or comma) to add, Backspace on empty removes the last. */
function Chips({ items, onChange, placeholder = "+ ekle" }: { items: string[]; onChange: (v: string[]) => void; placeholder?: string }) {
  const [draft, setDraft] = useState("");
  const add = () => {
    const v = draft.trim();
    if (v && !items.includes(v)) onChange([...items, v]);
    setDraft("");
  };
  const onKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      add();
    } else if (e.key === "Backspace" && !draft && items.length) onChange(items.slice(0, -1));
  };
  return (
    <div className="flex flex-wrap items-center gap-1.5 rounded-lg border border-line bg-ink/60 p-2 focus-within:border-brand/60">
      {items.map((m) => (
        <span key={m} className="inline-flex items-center gap-1.5 rounded-full border border-line bg-coal px-3 py-1 text-xs">
          {m}
          <button type="button" onClick={() => onChange(items.filter((x) => x !== m))} className="text-ash hover:text-brand" aria-label={`${m} kaldır`}>
            ×
          </button>
        </span>
      ))}
      <input
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onKeyDown={onKey}
        onBlur={add}
        placeholder={placeholder}
        className="min-w-32 flex-1 bg-transparent px-1 py-1 text-xs outline-none placeholder:text-ash/60"
      />
    </div>
  );
}

/** Longer texts (paragraphs): one textarea per row with reorder and remove. */
function Rows({ items, onChange, addLabel }: { items: string[]; onChange: (v: string[]) => void; addLabel: string }) {
  const move = (i: number, d: number) => {
    const j = i + d;
    if (j < 0 || j >= items.length) return;
    const c = [...items];
    [c[i], c[j]] = [c[j], c[i]];
    onChange(c);
  };
  return (
    <div className="space-y-2">
      {items.map((p, i) => (
        <div key={i} className="flex items-start gap-2">
          <textarea className="admin-input flex-1 leading-relaxed" rows={3} value={p} onChange={(e) => onChange(items.map((x, j) => (j === i ? e.target.value : x)))} />
          <div className="flex flex-col pt-1">
            <MiniBtn label="Yukarı" onClick={() => move(i, -1)}>
              ↑
            </MiniBtn>
            <MiniBtn label="Aşağı" onClick={() => move(i, 1)}>
              ↓
            </MiniBtn>
            <MiniBtn label="Sil" danger onClick={() => onChange(items.filter((_, j) => j !== i))}>
              ✕
            </MiniBtn>
          </div>
        </div>
      ))}
      <button type="button" className="admin-btn text-xs" onClick={() => onChange([...items, ""])}>
        + {addLabel}
      </button>
    </div>
  );
}

/* ——————————————————————————— editor */

type Props = { initial: unknown; details: unknown; action: (prev: ActionState, fd: FormData) => Promise<ActionState> };

/**
 * Fabrics admin: the fabric list on the left (grouped, with thumbnails and "add"), the chosen fabric on the right —
 * photo, pattern, group, name and materials, plus the texts of its own detail page. "Sayfa ayarları" holds the page texts.
 */
export function FabricsEditor({ initial, details: initialDetails, action }: Props) {
  const [data, setData] = useState<Data>(initial as Data);
  const [details, setDetails] = useState<Details>(initialDetails as Details);
  const [lang, setLang] = useState<L>("tr");
  const [sel, setSel] = useState<string>("_page");
  const [adding, setAdding] = useState<number | null>(null);
  const [newName, setNewName] = useState("");

  const l = data[lang];
  const prefix = LANGS.find((x) => x.key === lang)!.prefix;
  const swatches = data.images.swatches ?? {};
  const trGroups = data.tr.groups;
  const total = trGroups.reduce((n, g) => n + g.fabrics.length, 0);

  // Position of the selected fabric (the same in every language)
  let pos: { gi: number; fi: number } | null = null;
  trGroups.forEach((g, gi) => {
    const fi = g.fabrics.findIndex((f) => f.slug === sel);
    if (fi >= 0) pos = { gi, fi };
  });
  const at = pos as { gi: number; fi: number } | null;
  const fabric = at ? l.groups[at.gi]?.fabrics[at.fi] : null;
  const detail: Detail = { ...EMPTY_DETAIL, ...(details[lang]?.[sel] ?? {}) };

  /* ——— mutations; structural ones apply to all languages */
  const setLangData = (patch: Partial<Lang>) => setData((d) => ({ ...d, [lang]: { ...d[lang], ...patch } }));
  const eachLang = (fn: (g: Group[]) => Group[]) =>
    setData((d) => ({ ...d, tr: { ...d.tr, groups: fn(d.tr.groups) }, en: { ...d.en, groups: fn(d.en.groups) }, fr: { ...d.fr, groups: fn(d.fr.groups) } }));
  const patchFabric = (patch: Partial<Fabric>, all = false) => {
    if (!at) return;
    const apply = (groups: Group[]) =>
      groups.map((g, gi) => (gi === at.gi ? { ...g, fabrics: g.fabrics.map((f, fi) => (fi === at.fi ? { ...f, ...patch } : f)) } : g));
    if (all) eachLang(apply);
    else setLangData({ groups: apply(l.groups) });
  };
  const patchDetail = (patch: Partial<Detail>) =>
    setDetails((d) => ({ ...d, [lang]: { ...d[lang], [sel]: { ...EMPTY_DETAIL, ...(d[lang]?.[sel] ?? {}), ...patch } } }));
  const setSwatch = (v: ImageRef | null) => setData((d) => ({ ...d, images: { ...d.images, swatches: { ...(d.images.swatches ?? {}), [sel]: v } } }));
  const setGroupLabel = (gi: number, label: string) => setLangData({ groups: l.groups.map((g, i) => (i === gi ? { ...g, label } : g)) });

  const move = (dir: number) => {
    if (!at) return;
    const j = at.fi + dir;
    if (j < 0 || j >= trGroups[at.gi].fabrics.length) return;
    eachLang((groups) =>
      groups.map((g, gi) => {
        if (gi !== at.gi) return g;
        const c = [...g.fabrics];
        [c[at.fi], c[j]] = [c[j], c[at.fi]];
        return { ...g, fabrics: c };
      }),
    );
  };
  const moveToGroup = (target: number) => {
    if (!at || target === at.gi) return;
    eachLang((groups) => {
      const f = groups[at.gi].fabrics[at.fi];
      return groups.map((g, gi) =>
        gi === at.gi ? { ...g, fabrics: g.fabrics.filter((_, i) => i !== at.fi) } : gi === target ? { ...g, fabrics: [...g.fabrics, f] } : g,
      );
    });
  };
  const remove = () => {
    if (!at || !confirm(`“${trGroups[at.gi].fabrics[at.fi].title}” silinsin mi? Detay sayfası da kaldırılır.`)) return;
    eachLang((groups) => groups.map((g, gi) => (gi === at.gi ? { ...g, fabrics: g.fabrics.filter((_, i) => i !== at.fi) } : g)));
    setSel("_page");
  };
  const add = (gi: number) => {
    const name = newName.trim();
    if (!name) return;
    const all = trGroups.flatMap((g) => g.fabrics.map((f) => f.slug));
    const base = slugify(name) || "kumas";
    let slug = base;
    for (let n = 2; all.includes(slug); n++) slug = `${base}-${n}`;
    const weave = WEAVES[all.length % WEAVES.length].key;
    eachLang((groups) => groups.map((g, i) => (i === gi ? { ...g, fabrics: [...g.fabrics, { slug, weave, title: name, materials: [] }] } : g)));
    setDetails((d) => ({ ...d, tr: { ...d.tr, [slug]: { ...EMPTY_DETAIL } }, en: { ...d.en, [slug]: { ...EMPTY_DETAIL } }, fr: { ...d.fr, [slug]: { ...EMPTY_DETAIL } } }));
    setAdding(null);
    setNewName("");
    setSel(slug);
  };

  return (
    <FormShell action={action}>
      <input type="hidden" name="data" value={JSON.stringify(data)} />
      <input type="hidden" name="details" value={JSON.stringify(details)} />

      <div className="grid gap-6 lg:grid-cols-[300px_minmax(0,1fr)]">
        {/* ——————————— left: the fabric list */}
        <aside className="lg:sticky lg:top-20 lg:max-h-[calc(100vh-11rem)] lg:self-start lg:overflow-y-auto lg:pr-1">
          <div className="mb-3 flex items-center rounded-lg border border-line bg-coal/60 p-1" role="tablist" aria-label="Dil">
            {LANGS.map((t) => (
              <button
                key={t.key}
                type="button"
                onClick={() => setLang(t.key)}
                className={cn("flex-1 rounded-md py-1.5 text-xs font-semibold transition-colors", lang === t.key ? "bg-brand text-white" : "text-ash hover:text-bone")}
              >
                {t.label}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={() => setSel("_page")}
            className={cn(
              "mb-5 flex w-full items-center gap-3 rounded-lg border px-3 py-2.5 text-left text-sm transition-colors",
              sel === "_page" ? "border-brand/60 bg-brand/10" : "border-line hover:border-ash/40",
            )}
          >
            <span className="flex size-9 items-center justify-center rounded-md bg-ink text-base text-ash">⚙</span>
            <span>
              <span className="block font-medium">Sayfa ayarları</span>
              <span className="block text-xs text-ash">Başlık, görsel, gruplar, SEO</span>
            </span>
          </button>

          {l.groups.map((g, gi) => (
            <div key={g.id} className="mb-5">
              <p className="mb-2 flex items-center justify-between px-1 text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-ash">
                {g.label}
                <span className="font-normal normal-case tracking-normal">{g.fabrics.length}</span>
              </p>
              <ul className="space-y-1">
                {g.fabrics.map((f) => (
                  <li key={f.slug}>
                    <button
                      type="button"
                      onClick={() => setSel(f.slug)}
                      className={cn(
                        "flex w-full items-center gap-3 rounded-lg px-2 py-1.5 text-left transition-colors",
                        sel === f.slug ? "bg-brand/15 shadow-[inset_2px_0_0_#d80000]" : "hover:bg-white/5",
                      )}
                    >
                      <FabricSwatch weave={f.weave} image={swatches[f.slug]} sizes="40px" className="size-10 shrink-0 rounded-md" />
                      <span className="min-w-0">
                        <span className={cn("block truncate text-sm", sel === f.slug ? "text-bone" : "text-mist")}>{f.title || "Adsız kumaş"}</span>
                        <span className="block text-[0.7rem] text-ash">
                          {f.materials.length} malzeme{swatches[f.slug] ? " · fotoğraflı" : ""}
                        </span>
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
              {adding === gi ? (
                <div className="mt-2 flex gap-1.5 rounded-lg border border-brand/50 p-1.5">
                  <input
                    autoFocus
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        add(gi);
                      } else if (e.key === "Escape") setAdding(null);
                    }}
                    placeholder="Yeni kumaşın adı"
                    className="min-w-0 flex-1 bg-transparent px-2 text-sm outline-none"
                  />
                  <button type="button" className="admin-btn admin-btn--primary px-3 py-1 text-xs" onClick={() => add(gi)}>
                    Ekle
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    setAdding(gi);
                    setNewName("");
                  }}
                  className="mt-1 w-full rounded-lg border border-dashed border-line px-3 py-2 text-left text-xs text-ash transition-colors hover:border-brand/60 hover:text-bone"
                >
                  + Bu gruba kumaş ekle
                </button>
              )}
            </div>
          ))}
          <p className="px-1 text-xs text-ash">Toplam {total} kumaş</p>
        </aside>

        {/* ——————————— right: the chosen item */}
        <div className="min-w-0 space-y-5">
          {!fabric || !at ? (
            <>
              <Card title="Sayfa başlığı" hint="Kumaşlar sayfasının en üstü.">
                <div className="grid gap-4 md:grid-cols-2">
                  <Text label="Küçük etiket" value={l.eyebrow} onChange={(v) => setLangData({ eyebrow: v })} />
                  <Text label="Başlık" value={l.title} onChange={(v) => setLangData({ title: v })} />
                </div>
                <Text label="Giriş cümlesi" value={l.lead} onChange={(v) => setLangData({ lead: v })} area rows={2} />
              </Card>
              <Card title="Büyük görsel" hint="Başlığın altındaki tam genişlik görsel. Tüm dillerde ortak.">
                <ImageField
                  label="Görsel"
                  name="_img.hero"
                  value={data.images.hero}
                  hint="En az 2400px genişlik önerilir. Görsele tıklayarak odak noktasını seçin."
                  onChange={(v) => v && setData((d) => ({ ...d, images: { ...d.images, hero: v } }))}
                />
              </Card>
              <Card title="Grup adları">
                <div className="grid gap-4 md:grid-cols-3">
                  {l.groups.map((g, gi) => (
                    <Text key={g.id} label={`Grup ${gi + 1}`} value={g.label} onChange={(v) => setGroupLabel(gi, v)} />
                  ))}
                </div>
              </Card>
              <Card title="Sayfa sonu çağrısı" hint="En alttaki numune / iletişim bölümü.">
                <Text label="Başlık" value={l.ctaTitle} onChange={(v) => setLangData({ ctaTitle: v })} />
                <Text label="Metin" value={l.ctaText} onChange={(v) => setLangData({ ctaText: v })} area rows={2} />
                <Text label="Buton yazısı" value={l.cta} onChange={(v) => setLangData({ cta: v })} />
              </Card>
              <Card title="Küçük etiketler">
                <div className="grid gap-4 md:grid-cols-3">
                  <Text label="“Gruplar”" value={l.groupsLabel} onChange={(v) => setLangData({ groupsLabel: v })} />
                  <Text label="Sayı etiketi" value={l.countLabel} onChange={(v) => setLangData({ countLabel: v })} hint="Örn. “12 kumaş grubu”" />
                  <Text label="“Malzemeler”" value={l.materialsLabel} onChange={(v) => setLangData({ materialsLabel: v })} />
                </div>
              </Card>
              <Card title="Google görünümü (SEO)">
                <Text label="Sayfa başlığı" value={l.meta.title} onChange={(v) => setLangData({ meta: { ...l.meta, title: v } })} />
                <Text
                  label="Açıklama"
                  value={l.meta.description}
                  onChange={(v) => setLangData({ meta: { ...l.meta, description: v } })}
                  area
                  rows={2}
                  hint={`${l.meta.description.length} / 160 karakter`}
                />
              </Card>
            </>
          ) : (
            <>
              {/* header: preview, name, group, order, delete */}
              <section className="overflow-hidden rounded-xl border border-line bg-coal/60">
                <div className="grid md:grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)]">
                  <FabricSwatch weave={fabric.weave} image={swatches[sel]} sizes="(min-width: 768px) 30vw, 100vw" className="aspect-[16/10] md:aspect-auto md:min-h-64" />
                  <div className="space-y-4 p-5">
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-xs text-ash">
                        {at.fi + 1}. sıra · <code className="text-mist">/fabrics/{sel}</code>
                      </span>
                      <span className="flex items-center gap-1">
                        <MiniBtn label="Yukarı taşı" onClick={() => move(-1)}>
                          ↑ Yukarı
                        </MiniBtn>
                        <MiniBtn label="Aşağı taşı" onClick={() => move(1)}>
                          ↓ Aşağı
                        </MiniBtn>
                      </span>
                    </div>
                    <label className="block">
                      <span className="admin-label">Kumaş adı ({lang.toUpperCase()})</span>
                      <input className="admin-input text-lg font-semibold" value={fabric.title} onChange={(e) => patchFabric({ title: e.target.value })} />
                    </label>
                    <label className="block">
                      <span className="admin-label">Grup</span>
                      <select className="admin-input" value={at.gi} onChange={(e) => moveToGroup(Number(e.target.value))}>
                        {l.groups.map((g, gi) => (
                          <option key={g.id} value={gi}>
                            {g.label}
                          </option>
                        ))}
                      </select>
                    </label>
                    <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                      <Link href={`${prefix}/fabrics/${sel}`} target="_blank" className="admin-btn text-xs">
                        Sayfayı gör ↗
                      </Link>
                      <button type="button" onClick={remove} className="admin-btn text-xs text-brand">
                        Kumaşı sil
                      </button>
                    </div>
                  </div>
                </div>
              </section>

              <Card title="Görsel" hint="Kumaş kartında ve detay sayfasında görünür. Tüm dillerde ortak.">
                <ImageField
                  key={`sw-${sel}`}
                  label="Kumaş fotoğrafı"
                  name={`_img.sw.${sel}`}
                  value={swatches[sel] ?? null}
                  onChange={setSwatch}
                  hint="Bilgisayardan yükleyin veya kütüphaneden seçin. Boşsa aşağıdaki desen çizimi gösterilir."
                />
                <div>
                  <span className="admin-label">Fotoğraf yoksa kullanılacak desen</span>
                  <div className="grid grid-cols-4 gap-2 sm:grid-cols-6">
                    {WEAVES.map((w) => (
                      <button
                        key={w.key}
                        type="button"
                        onClick={() => patchFabric({ weave: w.key }, true)}
                        className={cn(
                          "overflow-hidden rounded-md border text-left transition-colors",
                          fabric.weave === w.key ? "border-brand ring-1 ring-brand" : "border-line hover:border-ash/50",
                        )}
                      >
                        <FabricSwatch weave={w.key} className="aspect-square" />
                        <span className={cn("block px-1.5 py-1 text-[0.65rem]", fabric.weave === w.key ? "text-bone" : "text-ash")}>{w.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </Card>

              <Card title="Malzemeler" hint="Kartta ve detay sayfasında listelenir. Yazıp Enter'a basın; × ile silin.">
                <Chips items={fabric.materials} onChange={(materials) => patchFabric({ materials })} placeholder="+ malzeme ekle" />
                {fabric.materials.length > 0 && (
                  <div>
                    <span className="admin-label">Malzeme notları — detay sayfasında her malzemenin yanında</span>
                    <div className="space-y-2">
                      {fabric.materials.map((m, i) => (
                        <div key={m} className="flex items-start gap-3">
                          <span className="mt-2.5 w-32 shrink-0 truncate text-xs text-mist">{m}</span>
                          <input
                            className="admin-input flex-1"
                            value={detail.materialNotes[i] ?? ""}
                            placeholder="Kısa not (opsiyonel)"
                            onChange={(e) => {
                              const notes = [...detail.materialNotes];
                              while (notes.length < fabric.materials.length) notes.push("");
                              notes[i] = e.target.value;
                              patchDetail({ materialNotes: notes });
                            }}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </Card>

              <Card title="Detay sayfası — giriş" hint="Kumaşın kendi sayfasının üst kısmı ve genel bakış.">
                <Text label="Kısa tanıtım (başlığın altında)" value={detail.lead} onChange={(v) => patchDetail({ lead: v })} area rows={2} />
                <Text label="Yapı" value={detail.structure} onChange={(v) => patchDetail({ structure: v })} placeholder="Örn. Bezayağı, dobby ve iplik boyalı dokuma" />
                <div>
                  <span className="admin-label">Genel bakış paragrafları</span>
                  <Rows items={detail.body} onChange={(body) => patchDetail({ body })} addLabel="Paragraf ekle" />
                </div>
              </Card>

              <Card title="Öne çıkanlar" hint="Detay sayfasında kartlar hâlinde; en iyi görünüm 3 adet. Boşsa bölüm gizlenir.">
                {detail.features.map((ft, i) => (
                  <div key={i} className="grid items-start gap-2 rounded-lg border border-line p-3 md:grid-cols-[1fr_2fr_auto]">
                    <input
                      className="admin-input"
                      placeholder="Başlık"
                      value={ft.title}
                      onChange={(e) => patchDetail({ features: detail.features.map((x, j) => (j === i ? { ...x, title: e.target.value } : x)) })}
                    />
                    <input
                      className="admin-input"
                      placeholder="Açıklama"
                      value={ft.text}
                      onChange={(e) => patchDetail({ features: detail.features.map((x, j) => (j === i ? { ...x, text: e.target.value } : x)) })}
                    />
                    <MiniBtn label="Sil" danger onClick={() => patchDetail({ features: detail.features.filter((_, j) => j !== i) })}>
                      ✕
                    </MiniBtn>
                  </div>
                ))}
                <button type="button" className="admin-btn text-xs" onClick={() => patchDetail({ features: [...detail.features, { title: "", text: "" }] })}>
                  + Öne çıkan ekle
                </button>
              </Card>

              <div className="grid gap-5 xl:grid-cols-2">
                <Card title="Kullanım alanları">
                  <Chips items={detail.uses} onChange={(uses) => patchDetail({ uses })} placeholder="+ kullanım alanı" />
                </Card>
                <Card title="Apreler / bitiş işlemleri">
                  <Chips items={detail.finishes} onChange={(finishes) => patchDetail({ finishes })} placeholder="+ apre ekle" />
                </Card>
              </div>
            </>
          )}
        </div>
      </div>
    </FormShell>
  );
}

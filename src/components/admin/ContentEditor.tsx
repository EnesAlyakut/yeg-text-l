"use client";

import { useState } from "react";
import type { ActionState } from "@/lib/admin";
import type { ImageRef } from "@/lib/content-types";
import { cn } from "@/lib/utils";
import { FormShell } from "./FormShell";
import { ImageField } from "./ImageField";

type Json = string | number | boolean | null | Json[] | { [k: string]: Json };
type Obj = { [k: string]: Json };
type Path = (string | number)[];

const LANGS = [
  { key: "tr", label: "Türkçe" },
  { key: "en", label: "English" },
  { key: "fr", label: "Français" },
] as const;
const isLang = (k: string) => LANGS.some((l) => l.key === k);

/** Keys that identify things in code (URLs, matching) — shown read-only. */
const LOCKED = new Set(["slug", "weave", "id", "lang", "image"]);
/** Sections removed from the site — kept in the data but not shown in the editor (paths without the language). */
const HIDDEN: Record<string, string[]> = {
  about: ["identity", "brand.slogan", "images.night"],
  fabrics: ["interlude"],
  production: ["hq"],
};
/** Where each image appears on the page. */
const IMAGE_HINTS: Record<string, Record<string, string>> = {
  about: {
    hero: "Başlığın altındaki büyük, tam genişlik görsel.",
    studio: "“Biz Kimiz?” bölümünde metnin yanındaki görsel.",
    portraitA: "“Hikâyemiz” bölümünde metnin yanındaki görsel.",
    portraitB: "“YEG'in Marka Bakışı” bölümünde metnin yanındaki görsel.",
    dusk: "“Geleceğe Bakış” bölümünün soluk arka planı.",
    areaDenim: "“Üretim Alanlarımız” — Denim kartı.",
    areaKnit: "“Üretim Alanlarımız” — Örme kartı.",
    areaKnitwear: "“Üretim Alanlarımız” — Triko kartı.",
    areaWoven: "“Üretim Alanlarımız” — Dokuma kartı.",
    global: "“İş Yapma Biçimimiz” ile “Uluslararası Yapılanma” arasındaki boydan boya görsel (yatay). Kaldırırsanız bant gizlenir.",
  },
};
/** Shapes for new items in lists that may start empty. */
const TEMPLATES: Record<string, Json> = { paragraphs: "", blocks: { title: "", text: "" } };

/** Section (top-level) names, in site order where it matters. */
const SECTIONS: Record<string, string> = {
  hero: "Açılış",
  who: "Biz Kimiz?",
  story: "Hikâyemiz",
  brand: "YEG'in Marka Bakışı",
  company: "Şirket Olarak YEG",
  capacity: "Üretim Kapasitesi",
  areas: "Üretim Alanlarımız",
  quality: "Kalite ve Sorumluluk",
  conduct: "İş Yapma Biçimimiz",
  global: "Uluslararası Yapılanma",
  future: "Geleceğe Bakış",
  capabilities: "Yetenekler bandı",
  hq: "Üretim merkezi",
  facts: "Rakamlar",
  chapters: "Üretim aşamaları",
  steps: "Sonraki adımlar",
  blocks: "Bloklar",
  paragraphs: "Paragraflar",
  labels: "Detay sayfası etiketleri",
  meta: "Google görünümü (SEO)",
  // fabric detail pages
  shirt: "Gömleklik kumaşlar",
  "suit-trouser": "Takım elbise & pantolon",
  sportswear: "Spor giyim",
  "fancy-outerwear": "Fantezi dış giyim",
  workwear: "İş elbisesi",
  decoration: "Dekorasyon",
  curtain: "Perde",
  "bed-linen": "Nevresimlik",
  "home-knit-velvet": "Örme & kadife",
  upholstery: "Döşemelik",
  mattress: "Yatak kumaşları",
  technical: "Teknik kumaşlar",
  _texts: "Diğer metinler",
  _images: "Görseller",
};

const FIELDS: Record<string, string> = {
  images: "Görseller",
  title: "Başlık",
  lead: "Giriş cümlesi",
  text: "Metin",
  body: "Metin",
  intro: "Giriş",
  paragraphs: "Paragraflar",
  items: "Maddeler",
  blocks: "Bloklar",
  eyebrow: "Küçük etiket",
  label: "Etiket",
  value: "Değer",
  unit: "Birim",
  closing: "Kapanış",
  outro: "Kapanış metni",
  emphasis: "Vurgulu cümle",
  cta: "Buton yazısı",
  ctaTitle: "Alt çağrı başlığı",
  ctaText: "Alt çağrı metni",
  address: "Adres",
  published: "Yayında (arama motorlarına açık)",
  labels: "Etiketler",
  steps: "Adımlar",
  city: "Şehir",
  country: "Ülke",
  role: "Görev",
  description: "Açıklama",
  name: "Ad",
  imageAlt: "Görsel açıklaması (erişilebilirlik)",
  founded: "Kuruluş",
  start: "Başlangıç",
  stats: "Rakamlar",
  certs: "Sertifikalar",
  certsIntro: "Sertifika girişi",
  purpose: "Amaç",
  code: "Kod",
  commitments: "Taahhütler",
  goals: "Hedefler",
  final: "Kapanış cümlesi",
  milestones: "Dönüm noktaları",
  locations: "Lokasyonlar",
  today: "Bugün",
  stages: "Aşamalar",
  structure: "Yapı",
  features: "Öne çıkanlar",
  uses: "Kullanım alanları",
  materialNotes: "Malzeme notları",
  finishes: "Apreler",
  email: "E-posta etiketi",
  stepsTitle: "Adımlar başlığı",
  questions: "Sorular",
  before: "Öncesi",
  strength: "Güç",
  audience: "Hedef kitle",
  stance: "Duruş",
  crowd: "Kalabalık",
  selective: "Seçicilik",
  ownLine: "Kendi çizgisi",
  honesty: "Dürüstlük",
  easy: "Kolaylık",
  matters: "Asıl önemli olan",
  grow: "Büyüme",
  measure: "Ölçü",
  hero: "Açılış görseli",
  portraitA: "Hikâyemiz görseli",
  portraitB: "Marka Bakışı görseli",
  dusk: "Geleceğe Bakış arka planı",
  studio: "Biz Kimiz görseli",
  areaDenim: "Üretim alanı — Denim",
  areaKnit: "Üretim alanı — Örme",
  areaKnitwear: "Üretim alanı — Triko",
  areaWoven: "Üretim alanı — Dokuma",
  global: "Türkiye'den dünyaya bandı",
  rawMaterial: "Ham madde",
  cutting: "Kesim",
  sewing: "Dikim",
  craft: "İşçilik",
  network: "Üretim ağı",
  quality: "Kalite kontrol",
  back: "Geri",
  view: "İncele",
  group: "Grup",
  overview: "Genel bakış",
  materials: "Malzemeler",
  prev: "Önceki",
  next: "Sonraki",
  related: "İlgili",
  sampleTitle: "Numune başlığı",
  sampleText: "Numune metni",
  sampleCta: "Numune butonu",
  enquiry: "Talep",
  finishesNote: "Apre notu",
  mailboxes: "Birim e-postaları",
  mailboxesTitle: "E-posta listesi başlığı",
  statement: "Vurgu satırları (ilki küçük giriş, diğerleri büyük)",
  motto: "Kırmızı bant sloganı",
  mottoNote: "Slogan altı yazı",
  signature: "Kapanış imzası",
};

const human = (k: string) => FIELDS[k] ?? SECTIONS[k] ?? k.replace(/([a-z])([A-Z])/g, "$1 $2").replace(/^./, (c) => c.toUpperCase());
const isImage = (v: Json): v is ImageRef & Obj => !!v && typeof v === "object" && !Array.isArray(v) && "url" in v && "width" in v;
const isImageKey = (k: string) => /^(image|hero|photo|cover|global)$/i.test(k);
const isObj = (v: Json): v is Obj => !!v && typeof v === "object" && !Array.isArray(v);
/** A short title for a list item card. */
const itemTitle = (v: Json, i: number) => {
  if (typeof v === "string") return v || `${i + 1}. madde`;
  if (isObj(v)) for (const k of ["title", "name", "city", "label", "code", "value"]) if (typeof v[k] === "string" && v[k]) return (v[k] as string).replace(/\*/g, "");
  return `${i + 1}. öğe`;
};

function blank(v: Json): Json {
  if (typeof v === "string") return "";
  if (typeof v === "number") return 0;
  if (typeof v === "boolean") return false;
  if (Array.isArray(v)) return [];
  if (v && typeof v === "object") {
    if (isImage(v)) return v;
    return Object.fromEntries(Object.entries(v).map(([k, x]) => [k, LOCKED.has(k) ? x : blank(x)]));
  }
  return "";
}

function setIn(root: Json, path: Path, val: Json): Json {
  if (!path.length) return val;
  const [h, ...rest] = path;
  if (Array.isArray(root)) {
    const copy = [...root];
    copy[h as number] = setIn(copy[h as number], rest, val);
    return copy;
  }
  const o = (root ?? {}) as Obj;
  return { ...o, [h]: setIn(o[h as string], rest, val) };
}

type NodeProps = { name: string; value: Json; path: Path; onChange: (p: Path, v: Json) => void; hidden: string[]; bare?: boolean };

const IconBtn = ({ onClick, label, children, danger }: { onClick: () => void; label: string; children: string; danger?: boolean }) => (
  <button type="button" onClick={onClick} aria-label={label} title={label} className={cn("rounded px-1.5 py-0.5 text-xs text-ash hover:bg-white/5", danger ? "hover:text-brand" : "hover:text-bone")}>
    {children}
  </button>
);

function Node({ name, value, path, onChange, hidden, bare }: NodeProps) {
  const id = path.join(".");
  const label = human(name);

  if (isImage(value) || (value === null && isImageKey(name))) {
    return <ImageField key={id} label={label} name={`_img.${id}`} value={value as ImageRef | null} onChange={(v) => onChange(path, v as Json)} />;
  }

  if (typeof value === "boolean") {
    return (
      <label className="flex items-center gap-3 rounded-md border border-line bg-ink/40 p-3 text-sm">
        <input type="checkbox" className="size-4 accent-[#d80000]" checked={value} onChange={(e) => onChange(path, e.target.checked)} />
        {label}
      </label>
    );
  }

  if (typeof value === "number") {
    return (
      <label className="block">
        <span className="admin-label">{label}</span>
        <input type="number" className="admin-input" value={value} onChange={(e) => onChange(path, Number(e.target.value))} />
      </label>
    );
  }

  if (typeof value === "string" || value === null) {
    const v = value ?? "";
    const locked = LOCKED.has(name);
    const long = v.length > 70 || v.includes("\n");
    const field = long ? (
      <textarea className="admin-input leading-relaxed" rows={Math.min(10, Math.ceil(v.length / 85) + 1)} value={v} onChange={(e) => onChange(path, e.target.value)} />
    ) : (
      <input className={cn("admin-input", locked && "opacity-60")} value={v} readOnly={locked} onChange={(e) => onChange(path, e.target.value)} />
    );
    if (bare) return field;
    return (
      <label className="block">
        <span className="admin-label">
          {label}
          {locked && <span className="ml-2 text-ash/60">(sabit)</span>}
        </span>
        {field}
      </label>
    );
  }

  if (Array.isArray(value)) {
    const add = () => onChange(path, [...value, value.length ? blank(value[value.length - 1]) : (TEMPLATES[name] ?? "")]);
    const remove = (i: number) => confirm("Bu öğe silinsin mi?") && onChange(path, value.filter((_, j) => j !== i));
    const move = (i: number, d: number) => {
      const j = i + d;
      if (j < 0 || j >= value.length) return;
      const copy = [...value];
      [copy[i], copy[j]] = [copy[j], copy[i]];
      onChange(path, copy);
    };
    const tools = (i: number) => (
      <span className="flex shrink-0 items-center">
        <IconBtn onClick={() => move(i, -1)} label="Yukarı taşı">↑</IconBtn>
        <IconBtn onClick={() => move(i, 1)} label="Aşağı taşı">↓</IconBtn>
        <IconBtn onClick={() => remove(i)} label="Sil" danger>✕</IconBtn>
      </span>
    );
    const simple = value.every((x) => typeof x === "string");
    return (
      <div>
        <p className="admin-label flex items-center justify-between">
          <span>
            {label} <span className="text-ash">({value.length})</span>
          </span>
        </p>
        {simple ? (
          <ol className="space-y-2">
            {value.map((item, i) => (
              <li key={`${id}.${i}`} className="flex items-start gap-2">
                <span className="w-5 pt-2.5 text-right text-[0.65rem] text-ash">{i + 1}</span>
                <div className="min-w-0 flex-1">
                  <Node name={name} value={item} path={[...path, i]} onChange={onChange} hidden={hidden} bare />
                </div>
                <span className="pt-1.5">{tools(i)}</span>
              </li>
            ))}
          </ol>
        ) : (
          <ol className="space-y-2">
            {value.map((item, i) => (
              <li key={`${id}.${i}`}>
                <details className="group rounded-md border border-line bg-ink/40">
                  <summary className="flex cursor-pointer list-none items-center gap-3 px-3 py-2.5">
                    <span aria-hidden className="text-ash transition-transform group-open:rotate-90">›</span>
                    <span className="min-w-0 flex-1 truncate text-sm">{itemTitle(item, i)}</span>
                    {tools(i)}
                  </summary>
                  <div className="space-y-4 border-t border-line p-4">
                    {isObj(item) ? (
                      Object.entries(item).map(([k, v]) => <Node key={k} name={k} value={v} path={[...path, i, k]} onChange={onChange} hidden={hidden} />)
                    ) : (
                      <Node name={name} value={item} path={[...path, i]} onChange={onChange} hidden={hidden} />
                    )}
                  </div>
                </details>
              </li>
            ))}
          </ol>
        )}
        <button type="button" className="admin-btn mt-2 text-xs" onClick={add}>
          + Yeni ekle
        </button>
      </div>
    );
  }

  // Hidden paths are matched without the leading language key
  const rel = (k: string) => [...path, k].filter((s, i) => !(i === 0 && isLang(String(s)))).join(".");
  const entries = Object.entries(value).filter(([k]) => !hidden.includes(rel(k)));
  const body = (
    <div className="space-y-5">
      {entries.map(([k, v]) => (
        <Node key={k} name={k} value={v} path={[...path, k]} onChange={onChange} hidden={hidden} />
      ))}
    </div>
  );
  if (bare) return body;
  return (
    <fieldset className="space-y-4 rounded-md border border-line p-4">
      <legend className="px-2 text-xs font-semibold text-bone">{label}</legend>
      {body}
    </fieldset>
  );
}

type Props = { pageKey: string; initial: unknown; action: (prev: ActionState, fd: FormData) => Promise<ActionState> };

/**
 * Edits a whole page's content: language tabs, a section list on the left and the chosen section on the right.
 * Loose top-level texts (CTA etc.) are grouped as "Diğer metinler"; images and settings sit in their own tab.
 */
export function ContentEditor({ pageKey, initial, action }: Props) {
  const [data, setData] = useState<Obj>(initial as Obj);
  const [tab, setTab] = useState<string>("tr");
  const [section, setSection] = useState<string | null>(null);
  const onChange = (p: Path, v: Json) => setData((d) => setIn(d, p, v) as Obj);
  const hidden = HIDDEN[pageKey] ?? [];

  // Images have their own section in every language; the shared tab keeps the rest (address, published, labels…)
  // Shared values split by language (e.g. fabric-details labels {tr,en,fr}) are edited inside each language tab.
  const perLang = (v: Json) => isObj(v) && !isImage(v) && LANGS.every((l) => l.key in v);
  const shared = Object.entries(data).filter(([k, v]) => !isLang(k) && !hidden.includes(k) && k !== "images" && !perLang(v));
  const langShared = Object.entries(data).filter(([k, v]) => !isLang(k) && !hidden.includes(k) && perLang(v));
  const tabs = [...LANGS, ...(shared.length ? [{ key: "_shared", label: "Genel ayarlar" }] : [])];

  const langObj = isLang(tab) ? (data[tab] as Obj) : {};
  const visible = Object.entries(langObj).filter(([k]) => !hidden.includes(k));
  // Sections: objects and lists; loose strings are gathered into one "Diğer metinler" section. SEO goes last.
  const blocks = visible.filter(([, v]) => typeof v === "object" && v !== null && !isImage(v));
  const loose = visible.filter(([, v]) => !(typeof v === "object" && v !== null) || isImage(v));
  const images = isObj(data.images as Json) ? (data.images as Obj) : null;
  const keys = [...(images ? ["_images"] : []), ...blocks.map(([k]) => k).filter((k) => k !== "meta"), ...langShared.map(([k]) => `_shared.${k}`), ...(loose.length ? ["_texts"] : []), ...(blocks.some(([k]) => k === "meta") ? ["meta"] : [])];
  const current = section && keys.includes(section) ? section : keys[0];

  return (
    <FormShell action={action}>
      <input type="hidden" name="key" value={pageKey} />
      <input type="hidden" name="data" value={JSON.stringify(data)} />

      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line pb-3">
        <div className="flex flex-wrap gap-2">
          {tabs.map((t) => (
            <button key={t.key} type="button" onClick={() => setTab(t.key)} className={tab === t.key ? "admin-btn admin-btn--primary" : "admin-btn"}>
              {t.label}
            </button>
          ))}
        </div>
        <p className="text-xs text-ash">
          <code className="text-bone">*kelime*</code> → sitede kırmızı vurgu · Ctrl + S ile kaydet
        </p>
      </div>

      {tab === "_shared" ? (
        <div className="admin-card">
          <div className="grid gap-6 md:grid-cols-2">
            {shared.flatMap(([k, v]) =>
              isObj(v) && !isImage(v) && Object.values(v).every((x) => isImage(x) || x === null)
                ? Object.entries(v).map(([ik, iv]) => <Node key={`${k}.${ik}`} name={ik} value={iv} path={[k, ik]} onChange={onChange} hidden={hidden} />)
                : [
                    <div key={k} className={cn(isObj(v) && !isImage(v) && "md:col-span-2")}>
                      <Node name={k} value={v} path={[k]} onChange={onChange} hidden={hidden} />
                    </div>,
                  ],
            )}
          </div>
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-[220px_minmax(0,1fr)]">
          <nav className="lg:sticky lg:top-20 lg:self-start" aria-label="Bölümler">
            <ul className="flex gap-1 overflow-x-auto lg:flex-col">
              {keys.map((k) => (
                <li key={k}>
                  <button
                    type="button"
                    onClick={() => setSection(k)}
                    className={cn(
                      "w-full whitespace-nowrap rounded-md px-3 py-2 text-left text-sm transition-colors",
                      k === current ? "bg-brand/15 text-bone shadow-[inset_2px_0_0_#d80000]" : "text-ash hover:bg-white/5 hover:text-bone",
                    )}
                  >
                    {SECTIONS[k.replace(/^_shared\./, "")] ?? human(k.replace(/^_shared\./, ""))}
                  </button>
                </li>
              ))}
            </ul>
          </nav>

          <section className="admin-card min-w-0">
            <h2 className="mb-5 text-base font-semibold">{SECTIONS[current.replace(/^_shared\./, "")] ?? human(current.replace(/^_shared\./, ""))}</h2>
            {current === "_images" && images ? (
              <>
                <p className="mb-5 text-xs text-ash">Görseller tüm dillerde ortaktır. Yükle veya kütüphaneden seç; görsele tıklayarak odak noktasını ayarla.</p>
                <div className="grid gap-6 md:grid-cols-2">
                  {Object.entries(images)
                    .filter(([k]) => !hidden.includes(`images.${k}`))
                    .map(([k, v]) => (
                      <div key={k}>
                        <Node name={k} value={v} path={["images", k]} onChange={onChange} hidden={hidden} />
                        {IMAGE_HINTS[pageKey]?.[k] && <p className="admin-hint">{IMAGE_HINTS[pageKey][k]}</p>}
                      </div>
                    ))}
                </div>
              </>
            ) : current.startsWith("_shared.") ? (
              <Node key={`${tab}.${current}`} name={current.slice(8)} value={(data[current.slice(8)] as Obj)[tab]} path={[current.slice(8), tab]} onChange={onChange} hidden={hidden} bare />
            ) : current === "_texts" ? (
              <div className="space-y-5">
                {loose.map(([k, v]) => (
                  <Node key={`${tab}.${k}`} name={k} value={v} path={[tab, k]} onChange={onChange} hidden={hidden} />
                ))}
              </div>
            ) : (
              <Node key={`${tab}.${current}`} name={current} value={langObj[current]} path={[tab, current]} onChange={onChange} hidden={hidden} bare />
            )}
          </section>
        </div>
      )}
    </FormShell>
  );
}

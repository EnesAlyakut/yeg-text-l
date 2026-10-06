import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/utils";

export function PageTitle({ title, description, actions }: { title: string; description?: string; actions?: ReactNode }) {
  return (
    <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="text-2xl font-semibold tracking-[-0.01em]">{title}</h1>
        {description && <p className="mt-1 text-sm text-ash">{description}</p>}
      </div>
      {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
    </div>
  );
}

export function Card({ title, description, children, className }: { title?: string; description?: string; children: ReactNode; className?: string }) {
  return (
    <section className={cn("admin-card", className)}>
      {title && (
        <header className="mb-5">
          <h2 className="text-sm font-semibold">{title}</h2>
          {description && <p className="mt-1 text-xs text-ash">{description}</p>}
        </header>
      )}
      <div className="space-y-4">{children}</div>
    </section>
  );
}

type FieldProps = { label: string; hint?: string; className?: string; children: ReactNode };
export function Field({ label, hint, className, children }: FieldProps) {
  return (
    <label className={cn("block", className)}>
      <span className="admin-label">{label}</span>
      {children}
      {hint && <p className="admin-hint">{hint}</p>}
    </label>
  );
}

export function Input(props: ComponentProps<"input">) {
  return <input {...props} className={cn("admin-input", props.className)} />;
}

export function Textarea(props: ComponentProps<"textarea">) {
  return <textarea rows={4} {...props} className={cn("admin-input", props.className)} />;
}

export function Select(props: ComponentProps<"select">) {
  return <select {...props} className={cn("admin-input", props.className)} />;
}

export function Checkbox({ label, hint, ...props }: ComponentProps<"input"> & { label: string; hint?: string }) {
  return (
    <label className="flex cursor-pointer items-start gap-3">
      <input type="checkbox" {...props} className="mt-0.5 size-4 accent-[#d80000]" />
      <span>
        <span className="text-sm">{label}</span>
        {hint && <span className="block text-xs text-ash">{hint}</span>}
      </span>
    </label>
  );
}

/**
 * Side-by-side EN / TR / FR inputs for a localized field.
 * French is optional everywhere: an empty French value falls back to English on the site.
 */
export function Bilingual({
  label,
  name,
  en,
  tr,
  fr,
  textarea,
  rows,
  required,
  hint,
}: {
  label: string;
  name: string;
  en?: string | null;
  tr?: string | null;
  fr?: string | null;
  textarea?: boolean;
  rows?: number;
  required?: boolean;
  hint?: string;
}) {
  const C = textarea ? Textarea : Input;
  const langs = [
    { code: "EN", suffix: "En", value: en, required },
    { code: "TR", suffix: "Tr", value: tr, required },
    { code: "FR", suffix: "Fr", value: fr, required: false },
  ];
  return (
    <div>
      <span className="admin-label">{label}</span>
      <div className="grid gap-3 md:grid-cols-3">
        {langs.map((l) => (
          <div key={l.code} className="relative">
            <span className="pointer-events-none absolute right-2 top-2 text-[0.6rem] font-semibold text-ash">{l.code}</span>
            <C name={`${name}${l.suffix}`} defaultValue={l.value ?? ""} required={l.required} {...(textarea ? { rows } : {})} />
          </div>
        ))}
      </div>
      {hint && <p className="admin-hint">{hint}</p>}
    </div>
  );
}

export function LinkButton({ href, children, primary }: { href: string; children: ReactNode; primary?: boolean }) {
  return (
    <Link href={href} className={cn("admin-btn", primary && "admin-btn--primary")}>
      {children}
    </Link>
  );
}

export function Stat({ label, value, href }: { label: string; value: number | string; href?: string }) {
  const body = (
    <div className="admin-card transition-colors hover:border-ash/50">
      <p className="text-xs text-ash">{label}</p>
      <p className="mt-3 font-display text-5xl leading-none">{value}</p>
    </div>
  );
  return href ? <Link href={href}>{body}</Link> : body;
}

export function Empty({ children }: { children: ReactNode }) {
  return <p className="rounded-lg border border-dashed border-line p-10 text-center text-sm text-ash">{children}</p>;
}

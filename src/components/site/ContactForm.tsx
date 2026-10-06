"use client";

import { AnimatePresence, m } from "framer-motion";
import { useSearchParams } from "next/navigation";
import { useActionState } from "react";
import { sendContact, type ContactState } from "@/app/[lang]/contact/actions";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/get-dictionary";
import { cn } from "@/lib/utils";
import { Button } from "./Button";

type Props = {
  lang: Locale;
  labels: Dictionary["contact"]["form"];
  products: Record<string, string>;
  /** Ready-made subjects for `?fabric=<slug>` links from the fabric pages */
  fabrics?: Record<string, string>;
};

export function ContactForm({ lang, labels, products, fabrics }: Props) {
  const [state, action, pending] = useActionState<ContactState, FormData>(sendContact, { status: "idle" });
  const params = useSearchParams();
  const productSlug = params.get("product");
  const productName = productSlug ? products[productSlug] : undefined;
  const fabricSlug = params.get("fabric");
  const subject = productName ? `${labels.productEnquiry}: ${productName}` : (fabricSlug && fabrics?.[fabricSlug]) || "";
  const invalid = new Set(state.fields ?? []);

  if (state.status === "success") {
    return (
      <m.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="border-t border-brand pt-8">
        <p className="display text-5xl text-brand">✓</p>
        <p className="mt-6 max-w-md text-lg leading-relaxed">{labels.success}</p>
      </m.div>
    );
  }

  return (
    <form action={action} className="grid gap-x-6 gap-y-2 md:grid-cols-2" noValidate>
      <input type="hidden" name="locale" value={lang} />
      <input type="hidden" name="subject" value={subject} />
      <div className="absolute -left-[9999px]" aria-hidden>
        <label>
          Website
          <input type="text" name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      {subject && <p className="eyebrow col-span-full mb-4 border-l-2 border-brand pl-3 text-bone">{subject}</p>}

      <Field name="name" label={labels.name} required autoComplete="name" invalid={invalid.has("name")} />
      <Field name="email" type="email" label={labels.email} required autoComplete="email" invalid={invalid.has("email")} />
      <Field name="phone" type="tel" label={labels.phone} autoComplete="tel" invalid={invalid.has("phone")} />
      <Field name="company" label={labels.company} autoComplete="organization" invalid={invalid.has("company")} />
      <Field name="message" label={labels.message} required textarea className="md:col-span-2" invalid={invalid.has("message")} />

      <AnimatePresence>
        {state.status === "error" && (
          <m.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="col-span-full text-sm text-brand" role="alert">
            {labels.error}
          </m.p>
        )}
      </AnimatePresence>

      <div className="col-span-full mt-8">
        <Button type="submit" disabled={pending}>
          {pending ? labels.sending : labels.submit}
        </Button>
      </div>
    </form>
  );
}

function Field({
  name,
  label,
  type = "text",
  required,
  textarea,
  className,
  invalid,
  autoComplete,
}: {
  name: string;
  label: string;
  type?: string;
  required?: boolean;
  textarea?: boolean;
  className?: string;
  invalid?: boolean;
  autoComplete?: string;
}) {
  const input = cn(
    "peer w-full border-b bg-transparent pb-3 pt-7 text-base text-bone outline-none transition-colors placeholder:text-transparent focus:border-brand",
    invalid ? "border-brand" : "border-line",
  );
  return (
    <label className={cn("relative block", className)}>
      {textarea ? (
        <textarea name={name} required={required} rows={5} placeholder={label} className={cn(input, "resize-none")} aria-invalid={invalid} />
      ) : (
        <input name={name} type={type} required={required} placeholder={label} autoComplete={autoComplete} className={input} aria-invalid={invalid} />
      )}
      <span className="eyebrow pointer-events-none absolute left-0 top-7 text-ash transition-all duration-300 peer-focus:top-1 peer-focus:text-[0.6rem] peer-[:not(:placeholder-shown)]:top-1 peer-[:not(:placeholder-shown)]:text-[0.6rem]">
        {label}
        {required && <span className="text-brand"> *</span>}
      </span>
    </label>
  );
}

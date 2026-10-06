import { notFound } from "next/navigation";

/** Unknown paths inside a locale render the localized 404 (keeps the site chrome). */
export default function CatchAll() {
  notFound();
}

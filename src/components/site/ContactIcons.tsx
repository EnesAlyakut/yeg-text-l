import type { SVGProps } from "react";

/** Small line icons for contact details; they inherit the text colour. */
const base = { width: 16, height: 16, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.6, strokeLinecap: "round", strokeLinejoin: "round" } as const;

export function InstagramIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg aria-hidden {...base} {...props}>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4.2" />
      <circle cx="17.4" cy="6.6" r="0.9" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function WhatsAppIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg aria-hidden {...base} {...props}>
      <path d="M3.5 20.5l1.3-4.3A8.6 8.6 0 1 1 8 19.3z" />
      <path d="M9.2 8.4c.2-.5.4-.5.7-.5h.5c.2 0 .4 0 .6.4l.8 1.8c.1.2.1.4 0 .6l-.5.7c-.1.2-.1.3 0 .5.6 1 1.4 1.8 2.4 2.3.2.1.4.1.5 0l.7-.8c.2-.2.4-.2.6-.1l1.7.8c.3.1.4.3.3.6-.2 1-1.1 1.7-2.1 1.7-3.1-.3-6.4-3.6-6.6-6.6 0-.5.1-1 .4-1.4z" />
    </svg>
  );
}

export function MailIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg aria-hidden {...base} {...props}>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="M3.5 6.5l8.5 6.5 8.5-6.5" />
    </svg>
  );
}

export function PhoneIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg aria-hidden {...base} {...props}>
      <path d="M5 3.5h3.2l1.6 4.2-2.1 1.3a11 11 0 0 0 5.3 5.3l1.3-2.1 4.2 1.6V17a2 2 0 0 1-2 2A15.5 15.5 0 0 1 3 5.5a2 2 0 0 1 2-2z" />
    </svg>
  );
}

export function PinIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg aria-hidden {...base} {...props}>
      <path d="M12 21s-6.5-5.6-6.5-11a6.5 6.5 0 0 1 13 0c0 5.4-6.5 11-6.5 11z" />
      <circle cx="12" cy="10" r="2.3" />
    </svg>
  );
}

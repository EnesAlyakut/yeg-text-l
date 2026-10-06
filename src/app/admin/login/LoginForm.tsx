"use client";

import { useActionState } from "react";
import { login } from "./actions";

export function LoginForm() {
  const [state, action, pending] = useActionState(login, {});
  return (
    <form action={action} className="mt-8 space-y-4">
      <label className="block">
        <span className="eyebrow text-ash">E-posta</span>
        <input name="email" type="email" required autoComplete="username" className="admin-input mt-2" />
      </label>
      <label className="block">
        <span className="eyebrow text-ash">Şifre</span>
        <input name="password" type="password" required autoComplete="current-password" className="admin-input mt-2" />
      </label>
      {state.error && <p className="text-sm text-brand">{state.error}</p>}
      <button type="submit" disabled={pending} className="admin-btn admin-btn--primary w-full">
        {pending ? "Giriş yapılıyor…" : "Giriş yap"}
      </button>
    </form>
  );
}

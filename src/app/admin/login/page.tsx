import { redirect } from "next/navigation";
import { Logo } from "@/components/brand/Logo";
import { getSession } from "@/lib/auth";
import { LoginForm } from "./LoginForm";

export const metadata = { title: "Giriş" };

export default async function LoginPage() {
  if (await getSession()) redirect("/admin");
  return (
    <main className="grid min-h-dvh place-items-center bg-ink px-4">
      <div className="w-full max-w-sm">
        <Logo className="mx-auto w-20" monogramClassName="text-brand" />
        <h1 className="eyebrow mt-10 text-center text-ash">Yönetim Paneli</h1>
        <LoginForm />
      </div>
    </main>
  );
}

import { DeleteButton } from "@/components/admin/DeleteButton";
import { Empty, PageTitle } from "@/components/admin/ui";
import { db } from "@/lib/db";
import { deleteMessage, toggleRead } from "./actions";

export const metadata = { title: "Mesajlar" };

export default async function Messages() {
  const messages = await db.contactMessage.findMany({ orderBy: { createdAt: "desc" } });
  return (
    <>
      <PageTitle title="İletişim mesajları" description="Sitedeki iletişim formundan gelen talepler." />
      {messages.length === 0 ? (
        <Empty>Henüz mesaj yok.</Empty>
      ) : (
        <div className="space-y-3">
          {messages.map((m) => (
            <article key={m.id} className={`admin-card ${m.isRead ? "opacity-70" : "border-l-2 border-l-brand"}`}>
              <header className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="font-semibold">
                    {m.name} {m.company && <span className="font-normal text-ash">· {m.company}</span>}
                  </p>
                  <p className="mt-1 text-xs text-ash">
                    <a className="hover:text-bone" href={`mailto:${m.email}`}>
                      {m.email}
                    </a>
                    {m.phone && (
                      <>
                        {" · "}
                        <a className="hover:text-bone" href={`tel:${m.phone}`}>
                          {m.phone}
                        </a>
                      </>
                    )}
                    {" · "}
                    {m.locale.toUpperCase()} · {m.createdAt.toLocaleString("tr-TR")}
                  </p>
                </div>
                <div className="flex gap-2">
                  <form action={toggleRead.bind(null, m.id, !m.isRead)}>
                    <button className="admin-btn">{m.isRead ? "Okunmadı işaretle" : "Okundu işaretle"}</button>
                  </form>
                  <DeleteButton action={deleteMessage.bind(null, m.id)} />
                </div>
              </header>
              {m.subject && <p className="mt-4 text-xs font-semibold text-brand">{m.subject}</p>}
              <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-mist">{m.message}</p>
            </article>
          ))}
        </div>
      )}
    </>
  );
}

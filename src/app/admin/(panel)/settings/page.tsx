import { FormShell } from "@/components/admin/FormShell";
import { Card, Checkbox, Field, Input, PageTitle } from "@/components/admin/ui";
import { getSettings } from "@/lib/queries";
import { changePassword, saveSettings } from "./actions";

export const metadata = { title: "Ayarlar" };

export default async function SettingsPage() {
  const { contact, general } = await getSettings();
  return (
    <>
      <PageTitle title="Ayarlar" />
      <div className="space-y-10">
        <FormShell action={saveSettings}>
          <Card title="İletişim bilgileri" description="Footer, iletişim sayfası, ürün WhatsApp butonu ve schema verilerinde kullanılır.">
            <div className="grid gap-4 md:grid-cols-2">
              <Field label="E-posta *">
                <Input name="email" type="email" defaultValue={contact.email} required />
              </Field>
              <Field label="Telefon">
                <Input name="phone" defaultValue={contact.phone} />
              </Field>
              <Field label="WhatsApp" hint="Ülke koduyla, örn. +90 5xx xxx xx xx">
                <Input name="whatsapp" defaultValue={contact.whatsapp} />
              </Field>
              <Field label="Instagram kullanıcı adı">
                <Input name="instagram" defaultValue={contact.instagram} />
              </Field>
              <Field label="Adres (EN)">
                <Input name="addressEn" defaultValue={contact.addressEn} />
              </Field>
              <Field label="Adres (TR)">
                <Input name="addressTr" defaultValue={contact.addressTr} />
              </Field>
              <Field label="Adres (FR)" hint="Boşsa İngilizce adres gösterilir.">
                <Input name="addressFr" defaultValue={contact.addressFr ?? ""} />
              </Field>
              <Field label="Harita bağlantısı" hint="Boşsa adres Google Maps araması olarak açılır.">
                <Input name="mapUrl" defaultValue={contact.mapUrl ?? ""} />
              </Field>
            </div>
          </Card>
          <Card title="Fiyatlandırma">
            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Para birimi" hint="ISO kodu: USD, EUR, TRY…">
                <Input name="currency" defaultValue={general.currency} maxLength={3} />
              </Field>
            </div>
            <Checkbox name="showPrices" label="Fiyatları sitede göster" defaultChecked={general.showPrices} />
          </Card>
        </FormShell>

        <FormShell action={changePassword} submitLabel="Şifreyi güncelle">
          <Card title="Şifre değiştir">
            <div className="grid gap-4 md:grid-cols-3">
              <Field label="Mevcut şifre">
                <Input name="current" type="password" autoComplete="current-password" required />
              </Field>
              <Field label="Yeni şifre" hint="En az 10 karakter">
                <Input name="next" type="password" autoComplete="new-password" required />
              </Field>
              <Field label="Yeni şifre (tekrar)">
                <Input name="confirm" type="password" autoComplete="new-password" required />
              </Field>
            </div>
          </Card>
        </FormShell>
      </div>
    </>
  );
}

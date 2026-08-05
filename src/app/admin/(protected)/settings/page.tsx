import { AdminForm } from "@/components/admin/AdminForm";
import {
  AdminPageHeader,
  BilingualFields,
  FormActions,
  TextArea,
  TextField,
} from "@/components/admin/FormFields";
import { saveSettingsAction } from "@/lib/admin/actions";
import { fetchSiteSettingsForAdmin } from "@/lib/airtable/admin-queries";
import { getEnv } from "@/lib/env";

export default async function AdminSettingsPage() {
  const env = getEnv();
  if (env.CONTENT_SOURCE !== "airtable") {
    return (
      <div>
        <AdminPageHeader title="Site settings" />
        <p className="text-sm text-[var(--color-muted)]">Requires CONTENT_SOURCE=airtable.</p>
      </div>
    );
  }

  const settings = await fetchSiteSettingsForAdmin();

  return (
    <div>
      <AdminPageHeader
        title="Site settings"
        description="Active settings record used across the public site."
      />
      <AdminForm action={saveSettingsAction}>
        {settings ? <input type="hidden" name="id" value={settings.id} /> : null}
        <TextField label="Brand name" name="brandName" defaultValue={settings?.brandName ?? ""} required />
        <BilingualFields
          label="Hero heading"
          enName="heroHeadingEn"
          bgName="heroHeadingBg"
          enDefault={settings?.heroHeading.en}
          bgDefault={settings?.heroHeading.bg}
        />
        <BilingualFields
          label="Hero subheading"
          enName="heroSubheadingEn"
          bgName="heroSubheadingBg"
          enDefault={settings?.heroSubheading.en}
          bgDefault={settings?.heroSubheading.bg}
          multiline
        />
        <BilingualFields
          label="About heading"
          enName="aboutHeadingEn"
          bgName="aboutHeadingBg"
          enDefault={settings?.aboutHeading.en}
          bgDefault={settings?.aboutHeading.bg}
        />
        <BilingualFields
          label="About summary"
          enName="aboutSummaryEn"
          bgName="aboutSummaryBg"
          enDefault={settings?.aboutSummary.en}
          bgDefault={settings?.aboutSummary.bg}
          multiline
        />
        <BilingualFields
          label="About body"
          enName="aboutBodyEn"
          bgName="aboutBodyBg"
          enDefault={settings?.aboutBody.en}
          bgDefault={settings?.aboutBody.bg}
          multiline
          rows={8}
        />
        <BilingualFields
          label="Contact heading"
          enName="contactHeadingEn"
          bgName="contactHeadingBg"
          enDefault={settings?.contactHeading.en}
          bgDefault={settings?.contactHeading.bg}
        />
        <BilingualFields
          label="Contact intro"
          enName="contactIntroEn"
          bgName="contactIntroBg"
          enDefault={settings?.contactIntro.en}
          bgDefault={settings?.contactIntro.bg}
          multiline
        />
        <div className="grid gap-4 md:grid-cols-2">
          <TextField label="Phone" name="phone" defaultValue={settings?.phone ?? ""} />
          <TextField label="Email" name="email" type="email" defaultValue={settings?.email ?? ""} />
        </div>
        <BilingualFields
          label="Location"
          enName="locationEn"
          bgName="locationBg"
          enDefault={settings?.location.en}
          bgDefault={settings?.location.bg}
        />
        <div className="grid gap-4 md:grid-cols-1">
          <TextField label="Instagram URL" name="instagramUrl" defaultValue={settings?.instagramUrl ?? ""} />
          <TextField label="Facebook URL" name="facebookUrl" defaultValue={settings?.facebookUrl ?? ""} />
          <TextField label="Survey URL" name="surveyUrl" defaultValue={settings?.surveyUrl ?? ""} />
        </div>
        <BilingualFields
          label="Prices heading"
          enName="pricesHeadingEn"
          bgName="pricesHeadingBg"
          enDefault={settings?.pricesPage.heading.en}
          bgDefault={settings?.pricesPage.heading.bg}
        />
        <BilingualFields
          label="Prices intro"
          enName="pricesIntroEn"
          bgName="pricesIntroBg"
          enDefault={settings?.pricesPage.intro.en}
          bgDefault={settings?.pricesPage.intro.bg}
          multiline
        />
        <BilingualFields
          label="Payment heading"
          enName="paymentHeadingEn"
          bgName="paymentHeadingBg"
          enDefault={settings?.pricesPage.paymentHeading.en}
          bgDefault={settings?.pricesPage.paymentHeading.bg}
        />
        <div className="grid gap-4 md:grid-cols-2">
          <TextArea
            label="Payment terms EN (one per line)"
            name="paymentTermsEn"
            defaultValue={settings?.pricesPage.paymentTerms.map((t) => t.en).join("\n") ?? ""}
            rows={5}
          />
          <TextArea
            label="Payment terms BG (one per line)"
            name="paymentTermsBg"
            defaultValue={settings?.pricesPage.paymentTerms.map((t) => t.bg).join("\n") ?? ""}
            rows={5}
          />
        </div>
        <fieldset className="space-y-3 border border-[var(--color-line)] p-4">
          <legend className="px-1 text-sm font-medium">Media (paste URL to replace)</legend>
          <TextField
            label="Logo URL"
            name="logoUrl"
            defaultValue=""
            hint={settings?.logo?.src ? `Current: ${settings.logo.src}` : "No logo set"}
          />
          <TextField
            label="Hero image URL"
            name="heroImageUrl"
            defaultValue=""
            hint={settings?.heroImage?.src ? `Current: ${settings.heroImage.src}` : "No hero image"}
          />
          <TextField
            label="About image URL"
            name="aboutImageUrl"
            defaultValue=""
            hint={settings?.aboutImage?.src ? `Current: ${settings.aboutImage.src}` : "No about image"}
          />
        </fieldset>
        <FormActions />
      </AdminForm>
    </div>
  );
}

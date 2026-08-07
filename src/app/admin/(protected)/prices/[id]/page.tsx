import { notFound } from "next/navigation";

import { AdminForm } from "@/components/admin/AdminForm";
import { ConfirmDeleteForm } from "@/components/admin/ConfirmDeleteForm";
import {
  AdminPageHeader,
  BilingualFields,
  FormActions,
  StatusSelect,
  TextArea,
  TextField,
} from "@/components/admin/FormFields";
import { deletePriceAction, savePriceAction } from "@/lib/admin/actions";
import { fetchPriceByIdForAdmin } from "@/lib/airtable/admin-queries";
import type { PriceItem } from "@/types/content";

type PageProps = {
  params: Promise<{ id: string }>;
};

function PriceEditor({ price }: { price?: PriceItem }) {
  return (
    <>
      <AdminForm action={savePriceAction}>
        {price ? <input type="hidden" name="id" value={price.id} /> : null}
        <div className="grid gap-4 md:grid-cols-2">
          <TextField
            label="Internal name"
            name="internalName"
            defaultValue={price?.name.en ?? ""}
            required
          />
          <StatusSelect defaultValue={price?.status ?? "draft"} />
          <TextField
            label="Order"
            name="order"
            type="number"
            defaultValue={String(price?.order ?? 0)}
            required
          />
        </div>
        <BilingualFields
          label="Name"
          enName="nameEn"
          bgName="nameBg"
          enDefault={price?.name.en}
          bgDefault={price?.name.bg}
          required
        />
        <BilingualFields
          label="Description"
          enName="descriptionEn"
          bgName="descriptionBg"
          enDefault={price?.description.en}
          bgDefault={price?.description.bg}
          multiline
        />
        <BilingualFields
          label="Price display"
          enName="priceDisplayEn"
          bgName="priceDisplayBg"
          enDefault={price?.priceDisplay.en}
          bgDefault={price?.priceDisplay.bg}
          required
        />
        <div className="grid gap-4 md:grid-cols-2">
          <TextArea
            label="Features EN (one per line)"
            name="featuresEn"
            defaultValue={price?.features?.map((f) => f.en).join("\n") ?? ""}
            rows={5}
          />
          <TextArea
            label="Features BG (one per line)"
            name="featuresBg"
            defaultValue={price?.features?.map((f) => f.bg).join("\n") ?? ""}
            rows={5}
          />
        </div>
        <BilingualFields
          label="Notes"
          enName="notesEn"
          bgName="notesBg"
          enDefault={price?.notes?.en}
          bgDefault={price?.notes?.bg}
          multiline
        />
        <FormActions />
      </AdminForm>
      {price ? (
        <ConfirmDeleteForm
          action={deletePriceAction}
          recordId={price.id}
          label="Delete package"
          confirmMessage="Delete this package? This cannot be undone."
        />
      ) : null}
    </>
  );
}

export default async function EditPricePage({ params }: PageProps) {
  const { id } = await params;
  if (id === "new") {
    return (
      <div>
        <AdminPageHeader title="New price package" />
        <PriceEditor />
      </div>
    );
  }

  const price = await fetchPriceByIdForAdmin(id);
  if (!price) notFound();

  return (
    <div>
      <AdminPageHeader title={`Edit: ${price.name.en}`} />
      <PriceEditor price={price} />
    </div>
  );
}

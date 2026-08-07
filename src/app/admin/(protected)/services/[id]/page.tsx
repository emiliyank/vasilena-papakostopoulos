import { notFound } from "next/navigation";

import { AdminForm } from "@/components/admin/AdminForm";
import { ConfirmDeleteForm } from "@/components/admin/ConfirmDeleteForm";
import {
  AdminPageHeader,
  BilingualFields,
  FormActions,
  StatusSelect,
  TextField,
} from "@/components/admin/FormFields";
import { deleteServiceAction, saveServiceAction } from "@/lib/admin/actions";
import { fetchServiceByIdForAdmin } from "@/lib/airtable/admin-queries";
import type { Service } from "@/types/content";

type PageProps = {
  params: Promise<{ id: string }>;
};

function ServiceEditor({ service }: { service?: Service }) {
  return (
    <>
      <AdminForm action={saveServiceAction}>
        {service ? <input type="hidden" name="id" value={service.id} /> : null}
        <div className="grid gap-4 md:grid-cols-2">
          <TextField
            label="Internal name"
            name="internalName"
            defaultValue={service?.title.en ?? ""}
            required
          />
          <TextField label="Slug" name="slug" defaultValue={service?.slug ?? ""} required />
          <StatusSelect defaultValue={service?.status ?? "draft"} />
          <TextField
            label="Order"
            name="order"
            type="number"
            defaultValue={String(service?.order ?? 0)}
            required
          />
        </div>
        <BilingualFields
          label="Title"
          enName="titleEn"
          bgName="titleBg"
          enDefault={service?.title.en}
          bgDefault={service?.title.bg}
          required
        />
        <BilingualFields
          label="Short description"
          enName="shortDescriptionEn"
          bgName="shortDescriptionBg"
          enDefault={service?.shortDescription.en}
          bgDefault={service?.shortDescription.bg}
          multiline
        />
        <BilingualFields
          label="Full description"
          enName="fullDescriptionEn"
          bgName="fullDescriptionBg"
          enDefault={service?.fullDescription.en}
          bgDefault={service?.fullDescription.bg}
          multiline
          rows={6}
        />
        <FormActions />
      </AdminForm>
      {service ? (
        <ConfirmDeleteForm
          action={deleteServiceAction}
          recordId={service.id}
          label="Delete service"
          confirmMessage="Delete this service? This cannot be undone."
        />
      ) : null}
    </>
  );
}

export default async function EditServicePage({ params }: PageProps) {
  const { id } = await params;
  if (id === "new") {
    return (
      <div>
        <AdminPageHeader title="New service" />
        <ServiceEditor />
      </div>
    );
  }

  const service = await fetchServiceByIdForAdmin(id);
  if (!service) notFound();

  return (
    <div>
      <AdminPageHeader title={`Edit: ${service.title.en}`} />
      <ServiceEditor service={service} />
    </div>
  );
}

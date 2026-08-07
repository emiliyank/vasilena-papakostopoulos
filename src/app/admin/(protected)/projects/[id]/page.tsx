import { notFound } from "next/navigation";

import { AccordionEditLink, AdminAccordionItem } from "@/components/admin/AdminAccordion";
import { AdminForm } from "@/components/admin/AdminForm";
import { AdminNotice } from "@/components/admin/AdminNotice";
import { ConfirmDeleteForm } from "@/components/admin/ConfirmDeleteForm";
import {
  AdminPageHeader,
  AdminTable,
  BilingualFields,
  FormActions,
  SelectField,
  StatusSelect,
  TextField,
} from "@/components/admin/FormFields";
import {
  deleteProjectAction,
  deleteProjectImageAction,
  saveProjectAction,
  saveProjectImageAction,
} from "@/lib/admin/actions";
import {
  fetchProjectByIdForAdmin,
  fetchProjectImagesForAdmin,
} from "@/lib/airtable/admin-queries";
import type { Project } from "@/types/content";

type PageProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ notice?: string | string[] }>;
};

function ProjectEditor({ project }: { project?: Project }) {
  return (
    <>
      <AdminForm action={saveProjectAction} encType="multipart/form-data">
        {project ? <input type="hidden" name="id" value={project.id} /> : null}
        <input type="hidden" name="_featured_present" value="1" />
        <div className="grid gap-4 md:grid-cols-2">
          <TextField
            label="Internal name"
            name="internalName"
            defaultValue={project?.title.en ?? ""}
            required
          />
          <TextField label="Slug" name="slug" defaultValue={project?.slug ?? ""} required />
          <StatusSelect defaultValue={project?.status ?? "draft"} />
          <TextField
            label="Order"
            name="order"
            type="number"
            defaultValue={String(project?.order ?? 0)}
            required
          />
          <TextField
            label="Project date"
            name="projectDate"
            type="date"
            defaultValue={project?.projectDate ?? ""}
          />
          <label className="flex items-center gap-2 pt-7 text-sm">
            <input
              type="checkbox"
              name="featured"
              value="true"
              defaultChecked={project?.featured ?? false}
            />
            Featured
          </label>
        </div>
        <BilingualFields
          label="Title"
          enName="titleEn"
          bgName="titleBg"
          enDefault={project?.title.en}
          bgDefault={project?.title.bg}
          required
        />
        <BilingualFields
          label="Summary"
          enName="summaryEn"
          bgName="summaryBg"
          enDefault={project?.summary.en}
          bgDefault={project?.summary.bg}
          multiline
        />
        <BilingualFields
          label="Description"
          enName="descriptionEn"
          bgName="descriptionBg"
          enDefault={project?.description.en}
          bgDefault={project?.description.bg}
          multiline
          rows={6}
        />
        <BilingualFields
          label="Project type"
          enName="projectTypeEn"
          bgName="projectTypeBg"
          enDefault={project?.projectType.en}
          bgDefault={project?.projectType.bg}
        />
        <BilingualFields
          label="Location"
          enName="locationEn"
          bgName="locationBg"
          enDefault={project?.location.en}
          bgDefault={project?.location.bg}
        />
        <BilingualFields
          label="SEO title"
          enName="seoTitleEn"
          bgName="seoTitleBg"
          enDefault={project?.seoTitle?.en}
          bgDefault={project?.seoTitle?.bg}
        />
        <BilingualFields
          label="SEO description"
          enName="seoDescriptionEn"
          bgName="seoDescriptionBg"
          enDefault={project?.seoDescription?.en}
          bgDefault={project?.seoDescription?.bg}
          multiline
        />
        <fieldset className="space-y-3 border border-[var(--color-line)] p-4">
          <legend className="px-1 text-sm font-medium">Cover image</legend>
          <TextField
            label="Cover image URL"
            name="coverImageUrl"
            defaultValue=""
            hint={
              project?.coverImage?.src && !project.coverImage.temporarySource
                ? `Current: ${project.coverImage.src}`
                : "Paste a URL or upload a file"
            }
          />
          <div className="space-y-1.5">
            <label htmlFor="coverImageFile" className="block text-sm font-medium">
              Upload cover file
            </label>
            <input id="coverImageFile" name="coverImageFile" type="file" accept="image/*" />
          </div>
        </fieldset>
        <FormActions />
      </AdminForm>
      {project ? (
        <ConfirmDeleteForm
          action={deleteProjectAction}
          recordId={project.id}
          label="Delete project"
          confirmMessage="Delete this project? This cannot be undone."
        />
      ) : null}
    </>
  );
}

function ProjectImagesSection({
  projectId,
  images,
}: {
  projectId: string;
  images: Awaited<ReturnType<typeof fetchProjectImagesForAdmin>>;
}) {
  return (
    <section className="mt-12 space-y-6">
      <div>
        <h2 className="font-[family-name:var(--font-display)] text-3xl">Gallery images</h2>
        <p className="mt-2 text-sm text-[var(--color-muted)]">
          Edit or delete existing images below, or add a new one at the bottom.
        </p>
      </div>

      {images.length === 0 ? (
        <p className="border border-[var(--color-line)] bg-[var(--color-surface)] px-4 py-3 text-sm text-[var(--color-muted)]">
          No gallery images yet for this project.
        </p>
      ) : (
        <AdminTable
          headers={["Order", "Alt EN", "Span", "Image", "Actions"]}
          rows={images.map((image) => [
            String(image.order),
            image.alt.en || "—",
            image.layoutSpan,
            image.hasImage && image.src ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={image.src} alt={image.alt.en} className="h-12 w-16 object-cover" />
            ) : (
              "Missing"
            ),
            <div key={image.id} className="flex flex-wrap items-center gap-3">
              <AccordionEditLink targetId={`image-${image.id}`}>Edit</AccordionEditLink>
              <form action={deleteProjectImageAction}>
                <input type="hidden" name="id" value={image.id} />
                <input type="hidden" name="projectId" value={projectId} />
                <button
                  type="submit"
                  className="border border-red-700 px-2 py-1 text-xs text-red-800"
                >
                  Delete
                </button>
              </form>
            </div>,
          ])}
        />
      )}

      {images.length > 0 ? (
        <div className="space-y-2">
          <p className="text-xs tracking-[0.08em] text-[var(--color-muted)] uppercase">
            Image editors (collapsed)
          </p>
          {images.map((image) => (
            <AdminAccordionItem
              key={image.id}
              id={`image-${image.id}`}
              title={
                <span className="flex items-center gap-3">
                  {image.hasImage && image.src ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={image.src}
                      alt=""
                      className="h-8 w-10 object-cover"
                    />
                  ) : null}
                  <span>
                    Image {image.order}
                    {image.alt.en ? ` — ${image.alt.en}` : ""}
                    <span className="ml-2 font-normal text-[var(--color-muted)]">
                      ({image.layoutSpan})
                    </span>
                  </span>
                </span>
              }
            >
              <div className="flex justify-end">
                <form action={deleteProjectImageAction}>
                  <input type="hidden" name="id" value={image.id} />
                  <input type="hidden" name="projectId" value={projectId} />
                  <button
                    type="submit"
                    className="border border-red-700 px-3 py-1.5 text-sm text-red-800"
                  >
                    Delete image
                  </button>
                </form>
              </div>
              <AdminForm action={saveProjectImageAction} encType="multipart/form-data">
                <input type="hidden" name="id" value={image.id} />
                <input type="hidden" name="projectId" value={projectId} />
                <div className="grid gap-4 md:grid-cols-2">
                  <TextField
                    label="Internal name"
                    name="internalName"
                    defaultValue={image.alt.en || `Image ${image.order}`}
                    required
                  />
                  <TextField
                    label="Order"
                    name="order"
                    type="number"
                    defaultValue={String(image.order)}
                    required
                  />
                  <SelectField
                    label="Layout span"
                    name="layoutSpan"
                    defaultValue={image.layoutSpan}
                    options={[
                      { value: "full", label: "Full" },
                      { value: "half", label: "Half" },
                    ]}
                  />
                </div>
                <BilingualFields
                  label="Alt text"
                  enName="altTextEn"
                  bgName="altTextBg"
                  enDefault={image.alt.en}
                  bgDefault={image.alt.bg}
                />
                <BilingualFields
                  label="Caption"
                  enName="captionEn"
                  bgName="captionBg"
                  enDefault={image.caption?.en}
                  bgDefault={image.caption?.bg}
                />
                <TextField label="Replace via URL" name="imageUrl" defaultValue="" />
                <div className="space-y-1.5">
                  <label htmlFor={`file-${image.id}`} className="block text-sm font-medium">
                    Upload file
                  </label>
                  <input id={`file-${image.id}`} name="imageFile" type="file" accept="image/*" />
                </div>
                <FormActions />
              </AdminForm>
            </AdminAccordionItem>
          ))}
        </div>
      ) : null}

      <div className="border border-[var(--color-line)] p-4">
        <h3 className="mb-4 text-sm font-medium">Add gallery image</h3>
        <AdminForm action={saveProjectImageAction} encType="multipart/form-data">
          <input type="hidden" name="projectId" value={projectId} />
          <div className="grid gap-4 md:grid-cols-2">
            <TextField label="Internal name" name="internalName" defaultValue="" required />
            <TextField
              label="Order"
              name="order"
              type="number"
              defaultValue={String(images.length + 1)}
              required
            />
            <SelectField
              label="Layout span"
              name="layoutSpan"
              defaultValue="full"
              options={[
                { value: "full", label: "Full" },
                { value: "half", label: "Half" },
              ]}
            />
          </div>
          <BilingualFields label="Alt text" enName="altTextEn" bgName="altTextBg" />
          <BilingualFields label="Caption" enName="captionEn" bgName="captionBg" />
          <TextField label="Image URL" name="imageUrl" defaultValue="" />
          <div className="space-y-1.5">
            <label htmlFor="new-image-file" className="block text-sm font-medium">
              Upload file
            </label>
            <input id="new-image-file" name="imageFile" type="file" accept="image/*" />
          </div>
          <FormActions />
        </AdminForm>
      </div>
    </section>
  );
}

export default async function EditProjectPage({ params, searchParams }: PageProps) {
  const { id } = await params;
  const { notice } = await searchParams;
  if (id === "new") {
    return (
      <div>
        <AdminPageHeader title="New project" />
        <ProjectEditor />
      </div>
    );
  }

  const project = await fetchProjectByIdForAdmin(id);
  if (!project) notFound();
  const images = await fetchProjectImagesForAdmin(project.id);

  return (
    <div>
      <AdminNotice notice={notice} />
      <AdminPageHeader title={`Edit: ${project.title.en}`} />
      <ProjectEditor project={project} />
      <ProjectImagesSection projectId={project.id} images={images} />
    </div>
  );
}

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
import { deleteBlogAction, saveBlogAction } from "@/lib/admin/actions";
import {
  fetchBlogPostByIdForAdmin,
  type AdminBlogPost,
} from "@/lib/airtable/admin-queries";

type PageProps = {
  params: Promise<{ id: string }>;
};

function BlogEditor({ post }: { post?: AdminBlogPost }) {
  return (
    <>
      <AdminForm action={saveBlogAction} encType="multipart/form-data">
        {post ? <input type="hidden" name="id" value={post.id} /> : null}
        <div className="grid gap-4 md:grid-cols-2">
          <TextField
            label="Internal title"
            name="internalTitle"
            defaultValue={post?.title.en ?? ""}
            required
          />
          <TextField label="Slug" name="slug" defaultValue={post?.slug ?? ""} required />
          <StatusSelect defaultValue={post?.status ?? "draft"} />
          <TextField
            label="Published at"
            name="publishedAt"
            type="date"
            defaultValue={post?.publishedAt?.slice(0, 10) ?? ""}
          />
        </div>
        <BilingualFields
          label="Title"
          enName="titleEn"
          bgName="titleBg"
          enDefault={post?.title.en}
          bgDefault={post?.title.bg}
          required
        />
        <BilingualFields
          label="Excerpt"
          enName="excerptEn"
          bgName="excerptBg"
          enDefault={post?.excerpt.en}
          bgDefault={post?.excerpt.bg}
          multiline
        />
        <BilingualFields
          label="Body (Markdown)"
          enName="bodyEn"
          bgName="bodyBg"
          enDefault={post?.bodyMarkdown.en}
          bgDefault={post?.bodyMarkdown.bg}
          multiline
          rows={12}
        />
        <BilingualFields
          label="Cover alt text"
          enName="coverAltEn"
          bgName="coverAltBg"
          enDefault={post?.coverAlt.en}
          bgDefault={post?.coverAlt.bg}
        />
        <BilingualFields
          label="SEO title"
          enName="seoTitleEn"
          bgName="seoTitleBg"
          enDefault={post?.seoTitle?.en}
          bgDefault={post?.seoTitle?.bg}
        />
        <BilingualFields
          label="SEO description"
          enName="seoDescriptionEn"
          bgName="seoDescriptionBg"
          enDefault={post?.seoDescription?.en}
          bgDefault={post?.seoDescription?.bg}
          multiline
        />
        <fieldset className="space-y-3 border border-[var(--color-line)] p-4">
          <legend className="px-1 text-sm font-medium">Cover image</legend>
          <TextField
            label="Cover image URL"
            name="coverImageUrl"
            defaultValue=""
            hint={post?.coverImage?.src ? `Current: ${post.coverImage.src}` : undefined}
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
      {post ? (
        <ConfirmDeleteForm
          action={deleteBlogAction}
          recordId={post.id}
          label="Delete post"
          confirmMessage="Delete this post? This cannot be undone."
        />
      ) : null}
    </>
  );
}

export default async function EditBlogPage({ params }: PageProps) {
  const { id } = await params;
  if (id === "new") {
    return (
      <div>
        <AdminPageHeader title="New blog post" />
        <BlogEditor />
      </div>
    );
  }

  const post = await fetchBlogPostByIdForAdmin(id);
  if (!post) notFound();

  return (
    <div>
      <AdminPageHeader title={`Edit: ${post.title.en}`} />
      <BlogEditor post={post} />
    </div>
  );
}

"use server";

import { redirect } from "next/navigation";

import {
  blogFields,
  priceFields,
  projectFields,
  projectImageFields,
  serviceFields,
  siteSettingsFields,
} from "@/lib/airtable/map-fields";
import {
  createAirtableRecord,
  deleteAirtableRecord,
  updateAirtableRecord,
  uploadAirtableAttachment,
} from "@/lib/airtable/write";
import { logAdminAction } from "@/lib/admin/audit";
import { AdminAuthError, AdminConfigError, requireAdminSession, requireAirtableContentSource } from "@/lib/admin/guard";
import { withAdminNotice } from "@/lib/admin/notices";
import { revalidateAirtableContent } from "@/lib/admin/revalidate";
import {
  blogFormSchema,
  formDataToObject,
  priceFormSchema,
  projectFormSchema,
  projectImageFormSchema,
  serviceFormSchema,
  siteSettingsFormSchema,
} from "@/lib/admin/schemas";

export type ActionState = {
  error?: string;
  success?: string;
};

function actionError(error: unknown): ActionState {
  if (error instanceof AdminAuthError) {
    return { error: "You must be signed in." };
  }
  if (error instanceof AdminConfigError) {
    return { error: error.message };
  }
  if (error instanceof Error) {
    return { error: error.message };
  }
  return { error: "Something went wrong." };
}

async function prepareWrite() {
  const session = await requireAdminSession();
  const env = requireAirtableContentSource();
  return { session, env };
}

export async function saveServiceAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  try {
    const { session, env } = await prepareWrite();
    const id = String(formData.get("id") ?? "");
    const parsed = serviceFormSchema.parse(formDataToObject(formData));
    const fields = serviceFields(parsed);
    const table = env.AIRTABLE_TABLE_SERVICES;

    if (id) {
      await updateAirtableRecord(table, id, fields);
      logAdminAction({ actorEmail: session.email, action: "update", table, recordId: id });
    } else {
      const created = await createAirtableRecord(table, fields);
      logAdminAction({
        actorEmail: session.email,
        action: "create",
        table,
        recordId: created.id,
      });
    }

    revalidateAirtableContent(table);
    redirect(withAdminNotice("/admin/services", "saved"));
  } catch (error) {
    if (typeof error === "object" && error && "digest" in error) throw error;
    return actionError(error);
  }
}

export async function deleteServiceAction(formData: FormData): Promise<void> {
  const { session, env } = await prepareWrite();
  const id = String(formData.get("id") ?? "");
  if (!id) return;
  const table = env.AIRTABLE_TABLE_SERVICES;
  await deleteAirtableRecord(table, id);
  logAdminAction({ actorEmail: session.email, action: "delete", table, recordId: id });
  revalidateAirtableContent(table);
  redirect(withAdminNotice("/admin/services", "deleted"));
}

export async function savePriceAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  try {
    const { session, env } = await prepareWrite();
    const id = String(formData.get("id") ?? "");
    const parsed = priceFormSchema.parse(formDataToObject(formData));
    const fields = priceFields(parsed);
    const table = env.AIRTABLE_TABLE_PRICES;

    if (id) {
      await updateAirtableRecord(table, id, fields);
      logAdminAction({ actorEmail: session.email, action: "update", table, recordId: id });
    } else {
      const created = await createAirtableRecord(table, fields);
      logAdminAction({
        actorEmail: session.email,
        action: "create",
        table,
        recordId: created.id,
      });
    }

    revalidateAirtableContent(table);
    redirect(withAdminNotice("/admin/prices", "saved"));
  } catch (error) {
    if (typeof error === "object" && error && "digest" in error) throw error;
    return actionError(error);
  }
}

export async function deletePriceAction(formData: FormData): Promise<void> {
  const { session, env } = await prepareWrite();
  const id = String(formData.get("id") ?? "");
  if (!id) return;
  const table = env.AIRTABLE_TABLE_PRICES;
  await deleteAirtableRecord(table, id);
  logAdminAction({ actorEmail: session.email, action: "delete", table, recordId: id });
  revalidateAirtableContent(table);
  redirect(withAdminNotice("/admin/prices", "deleted"));
}

export async function saveSettingsAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  try {
    const { session, env } = await prepareWrite();
    const id = String(formData.get("id") ?? "");
    const parsed = siteSettingsFormSchema.parse(formDataToObject(formData));
    const fields = siteSettingsFields(parsed);
    const table = env.AIRTABLE_TABLE_SITE_SETTINGS;

    if (id) {
      await updateAirtableRecord(table, id, fields);
      logAdminAction({ actorEmail: session.email, action: "update", table, recordId: id });
    } else {
      const created = await createAirtableRecord(table, {
        ...fields,
        "Internal Name": "Primary",
      });
      logAdminAction({
        actorEmail: session.email,
        action: "create",
        table,
        recordId: created.id,
      });
    }

    revalidateAirtableContent(table);
    return { success: "Changes saved successfully." };
  } catch (error) {
    return actionError(error);
  }
}

export async function saveProjectAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  try {
    const { session, env } = await prepareWrite();
    const id = String(formData.get("id") ?? "");
    const parsed = projectFormSchema.parse(formDataToObject(formData));
    const fields = projectFields(parsed);
    const table = env.AIRTABLE_TABLE_PROJECTS;

    let recordId = id;
    if (id) {
      await updateAirtableRecord(table, id, fields);
      logAdminAction({ actorEmail: session.email, action: "update", table, recordId: id });
    } else {
      const created = await createAirtableRecord(table, fields);
      recordId = created.id;
      logAdminAction({
        actorEmail: session.email,
        action: "create",
        table,
        recordId: created.id,
      });
    }

    const file = formData.get("coverImageFile");
    if (file instanceof File && file.size > 0) {
      const bytes = await file.arrayBuffer();
      await uploadAirtableAttachment({
        recordId,
        fieldName: "Cover Image",
        filename: file.name,
        contentType: file.type || "application/octet-stream",
        bytes,
      });
      logAdminAction({
        actorEmail: session.email,
        action: "upload",
        table,
        recordId,
      });
    }

    revalidateAirtableContent(table);
    redirect(withAdminNotice(`/admin/projects/${recordId}`, "saved"));
  } catch (error) {
    if (typeof error === "object" && error && "digest" in error) throw error;
    return actionError(error);
  }
}

export async function deleteProjectAction(formData: FormData): Promise<void> {
  const { session, env } = await prepareWrite();
  const id = String(formData.get("id") ?? "");
  if (!id) return;
  const table = env.AIRTABLE_TABLE_PROJECTS;
  await deleteAirtableRecord(table, id);
  logAdminAction({ actorEmail: session.email, action: "delete", table, recordId: id });
  revalidateAirtableContent(table);
  redirect(withAdminNotice("/admin/projects", "deleted"));
}

export async function saveProjectImageAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  try {
    const { session, env } = await prepareWrite();
    const id = String(formData.get("id") ?? "");
    const parsed = projectImageFormSchema.parse(formDataToObject(formData));
    const fields = projectImageFields(parsed);
    const table = env.AIRTABLE_TABLE_PROJECT_IMAGES;

    let recordId = id;
    if (id) {
      await updateAirtableRecord(table, id, fields);
      logAdminAction({ actorEmail: session.email, action: "update", table, recordId: id });
    } else {
      const created = await createAirtableRecord(table, fields);
      recordId = created.id;
      logAdminAction({
        actorEmail: session.email,
        action: "create",
        table,
        recordId: created.id,
      });
    }

    const file = formData.get("imageFile");
    if (file instanceof File && file.size > 0) {
      const bytes = await file.arrayBuffer();
      await uploadAirtableAttachment({
        recordId,
        fieldName: "Image",
        filename: file.name,
        contentType: file.type || "application/octet-stream",
        bytes,
      });
      logAdminAction({
        actorEmail: session.email,
        action: "upload",
        table,
        recordId,
      });
    }

    revalidateAirtableContent(table);
    revalidateAirtableContent(env.AIRTABLE_TABLE_PROJECTS);
    redirect(withAdminNotice(`/admin/projects/${parsed.projectId}`, "saved"));
  } catch (error) {
    if (typeof error === "object" && error && "digest" in error) throw error;
    return actionError(error);
  }
}

export async function deleteProjectImageAction(formData: FormData): Promise<void> {
  const { session, env } = await prepareWrite();
  const id = String(formData.get("id") ?? "");
  const projectId = String(formData.get("projectId") ?? "");
  if (!id) return;
  const table = env.AIRTABLE_TABLE_PROJECT_IMAGES;
  await deleteAirtableRecord(table, id);
  logAdminAction({ actorEmail: session.email, action: "delete", table, recordId: id });
  revalidateAirtableContent(table);
  revalidateAirtableContent(env.AIRTABLE_TABLE_PROJECTS);
  redirect(withAdminNotice(`/admin/projects/${projectId}`, "deleted"));
}

export async function saveBlogAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  try {
    const { session, env } = await prepareWrite();
    const id = String(formData.get("id") ?? "");
    const parsed = blogFormSchema.parse(formDataToObject(formData));
    const fields = blogFields(parsed);
    const table = env.AIRTABLE_TABLE_BLOG_POSTS;

    let recordId = id;
    if (id) {
      await updateAirtableRecord(table, id, fields);
      logAdminAction({ actorEmail: session.email, action: "update", table, recordId: id });
    } else {
      const created = await createAirtableRecord(table, fields);
      recordId = created.id;
      logAdminAction({
        actorEmail: session.email,
        action: "create",
        table,
        recordId: created.id,
      });
    }

    const file = formData.get("coverImageFile");
    if (file instanceof File && file.size > 0) {
      const bytes = await file.arrayBuffer();
      await uploadAirtableAttachment({
        recordId,
        fieldName: "Cover Image",
        filename: file.name,
        contentType: file.type || "application/octet-stream",
        bytes,
      });
      logAdminAction({
        actorEmail: session.email,
        action: "upload",
        table,
        recordId,
      });
    }

    revalidateAirtableContent(table);
    redirect(withAdminNotice("/admin/blog", "saved"));
  } catch (error) {
    if (typeof error === "object" && error && "digest" in error) throw error;
    return actionError(error);
  }
}

export async function deleteBlogAction(formData: FormData): Promise<void> {
  const { session, env } = await prepareWrite();
  const id = String(formData.get("id") ?? "");
  if (!id) return;
  const table = env.AIRTABLE_TABLE_BLOG_POSTS;
  await deleteAirtableRecord(table, id);
  logAdminAction({ actorEmail: session.email, action: "delete", table, recordId: id });
  revalidateAirtableContent(table);
  redirect(withAdminNotice("/admin/blog", "deleted"));
}

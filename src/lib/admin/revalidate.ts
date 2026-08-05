import { revalidatePath, revalidateTag, updateTag } from "next/cache";

export function revalidateAirtableContent(tableName?: string) {
  updateTag("airtable");
  revalidateTag("airtable", "max");
  if (tableName) {
    updateTag(`airtable:${tableName}`);
    revalidateTag(`airtable:${tableName}`, "max");
  }
  revalidatePath("/", "layout");
  revalidatePath("/admin", "layout");
}

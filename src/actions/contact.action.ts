"use server";

import { sendContactEmail } from "@/services/contact.service";

export async function submitContact(formData: FormData) {
  const name = formData.get("name")?.toString() ?? "";
  const email = formData.get("email")?.toString() ?? "";
  const message = formData.get("message")?.toString() ?? "";
  const locale = formData.get("locale")?.toString() === "en" ? "en" : "vi";

  return await sendContactEmail(name, email, message, locale);
}

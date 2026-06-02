"use server";

import { sendContactEmail } from "@/services/contact.service";

export async function submitContact(formData: FormData) {
  const name = formData.get("name")?.toString() ?? "";
  const email = formData.get("email")?.toString() ?? "";
  const message = formData.get("message")?.toString() ?? "";

  return await sendContactEmail(name, email, message);
}
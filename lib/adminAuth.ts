import { cookies } from "next/headers";

export const ADMIN_COOKIE = "af237_admin";

export function isAdminAuthed() {
  return cookies().get(ADMIN_COOKIE)?.value === "ok";
}

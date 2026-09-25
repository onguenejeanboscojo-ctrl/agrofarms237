import { redirect } from "next/navigation";
import { isAdminAuthed } from "@/lib/adminAuth";
import AdminEducationClient from "./AdminEducationClient";

export default function AdminEducationPage() {
  if (!isAdminAuthed()) {
    redirect("/admin/login");
  }

  return <AdminEducationClient />;
}

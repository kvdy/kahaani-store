import { redirect } from "next/navigation"
import { getAdminFromRequest } from "@/lib/admin-middleware"
import AdminDashboard from "@/components/AdminDashboard"

export default async function AdminDashboardPage() {
  const admin = await getAdminFromRequest()
  
  if (!admin) {
    redirect("/admin/login")
  }

  return <AdminDashboard admin={admin} />
}
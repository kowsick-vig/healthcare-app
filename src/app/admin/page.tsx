import { getServerSession } from "next-auth";
import { authOptions } from "../../lib/auth"; // relative import avoids alias issues
import { redirect } from "next/navigation";

export default async function AdminPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/api/auth/signin?callbackUrl=/admin");
  const role = (session.user as any).role || "PATIENT";
  if (role !== "ADMIN") return <main className="p-6">Not authorized.</main>;
  return (
    <main className="p-6">
      <h1 className="text-2xl font-semibold">Admin</h1>
      <p>Welcome, admin!</p>
    </main>
  );
}

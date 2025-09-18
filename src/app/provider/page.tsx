import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import ProviderUI from "./ui";

export default async function ProviderPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/api/auth/signin?callbackUrl=/provider");
  const role = (session.user as any).role || "PATIENT";
  if (!["PROVIDER", "ADMIN"].includes(role)) return <main className="p-6">Not authorized.</main>;
  return <ProviderUI email={session.user.email!} />;
}

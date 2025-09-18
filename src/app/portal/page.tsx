import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import PortalUI from "./ui";

export default async function PortalPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/api/auth/signin?callbackUrl=/portal");
  return <PortalUI email={session.user.email!} />;
}

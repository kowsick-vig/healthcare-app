import { getServerSession } from "next-auth";
import { authOptions } from "../../lib/auth";

export default async function WhoAmI() {
  const session = await getServerSession(authOptions);
  return <pre style={{ padding: 16 }}>{JSON.stringify(session, null, 2)}</pre>;
}

import { auth } from "@/shared/lib/auth";
import { prisma } from "@/shared/lib/prisma";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function WaitingPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  const member = await prisma.member.findUnique({
    where: {
      userId: session?.user.id,
    },
  });
  if (member) {
    redirect(`/${session?.user.clubId}`);
  }
  return <div>Waiting for approval...</div>;
}

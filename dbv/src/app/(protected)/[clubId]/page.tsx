import { auth } from "@/shared/lib/auth";
import { prisma } from "@/shared/lib/prisma";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import ClubPageClient from "./page_client";
import { User } from "../../../../generated/prisma/client";

export default async function ClubPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session) {
    redirect("/login");
  }
  const user = await prisma.user.findUnique({
    where: {
      id: session.user.id,
    },
  }) as User

  const units = await prisma.unit.findMany()

  return <ClubPageClient units={units} user={user}/>;
}

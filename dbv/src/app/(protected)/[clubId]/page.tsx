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
  const member = await prisma.member.findFirst({
    where: {
      userId: session.user.id,
    },
  });

  if (!member) {
    redirect(`/waiting`);
  }

  const user = (await prisma.user.findUnique({
    where: {
      id: session.user.id,
    },
  })) as User;

  if(user.permission >= 3){
    redirect(`/${session.user.clubId}/${member.unitId}`);
  }

  const units = await prisma.unit.findMany({
    where: {
      clubId: session.user.clubId,
    },
  });

  return <ClubPageClient units={units} user={user} />;
}

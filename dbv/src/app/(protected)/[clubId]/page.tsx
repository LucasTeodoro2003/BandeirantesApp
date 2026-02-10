"use server";
import { auth } from "@/shared/lib/auth";
import { prisma } from "@/shared/lib/prisma";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import ClubPageClient from "./page_client";
import { Club, User } from "../../../../generated/prisma/client";

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

  const club = (await prisma.club.findFirst({
    where: {
      id: session.user.clubId,
    },
  })) as Club;

  if (user.permission >= 3) {
    redirect(`/${session.user.clubId}/${member.unitId}`);
  }

  const units = await prisma.unit.findMany({
    where: {
      clubId: session.user.clubId,
    },
    include: {
      members: {
        include: {
          user: true,
        },
      },
    },
  });

  const users = await prisma.user.findMany({
  })

  const members = await prisma.member.findMany({
    where: {
      clubId: session.user.clubId,
    },
  })

  return <ClubPageClient units={units} users={users} club={club} members={members} user={user} />;
}

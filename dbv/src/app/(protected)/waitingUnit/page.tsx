"use server";
import { auth } from "@/shared/lib/auth";
import { prisma } from "@/shared/lib/prisma";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import WaitingPageClient from "./page_client";

export default async function WaitingPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  const member = await prisma.member.findUnique({
    where: {
      userId: session?.user.id,
    },
    include: {
      user: {
        select: {
          clubId: true,
        },
      },
    },
  });

  if (member && member.unitId) {
    redirect(`/${member.user.clubId}`);
  }

  return <WaitingPageClient />;
}

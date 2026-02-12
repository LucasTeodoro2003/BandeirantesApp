import { auth } from "@/shared/lib/auth";
import UnitPageClient from "./page_client";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/shared/lib/prisma";

interface UnitPageProps {
  params: Promise<{
    clubId: string;
    unitId: string;
  }>;
}

export default async function UnitPage({ params }: UnitPageProps) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session) {
    redirect("/login");
  }

  const member = await prisma.member.findUnique({
    where: {
      userId: session.user.id,
    },
    include: {
      user: true,
    },
  });
  if (!member) {
    redirect("/login");
  }
  if (member.clubId !== (await params).clubId) {
    redirect(`/${member.clubId}`);
  }
  if (member.unitId !== (await params).unitId && member.user.permission >= 3) {
    redirect(`/${member.clubId}`);
  }
  if (!member.active) {
    redirect(`/waiting`);
  }

  const unit = await prisma.unit.findUnique({
    where: {
      id: member.unitId || "",
    },
  });

  const members = await prisma.member.findMany({
    where: {
      unitId: (await params).unitId,
      active: true,
    },
    include:{
      user: true,
      PointsMember: true,
      unit:{
        include:{
          PointsUnit: true,
          members: true
        }
      }
    }
  })

  return <UnitPageClient members={members} />;
}

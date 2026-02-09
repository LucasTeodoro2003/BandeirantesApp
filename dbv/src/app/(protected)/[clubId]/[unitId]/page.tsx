import { auth } from "@/shared/lib/auth";
import UnitPageClient from "./page_client";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/shared/lib/prisma";

export default async function UnitPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if(!session){
    redirect("/login")
  }

  const member = await prisma.member.findUnique({
    where: {
        userId: session.user.id
    }, include:{
        user: true
    }
  })
  if(!member){
    redirect("/login")
  }

  const unit = await prisma.unit.findUnique({
    where: {
        id: member.unitId || ""
    }
  })

  return <UnitPageClient />;
}

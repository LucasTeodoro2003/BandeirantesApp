import { auth } from "@/shared/lib/auth";
import { headers } from "next/headers";
import LoginPageClient from "./page_client";
import { redirect } from "next/navigation";
import { prisma } from "@/shared/lib/prisma";

export default async function LoginPage(){
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if(session){
    redirect(`/${session.user.clubId}`)
  }

  const units = await prisma.unit.findMany({
    include:{
      PointsUnit:true,
      members:{
        include:{
          user:true,
          PointsMember:true
        }
      }
    }
  })

  const members = await prisma.member.findMany({
    include:{
      user:true,
      PointsMember: true,
      unit:{
        include:{
          PointsUnit:true,
          members:{
          }
        }
      }
    }
  })
  
  return <LoginPageClient units={units} members={members}/>
}
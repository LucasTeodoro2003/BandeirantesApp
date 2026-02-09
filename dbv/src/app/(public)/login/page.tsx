import { auth } from "@/shared/lib/auth";
import { headers } from "next/headers";
import LoginPageClient from "./page_client";
import { redirect } from "next/navigation";

export default async function LoginPage(){
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if(session){
    redirect(`/${session.user.clubId}`)
  }

  return <LoginPageClient />
}
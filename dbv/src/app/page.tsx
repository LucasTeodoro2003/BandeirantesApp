"use server"

import { prisma } from "../shared/lib/prisma"
import HomeClient from "./page_client"

export default async function Home(){
  const users = await prisma.user.findMany()
  console.log(users)
  return <HomeClient />
}
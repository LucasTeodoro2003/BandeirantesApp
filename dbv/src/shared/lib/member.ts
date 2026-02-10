"use server"
import { prisma } from "./prisma";

export default async function UpdateOrCreateMember(member: FormData) {
    try {
        await prisma.member.upsert({
            where: {
                id: member.get("id")?.toString() || ""
            },
            update: {
                active: member.get("active") === "true"
            },
            create: {
                active: member.get("active") === "true",
                userId: member.get("userId")?.toString() || "",
                clubId: member.get("clubId")?.toString() || "",
            }
        })
    } catch (error) {
        console.error("Erro ao criar membro:", error);
    }
}
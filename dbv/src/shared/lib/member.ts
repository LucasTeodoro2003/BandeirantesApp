"use server";
import { revalidatePath } from "next/cache";
import { prisma } from "./prisma";

export default async function UpdateOrCreateMember(member: FormData) {
  try {
    await prisma.$transaction(async (tx) => {
      await prisma.member.upsert({
        where: {
          id: member.get("id")?.toString() || "",
        },
        update: {
          active: member.get("active") === "true",
          unitId: member.get("unitId")?.toString() || null,
        },
        create: {
          active: member.get("active") === "true",
          userId: member.get("userId")?.toString() || "",
          clubId: member.get("clubId")?.toString() || "",
          unitId: member.get("unitId")?.toString() || null,
        },
      });

      await prisma.user.update({
        where: {
          id: member.get("userId")?.toString() || "",
        },
        data: {
          permission: parseInt(member.get("occupation")?.toString() || "5"),
          clubId: member.get("clubId")?.toString() || "",
        },
      });
      revalidatePath("/");
    });
  } catch (error) {
    console.error("Erro ao criar membro:", error);
    throw new Error("Erro ao criar membro. Tente novamente.");
  }
}

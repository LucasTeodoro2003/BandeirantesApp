"use server"
import { revalidatePath } from "next/cache";
import { prisma } from "./prisma";

export default async function SelectClub(formData: FormData) {
  try {
    await prisma.user.update({
      where: {
        id: formData.get("userId")?.toString() || "",
      },
      data: {
        clubId: formData.get("clubId")?.toString() || "",
      },
    });
    revalidatePath("/");
  } catch (error) {
    console.error("Erro ao selecionar clube:", error);
    throw new Error("Erro ao selecionar clube. Tente novamente.");
  }
}

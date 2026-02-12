"use server";

import { auth } from "@/shared/lib/auth";
import { prisma } from "@/shared/lib/prisma";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

export async function updateUserAvatar(formData: FormData) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user?.id) {
      throw new Error("Não autenticado");
    }

    const userId = formData.get("userId") as string;

    if (session.user.id !== userId) {
      throw new Error("Não autorizado");
    }

    const currentUser = await prisma.user.findUnique({
      where: { id: userId },
      select: { image: true, name: true },
    });

    if (currentUser?.image && currentUser.image.includes("supabase")) {
      try {
        const oldPath = currentUser.image.split("/").slice(-3).join("/");
        console.log("Deletando imagem antiga em:", oldPath);
        await supabase.storage.from("DBV").remove([oldPath]);
      } catch (error) {
        console.warn("Não foi possível deletar imagem antiga:", error);
      }
    }

    const file = formData.get("image") as File | null;
    let imageUrl: string | null = null;

    if (file && file.size > 0) {
      const fileBuffer = Buffer.from(await file.arrayBuffer());
      const fileExtension = file.name.split(".").pop() || "png";
      const nameFilePath =
        currentUser?.name.split(" ")[0] ||
        "Sem" + currentUser?.name.split(" ")[1] ||
        "nome";
      const filePath = `members/${nameFilePath}-${userId}/${nameFilePath}.${fileExtension}`;

      const { error: uploadError } = await supabase.storage
        .from("DBV")
        .upload(filePath, fileBuffer, {
          contentType: file.type,
          upsert: true,
        });

      if (uploadError) throw uploadError;

      const { data: publicData } = supabase.storage
        .from("DBV")
        .getPublicUrl(filePath);

      imageUrl = `${publicData.publicUrl}?v=${Date.now()}`;

      await prisma.user.update({
        where: { id: userId },
        data: { image: imageUrl },
      });
    }

    revalidatePath("/");

    return { success: true, url: imageUrl };
  } catch (error) {
    console.error("Erro ao atualizar avatar:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Erro desconhecido",
    };
  }
}

"use client";
import {
  Menubar,
  MenubarContent,
  MenubarGroup,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarTrigger,
} from "@/shared/components/ui/menubar";
import { authClient } from "@/shared/lib/auth-client";
import {
  CircleFadingPlusIcon,
  CircleStarIcon,
  LogOutIcon,
  TrashIcon,
  User2Icon,
  UserCogIcon,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Spinner } from "../spinner";
import { toast } from "sonner";

interface MenubarIconsProps {
  setOpenMember: (open: boolean) => void;
}

export function MenubarIcons({ setOpenMember }: MenubarIconsProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSignOut = async () => {
    setLoading(true);
    try{
      await authClient.signOut();
      toast.success("Deslogado com sucesso!")
      router.replace("/");
      setLoading(false);
    }catch(error){
      console.error("Error ao sair:", error);
      setLoading(false);
      toast.error("Erro ao sair. Tente novamente.");
    }
  };

  return (
    <Menubar className="w-min">
      <MenubarMenu>
        <MenubarTrigger>{loading ? <Spinner /> : "Perfil"}</MenubarTrigger>
        <MenubarContent>
          <MenubarItem>
            <User2Icon />
            Editar Perfil
          </MenubarItem>
          <MenubarSeparator />
          <MenubarItem variant="destructive" onClick={handleSignOut}>
            <LogOutIcon />
            Sair
          </MenubarItem>
        </MenubarContent>
      </MenubarMenu>
      <MenubarMenu>
        <MenubarTrigger className="w-min">Clube</MenubarTrigger>
        <MenubarContent>
          <MenubarGroup>
            <MenubarItem>
              <CircleFadingPlusIcon />
              Unidades
            </MenubarItem>
            <MenubarItem onClick={() => setOpenMember(true)}>
              <UserCogIcon />
              Membros
            </MenubarItem>
            <MenubarItem>
              <CircleStarIcon />
              Pontuações
            </MenubarItem>
            <MenubarSeparator />
            <MenubarItem variant="destructive">
              <TrashIcon />
              Delete
            </MenubarItem>
          </MenubarGroup>
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  );
}

"use client"
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
  UserRoundPlusIcon,
} from "lucide-react";
import { useRouter } from "next/navigation";

interface MenubarIconsProps {
  setOpenMember: (open: boolean) => void;
}

export function MenubarIcons({ setOpenMember }: MenubarIconsProps) {
  const handleSignOut = async () => {
    const router = useRouter();
    await authClient.signOut();
    router.replace("/");
  };

  return (
    <Menubar className="w-min">
      <MenubarMenu>
        <MenubarTrigger>Perfil</MenubarTrigger>
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
              <UserRoundPlusIcon />
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

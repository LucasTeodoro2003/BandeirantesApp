"use client"
import { useState } from "react";
import { Button } from "../../shared/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "../../shared/components/ui/drawer";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "../../shared/components/ui/select";
import { Field, FieldContent, FieldGroup, FieldLabel } from "../../shared/components/ui/field";
import { Switch } from "../../shared/components/ui/switch";
import { Member, User } from "../../../generated/prisma/client";
import { Toaster } from "../../shared/components/ui/sonner";
import { toast } from "sonner";
import UpdateOrCreateMember from "@/shared/lib/member";
import { Spinner } from "@/shared/components/ui/spinner";

interface CreateMemberProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  users: User[]
  members: Member[]
  user: User
}

export default function CreateMember({ open, setOpen, users, members, user }: CreateMemberProps) {

  const [selectedUser, setSelectedUser] = useState("")
  const [openActiveMember, setOpenActiveMember] = useState(false)
  const [selectedMember, setSelectedMember] = useState<Member | null>(null)
  const [activeMember, setActiveMember] = useState(members.find((m) => m.userId === selectedUser)?.active || false)
  const [loading, setLoading] = useState(false)

  const usersWithMembership = users.filter(u => members.some(m => m.userId === u.id));
  const usersWithoutMembership = users.filter(u => !members.some(m => m.userId === u.id));

  const handleSelectUser = (userId: string) => {
    setSelectedUser(userId);
    setOpenActiveMember(true);
    const member = members.find((m) => m.userId === userId) || null;
    setSelectedMember(member);
    setActiveMember(member ? member.active : false);
  }

  const closedModal = () => {
    setSelectedUser("")
    setOpenActiveMember(false)
    setOpen(false)
  }

  const handleSave = async () => {
    setLoading(true);
    try {
      const formMember = new FormData()
      formMember.append("userId", selectedUser)
      formMember.append("active", activeMember.toString())
      formMember.append("id", selectedMember?.id || "")
      formMember.append("clubId", user.clubId || "")
      await UpdateOrCreateMember(formMember)
      toast.success("Membro salvo com sucesso!");
    } catch (error) {
      console.error("Erro ao criar membro:", error);
      toast.error("Erro ao criar membro. Tente novamente.");
      setLoading(false);
      return;
    }
    closedModal();
    setLoading(false);
  }

  return (
    <Drawer direction="right" open={open}>
      <Toaster richColors position="top-center" />
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Criar Membros</DrawerTitle>
          <DrawerDescription>Preencha as informações para criar um novo membro.</DrawerDescription>
        </DrawerHeader>
        <div className="no-scrollbar overflow-y-auto px-4">
          <FieldGroup className="w-full max-w-xs">
            <Field>
              <Select value={selectedUser} onValueChange={(value) => handleSelectUser(value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um usuário" />
                </SelectTrigger>
                <SelectContent>
                  {usersWithMembership.length > 0 && (
                    <SelectGroup>
                      <SelectLabel className="text-red-400 font-bold text-center">Membros</SelectLabel>
                      {usersWithMembership.map((u) => (
                        <SelectItem key={u.id} value={u.id}>
                          {u.name ? u.name : u.email}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  )}
                  {usersWithoutMembership.length > 0 && (
                    <SelectGroup>
                      <SelectLabel className="text-red-400 font-bold text-center">Não Membros</SelectLabel>
                      {usersWithoutMembership.map((u) => (
                        <SelectItem key={u.id} value={u.id}>
                          {u.name ? u.name : u.email}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  )}
                </SelectContent>
              </Select>
            </Field>
            {openActiveMember && (
              <Field orientation="horizontal" className="">
                <FieldContent>
                  <FieldLabel htmlFor="align-item" className="ml-2">Ativar Membro</FieldLabel>
                </FieldContent>
                <Switch
                  id="align-item"
                  checked={activeMember}
                  onCheckedChange={(checked) => setActiveMember(checked)}
                  className="mr-2"
                />
              </Field>
            )}
          </FieldGroup>
        </div>
        <DrawerFooter>
          <Button onClick={handleSave} disabled={!selectedUser || loading}>{loading ? <Spinner /> : "Salvar"}</Button>
          <DrawerClose asChild>
            <Button variant="outline" onClick={closedModal}>Fechar</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

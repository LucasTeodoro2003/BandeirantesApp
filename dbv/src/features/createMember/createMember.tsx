"use client";
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
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../../shared/components/ui/select";
import {
  Field,
  FieldContent,
  FieldGroup,
  FieldLabel,
  FieldTitle,
} from "../../shared/components/ui/field";
import { Switch } from "../../shared/components/ui/switch";
import { Member, Prisma, User } from "../../../generated/prisma/client";
import { Toaster } from "../../shared/components/ui/sonner";
import { toast } from "sonner";
import UpdateOrCreateMember from "@/shared/lib/member";
import { Spinner } from "@/shared/components/ui/spinner";
import { RadioGroup, RadioGroupItem } from "@/shared/components/ui/radio-group";
import { RefreshCcwIcon } from "lucide-react";
import updatePage from "@/shared/lib/updatePage";

interface CreateMemberProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  users: User[];
  members: Member[];
  user: User;
  units: Prisma.UnitGetPayload<{
    include: { members: { include: { user: true } } };
  }>[];
}

export default function CreateMember({
  open,
  setOpen,
  users,
  members,
  user,
  units,
}: CreateMemberProps) {
  const [selectedUser, setSelectedUser] = useState("");
  const [openActiveMember, setOpenActiveMember] = useState(false);
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [activeMember, setActiveMember] = useState(
    members.find((m) => m.userId === selectedUser)?.active || false,
  );
  const [loading, setLoading] = useState(false);
  const [unitSelect, setUnitSelect] = useState<Member["unitId"]>(
    selectedMember?.unitId || "",
  );
  const [isRotating, setIsRotating] = useState(false);
  const [occupation, setOccupation] = useState("");

  const usersWithMembership = users.filter((u) =>
    members.some((m) => m.userId === u.id),
  );
  const usersWithoutMembership = users.filter(
    (u) => !members.some((m) => m.userId === u.id),
  );

  const handleSelectUser = (userId: string) => {
    setSelectedUser(userId);
    setOpenActiveMember(true);
    const member = members.find((m) => m.userId === userId) || null;
    setSelectedMember(member);
    setActiveMember(member ? member.active : false);
    setUnitSelect(member?.unitId || null);
    setOccupation(
      users.find((u) => u.id === userId)?.permission.toString() || "",
    );
  };

  const closedModal = () => {
    setSelectedUser("");
    setOpenActiveMember(false);
    setSelectedMember(null);
    setActiveMember(false);
    setUnitSelect("");
    setOccupation("");
    setOpen(false);
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const formMember = new FormData();
      formMember.append("userId", selectedUser);
      formMember.append("active", activeMember.toString());
      formMember.append("id", selectedMember?.id || "");
      formMember.append("clubId", user.clubId || "");
      formMember.append("unitId", unitSelect || "");
      formMember.append("occupation", occupation);
      await UpdateOrCreateMember(formMember);
      toast.success("Membro salvo com sucesso!");
    } catch (error) {
      console.error("Erro ao criar membro:", error);
      toast.error("Erro ao criar membro. Tente novamente.");
      setLoading(false);
      return;
    }
    closedModal();
    setLoading(false);
  };

  const handleRefresh = async () => {
    setIsRotating(true);
    try {
      await updatePage();
      setIsRotating(false);
    } catch (erro) {
      console.error("Erro ao atualizar a página:", erro);
      setIsRotating(false);
    }
  };

  return (
    <Drawer direction="right" open={open} setBackgroundColorOnScale={false}>
      <Toaster richColors position="top-center" />
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle className="flex justify-between items-center">
            <div>Criar Membros</div>
            <div>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full"
                onClick={handleRefresh}
              >
                <RefreshCcwIcon className={isRotating ? "animate-spin" : ""} />
              </Button>
            </div>
          </DrawerTitle>
          <DrawerDescription>
            Preencha as informações do membro
          </DrawerDescription>
        </DrawerHeader>
        <div className="no-scrollbar overflow-y-auto px-4">
          <FieldGroup className="w-full max-w-xs">
            <Field>
              <Select
                value={selectedUser}
                onValueChange={(value) => {
                  handleSelectUser(value);
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um usuário" />
                </SelectTrigger>
                <SelectContent>
                  {usersWithMembership.length > 0 && (
                    <SelectGroup>
                      <SelectLabel className="text-red-400 font-bold text-center">
                        Membros
                      </SelectLabel>
                      {usersWithMembership.map((u) => (
                        <SelectItem key={u.id} value={u.id}>
                          {u.name ? u.name : u.email}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  )}
                  {usersWithoutMembership.length > 0 && (
                    <SelectGroup>
                      <SelectLabel className="text-red-400 font-bold text-center">
                        Não Membros
                      </SelectLabel>
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
              <>
                <Field className="w-full max-w-xs -mt-6">
                  <Select
                    value={occupation || ""}
                    onValueChange={(value) => setOccupation(value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione um cargo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value="0">Admin Sistema</SelectItem>
                        <SelectItem value="1">Diretor(a)</SelectItem>
                        <SelectItem value="2">Secretario(a)</SelectItem>
                        <SelectItem value="3">Conselheiro(a)</SelectItem>
                        <SelectItem value="4">
                          Conselheiro(a) Associado(a)
                        </SelectItem>
                        <SelectItem value="5">Membro</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </Field>

                <Field orientation="horizontal" className="">
                  <FieldContent>
                    <FieldLabel htmlFor="align-item" className="ml-2">
                      Ativar Membro
                    </FieldLabel>
                  </FieldContent>
                  <Switch
                    id="align-item"
                    checked={activeMember}
                    onCheckedChange={(checked) => setActiveMember(checked)}
                    className="mr-2"
                  />
                </Field>
              </>
            )}
          </FieldGroup>

          <FieldGroup className="w-full max-w-xs mt-4">
            <Field>
              <FieldLabel>Opções</FieldLabel>
              <FieldContent>
                {selectedUser && activeMember === true ? (
                  <RadioGroup
                    value={unitSelect || ""}
                    onValueChange={(value) => {
                      setUnitSelect(value);
                    }}
                  >
                    <FieldLabel>
                      <Field orientation="horizontal" className="">
                        <FieldContent>
                          <FieldTitle className="text-red-500">
                            Nenhuma
                          </FieldTitle>
                        </FieldContent>
                        <RadioGroupItem value={""} id={""} />
                      </Field>
                    </FieldLabel>
                    {units.map((unit) => (
                      <FieldLabel htmlFor={unit.id} key={unit.id}>
                        <Field orientation="horizontal" className="">
                          <FieldContent>
                            <FieldTitle>{unit.name}</FieldTitle>
                          </FieldContent>
                          <RadioGroupItem value={unit.id} id={unit.id} />
                        </Field>
                      </FieldLabel>
                    ))}
                  </RadioGroup>
                ) : selectedUser && activeMember === false ? (
                  <>
                    {selectedMember === null ? (
                      <div className="text-center text-red-400 font-bold">
                        Sem Cadastro
                      </div>
                    ) : (
                      <div className="text-center text-red-400 font-bold">
                        Membro Desativado
                      </div>
                    )}
                  </>
                ) : (
                  <div className="text-center text-gray-400 font-bold">
                    Selecione um usuário
                  </div>
                )}
              </FieldContent>
            </Field>
          </FieldGroup>
        </div>
        <DrawerFooter>
          <Button onClick={handleSave} disabled={!selectedUser || loading}>
            {loading ? <Spinner /> : "Salvar"}
          </Button>
          <DrawerClose asChild>
            <Button variant="outline" onClick={closedModal}>
              Fechar
            </Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

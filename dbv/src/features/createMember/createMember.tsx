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
import { toast } from "sonner";
import UpdateOrCreateMember from "@/shared/lib/member";
import { Spinner } from "@/shared/components/ui/spinner";
import { RadioGroup, RadioGroupItem } from "@/shared/components/ui/radio-group";
import { CameraIcon, RefreshCcwIcon } from "lucide-react";
import updatePage from "@/shared/lib/updatePage";
import { Input } from "@/shared/components/ui/input";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/shared/components/ui/avatar";
import imageCompression from "browser-image-compression";
import { updateUserAvatar } from "@/shared/lib/updateImageUser";

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
  const [imagePreview, setImagePreview] = useState<string>(
    users.find((u) => u.id === selectedUser)?.image || "",
  );
  const [nameUser, setNameUser] = useState(
    users.find((u) => u.id === selectedUser)?.name || "",
  );
  const [uploading, setUploading] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const options = {
        maxSizeMB: 0.9,
        maxWidthOrHeight: 1024,
        useWebWorker: true,
      };
      const compressedFile = await imageCompression(file, options);
      if (imagePreview && !imagePreview.startsWith("https")) {
        URL.revokeObjectURL(imagePreview);
      }
      const preview = URL.createObjectURL(compressedFile);
      setImagePreview(preview);
      const formData = new FormData();
      formData.append("image", compressedFile);
      formData.append("userId", selectedUser);
      const result = await updateUserAvatar(formData);
      if (result.success && result.url) {
        setImagePreview(result.url);
        toast.success("Avatar atualizado com sucesso!");
      } else {
        throw new Error("Falha ao atualizar avatar");
      }
    } catch (error) {
      console.error("Erro ao fazer upload:", error);
      console.log("Erro ao fazer upload:", error);
      toast.error("Erro ao atualizar avatar. Tente novamente.");
    } finally {
      setUploading(false);
      console.log("Upload finalizado", imagePreview);
      console.log("Imagem usuario:", users.find((u) => u.id === selectedUser)?.image);
    }
  };

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
    setNameUser(users.find((u) => u.id === userId)?.name || "");
    setImagePreview(users.find((u) => u.id === userId)?.image || "");
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
      formMember.append("nameUser", nameUser);
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

  const getInitials = (name: string) => {
    const parts = name?.split(" ") || [];
    return (parts[0]?.[0] || "") + (parts[1]?.[0] || "");
  };

  const handleAvatarClick = () => {
    document.getElementById("avatar-upload")?.click();
  };

  return (
    <Drawer direction="right" open={open} setBackgroundColorOnScale={false}>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle className="flex justify-between items-center">
            <div>Gerenciar Membros</div>
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
                  <>
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
                    <FieldGroup className="w-full max-w-xs mt-4">
                      <Field>
                        <FieldLabel>
                          <div className="flex items-center justify-between w-full">
                            <div>Usuario</div>
                            <div>
                              <div className="flex items-center gap-4">
                                <div className="relative group">
                                  <Avatar
                                    className="cursor-pointer w-12 h-12"
                                    onClick={handleAvatarClick}
                                  >
                                    <AvatarImage
                                      src={imagePreview}
                                      alt={nameUser || "User"}
                                      className="object-cover"
                                    />
                                    <AvatarFallback>
                                      {getInitials(nameUser || "SN")}
                                    </AvatarFallback>
                                  </Avatar>

                                  <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                                    {uploading ? (
                                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    ) : (
                                      <CameraIcon className="w-5 h-5 text-white" />
                                    )}
                                  </div>
                                </div>

                                <input
                                  id="avatar-upload"
                                  type="file"
                                  accept="image/*"
                                  className="hidden"
                                  onChange={handleFileChange}
                                  disabled={uploading}
                                />
                              </div>
                            </div>
                          </div>
                        </FieldLabel>
                        <Input
                          id="username"
                          type="text"
                          className="h-10"
                          value={nameUser}
                          onChange={(e) => setNameUser(e.target.value)}
                        />
                      </Field>
                    </FieldGroup>
                  </>
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

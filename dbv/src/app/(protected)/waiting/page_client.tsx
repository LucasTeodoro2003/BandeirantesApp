"use client";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/shared/components/ui/alert";
import { Button } from "@/shared/components/ui/button";
import { Spinner } from "@/shared/components/ui/spinner";
import updatePage from "@/shared/lib/updatePage";
import { AlertCircleIcon } from "lucide-react";
import { useState } from "react";
import { Club, User } from "../../../../generated/prisma/client";
import { RadioGroup, RadioGroupItem } from "@/shared/components/ui/radio-group";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldLabel,
  FieldTitle,
} from "@/shared/components/ui/field";
import { toast } from "sonner";
import { Toaster } from "@/shared/components/ui/sonner";
import SelectClub from "@/shared/lib/selectClub";

interface WaitingPageClientProps {
  user: User;
  clubs: Club[];
}

export default function WaitingPageClient({
  user,
  clubs,
}: WaitingPageClientProps) {
  const [isRotating, setIsRotating] = useState(false);
  const [selectClub, setSelectClub] = useState(user.clubId || "");
  const [loading, setLoading] = useState(false);

  const handleRefresh = async () => {
    setIsRotating(true);
    try {
      await updatePage();
      setIsRotating(false);
    } catch (err) {
      console.error("Erro ao atualizar a página:", err);
      setIsRotating(false);
    }
  };

  const handleSave = async () => {
    if (!selectClub) return;
    setLoading(true);
    try {
      const formUser = new FormData();
      formUser.append("userId", user.id);
      formUser.append("clubId", selectClub);
      await SelectClub(formUser);
      toast.info("Aguarde aprovação do diretor do clube!");
    } catch (err) {
      console.error("Erro ao salvar a seleção do clube:", err);
      toast.error(
        "Erro ao salvar a seleção do clube. Tente novamente mais tarde.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Toaster richColors position="top-center" />
      {user.clubId && (
        <div className="flex min-h-screen flex-col justify-center items-center p-4 text-center gap-6">
          <div className="">
            <Button
              className="bandeirantes-gradient text-white font-bold text-xl"
              onClick={handleRefresh}
              disabled={isRotating}
            >
              {isRotating ? <Spinner /> : "Atualizar"}
            </Button>
          </div>
          <div className="">
            <Alert variant="destructive" className="max-w-md">
              <AlertCircleIcon />
              <AlertTitle>AGUARDE APROVAÇÃO</AlertTitle>
              <AlertDescription>
                Sua conta foi devidamente criada, mas ainda está aguardando
                aprovação do diretor do clube. Por favor, aguarde até que sua
                solicitação seja revisada e aprovada.
              </AlertDescription>
              <AlertDescription>
                Se tem Alguma duvida, entre em contato com o diretor do clube
                para obter mais informações!
              </AlertDescription>
            </Alert>
          </div>
        </div>
      )}
      {!user.clubId && (
        <div className="flex min-h-screen flex-col justify-center items-center p-4 text-center gap-6">
          <RadioGroup
            value={selectClub || ""}
            onValueChange={(value) => {
              setSelectClub(value);
            }}
          >
            <FieldLabel>Selecione seu clube</FieldLabel>
            {clubs.map((club) => (
              <FieldLabel key={club.id}>
                <Field orientation="horizontal" className="">
                  <FieldContent>
                    <FieldTitle>{club.name}</FieldTitle>
                    <FieldDescription>
                      <img
                        src={club.image || "/bandeirantes.png"}
                        alt={club.name}
                      />
                    </FieldDescription>
                  </FieldContent>
                  <RadioGroupItem value={club.id} id={club.id} />
                </Field>
              </FieldLabel>
            ))}
          </RadioGroup>
          <Button onClick={handleSave} disabled={!selectClub || loading}>
            {loading ? <Spinner /> : "Salvar"}
          </Button>
        </div>
      )}
    </>
  );
}

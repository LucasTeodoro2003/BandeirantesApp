"use client"
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

export default function WaitingPageClient() {
  const [isRotating, setIsRotating] = useState(false)

  const handleRefresh = async () => {
    setIsRotating(true);
    try{
      await updatePage()
      setIsRotating(false);
    }catch(err){
      console.error("Erro ao atualizar a página:", err);
      setIsRotating(false);
    }
  }

  return (
    <div className="flex min-h-screen flex-col justify-center items-center p-4 text-center gap-6">
      <div className="">
        <Button className="bandeirantes-gradient text-white font-bold text-xl" onClick={handleRefresh} disabled={isRotating}>
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
            Se tem Alguma duvida, entre em contato com o diretor do clube para
            obter mais informações!
          </AlertDescription>
        </Alert>
      </div>
    </div>
  );
}

import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/shared/components/ui/alert";
import { auth } from "@/shared/lib/auth";
import { prisma } from "@/shared/lib/prisma";
import { AlertCircleIcon } from "lucide-react";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function WaitingPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  const member = await prisma.member.findUnique({
    where: {
      userId: session?.user.id,
    },
  });
  if (member) {
    redirect(`/${session?.user.clubId}`);
  }
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4 text-center">
      <Alert variant="destructive" className="max-w-md">
        <AlertCircleIcon />
        <AlertTitle>AGUARDE APROVAÇÃO</AlertTitle>
        <AlertDescription>
          Sua conta foi devidamente criada, mas ainda está aguardando aprovação
          do diretor do clube. Por favor, aguarde até que sua solicitação seja
          revisada e aprovada.
        </AlertDescription>
        <AlertDescription>
          Se tem Alguma duvida, entre em contato com o diretor do clube para
          obter mais informações!
        </AlertDescription>
      </Alert>
    </div>
  );
}

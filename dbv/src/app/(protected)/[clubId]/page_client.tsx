"use client";

import { Button } from "@/shared/components/ui/button";
import { authClient } from "@/shared/lib/auth-client";
import { useRouter } from "next/navigation";
import { Unit, User } from "../../../../generated/prisma/client";
import { CardUnit } from "@/features/cardUnits/cardUnit";

interface ClubPageClientProps {
  units: Unit[];
  user: User;
}
export default function ClubPageClient({ units, user }: ClubPageClientProps) {
  const router = useRouter();
  console.log(user);
  console.log(units);

  const handleSignOut = async () => {
    await authClient.signOut();
    router.replace("/");
  };
  return (
    <div>
      <div className="flex justify-start p-4">
        <Button variant="outline" onClick={handleSignOut}>
          Sair
        </Button>
      </div>
      <div className="flex justify-center items-center pt-10">
        <CardUnit units={units} />
      </div>
    </div>
  );
}

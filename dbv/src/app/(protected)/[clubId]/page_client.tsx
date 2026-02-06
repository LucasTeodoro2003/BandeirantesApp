"use client";

import { Button } from "@/shared/components/ui/button";
import { authClient } from "@/shared/lib/auth-client";
import { useRouter } from "next/navigation";
import { Unit, User } from "../../../../generated/prisma/client";
import { CardUnit } from "@/features/cardUnits/cardUnit";
import { Switch } from "@/shared/components/ui/switch";
import { useTheme } from "next-themes";

interface ClubPageClientProps {
  units: Unit[];
  user: User;
}
export default function ClubPageClient({ units, user }: ClubPageClientProps) {
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  console.log(user);
  console.log(units);

  const handleSignOut = async () => {
    await authClient.signOut();
    router.replace("/");
  };
  return (
    <div>
      <div className="flex justify-between p-1.5 shadow-2xl item w-full bg-bandeirantes-gradient">
        <div className="flex justify-start p-1.5 bg-red-500">
          <Button variant="outline" onClick={handleSignOut}>
            Sair
          </Button>
        </div>
        <div className="flex justify-end items-center">
          <Switch
            checked={theme === "dark"}
            onCheckedChange={() => {
              setTheme(theme === "light" ? "dark" : "light");
            }}
            size="default"
          />
        </div>
      </div>
      <div className="flex justify-center items-center pt-10">
        <CardUnit units={units} />
      </div>
    </div>
  );
}

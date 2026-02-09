"use client";

import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import {
  Card,
  CardAction,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { Prisma } from "../../../generated/prisma/client";
import { Suspense, useState } from "react";
import { SkeletonCard } from "../skeletons/skeletonCard";
import { Separator } from "@/shared/components/ui/separator";
import { useRouter } from "next/navigation";
import { DoorOpenIcon } from "lucide-react";
import { Spinner } from "@/shared/components/ui/spinner";

interface CardUnitProps {
  units: Prisma.UnitGetPayload<{
    include: { members: { include: { user: true } } };
  }>[];
}

export function CardUnit({ units }: CardUnitProps) {
  const router = useRouter();
  const [loading, setLoading] = useState("");

  const unitRouter = (idUnit: string) => {
    setLoading(idUnit);
    router.push(`/${units[0].clubId}/${idUnit}`);
  };
  return (
    <Suspense fallback={<SkeletonCard />}>
      <div className="grid gap-6 sm:grid-cols-12 lg:grid-cols-6">
        {units.map((u) => (
          <Card
            key={u.id}
            className="relative w-full pt-0 rounded-t-2xl flex flex-col"
          >
            <div className="absolute inset-0 z-30 aspect-video bg-black/35 rounded-t-4xl" />
            <img
              src={u.image || "/bandeirantes.jpg"}
              alt={`Foto Unidade ${u.name}`}
              className="relative z-20 aspect-video w-full object-cover brightness-60 grayscale dark:brightness-40 rounded-t-3xl"
            />
            <CardHeader className="flex flex-col">
              <CardAction className="flex">
                <CardTitle className="flex items-center gap-2 justify-center">
                  <div>{u.name}</div>
                  <Badge
                    variant={u.members.length === 0 ? "destructive" : "default"}
                  >
                    {u.members.length} Membros
                  </Badge>
                </CardTitle>
              </CardAction>
              <Separator className="my-4 -mt-1" />
            </CardHeader>
            <CardFooter className="flex flex-col -mt-8 flex-1">
              <div className="flex-1">
                {u.members
                  .filter((m) => m.permission < 3)
                  .map((m) => (
                    <div
                      key={m.id}
                      className="text-sm flex justify-between gap-4"
                    >
                      <div className="pt-2">
                        {m.user.name.split(" ")[0] +
                          " " +
                          (m.user.name.split(" ")[1] || "")}
                      </div>
                      <div className="">
                        <Badge
                          className={
                            m.permission === 1
                              ? "bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300"
                              : "bg-sky-50 text-sky-700 dark:bg-sky-950 dark:text-sky-300"
                          }
                        >
                          {m.permission === 1 ? "Capitão" : "Secretário"}
                        </Badge>
                      </div>
                    </div>
                  ))}
              </div>
              <Button
                className="w-full mt-4"
                onClick={() => unitRouter(u.id)}
                disabled={loading !== "" && loading !== u.id}
              >
                {loading === u.id ? (
                  <Spinner />
                ) : (
                  <>
                    <DoorOpenIcon /> Entrar
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </Suspense>
  );
}

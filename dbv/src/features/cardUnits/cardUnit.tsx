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
import { DoorOpenIcon, PencilRulerIcon, ShieldPlusIcon } from "lucide-react";
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
      <div className="grid gap-2 grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
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
            <CardHeader className="flex flex-col items-center justify-center w-full">
              <CardAction className="flex items-center justify-center w-full">
                <CardTitle className="flex items-center justify-center w-full">
                  <div className="flex items-center justify-center w-full text-center">
                    {u.name}
                  </div>
                </CardTitle>
              </CardAction>
              <Separator className="my-4 -mt-1" />
            </CardHeader>
            <CardFooter className="flex flex-col -mt-8 flex-1 ">
              <div className="flex-1">
                {u.members
                  .filter((m) => m.permission < 3)
                  .map((m) => (
                    <div
                      key={m.id}
                      className="text-sm flex justify-between items-center mb-0.5"
                    >
                      <div>
                        {m.user.name.split(" ")[0] +
                          " " +
                          (m.user.name.split(" ")[1]?.[0] || "")}
                      </div>
                      <Badge
                        className={
                          m.permission === 1
                            ? "bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300"
                            : "bg-sky-50 text-sky-700 dark:bg-sky-950 dark:text-sky-300"
                        }
                      >
                        {m.permission === 1 ? (
                          <>
                            <ShieldPlusIcon /> Capitão
                          </>
                        ) : (
                          <>
                            <PencilRulerIcon /> Secretário
                          </>
                        )}
                      </Badge>
                    </div>
                  ))}
              </div>
              <div className="mt-1">
                <Badge
                  variant={u.members.length === 0 ? "destructive" : "default"}
                >
                  {u.members.length} Membros
                </Badge>
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

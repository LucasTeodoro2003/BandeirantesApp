import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { Unit } from "../../../generated/prisma/client";

interface CardUnitProps {
  units: Unit[];
}

export function CardUnit({ units }: CardUnitProps) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {units.map((u) => (
        <Card key={u.id} className="relative w-full pt-0">
          <div className="absolute inset-0 z-30 aspect-video bg-black/35" />
          <img
            src={u.image || "/bandeirantes.jpg"}
            alt={`Foto Unidade ${u.name}`}
            className="relative z-20 aspect-video w-full object-cover brightness-60 grayscale dark:brightness-40"
          />
          <CardHeader>
            <CardAction>
              <Badge variant="secondary">Featured</Badge>
            </CardAction>
            <CardTitle>{u.name}</CardTitle>
            <CardDescription>
              A practical talk on component APIs, accessibility, and shipping
              faster.
            </CardDescription>
          </CardHeader>
          <CardFooter>
            <Button className="w-full">View Event</Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
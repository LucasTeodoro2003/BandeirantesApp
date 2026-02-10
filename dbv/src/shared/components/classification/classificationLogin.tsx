"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { Badge } from "@/shared/components/ui/badge";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/shared/components/ui/avatar";
import { Separator } from "@/shared/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/shared/components/ui/tooltip";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/shared/components/ui/tabs";
import {
  TrophyIcon,
  MedalIcon,
  AwardIcon,
  Users2Icon,
  CrownIcon,
  ShieldPlusIcon,
  PencilRulerIcon,
  User2Icon,
} from "lucide-react";
import { cn } from "@/shared/lib/utils";
import { Prisma } from "../../../../generated/prisma/client";

type UnitWithPoints = Prisma.UnitGetPayload<{
  include: {
    PointsUnit: true;
    members: {
      include: {
        user: true;
        PointsMember: true;
      };
    };
  };
}>;

type MemberWithPoints = Prisma.MemberGetPayload<{
  include: {
    user: true;
    PointsMember: true;
    unit: {
      include: {
        PointsUnit: true;
        members: true;
      };
    };
  };
}>;

interface ClassificationProps {
  units: UnitWithPoints[];
  members?: MemberWithPoints[];
  showMemberRanking?: boolean;
}

export function ClassificationLogin({
  units,
  members = [],
  showMemberRanking = true,
}: ClassificationProps) {
  const [selectedTab, setSelectedTab] = useState<"units" | "members">("units");

  const calculateUnitPointsDetailed = (unit: UnitWithPoints) => {
    const unitPoints = unit.PointsUnit.reduce(
      (acc, point) => acc + Number(point.value),
      0,
    );

    return {
      unitPoints,
      total: unitPoints
    };
  };

  const calculateMemberPointsDetailed = (member: MemberWithPoints) => {
    const memberIndividualPoints = member.PointsMember.reduce(
      (acc, point) => acc + Number(point.value),
      0,
    );

    if (!member.unit) {
      return {
        individualPoints: memberIndividualPoints,
        unitAveragePoints: 0,
        multiplier: 0,
        finalScore: memberIndividualPoints,
      };
    }

    const unitTotalPoints = member.unit.PointsUnit.reduce(
      (acc, point) => acc + Number(point.value),
      0,
    );

    const activeMembersCount =
      member.unit.members.filter((m) => m.active === true).length || 1;

    const unitAveragePoints = unitTotalPoints / activeMembersCount;
    const finalScore = memberIndividualPoints * unitAveragePoints;

    return {
      individualPoints: memberIndividualPoints,
      unitAveragePoints,
      multiplier: unitAveragePoints,
      finalScore,
    };
  };

  const sortedMembers = [...members]
    .filter((m) => m.active)
    .sort((a, b) => {
      const pointsA = calculateMemberPointsDetailed(a).finalScore;
      const pointsB = calculateMemberPointsDetailed(b).finalScore;
      return pointsB - pointsA;
    });

  const sortedUnits = [...units].sort((a, b) => {
    const pointsA = calculateUnitPointsDetailed(a);
    const pointsB = calculateUnitPointsDetailed(b);
    if (pointsB.total !== pointsA.total) return pointsB.total - pointsA.total;
    return b.members.length - a.members.length;
  });

  const getInitials = (name: string) => {
    const parts = name.split(" ");
    return parts.length >= 2
      ? `${parts[0][0]}${parts[1][0]}`.toUpperCase()
      : parts[0].substring(0, 2).toUpperCase();
  };

  const renderPositionBadge = (position: number) => {
    if (position === 1) {
      return (
        <Badge className="bg-linear-to-r from-yellow-400 to-yellow-600 text-white border-0 shadow-lg">
          <CrownIcon className="w-4 h-4 mr-1" />
          1º
        </Badge>
      );
    }
    if (position === 2) {
      return (
        <Badge className="bg-linear-to-r from-slate-300 to-slate-500 text-white border-0 shadow-lg">
          <MedalIcon className="w-4 h-4 mr-1" />
          2º
        </Badge>
      );
    }
    if (position === 3) {
      return (
        <Badge className="bg-linear-to-r from-orange-400 to-orange-600 text-white border-0 shadow-lg">
          <AwardIcon className="w-4 h-4 mr-1" />
          3º
        </Badge>
      );
    }
    return (
      <Badge variant="outline" className="font-bold">
        {position}º
      </Badge>
    );
  };

  const getRowClassName = (index: number) => {
    if (index === 0) {
      return "bg-gradient-to-r from-yellow-50 to-yellow-100 dark:from-yellow-950/30 dark:to-yellow-900/30 border-l-4 border-l-yellow-500";
    }
    if (index === 1) {
      return "bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-950/30 dark:to-slate-900/30 border-l-4 border-l-slate-400";
    }
    if (index === 2) {
      return "bg-gradient-to-r from-orange-50 to-orange-100 dark:from-orange-950/30 dark:to-orange-900/30 border-l-4 border-l-orange-500";
    }
    return "hover:bg-muted/50 transition-colors";
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      <Card className="border-2 shadow-xl">
        <CardHeader className="">
          <div className="flex items-center justify-center gap-2">
            <div className="flex space-y-1">
              <CardTitle className="text-3xl font-bold flex items-center gap-2 text-center justify-center">
                <TrophyIcon className="w-8 h-8 text-yellow-500" />
                Classificação Geral
              </CardTitle>
            </div>
          </div>
        </CardHeader>

        <Separator />

        <CardContent className="">
          <Tabs
            value={selectedTab}
            onValueChange={(value) =>
              setSelectedTab(value as "units" | "members")
            }
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="units" className="text-base gap-2">
                <Users2Icon className="w-4 h-4" />
                Unidades ({units.length})
              </TabsTrigger>
              {showMemberRanking && (
                <TabsTrigger value="members" className="text-base gap-2">
                  <MedalIcon className="w-4 h-4" />
                  Membros ({members.filter((m) => m.active).length})
                </TabsTrigger>
              )}
            </TabsList>

            <TabsContent value="units" className="mt-0">
              <AnimatePresence mode="wait">
                <motion.div
                  key="units-table"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="rounded-lg border">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-muted/50">
                          <TableHead className="w-20 text-center font-bold">
                            Posição
                          </TableHead>
                          <TableHead className="font-bold">Unidade</TableHead>
                          <TableHead className="text-center font-bold">
                            <div className="flex items-center justify-center gap-1">
                              <Users2Icon className="w-4 h-4" />
                              Membros
                            </div>
                          </TableHead>

                          <TableHead className="text-center font-bold text-lg">
                            <div className="flex items-center justify-center gap-1">
                              <TrophyIcon className="w-5 h-5 text-yellow-500" />
                              Pontos
                            </div>
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {sortedUnits.map((unit, index) => {
                          const pointsBreakdown =
                            calculateUnitPointsDetailed(unit);
                          const activeMembersCount = unit.members.filter(
                            (m) => m.active,
                          ).length;

                          return (
                            <motion.tr
                              key={unit.id}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: index * 0.05 }}
                              className={cn(getRowClassName(index), "group")}
                            >
                              <TableCell className="text-center">
                                {renderPositionBadge(index + 1)}
                              </TableCell>

                              <TableCell>
                                <div className="flex items-center gap-3">
                                  <Avatar className="h-12 w-12 border-2 border-primary/20 group-hover:border-primary/50 transition-all">
                                    <AvatarImage
                                      src={unit.image || undefined}
                                    />
                                    <AvatarFallback className="font-bold text-sm">
                                      {unit.name
                                        .split(" ")[0][0]
                                        .toUpperCase() +
                                        (
                                          unit.name.split(" ")?.[1]?.[0] ||
                                          unit.name.split(" ")[0][1]
                                        ).toUpperCase()}
                                    </AvatarFallback>
                                  </Avatar>
                                  <div className="space-y-1">
                                    <p className="font-semibold text-base leading-none">
                                      {unit.name}
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                      {unit.PointsUnit.length} atividade
                                      {unit.PointsUnit.length !== 1 ? "s" : ""}{" "}
                                      registrada
                                      {unit.PointsUnit.length !== 1 ? "s" : ""}
                                    </p>
                                  </div>
                                </div>
                              </TableCell>

                              <TableCell className="text-center">
                                <TooltipProvider>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <Badge
                                        variant="secondary"
                                        className="cursor-help"
                                      >
                                        <Users2Icon className="w-3 h-3 mr-1" />
                                        {activeMembersCount}
                                      </Badge>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      <p>
                                        {activeMembersCount} membro
                                        {activeMembersCount !== 1
                                          ? "s"
                                          : ""}{" "}
                                        ativo
                                        {activeMembersCount !== 1 ? "s" : ""}
                                      </p>
                                    </TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
                              </TableCell>

                              <TableCell className="text-center">
                                <div className="flex flex-col items-center gap-1">
                                  <TooltipProvider>
                                    <Tooltip>
                                      <TooltipTrigger asChild>
                                        <Badge
                                          className={cn(
                                            "text-lg font-bold px-4 py-1.5 cursor-help",
                                            index === 0 &&
                                              "bg-yellow-500 hover:bg-yellow-600 text-white shadow-lg",
                                            index === 1 &&
                                              "bg-slate-400 hover:bg-slate-500 text-white shadow-lg",
                                            index === 2 &&
                                              "bg-orange-500 hover:bg-orange-600 text-white shadow-lg",
                                            index > 2 &&
                                              "bg-primary hover:bg-primary/90",
                                          )}
                                        >
                                          {pointsBreakdown.total}
                                        </Badge>
                                      </TooltipTrigger>
                                      <TooltipContent className="space-y-2">
                                        <div className="flex items-center justify-between gap-4">
                                          <span className="text-xs text-muted-foreground">
                                            Pontos da Unidade:
                                          </span>
                                          <span className="font-bold">
                                            {pointsBreakdown.unitPoints}
                                          </span>
                                        </div>
                                        <Separator />
                                        <div className="flex items-center justify-between gap-4">
                                          <span className="text-xs font-bold">
                                            Total:
                                          </span>
                                          <span className="font-bold text-primary">
                                            {pointsBreakdown.total}
                                          </span>
                                        </div>
                                      </TooltipContent>
                                    </Tooltip>
                                  </TooltipProvider>
                                </div>
                              </TableCell>
                            </motion.tr>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </div>
                </motion.div>
              </AnimatePresence>
            </TabsContent>

            {showMemberRanking && (
              <TabsContent value="members" className="mt-0">
                <AnimatePresence mode="wait">
                  <motion.div
                    key="members-table"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="rounded-lg border">
                      <Table>
                        <TableHeader>
                          <TableRow className="bg-muted/50">
                            <TableHead className="w-20 text-center font-bold">
                              Posição
                            </TableHead>
                            <TableHead className="font-bold">Membro</TableHead>
                            <TableHead className="text-center font-bold">
                              Unidade
                            </TableHead>
                            <TableHead className="text-center font-bold">
                              Cargo
                            </TableHead>
                            <TableHead className="text-center font-bold text-lg">
                              <div className="flex items-center justify-center gap-1">
                                <TrophyIcon className="w-5 h-5 text-yellow-500" />
                                Pontos
                              </div>
                            </TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {sortedMembers.map((member, index) => {
                            const pointsBreakdown =
                              calculateMemberPointsDetailed(member);

                            return (
                              <motion.tr
                                key={member.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.05 }}
                                className={cn(getRowClassName(index), "group")}
                              >
                                <TableCell className="text-center">
                                  {renderPositionBadge(index + 1)}
                                </TableCell>

                                <TableCell>
                                  <div className="flex items-center gap-3">
                                    <Avatar className="h-10 w-10 border-2 border-primary/20 group-hover:border-primary/50 transition-all">
                                      <AvatarImage
                                        src={member.user.image || undefined}
                                      />
                                      <AvatarFallback className="text-xs font-semibold">
                                        {getInitials(member.user.name)}
                                      </AvatarFallback>
                                    </Avatar>
                                    <div className="space-y-1">
                                      <p className="font-semibold leading-none">
                                        {member.user.name}
                                      </p>
                                      <p className="text-xs text-muted-foreground">
                                        {member.user.email}
                                      </p>
                                    </div>
                                  </div>
                                </TableCell>

                                <TableCell className="text-center">
                                  <Badge variant="secondary">
                                    {member.unit?.name || "Sem unidade"}
                                  </Badge>
                                </TableCell>

                                <TableCell className="text-center">
                                  {member.permission === 1 && (
                                    <Badge className="bg-blue-600 hover:bg-blue-700">
                                      <ShieldPlusIcon className="w-4 h-4 mr-1" />
                                      Capitão
                                    </Badge>
                                  )}
                                  {member.permission === 2 && (
                                    <Badge className="bg-sky-600 hover:bg-sky-700">
                                      <PencilRulerIcon className="w-4 h-4 mr-1" />
                                      Secretário
                                    </Badge>
                                  )}
                                  {member.permission === 3 && (
                                    <Badge variant="outline">
                                      <User2Icon className="w-4 h-4 mr-1" />
                                      Membro
                                    </Badge>
                                  )}
                                </TableCell>

                                <TableCell className="text-center">
                                  <div className="flex flex-col items-center gap-2">
                                    <TooltipProvider>
                                      <Tooltip>
                                        <TooltipTrigger asChild>
                                          <Badge
                                            className={cn(
                                              "text-lg font-bold px-4 py-1.5 cursor-help",
                                              index === 0 &&
                                                "bg-yellow-500 hover:bg-yellow-600 text-white shadow-lg",
                                              index === 1 &&
                                                "bg-slate-400 hover:bg-slate-500 text-white shadow-lg",
                                              index === 2 &&
                                                "bg-orange-500 hover:bg-orange-600 text-white shadow-lg",
                                              index > 2 &&
                                                "bg-primary hover:bg-primary/90",
                                            )}
                                          >
                                            {pointsBreakdown.finalScore.toFixed(
                                              2,
                                            )}
                                          </Badge>
                                        </TooltipTrigger>
                                        <TooltipContent className="space-y-2 max-w-xs">
                                          <div className="font-semibold text-sm border-b pb-2">
                                            Cálculo da Pontuação
                                          </div>

                                          <div className="flex items-center justify-between gap-4 text-xs">
                                            <span className="text-muted-foreground">
                                              Pontos Individuais:
                                            </span>
                                            <span className="font-bold">
                                              {pointsBreakdown.individualPoints}
                                            </span>
                                          </div>

                                          <div className="flex items-center justify-between gap-4 text-xs">
                                            <span className="text-muted-foreground">
                                              Média da Unidade:
                                            </span>
                                            <span className="font-bold">
                                              {pointsBreakdown.unitAveragePoints.toFixed(
                                                2,
                                              )}
                                            </span>
                                          </div>

                                          <Separator />

                                          <div className="text-xs text-center text-muted-foreground">
                                            {pointsBreakdown.individualPoints} ×{" "}
                                            {pointsBreakdown.unitAveragePoints.toFixed(
                                              2,
                                            )}
                                          </div>

                                          <Separator />

                                          <div className="flex items-center justify-between gap-4">
                                            <span className="text-xs font-bold">
                                              Pontuação Final:
                                            </span>
                                            <span className="font-bold text-primary text-base">
                                              {pointsBreakdown.finalScore.toFixed(
                                                2,
                                              )}
                                            </span>
                                          </div>
                                        </TooltipContent>
                                      </Tooltip>
                                    </TooltipProvider>

                                    <div className="flex gap-1 items-center text-[10px] text-muted-foreground">
                                      <Badge
                                        variant="outline"
                                        className="text-[10px] px-1.5"
                                      >
                                        {pointsBreakdown.individualPoints}
                                      </Badge>
                                      <span>×</span>
                                      <Badge
                                        variant="outline"
                                        className="text-[10px] px-1.5"
                                      >
                                        {pointsBreakdown.unitAveragePoints.toFixed(
                                          1,
                                        )}
                                      </Badge>
                                    </div>
                                  </div>
                                </TableCell>
                              </motion.tr>
                            );
                          })}
                        </TableBody>
                      </Table>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </TabsContent>
            )}
          </Tabs>
        </CardContent>
      </Card>

      <Card className="border-dashed">
        <CardContent className="">
          <div className="flex flex-wrap gap-6 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-linear-to-r from-yellow-400 to-yellow-600 rounded"></div>
              <span>1º Lugar</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-linear-to-r from-slate-300 to-slate-500 rounded"></div>
              <span>2º Lugar</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-linear-to-r from-orange-400 to-orange-600 rounded"></div>
              <span>3º Lugar</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

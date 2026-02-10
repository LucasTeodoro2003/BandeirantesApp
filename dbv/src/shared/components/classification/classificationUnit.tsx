"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Card,
  CardContent,
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
} from "@/shared/components/ui/tabs";
import {
  TrophyIcon,
  MedalIcon,
  AwardIcon,
  CrownIcon,
  ShieldPlusIcon,
  PencilRulerIcon,
  User2Icon,
} from "lucide-react";
import { cn } from "@/shared/lib/utils";
import { Prisma } from "../../../../generated/prisma/client";


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
  members?: MemberWithPoints[];
  showMemberRanking?: boolean;
}

export function ClassificationUnit({
  members = [],
  showMemberRanking = true,
}: ClassificationProps) {
  const [selectedTab, setSelectedTab] = useState<"members">("members");

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
    <div className="w-full">
      <Card className="border-2 shadow-xl">
        <CardContent className="">
          <Tabs
            value={selectedTab}
            onValueChange={(value) =>
              setSelectedTab(value as "members")
            }
            className="w-full"
          >
              <TabsContent value="members" className="-mx-4 -my-4">
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
          </Tabs>
        </CardContent>
      </Card>

    </div>
  );
}

"use client"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/shared/components/ui/tabs";
import {
  CalendarRangeIcon,
  FingerprintIcon,
  MedalIcon,
  UserPlusIcon,
} from "lucide-react";
import { LoginForm } from "../login/loginForm";
import { CreateForm } from "../createLogin/createForm";
import CalendarLogin from "../../calendar/calendarLogin";
import { ClassificationLogin } from "../../classification/classificationLogin";
import { Prisma } from "../../../../../generated/prisma/client";

interface TabsLoginProps {
  units: Prisma.UnitGetPayload<{include: {PointsUnit:true, members:{include:{user: true, PointsMember: true}}}}>[];
  members: Prisma.MemberGetPayload<{include:{user:true, PointsMember: true, unit:{include:{PointsUnit:true, members:true}}}}>[],
}

export function TabsLogin({ units, members }: TabsLoginProps) {
  return (
    <Tabs
      defaultValue="medals"
      className="w-full max-w-sm sm:max-w-md md:max-w-lg"
    >
      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger value="medals" >
          <MedalIcon />
          Medalhas
        </TabsTrigger>
        <TabsTrigger value="login">
          <FingerprintIcon /> Login
        </TabsTrigger>
        <TabsTrigger value="createLogin" className="flex items-center justify-center -ml-4">
          <UserPlusIcon />
          Cadastro
        </TabsTrigger>
        <TabsTrigger value="calendar">
          <CalendarRangeIcon />
          Calendário
        </TabsTrigger>
      </TabsList>

      <TabsContent value="login">
        <LoginForm />
      </TabsContent>

      <TabsContent value="createLogin">
        <CreateForm />
      </TabsContent>

      <TabsContent value="calendar">
        <CalendarLogin />
      </TabsContent>

      <TabsContent value="medals">
        <ClassificationLogin units={units} members={members} />
      </TabsContent>
    </Tabs>
  );
}

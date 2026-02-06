"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
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

export function TabsLogin() {
  return (
    <Tabs
      defaultValue="settings"
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
        <TabsTrigger value="createLogin" className="flex items-center justify-center">
          <UserPlusIcon />
          1º Acesso
        </TabsTrigger>
        <TabsTrigger value="calendar">
          <CalendarRangeIcon />
          Calendario
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
    </Tabs>
  );
}

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

export function TabsLogin() {
  return (
    <Tabs defaultValue="settings" className="w-full max-w-md">
      <TabsList>
        <TabsTrigger value="medals">
          <MedalIcon />
          Medalhas
        </TabsTrigger>
        <TabsTrigger value="login">
          <FingerprintIcon /> Login
        </TabsTrigger>
        <TabsTrigger value="createLogin">
          <UserPlusIcon />
          Primeiro Acesso
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
    </Tabs>
  );
}

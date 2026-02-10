import { TabsLogin } from "@/shared/components/ui/tabsLoginPage/tabs";
import { Prisma } from "../../../../generated/prisma/client";

interface LoginPageClientProps {
  units: Prisma.UnitGetPayload<{include:{PointsUnit:true, members:{
    include:{
      user:true,
      PointsMember:true
    }
  }}}>[],
  members: Prisma.MemberGetPayload<{include:{user:true, PointsMember: true, unit:{include:{PointsUnit:true, members:true}}}}>[]
}

export default function LoginPageClient({units, members}:LoginPageClientProps) {
  return (
    <div className="flex min-h-screen items-center justify-center px-2">
      <TabsLogin units={units} members={members}/>
    </div>
  );
}

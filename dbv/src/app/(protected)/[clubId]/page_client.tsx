"use client"

import { Button } from "@/shared/components/ui/button"
import { authClient } from "@/shared/lib/auth-client"
import { useRouter } from "next/navigation"

export default function ClubPageClient() {
    const router = useRouter()

    const handleSignOut = async () => {
        await authClient.signOut()
        router.replace("/")
    }
    return <div>
        <Button variant={"destructive"} onClick={handleSignOut}>
            Sair
        </Button>
    </div>
}
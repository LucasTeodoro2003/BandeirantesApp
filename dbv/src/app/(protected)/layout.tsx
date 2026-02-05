import { auth } from "@/shared/lib/auth"
import { headers } from "next/headers"
import { redirect } from "next/navigation"
import ClubPage from "./[clubId]/page"

export default async function Layout() {

    const session = await auth.api.getSession({
        headers: await headers()
    })
    if (!session) {
        redirect("/login")
    }

    return <ClubPage />
}
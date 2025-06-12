"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { getSupabaseClient } from "@/lib/supabase"
import { Loader2 } from "lucide-react"

export default function LogoutPage() {
  const router = useRouter()
  const supabase = getSupabaseClient()

  useEffect(() => {
    const handleLogout = async () => {
      await supabase.auth.signOut()
      router.push("/login")
    }

    handleLogout()
  }, [router])

  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin mb-4" />
      <p>Logging out...</p>
    </div>
  )
}


import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { cn } from "@/lib/utils"
import { createClient } from "@/lib/supabase/server"

const inter = Inter({ subsets: ["latin"] })

export async function generateMetadata(): Promise<Metadata> {
  const supabase = await createClient()

  const { data: siteSettings } = await supabase
    .from('site_settings')
    .select('owner_name, tagline')
    .eq('singleton', true)
    .single()

  const ownerName = siteSettings?.owner_name || 'John Doe'
  const tagline = siteSettings?.tagline || 'Creative Technologist'

  return {
    title: `${ownerName} | ${tagline}`,
    description: `Personal portfolio of ${ownerName}, showcasing works and thoughts.`,
  }
}

import { Toaster } from "sonner"

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={cn(inter.className, "antialiased")}>
        {children}
        <Toaster position="top-right" richColors />
      </body>
    </html>
  )
}

import type React from "react"
import type { Metadata } from "next"
import { Krona_One, Quantico, Roboto_Flex } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"

const kronaOne = Krona_One({
  subsets: ["latin"],
  variable: "--font-krona-one",
  weight: ["400"],
})

const quantico = Quantico({
  subsets: ["latin"],
  variable: "--font-quantico",
  weight: ["400", "700"],
})

const robotoFlex = Roboto_Flex({
  subsets: ["latin"],
  variable: "--font-roboto-flex",
  weight: ["400", "500", "600", "700"],
})

export const metadata: Metadata = {
  title: "Dravmo - AI Design Feedback Tool",
  description: "Get expert AI feedback on your designs",
  generator: "v0.dev",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${kronaOne.variable} ${quantico.variable} ${robotoFlex.variable} font-sans`}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}

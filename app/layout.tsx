import "./globals.css"
import { Inter as FontSans } from "next/font/google"
import AppHeader from "./header"

import { cn } from "@/lib/utils"

type RootLayoutProps = {
  children: React.ReactNode;
};

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
})

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          fontSans.variable
        )}
      >
              <AppHeader />

        {children}
      </body>
    </html>
  )
}
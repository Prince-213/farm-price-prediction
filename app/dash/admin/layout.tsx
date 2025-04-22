import type React from "react";
import "@/app/globals.css";
import type { Metadata } from "next";

import { cn } from "@/lib/utils";
import Sidebar from "@/components/sidebar";

import localFont from "next/font/local";

const myFont = localFont({
  src: "../../(font)/Outfit-Variable.ttf",
  display: "swap",
  variable: "--my-font"
});

export const metadata: Metadata = {
  title: "Farm Admin Dashboard",
  description: "Admin dashboard for managing farm produce prices"
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          "h-screen overflow-hidden bg-background font-sans antialiased",
          myFont.className
        )}
      >
        <div className="flex ">
          <Sidebar />
          <div className="flex-1">{children}</div>
        </div>
      </body>
    </html>
  );
}

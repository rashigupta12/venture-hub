import { auth } from "@/auth";
import { Toaster } from "@/components/ui/toaster";
import type { Metadata } from "next";
import { SessionProvider } from "next-auth/react";

import "./globals.css";



export const metadata: Metadata = {
   title: "VentureHub | Nurturing Visionary Growth",
  description:
    "VentureHub connects the world's most visionary founders with tactical capital and soul-led mentorship required to flourish sustainably.",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  return (
    <SessionProvider session={session}>
      <html lang="en">
      <head>
          <link
          rel="preconnect"
          href="https://api.fontshare.com"
          crossOrigin="anonymous"
        />
      </head>
             <body className="antialiased">{children} <Toaster/></body>

      </html>
    </SessionProvider>
  );
}

import type { Metadata } from "next";
import "./globals.css";
import { SessionProvider } from "next-auth/react";
import { Toaster } from "@/components/ui/toaster";

export const metadata: Metadata = {
  title: "Mystery Message",
  description: "It is an Anonymous messaging website built for fun purpose.",
  icons: {
    icon: "/public/icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <SessionProvider>
        <body className="bg-gradient-to-br from-blue-50 to-purple-50">
          {children}
          <Toaster />
        </body>
      </SessionProvider>
    </html>
  );
}

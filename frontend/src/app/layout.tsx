import "@/app/globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ReactNode } from "react";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Transit Arrival Board",
  description: "Gets and displays public transit info around Bronx Science",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html className="h-full w-full" lang="en">
      <body className={`h-full w-full ${inter.className}`}>{children}</body>
    </html>
  );
}

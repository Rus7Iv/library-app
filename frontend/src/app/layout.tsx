"use client";

import type { Metadata } from "next";
import Image from "next/image";
import { Inter } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { metadata } from "../utils/metadata";

const inter = Inter({ subsets: ["latin"] });
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();

  return (
    <html lang="ru">
      <head>
        <title>{metadata.title as React.ReactNode}</title>
        <meta name="description" content={String(metadata.description)} />
      </head>
      <body className={inter.className}>
        <div className="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
          <div className="relative py-3 sm:max-w-3xl sm:mx-auto">
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-light-blue-500 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl lg:block hidden" />
            <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">
              <div className="sm:min-w-[400px] mx-auto">
                <div className="flex w-full justify-between items-center">
                  <Image src='/logo.svg' alt='logo' width={100} height={100} priority/>
                  {pathname !== "/" && (
                    <Link href="/" className="text-blue-500 hover:text-blue-700">
                      На главную
                    </Link>
                  )}
                </div>                
                <div className="divide-y divide-gray-200">
                  {children}
                </div>
              </div>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}

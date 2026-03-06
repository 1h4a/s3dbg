import type { Metadata } from "next";
import "./globals.css";

import { Geist, Geist_Mono } from "next/font/google";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "s3dbg",
  description: "js client-s3 test tool",
};

import NextTopLoader from "nextjs-toploader";
import Link from "next/link";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`antialiased`}>
        <NextTopLoader
          color="#FFFFFF"
          height={1}
          showSpinner={false}
          crawl={false}
        />
        <div className="w-screen h-full flex-col items-start justify-start p-24 tracking-tight">
          <div
            className={`flex flex-row w-full h-fit items-center justify-between font-medium tracking-tight ${geistSans.className}`}
          >
            <span className="flex flex-row w-fit h-fit items-center justify-center gap-4 pointer-events-none pb-4">
              <img src="/logo.svg" alt="logo" className="w-10 h-10" />
              <h1 className="text-xl"> s3dbg </h1>
            </span>
            <span className="h-10 flex flex-row gap-4">
              <Link
                href="/"
                className="h-full font-medium text-lg hover:underline hover:underline-offset-2 transition-all duration-500"
              >
                {" "}
                Config{" "}
              </Link>
              <Link
                href="/logging"
                className="h-full font-medium text-lg hover:underline hover:underline-offset-2 transition-all duration-500"
              >
                {" "}
                Logs{" "}
              </Link>
            </span>
          </div>
          <span className={geistMono.className}>{children}</span>
        </div>
      </body>
    </html>
  );
}

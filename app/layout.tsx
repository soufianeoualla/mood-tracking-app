import type { Metadata } from "next";
import { Reddit_Sans } from "next/font/google";
import "./globals.css";
import QueryProvider from "./query-provider";
import { Toaster } from "react-hot-toast";

const redditSans = Reddit_Sans({
  subsets: ["latin"],
  variable: "--font-reddit-sans",
});

export const metadata: Metadata = {
  title: "Mood Tracker",
  description: "Track your mood, sleep, and feelings",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${redditSans.className} antialiased flex flex-col items-center custom-linear-gradiant min-h-screen`}
      >
        <Toaster position="bottom-right" />

        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  );
}

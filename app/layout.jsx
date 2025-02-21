import Navbar from "@/components/Navbar";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { getServerSession } from "next-auth";
import authOptions from "./api/auth/[...nextauth]/nextAuthOptions";
import ToastProvider, { useToast } from "@/components/toast/ToastProvider";
import { SessionProvider } from "next-auth/react";
import SessionProviderWrapper from "./SessionProviderWrapper";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Project Similarity Checker",
  description:
    "Compare project proposals with advanced similarity detection. Our AI-powered tool analyzes text embeddings to find related projects, prevent duplication, and ensure originality. Perfect for universities, researchers, and developers.",
  icons: {
    icon: "/favicon.png",
    shortcut: "/favicon.png",
    apple: "/favicon.png",
  },
};

export default async function RootLayout({ children }) {
  const session = await getServerSession(authOptions);
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-100 `}
      >
        <Navbar user={session?.user} />
        <SessionProviderWrapper>
          <ToastProvider>
            <div className="mx-4 my-6 lg:my-8 lg:mx-8">{children}</div>
          </ToastProvider>
        </SessionProviderWrapper>
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import Providers from "./providers";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Task Manager | Assignment Submission",
  description: "A clean, performant Task Manager application focusing on core full-stack principles.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full font-sans antialiased">
        <Providers>
          <div className="flex flex-col min-h-screen">
            <main className="flex-1">{children}</main>
          </div>
          <Toaster 
            position="top-center"
            toastOptions={{
              className: 'border border-slate-200 shadow-lg text-sm font-medium',
            }}
          />
        </Providers>
      </body>
    </html>
  );
}

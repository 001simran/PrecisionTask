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
  title: "Task Manager",
  description: "A clean and functional task management application.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} antialiased`}>
      <body className="min-h-screen font-sans bg-slate-50">
        <Providers>
          <div className="max-w-xl mx-auto py-12 px-4">
            {children}
          </div>
          <Toaster 
            position="bottom-right"
            toastOptions={{
              className: 'text-sm font-medium border border-slate-100 shadow-xl',
              duration: 3000,
            }}
          />
        </Providers>
      </body>
    </html>
  );
}

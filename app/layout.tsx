import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/theme-provider";
import ToasterProvider from "@/components/providers/ToasterProvider";
import AuthContext from "@/context/AuthContext";
import { ModalProvider } from "@/components/providers/modal-provider";

const poppinsRegular = localFont({
  src: "./fonts/Inter-VariableFont_opsz,wght.ttf",
  variable: "--font-poppins-regular",
  weight: "100 900",
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SmartNot",
  description: "The connected workspace where better, faster work happens.",
  icons: [
    {
      media: "(prefers-color-sheme: light)",
      url: "/logo-light.png",
      href: "/logo-light.png",
    },
    {
      media: "(prefers-color-sheme: dark)",
      url: "/logo-dark.png",
      href: "/logo-dark.png",
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${poppinsRegular.className} ${geistMono.variable} antialiased`}
      >
        <AuthContext>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <ToasterProvider />
            <ModalProvider />
            {children}
          </ThemeProvider>
        </AuthContext>
      </body>
    </html>
  );
}

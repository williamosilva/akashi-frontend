import type { Metadata, Viewport } from "next";
import { Geist, Azeret_Mono as Geist_Mono } from "next/font/google";
import "./globals.css";
import ConditionalLayout from "@/components/ui/Layout/ConditionalLayout";
import type React from "react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  colorScheme: "dark light",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#121212" },
  ],
};

export const metadata: Metadata = {
  title: "Akashi - Free Backend Generator for Web Projects",
  description:
    "An intuitive platform for visual API and JSON object creation. Build, test, and deploy backends for your frontend projects without complex coding.",
  keywords: [
    "baas",
    "backend as a service",
    "api",
    "json",
    "get requests",
    "visual building",
    "api generator",
    "no-code backend",
    "mock api",
    "web development",
    "rapid prototyping",
    "api integration",
    "frontend",
  ],
  authors: [{ name: "William Silva", url: "https://github.com/williamosilva" }],
  creator: "William Silva",
  publisher: "William Silva",
  category: "Technology",
  applicationName: "Akashi BaaS",
  generator: "Next.js",
  referrer: "origin-when-cross-origin",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "https://www.akashi-baas.com.br",
    // languages: {
    //   "pt-BR": "https://www.akashi-baas.com.br",
    //   "en-US": "https://www.akashi-baas.com.br/en",
    // },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://www.akashi-baas.com.br",
    title: "Akashi - Visually Build Backends for Your Frontend",
    description:
      "Create APIs and JSON objects visually and use them in your frontend projects without worrying about backend infrastructure.",
    siteName: "Akashi",
    // images: [
    //   {
    //     url: "https://www.akashi-baas.com.br/og-image.jpg",
    //     width: 1200,
    //     height: 630,
    //     alt: "Akashi BaaS - Visual platform for backend creation",
    //   },
    // ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Akashi - Visual API and Backend Generator",
    description:
      "Create APIs and JSON objects visually to speed up your frontend development.",
    creator: "@tnkswill",
  },
  manifest: "/site.webmanifest",
  verification: {
    google: "google-site-verification-code",
    yandex: "yandex-verification-code",
  },
  metadataBase: new URL("https://www.akashi-baas.com.br"),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en-US" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen`}
      >
        <ConditionalLayout>{children}</ConditionalLayout>
      </body>
    </html>
  );
}

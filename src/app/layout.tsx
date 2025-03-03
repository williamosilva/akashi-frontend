import type { Metadata, Viewport } from "next";
import { Geist, Azeret_Mono as Geist_Mono } from "next/font/google";
import "./globals.css";
import ConditionalLayout from "@/components/ui/ConditionalLayout";
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

// Novo objeto viewport exportado separadamente
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
  title: "Akashi - Gerador gratuito de backend para projetos web",
  description:
    "Plataforma intuitiva para construção visual de APIs e objetos JSON. Crie, teste e implemente backends para seus projetos frontend sem codificação complexa.",
  keywords: [
    "baas",
    "backend as a service",
    "api",
    "json",
    "requisições get",
    "construção visual",
    "gerador de api",
    "backend sem código",
    "mock api",
    "desenvolvimento web",
    "prototipagem rápida",
    "integração api",
    "frontend",
  ],
  authors: [{ name: "William Silva", url: "https://github.com/willianbs" }],
  creator: "William Silva",
  publisher: "William Silva",
  category: "Tecnologia",
  applicationName: "Akashi BaaS",
  generator: "Next.js",
  referrer: "origin-when-cross-origin",
  // Removi colorScheme, themeColor e viewport daqui
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
    languages: {
      "pt-BR": "https://www.akashi-baas.com.br",
      "en-US": "https://www.akashi-baas.com.br/en",
    },
  },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: "https://www.akashi-baas.com.br",
    title: "Akashi - Construa backends visualmente para o seu frontend",
    description:
      "Crie APIs e objetos JSON de forma visual e use em seus projetos frontend sem se preocupar com infraestrutura de backend",
    siteName: "Akashi",
    images: [
      {
        url: "https://www.akashi-baas.com.br/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Akashi BaaS - Plataforma visual para criação de backends",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Akashi - Gerador Visual de APIs e Backends",
    description:
      "Crie APIs e objetos JSON visualmente para acelerar o desenvolvimento do seu frontend",
    creator: "@tnkswill",
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
    apple: [{ url: "/apple-icon.png", sizes: "180x180", type: "image/png" }],
    shortcut: ["/shortcut-icon.png"],
    other: [
      {
        rel: "apple-touch-icon-precomposed",
        url: "/apple-touch-icon-precomposed.png",
      },
    ],
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
    <html lang="pt-BR" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen`}
      >
        <ConditionalLayout>{children}</ConditionalLayout>
      </body>
    </html>
  );
}

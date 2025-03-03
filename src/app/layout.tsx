import type { Metadata, Viewport } from "next";
import { Geist, Azeret_Mono as Geist_Mono } from "next/font/google";
import "./globals.css";
import ConditionalLayout from "@/components/ui/ConditionalLayout";
import type React from "react";
import { headers } from "next/headers";

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

async function detectLanguage() {
  const headersList = await headers();
  const acceptLanguage = headersList.get("accept-language") || "";

  if (acceptLanguage.toLowerCase().startsWith("en")) {
    return "en";
  }

  return "pt";
}
// Metadados dinâmicos baseados no idioma
export async function generateMetadata(): Promise<Metadata> {
  const lang = await detectLanguage();

  const metadata: Record<string, Metadata> = {
    en: {
      title: "Akashi - Free backend generator for web projects",
      description:
        "Intuitive platform for visual construction of APIs and JSON objects. Create, test, and deploy backends for your frontend projects without complex coding.",
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
      authors: [{ name: "William Silva", url: "https://github.com/willianbs" }],
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
        canonical: "https://www.akashi-baas.com.br/en",
        languages: {
          "pt-BR": "https://www.akashi-baas.com.br",
          "en-US": "https://www.akashi-baas.com.br/en",
        },
      },
      openGraph: {
        type: "website",
        locale: "en_US",
        url: "https://www.akashi-baas.com.br/en",
        title: "Akashi - Visually build backends for your frontend",
        description:
          "Create APIs and JSON objects visually and use them in your frontend projects without worrying about backend infrastructure",
        siteName: "Akashi",
        images: [
          {
            url: "https://www.akashi-baas.com.br/og-image-en.jpg",
            width: 1200,
            height: 630,
            alt: "Akashi BaaS - Visual platform for backend creation",
          },
        ],
      },
      twitter: {
        card: "summary_large_image",
        title: "Akashi - Visual API and Backend Generator",
        description:
          "Create APIs and JSON objects visually to accelerate your frontend development",
        creator: "@tnkswill",
      },
      icons: {
        icon: [
          { url: "/favicon.ico", sizes: "any" },
          { url: "/icon.svg", type: "image/svg+xml" },
        ],
        apple: [
          { url: "/apple-icon.png", sizes: "180x180", type: "image/png" },
        ],
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
    },
    pt: {
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
        apple: [
          { url: "/apple-icon.png", sizes: "180x180", type: "image/png" },
        ],
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
    },
  };

  return metadata[lang];
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const lang = await detectLanguage();

  return (
    <html lang={lang === "en" ? "en-US" : "pt-BR"} className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen`}
      >
        <ConditionalLayout>{children}</ConditionalLayout>
      </body>
    </html>
  );
}

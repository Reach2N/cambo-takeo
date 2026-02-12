import type { Metadata } from "next";
import { DM_Sans, Playfair_Display, JetBrains_Mono, Kantumruy_Pro } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { I18nProvider } from "@/lib/i18n";
import { Toaster } from "@/components/ui/sonner";
import { CinemaStoreInit } from "@/lib/cinema-store-init";
import "./globals.css";

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["600", "700"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  weight: ["400", "500"],
});

const kantumruyPro = Kantumruy_Pro({
  variable: "--font-kantumruy",
  subsets: ["khmer"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Cambo Cinema Takeo",
  description:
    "Book movie tickets online at Cambo Cinema Takeo - Cambodia's favorite cinema experience",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="km" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover, interactive-widget=overlays-content" />
        <link rel="dns-prefetch" href="https://image.tmdb.org" />
        <link rel="dns-prefetch" href="https://img.youtube.com" />
      </head>
      <body
        className={`${dmSans.variable} ${playfair.variable} ${jetbrainsMono.variable} ${kantumruyPro.variable} antialiased paper-texture`}
      >
        <ThemeProvider>
          <I18nProvider>
            <CinemaStoreInit />
            {children}
            <Toaster
              position="top-right"
              toastOptions={{
                style: {
                  background: "var(--card)",
                  color: "var(--foreground)",
                  border: "1px solid var(--border)",
                },
              }}
            />
          </I18nProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

import { ClerkProvider } from "@clerk/nextjs";
import type { Metadata } from "next";
import "./globals.css";
import SmoothScroll from "@/components/animations/SmoothScroll";
import Footer from "@/components/ui/Footer";
import { AuthProvider } from "@/context/AuthContext";
import TourGuide from "@/components/ui/TourGuide";
import { skyluxeClerkAppearance } from "@/lib/clerkTheme";
import ThemeInitializer from "@/components/theme/ThemeInitializer";

export const metadata: Metadata = {
  title: "SkyLuxe Ecosystem | Premium Aviation & Travel",
  description: "The next-generation AI-powered luxury aviation and travel ecosystem.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark antialiased" suppressHydrationWarning>
      <head>
        <link href="https://api.fontshare.com/v2/css?f[]=clash-display@200,300,400,500,600,700&f[]=satoshi@300,400,500,700,900&display=swap" rel="stylesheet" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                var theme = localStorage.getItem('skyluxe-theme');
                if (theme === 'light') {
                  document.documentElement.classList.remove('dark');
                  document.documentElement.classList.add('light');
                } else if (theme === 'dark') {
                  document.documentElement.classList.remove('light');
                  document.documentElement.classList.add('dark');
                } else if (window.matchMedia('(prefers-color-scheme: light)').matches) {
                  document.documentElement.classList.remove('dark');
                  document.documentElement.classList.add('light');
                }
              } catch (e) {}
            `,
          }}
        />
      </head>
      <body className="bg-onyx text-platinum selection:bg-gold/30">
        <ThemeInitializer />
        <ClerkProvider appearance={skyluxeClerkAppearance}>
          <AuthProvider>
            <SmoothScroll>
              {children}
              <Footer />
              <TourGuide />
            </SmoothScroll>
          </AuthProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}
import { ClerkProvider } from "@clerk/nextjs";
import type { Metadata } from "next";
import "./globals.css";
import SmoothScroll from "@/components/animations/SmoothScroll";
import Footer from "@/components/ui/Footer";
import { AuthProvider } from "@/context/AuthContext";
import TourGuide from "@/components/ui/TourGuide";
import { skyluxeClerkAppearance } from "@/lib/clerkTheme";

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
    <html lang="en" className="dark antialiased">
      <head>
        <link href="https://api.fontshare.com/v2/css?f[]=clash-display@200,300,400,500,600,700&f[]=satoshi@300,400,500,700,900&display=swap" rel="stylesheet" />
      </head>
      <body className="bg-onyx text-platinum selection:bg-gold/30">
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
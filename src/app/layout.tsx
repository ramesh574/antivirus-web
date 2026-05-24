import type { Metadata } from "next";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import { WishlistProvider } from "@/context/WishlistContext";
import ChatBot from "@/components/ChatBot";
import { Analytics } from "@vercel/analytics/react";
import { GoogleAnalytics } from "@next/third-parties/google";

export const metadata: Metadata = {
  title: "SecureGuard Antivirus | Virus Protection & Security Solutions",
  description:
    "SecureGuard Antivirus - Trusted cybersecurity solutions since 2015. Protect your devices from viruses, malware, ransomware, and all cyber threats. Plans starting at ₹499/year.",
  keywords: "antivirus, virus protection, malware protection, cybersecurity, online security, computer protection, ransomware protection",
  openGraph: {
    title: "SecureGuard Antivirus | Virus Protection & Security Solutions",
    description: "Trusted cybersecurity solutions since 2015. Protect all your devices with our award-winning antivirus software.",
    url: "https://secureguardantivirus.com",
    siteName: "SecureGuard Antivirus",
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "SecureGuard Antivirus",
    description: "Trusted cybersecurity solutions since 2015. Protect all your devices.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
        />
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.css"
        />
      </head>
      <body>
        <CartProvider>
          <WishlistProvider>{children}</WishlistProvider>
        </CartProvider>
        <ChatBot />
        <Analytics />
        <GoogleAnalytics gaId={process.env.GA_MEASUREMENT_ID || ""} />
      </body>
    </html>
  );
}

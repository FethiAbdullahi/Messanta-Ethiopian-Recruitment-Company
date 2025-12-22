import type { Metadata, Viewport } from "next";
import { Josefin_Sans } from "next/font/google";
import "./globals.css";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import ScrollToTop from "@/components/ScrollToTop";
import InstallPWA from "@/components/InstallPWA";
import { LanguageProvider } from "@/contexts/LanguageContext";

const josefinSans = Josefin_Sans({ 
  subsets: ["latin"],
  variable: "--font-josefin",
  weight: ["300", "400", "600", "700"],
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: "#0D9488",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export const metadata: Metadata = {
  title: "Skills for Life Training PLC — Empowering Lives Through Education",
  description: "Professional training and skill development programs. Empowering individuals with life-changing skills and career opportunities.",
  keywords: ["training", "education", "skills development", "Ethiopia", "careers", "professional development"],
  authors: [{ name: "Skills for Life Training PLC" }],
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Skills for Life",
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    title: "Skills for Life Training PLC — Empowering Lives Through Education",
    description: "Professional training and skill development programs. Empowering individuals with life-changing skills.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Skills for Life Training PLC — Empowering Lives Through Education",
    description: "Professional training and skill development programs. Empowering individuals with life-changing skills.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Skills for Life Training PLC",
    "description": "Professional training and skill development company empowering individuals with life-changing skills",
    "url": "https://skillsforlife.com",
    "logo": "https://skillsforlife.com/logo.png",
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+251-911-234-567",
      "contactType": "customer service",
      "email": "info@skillsforlife.com",
      "areaServed": "ET",
      "availableLanguage": ["en", "am", "ar"]
    },
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Addis Ababa",
      "addressCountry": "ET"
    }
  };

  return (
    <html lang="en" className={josefinSans.variable} suppressHydrationWarning>
      <head>
        <link rel="manifest" href="/manifest.json" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        {/* PWA Meta Tags */}
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
        <link rel="apple-touch-icon" sizes="152x152" href="/icons/icon-152x152.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/icons/icon-192x192.png" />
        <link rel="apple-touch-icon" sizes="167x167" href="/icons/icon-192x192.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Skills for Life" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="msapplication-TileColor" content="#0D9488" />
        <meta name="msapplication-tap-highlight" content="no" />
      </head>
      <body className="font-sans">
        <LanguageProvider>
          <Nav />
          <main className="min-h-screen">{children}</main>
          <Footer />
          <ScrollToTop />
          <InstallPWA />
        </LanguageProvider>
      </body>
    </html>
  );
}

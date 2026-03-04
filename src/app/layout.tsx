import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import "./globals.css";
import "../lib/init";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
  preload: true,
});

const poppins = Poppins({
  variable: "--font-poppins",
  weight: ["400", "500", "600", "700"], // Reduced weights
  subsets: ["latin"],
  display: "swap",
  preload: true,
});

export const metadata: Metadata = {
  title: {
    default: "StayStocked - Seamless Airbnb Grocery Stocking",
    template: "%s | StayStocked",
  },
  description: "Transform your Airbnb hosting experience with seamless grocery stocking. Your guests arrive to fully stocked kitchens, and you focus on what matters most.",
  keywords: ["airbnb", "grocery stocking", "rental management", "host services", "vacation rental", "grocery delivery"],
  authors: [{ name: "StayStocked" }],
  creator: "StayStocked",
  publisher: "StayStocked",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: [
      {
        url: '/favicon.svg',
        type: 'image/svg+xml',
      },
    ],
    shortcut: '/favicon.svg',
    apple: {
      url: '/favicon.svg',
      type: 'image/svg+xml',
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://staystocked.com',
    siteName: 'StayStocked',
    title: 'StayStocked - Seamless Airbnb Grocery Stocking',
    description: 'Transform your Airbnb hosting experience with seamless grocery stocking.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'StayStocked - Seamless Airbnb Grocery Stocking',
    description: 'Transform your Airbnb hosting experience with seamless grocery stocking.',
    creator: '@staystocked',
  },
  other: {
    "X-UA-Compatible": "IE=edge",
    "format-detection": "telephone=no",
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  shrinkToFit: 'no',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${poppins.variable} font-sans antialiased`}
      >
        {children}
      </body>
    </html>
  );
}

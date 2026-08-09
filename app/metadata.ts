import type { Metadata } from "next";

export const siteMetadata: Metadata = {
  metadataBase: new URL("https://ortcompany.com"),

  title: {
    default: "ORT — Entertainment, Media & Culture",
    template: "%s — ORT",
  },

  description:
    "ORT is a Sudanese entertainment and media platform for programs, reels, news, culture, music, and original productions.",

  keywords: [
    "ORT",
    "ORT Sudan",
    "Sudanese entertainment",
    "Sudanese media",
    "Sudanese culture",
    "Sudanese programs",
    "Sudanese reels",
    "Sudanese music",
    "ORT Production",
  ],

  authors: [
    {
      name: "ORT",
      url: "https://ortcompany.com",
    },
  ],

  creator: "ORT",
  publisher: "ORT",

  applicationName: "ORT",

  alternates: {
    canonical: "/",
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },

  openGraph: {
    type: "website",
    locale: "ar_SD",
    url: "https://ortcompany.com",
    siteName: "ORT",
    title: "ORT — Entertainment, Media & Culture",
    description:
      "Entertainment, media, culture, programs, reels, news, music and original productions from ORT.",
    images: ["/twitter-image"],
  },

  twitter: {
    card: "summary_large_image",
    title: "ORT — Entertainment, Media & Culture",
    description:
      "Entertainment, media, culture, programs, reels, news, music and original productions from ORT.",
    images: ["/og-image.jpg"],
  },
};

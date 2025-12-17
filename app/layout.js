import "./globals.css";

const SITE_URL = "https://ozodbek-abdullayev.uz";

export const metadata = {
  metadataBase: new URL(SITE_URL),

  title: {
    default: "Ozodbek Abdullayev — Full Stack Developer & Founder",
    template: "%s | Ozodbek Abdullayev",
  },

  description:
    "Ozodbek Abdullayev — Full Stack Developer & Product Builder. Portfolio, selected work, and contact information.",

  keywords: [
    "Ozodbek Abdullayev",
    "Ozodbek Abdullayev portfolio",
    "Full Stack Developer",
    "Next.js developer",
    "Node.js developer",
    "Uzbekistan developer",
  ],

  alternates: {
    canonical: SITE_URL,
  },

  openGraph: {
    type: "website",
    url: SITE_URL,
    title: "Ozodbek Abdullayev — Full Stack Developer & Founder",
    description:
      "Portfolio, selected work, and contact information for Ozodbek Abdullayev.",
    siteName: "Ozodbek Abdullayev",
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: "Ozodbek Abdullayev — Portfolio",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Ozodbek Abdullayev — Full Stack Developer & Founder",
    description:
      "Portfolio, selected work, and contact information for Ozodbek Abdullayev.",
    images: ["/og.png"],
  },

  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
    apple: "/favicon.svg",
  },

  // Google verification (HTML fayl o‘rniga meta bilan ham bo‘ladi)
  verification: {
    google: "6ca257423078377b",
  },
};

export default function RootLayout({ children }) {
  const personJsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Ozodbek Abdullayev",
    url: SITE_URL,
    jobTitle: "Full Stack Developer",
    sameAs: [
      "https://github.com/Abdullayev2005",
      "https://t.me/hasanovich_o",
    ],
  };

  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}

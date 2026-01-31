import type { Metadata, Viewport } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-poppins",
});

export const viewport: Viewport = {
  themeColor: "#ec4899",
};

export const metadata: Metadata = {
  title: "Nail Studio - Nail Art Inspiration",
  description: "Discover beautiful nail art ideas, trends, and inspiration for your next manicure",
  manifest: "/manifest.json",
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon-32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [
      { url: "/icon-192.png", sizes: "192x192" },
    ],
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
        <meta name="theme-color" content="#ec4899" />
      </head>
      <body
        className={`${poppins.variable} font-sans antialiased`}
      >
        {children}
      </body>
    </html>
  );
}

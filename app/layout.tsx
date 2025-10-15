import type { Metadata } from "next";
import { Inter,Geist_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-roboto",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Find That Movie",
  description: "Discover movies by description, plot, or theme.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}

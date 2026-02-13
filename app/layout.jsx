
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Providers from "./Providers";


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Frontend Task",
  description: "Dashboard + RAWG + Advanced select",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" dir="ltr">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-100 text-gray-900`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

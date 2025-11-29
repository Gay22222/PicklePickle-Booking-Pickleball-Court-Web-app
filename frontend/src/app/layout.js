
import { Geist, Geist_Mono, Baloo_2, Inter } from "next/font/google";
import "./globals.css";
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const pickleFont = Baloo_2({
  variable: "--font-pickle",
  subsets: ["latin"],
  weight: ["400", "600"],
});

export const metadata = {
  title: "Pickle Pickle",
  description: "PicklePickle Booking - Đặt sân chơi pickleball dễ dàng",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="vi"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} ${pickleFont.variable}`}
    >
      
      <body className="bg-black text-white min-h-screen flex flex-col">
      
        <Header />

        
        <main className="flex-1">
          {children}
        </main>

        
        <Footer />
      </body>
    </html>
  );
}

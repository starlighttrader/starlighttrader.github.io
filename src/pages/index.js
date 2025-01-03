import { useEffect, useState } from "react";
import Image from "next/image";
import { Geist, Geist_Mono } from "next/font/google";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Shop from "@/components/Shop";
import WhyUs from "@/components/WhyUs";
// import GoogleContact from "@/components/GoogleContact";
import FillOutForm from "@/components/FillOutForm";
import Footer from "@/components/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export default function Home() {
  const [currency, setCurrency] = useState('USD');

  useEffect(() => {
    // Detect user's location and set currency
    const detectCurrency = async () => {
      try {
        const response = await fetch('https://ipapi.co/json/');
        const data = await response.json();
        setCurrency(data.country === 'IN' ? 'INR' : 'USD');
      } catch (error) {
        console.error('Error detecting location:', error);
      }
    };

    detectCurrency();
  }, []);

  return (
    <div className={`${geistSans.variable} min-h-screen`}>
      <Header currency={currency} setCurrency={setCurrency} />
      <main>
        <Hero />
        <Shop currency={currency} />
        <WhyUs />
        {/* <GoogleContact /> */}
        <FillOutForm />
      </main>
      <Footer />
    </div>
  );
}
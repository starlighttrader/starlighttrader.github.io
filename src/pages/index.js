import { useEffect, useState } from "react";
import Image from "next/image";
import { Geist } from "next/font/google";
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
    // Check localStorage for saved currency preference
    const savedCurrency = localStorage.getItem('preferredCurrency');
    if (savedCurrency && (savedCurrency === 'USD' || savedCurrency === 'INR')) {
      setCurrency(savedCurrency);
      return;
    }

    // If no saved preference, detect based on location
    const detectCurrency = async () => {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000);

        const response = await fetch('https://ipapi.co/json/', {
          signal: controller.signal,
          headers: {
            'Accept': 'application/json',
            'User-Agent': 'StarLightTrader/1.0'
          }
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          throw new Error('Failed to fetch location data');
        }

        const data = await response.json();
        const detectedCurrency = data.country === 'IN' ? 'INR' : 'USD';
        setCurrency(detectedCurrency);
        localStorage.setItem('preferredCurrency', detectedCurrency);
      } catch (error) {
        console.error('Error detecting location:', error);
        // Default to USD and save preference
        setCurrency('USD');
        localStorage.setItem('preferredCurrency', 'USD');
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
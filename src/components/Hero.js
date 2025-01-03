import { useState, useEffect } from 'react';
import Link from 'next/link';

const Hero = () => {
  const messages = [
    "Are you looking for an edge in trading the financial markets beyond fundamental and technical analysis?",
    "Our data-driven approach helps you to apply Financial Astrology concepts to improve your decision making in trading the financial markets.",
    "Join our feature packed all inclusive course and get access to our discord community to start your journey to financial freedom."
  ];

  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentMessageIndex((prevIndex) => 
        prevIndex === messages.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000); // Change message every 5 seconds

    return () => clearInterval(timer);
  }, []);

  return (
    <section id="home" className="relative h-screen mt-20">
      <div className="absolute inset-0 w-full h-full">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="w-full h-full object-cover pointer-events-none"
        >
          <source src="/starfield_background_video.mp4" type="video/mp4" />
        </video>
      </div>
      
      <div className="absolute inset-0 bg-black/60">
        <div className="max-w-4xl mx-auto h-full flex flex-col justify-center px-4 text-white">
          <h1 className="text-5xl font-bold mb-6 animate-fade-in">
            Enhance your Trading Performance
          </h1>
          <p className="text-xl mb-6 animate-fade-in-delay text-center">
            Discover the power of Financial Astrology in your trading journey
          </p>
          
          <div className="h-20 mb-8">
            <p className="text-lg animate-fade-in-out font-mono bg-gradient-to-r from-gemini-blue to-gemini-pink inline-block text-transparent bg-clip-text">
              ➤ {messages[currentMessageIndex]}
            </p>
          </div>

          <div className="flex justify-center w-full">
            <Link
              href="#shop"
              className="bg-white text-black px-8 py-3 rounded-full hover:bg-gray-200 transition-colors animate-fade-in-delay-2"
            >
              Get Started
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero; 
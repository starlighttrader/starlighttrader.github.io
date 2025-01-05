import Link from 'next/link';
import Image from 'next/image';
import CurrencySelector from './CurrencySelector';
import { useEffect, useState } from 'react';

const Header = ({ currency, setCurrency }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const navItems = [
    { label: 'Home', href: '#home' },
    { label: 'Shop', href: '#shop' },
    { label: 'Why Us', href: '#why-us' },
    { label: 'Contact', href: '#contact' }
  ];

  useEffect(() => {
    const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    setIsDarkMode(darkModeMediaQuery.matches);

    const handleThemeChange = (e) => {
      setIsDarkMode(e.matches);
      console.log('Theme changed to:', e.matches ? 'dark' : 'light');
    };

    darkModeMediaQuery.addEventListener('change', handleThemeChange);

    return () => darkModeMediaQuery.removeEventListener('change', handleThemeChange);
  }, []);

  return (
    <header className="fixed top-0 w-full z-50 bg-background">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center">
          <Link href="/" className="flex items-center">
            <Image
              src={isDarkMode ? "./logo_dark.png" : "./logo.png"}
              alt="StarLightTrader Logo"
              width={150}
              height={40}
              priority
            />
          </Link>
        </div>
        
        <div className="flex items-center space-x-8">
          {navItems.map((item) => (
            <Link 
              key={item.label}
              href={item.href}
              className="hover:text-gray-300 transition-colors"
            >
              {item.label}
            </Link>
          ))}
          
          <CurrencySelector currency={currency} setCurrency={setCurrency} />
        </div>
      </nav>
    </header>
  );
};

export default Header; 
import Link from 'next/link';
import Image from 'next/image';
import CurrencySelector from './CurrencySelector';
import { useTheme } from './ThemeProvider';
import { Sun, Moon } from 'lucide-react';

const Header = ({ currency, setCurrency }) => {
  const { isDarkTheme, toggleTheme } = useTheme();

  const navItems = [
    { label: 'Home', href: '#home' },
    { label: 'Shop', href: '#shop' },
    { label: 'Why Us', href: '#why-us' },
    { label: 'Contact', href: '#contact' }
  ];

  return (
    <header className="fixed top-0 w-full z-50 bg-background border-b border-gray-200 dark:border-gray-800">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center">
          <Link href="/" className="flex items-center">
            <Image
              src={isDarkTheme ? "./logo_dark.png" : "./logo.png"}
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
              className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              {item.label}
            </Link>
          ))}
          
          <button
            onClick={toggleTheme}
            className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            aria-label="Toggle theme"
          >
            {isDarkTheme ? (
              <Sun className="h-5 w-5 text-gray-300" />
            ) : (
              <Moon className="h-5 w-5 text-gray-700" />
            )}
          </button>
          
          <CurrencySelector currency={currency} setCurrency={setCurrency} />
        </div>
      </nav>
    </header>
  );
};

export default Header; 
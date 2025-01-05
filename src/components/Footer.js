import Link from 'next/link';
import Image from 'next/image';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    quickLinks: [
      { name: 'Home', href: '#home' },
      { name: 'Shop', href: '#shop' },
      { name: 'About Us', href: '#why-us' },
      { name: 'Contact', href: '#contact' },
    ],
    legal: [
      { 
        name: 'Terms & Conditions', 
        href: 'https://vivacious-plot-3b2.notion.site/Terms-and-Conditions-1704c2c3bfc180d7ba28c25f369bb7bc'
      },
      { 
        name: 'Privacy Policy', 
        href: 'https://vivacious-plot-3b2.notion.site/Privacy-Policy-1704c2c3bfc180069ba9f9541069f384'
      },
      { 
        name: 'Refund Policy',
        href: 'https://vivacious-plot-3b2.notion.site/Refund-Policy-1724c2c3bfc18073a8cef2690dcefbb1?pvs=73'
      },
      { 
        name: 'FAQs', 
        href: 'https://vivacious-plot-3b2.notion.site/FAQs-1704c2c3bfc180d59433ee45d0bb2010'
      },
    ],
  };

  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand Section */}
          <div>
            <Link href="/" className="inline-block mb-4">
              <Image
                src="/logo_dark.png"
                alt="StarLightTrader Logo (Dark)"
                width={150}
                height={40}
                priority
              />
            </Link>
            <p className="text-sm">
              Using Financial Astrology for better trading.
            </p>
            <div className="flex space-x-4 mt-4">
              <Link
                href="https://wa.me/918925375889"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:opacity-80 transition-opacity"
              >
                <Image
                  src="/icons8-whatsapp.svg"
                  alt="WhatsApp"
                  width={24}
                  height={24}
                />
              </Link>
              <Link
                href="https://youtube.com/@StarLightTrader"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:opacity-80 transition-opacity"
              >
                <Image
                  src="/icons8-youtube.svg"
                  alt="YouTube"
                  width={24}
                  height={24}
                />
              </Link>
              <Link
                href="https://x.com/StarLiTrader"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:opacity-80 transition-opacity"
              >
                <Image
                  src="/icons8-x.svg"
                  alt="X (Twitter)"
                  width={24}
                  height={24}
                  className="invert"
                />
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {footerLinks.quickLinks.map((link) => (
                <li key={link.name}>
                  <Link 
                    href={link.href}
                    className="text-sm hover:text-white transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Legal</h4>
            <ul className="space-y-2">
              {footerLinks.legal.map((link) => (
                <li key={link.name}>
                  <Link 
                    href={link.href}
                    className="text-sm hover:text-white transition-colors"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-sm">
            © {currentYear} StarLightTrader. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 
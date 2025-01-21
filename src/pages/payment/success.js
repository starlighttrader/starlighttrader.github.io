import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Image from 'next/image';

export default function ThankYou() {
  const router = useRouter();
  const [countdown, setCountdown] = useState(30);

  useEffect(() => {
    // Redirect after 10 seconds
    const timer = setTimeout(() => {
      router.push('/');
    }, 30000);

    // Update countdown every second
    const countdownInterval = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    // Cleanup timers
    return () => {
      clearTimeout(timer);
      clearInterval(countdownInterval);
    };
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="max-w-md w-full p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg text-center">
        <div className="mb-8">
          <svg
            className="mx-auto h-16 w-16 text-green-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 48 48"
          >
            <circle
              className="opacity-25"
              cx="24"
              cy="24"
              r="20"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M14 24l8 8 16-16"
            />
          </svg>
        </div>
        
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          Thank You for Your Purchase!
        </h1>
        
        <p className="text-gray-600 dark:text-gray-300 mb-8">
          Your payment was successful. You will receive a confirmation email shortly with further details. You can also send your transaction receipt to our WhatsApp number (see website footer on Home Page) for faster onboarding.
        </p>

        {/* Added WhatsApp QR Code */}
        <div className="mb-8">
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Scan the QR code below on your WhatsApp Camera
          </p>
          <div className="flex justify-center">
            <Image
              src="/SLT_WhatsApp_QR.png"
              alt="WhatsApp QR Code"
              width={500}
              height={500}
              className="rounded-lg"
              style={{ objectFit: 'contain' }}
            />
          </div>
        </div>

        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
          Redirecting to home page in {countdown} seconds...
        </p>

        <Link 
          href="/"
          className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Return to Home
        </Link>
      </div>
    </div>
  );
} 
import Link from 'next/link';

export default function PaymentFailed() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="max-w-md w-full p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg text-center">
        <div className="mb-8">
          <svg
            className="mx-auto h-16 w-16 text-red-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 48 48"
          >
            <circle
              cx="24"
              cy="24"
              r="20"
              strokeWidth="4"
            />
            <path
              strokeLinecap="round"
              strokeWidth="4"
              d="M16 16l16 16m0-16L16 32"
            />
          </svg>
        </div>
        
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          Payment Failed
        </h1>
        
        <p className="text-gray-600 dark:text-gray-300 mb-8">
          We're sorry, but your payment could not be processed. Please try again or contact our support team if the problem persists.
        </p>

        <div className="space-y-4">
          <Link 
            href="/"
            className="block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Return to Home
          </Link>
          
          <Link 
            href="/#shop"
            className="block bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white px-6 py-2 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
          >
            Try Again
          </Link>
        </div>
      </div>
    </div>
  );
} 
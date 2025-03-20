import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

const ErrorPage = () => {
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (router.isReady) {
      const message = router.query.message || 'An error occurred';
      setErrorMessage(decodeURIComponent(message));
    }
  }, [router.isReady, router.query]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 text-center">
        <div>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900 dark:text-white">
            Payment Error
          </h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            {errorMessage}
          </p>
        </div>
        <div>
          <button
            onClick={() => window.close()}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Close Window
          </button>
        </div>
      </div>
    </div>
  );
};

export default ErrorPage; 
const ProductModal = ({ product, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-background rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Close button */}
          <button 
            onClick={onClose}
            className="float-right text-gray-500 hover:text-gray-700"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Content */}
          <h2 className="text-2xl font-bold mb-4">{product.title}</h2>
          
          {/* Video Section */}
          <div className="mb-6">
            <div className="aspect-w-16 aspect-h-9 h-[400px]">
              <iframe
                src={product.videoUrl}
                title={`${product.title} Preview`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full rounded-lg"
              ></iframe>
            </div>
          </div>

          {/* Detailed Description */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">Course Overview</h3>
            <p className="text-gray-600 dark:text-gray-300">
              {getDetailedDescription(product)}
            </p>

            {/* What You'll Learn */}
            <div>
              <h3 className="text-xl font-semibold mb-3">What You'll Learn</h3>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {product.fullDescription.map((item, index) => (
                  <li key={index} className="flex items-start">
                    <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Additional Information */}
            <div>
              <h3 className="text-xl font-semibold mb-3">Additional Information</h3>
              <div className="grid grid-cols-3 gap-4 text-sm">
                {product.title !== 'TradingView Indicators' && (
                  <>
                    <div>
                      <p className="font-semibold">Duration</p>
                      <p>{product.title === 'StarLightTrader Pro' ? '6 weeks' : '4 weeks'}</p>
                    </div>
                    <div>
                      <p className="font-semibold">Level</p>
                      <p>Beginner to Advanced</p>
                    </div>
                  </>
                )}
                <div>
                  <p className="font-semibold">Support</p>
                  <p>
                    {product.title === 'StarLightTrader Pro' 
                      ? 'Discord (12 months access)'
                      : 'Discord | Email'}
                  </p>
                </div>
                {product.title === 'TradingView Indicators' && (
                  <div>
                    <p className="font-semibold">Updates</p>
                    <p>Lifetime Access</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper function to generate detailed descriptions
const getDetailedDescription = (product) => {
  const descriptions = {
    'Western FinAstro Concepts': 'Dive deep into Western Financial Astrology methods pioneered by W.D. Gann. Learn how to combine astronomical cycles with market analysis to predict potential market turning points and price levels. This comprehensive course covers both theoretical foundations and practical applications.',
    'Vedic Financial Astrology': 'Explore the ancient wisdom of Vedic astrology applied to modern financial markets. Learn how planetary positions and aspects can influence market cycles and trading decisions. This course bridges traditional Vedic concepts with contemporary trading strategies.',
    'TradingView Indicators': 'Access our suite of professional TradingView indicators designed specifically for Financial Astrology trading. These tools help you analyze astronomical data with clarity to provide unique market insights in advance as well as for backtesting.',
    'StarLightTrader Pro': 'Get the complete Financial Astrology education package. This comprehensive bundle includes all our courses ( both Vedic and Western FinAstro course content with all our tradingview indicators) and indicators, plus exclusive access to our discord trading community.'
  };
  
  return descriptions[product.title] || 'Detailed description coming soon.';
};

export default ProductModal; 
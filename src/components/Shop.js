import { useState, useEffect } from 'react';
import ProductModal from './ProductModal';
import PopularCard from './PopularCard';
import popularConfig from '../config/CustomizeProduct.json';

const EXCHANGE_RATE_API = 'https://api.exchangerate-api.com/v4/latest/INR';
const FALLBACK_USD_RATE = 1/85; // 1 USD = 85 INR

const roundToNearest5Ceil = (number) => {
  return Math.ceil(number / 5) * 5;
};

const PRODUCTS = {
  courses: [
    {
      title: "Western FinAstro Concepts",
      shortProductID: "WFC",
      shortDescription: "Learn financial astrology methods of W.D Gann, McWhirter and astronomical cycles for market analysis.",
      fullDescription: [
        "Gann Square of 9",
        "Gann Price Levels",
        "Astrological Turn Dates",
        "McWhirter and Benner Cycles",
        "Time and Price Relationships",
        "LifeTime access to 2 TradingView indicators (TPP, GAL) and Excel Spreadsheets",
        "Course Delivery via Weekly Zoom Live Sessions",
        "Discord Community for course duration for anytime Q&A and support",
      ],
      price: { INR: 30000 },
      type: "courses",
      videoUrl: "https://www.youtube.com/embed/FwdqzcEPtls"
    },
    {
      title: "Vedic Financial Astrology",
      shortProductID: "VFA",
      shortDescription: "Learn traditional Vedic astrology concepts applied to modern markets.",
      fullDescription: [
        "Basic Vedic Astrology Concepts",
        "Planetary Transits and Market Impact",
        "Planetary Aspects and Reversal Points",
        "Market Timing Techniques",
        "LifeTime access to 2 TradingView indicators (Planetary Sign Transits and Aspects)",
        "Case Studies and Examples",
        "Course Delivery via Weekly Zoom Live Sessions",
        "Discord Community for course duration for anytime Q&A and support"
      ],
      price: { INR: 30000 },
      type: "courses",
      videoUrl: "https://www.youtube.com/embed/8lkHUrclA2M"
    }
  ],
  indicators: [
    {
      title: "TradingView Indicators",
      shortProductID: "TVIND",
      shortDescription: "Professional astrological indicators built using PineScript for TradingView platform.",
      fullDescription: [
        "Time and Price Projection (TPP)",
        "Gann Astro Lines (GAL)",
        "Planetary Sign Transits and Retrograde periods",
        "Planetary Aspects",
        "LifeTime access to indicator updates",
        "Technical Support"
      ],
      price: { INR: 35000 },
      type: "indicators",
      videoUrl: "https://www.youtube.com/embed?listType=playlist&list=PLlAwc_Rsq3jAcEe9FrGcRnxq-UJk7MHlF"
    }
  ],
  bundles: [
    {
      title: "StarLightTrader Pro",
      shortProductID: "SLTPRO",
      shortDescription: "Comprehensive package bundle combining Western & Vedic methodologies course content along with all our TradingView indicators.",
      fullDescription: [
        "All Western & Vedic FinAstro course content",
        "All 4 TradingView Indicators (Lifetime access)",        
        "BONUS - Trading Psychology & Risk Management Module",
        "BONUS - Free Personal Report on Incompatible Lunar Transits",
        "Course Delivery via Zoom Live Sessions",
        "Discord Community access for 3 months",
      ],
      price: { INR: 60000 },
      type: "bundles",
      videoUrl: "https://www.youtube.com/embed/0BmaHs04tAE"
    }
  ]
};

const Shop = ({ currency }) => {
  const [filter, setFilter] = useState('bundles');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [exchangeRate, setExchangeRate] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchExchangeRate = async () => {
      try {
        const response = await fetch(EXCHANGE_RATE_API);
        const data = await response.json();
        setExchangeRate(data.rates.USD);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching exchange rate:', error);
        setExchangeRate(FALLBACK_USD_RATE); // Use fallback rate if API fails
        setIsLoading(false);
      }
    };

    fetchExchangeRate();
    const interval = setInterval(fetchExchangeRate, 3600000); // Refresh every hour
    return () => clearInterval(interval);
  }, []);

  const getDisplayPrice = (product, isDiscounted = false) => {
    if (isLoading) {
      return 'Loading...';
    }

    if (isDiscounted) {
      const price = popularConfig.onSaleProduct.discountedPrice.INR;
      if (currency === 'USD' && exchangeRate) {
        const exactUSD = price * exchangeRate;
        const roundedUSD = roundToNearest5Ceil(exactUSD);
        return `$${roundedUSD.toLocaleString()}`;
      }
      return `₹${price.toLocaleString()}`;
    }

    const price = product.price.INR;
    if (currency === 'USD' && exchangeRate) {
      const exactUSD = price * exchangeRate;
      const roundedUSD = roundToNearest5Ceil(exactUSD);
      return `$${roundedUSD.toLocaleString()}`;
    }
    return `₹${price.toLocaleString()}`;
  };

  const getFilteredProducts = () => {
    if (filter === 'all') {
      return [...PRODUCTS.courses, ...PRODUCTS.indicators, ...PRODUCTS.bundles];
    }
    return PRODUCTS[filter] || [];
  };

  const generateOrderId = (product) => {
    // Get the predefined shortProductID
    const prefix = product.shortProductID;
    
    // Get current date time in DDMMYYYYHHMM format
    const now = new Date();
    const datetime = [
      now.getDate().toString().padStart(2, '0'),
      (now.getMonth() + 1).toString().padStart(2, '0'),
      now.getFullYear(),
      now.getHours().toString().padStart(2, '0'),
      now.getMinutes().toString().padStart(2, '0')
    ].join('');
    
    // Format as ABCD-XXYYZZ-DDMMYYYY
    return `${prefix}-${datetime.slice(0,6)}${datetime.slice(6,14)}`;
  };

  const handleBuyNow = async (product) => {
    const isOnSale = product.title === popularConfig.onSaleProduct.title;
    const basePrice = isOnSale ? popularConfig.onSaleProduct.discountedPrice.INR : product.price.INR;
    
    // Convert price if currency is USD
    const finalAmount = currency === 'USD' 
        ? roundToNearest5Ceil(basePrice * exchangeRate)
        : basePrice;

    // Generate order ID using the product object
    const orderId = generateOrderId(product);
    
    // Construct payment URL without merchantID
    const paymentUrl = `/payment?${new URLSearchParams({
      orderID: orderId,
      item: `${product.title}${product.type === 'indicators' ? '' : ' Course'}`,
      currency: currency,
      totalAmount: finalAmount
    }).toString()}`;

    // Open payment URL in a new window
    window.open(paymentUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <section id="shop" className="py-20 px-4 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12 text-gray-800 dark:text-white">Our Products</h2>
        
        <div className="flex justify-center gap-4 mb-8">
          {['all', 'courses', 'indicators', 'bundles'].map((type) => (
            <button
              key={type}
              onClick={() => setFilter(type)}
              className={`px-4 py-2 rounded-full ${
                filter === type 
                  ? 'bg-foreground text-background' 
                  : 'bg-gray-200 dark:bg-gray-700'
              }`}
            >
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </button>
          ))}
        </div>

        <div className={`grid grid-cols-1 gap-8 ${getFilteredProducts().length === 1 
          ? 'md:grid-cols-1 max-w-md mx-auto' 
          : getFilteredProducts().length === 2 
            ? 'md:grid-cols-2 max-w-3xl mx-auto' 
            : filter === 'all'
              ? 'md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
              : 'md:grid-cols-2 lg:grid-cols-3'
        }
        ${getFilteredProducts().length <= 3 ? 'place-items-center' : ''}`}>
          {getFilteredProducts().map((product) => {
            const isPopular = product.title === popularConfig.popularProduct;
            const isOnSale = product.title === popularConfig.onSaleProduct.title;
            const CardWrapper = isPopular ? PopularCard : 'div';
            
            return (
              <CardWrapper key={product.title} className="w-full relative">
                <div className={`bg-background rounded-lg shadow-lg p-6 flex flex-col h-full ${filter === 'courses' ? 'min-h-[320px]' : ''}`}>
                  <h3 className="text-lg font-bold mb-4 text-center">
                    {product.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4 flex-grow">
                    {product.shortDescription}
                  </p>
                  <div className="text-center mb-3">
                    {isOnSale ? (
                      <>
                        <span className="text-lg line-through text-red-500 dark:text-red-400 mb-1 block">
                          {getDisplayPrice(product)}
                        </span>
                        <span className="text-xl font-bold text-green-600 dark:text-green-400">
                          {getDisplayPrice(product, true)}
                        </span>
                      </>
                    ) : (
                      <span className="text-xl font-bold text-gray-800 dark:text-white">
                        {getDisplayPrice(product)}
                      </span>
                    )}
                  </div>
                  <button 
                    onClick={() => handleBuyNow(product)}
                    className="w-full bg-foreground text-background py-2 rounded-lg hover:opacity-90 hover:text-blue-400 transition-all"
                  >
                    Buy Now
                  </button>
                  <button 
                    onClick={() => setSelectedProduct(product)}
                    className="mt-4 text-sm flex items-center gap-1 text-gray-600 dark:text-gray-400 mx-auto hover:underline"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    More Info
                  </button>
                </div>
              </CardWrapper>
            );
          })}
        </div>
      </div>

      {selectedProduct && (
        <ProductModal 
          product={selectedProduct} 
          onClose={() => setSelectedProduct(null)}
          showGroupDiscount={selectedProduct.title === "StarLightTrader Pro"}
        />
      )}
    </section>
  );
};

export default Shop; 
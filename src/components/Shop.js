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
      shortDescription: "Learn W.D. Gann's methods and astronomical cycles for market analysis.",
      fullDescription: [
        "WD Gann Square of 9",
        "Gann Price Levels",
        "Astrological Turn Dates",
        "McWhirter and Benner Cycles",
        "Time and Price Relationships",
        "Includes 2 TradingView indicators (TPP, GMPL) and Excel Spreadsheets",
        "Course Delivery via Weekly Zoom Live Sessions (4 hrs per week)",
        "Discord Community for course duration for anytime Q&A and support",
      ],
      price: { INR: 30000 },
      type: "courses",
      videoUrl: "https://www.youtube.com/embed/abc123"
    },
    {
      title: "Vedic Financial Astrology",
      shortDescription: "Learn traditional Vedic astrology concepts applied to modern markets.",
      fullDescription: [
        "Basic Vedic Astrology Concepts",
        "Planetary Transits and Market Impact",
        "Planetary Aspects and Reversal Points",
        "Market Timing Techniques",
        "Access to 2 TradingView indicators (Planetary Sign Transits and Aspects)",
        "Case Studies and Examples",
        "Course Delivery via Weekly Zoom Live Sessions (4 hrs per week)",
        "Discord Community for course duration for anytime Q&A and support"
      ],
      price: { INR: 30000 },
      type: "courses",
      videoUrl: "https://www.youtube.com/embed/def456"
    }
  ],
  indicators: [
    {
      title: "TradingView Indicators",
      shortDescription: "Professional astrological indicators built using PineScript for TradingView platform.",
      fullDescription: [
        "Time and Price Projection (TPP)",
        "Gann Major Price Levels (GMPL)",
        "Planetary Sign Transits and Retrograde periods",
        "Planetary Aspects",
        "LifeTime access to indicator updates",
        "Technical Support"
      ],
      price: { INR: 35000 },
      type: "indicators",
      videoUrl: "https://www.youtube.com/embed/ghi789"
    }
  ],
  bundles: [
    {
      title: "StarLightTrader Pro",
      shortDescription: "Comprehensive package bundle combining Western & Vedic methodologies course content along with all our TradingView indicators.",
      fullDescription: [
        "All Western & Vedic FinAstro course content",
        "All 4 TradingView Indicators",        
        "BONUS - Trading Psychology & Risk Management Module",
        "Course Delivery via Weekly Zoom Live Sessions (4 hrs per week)",
        "Discord Community access and Trade Idea Service for 12 months",
      ],
      price: { INR: 60000 },
      type: "bundles",
      videoUrl: "https://www.youtube.com/embed/jkl012"
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

  return (
    <section id="shop" className="py-20 px-4 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12">Our Products</h2>
        
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
                <div className="bg-background rounded-lg shadow-lg p-6 flex flex-col h-full">
                  <h3 className="text-xl font-bold mb-4 text-center">
                    {product.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-6 flex-grow">
                    {product.shortDescription}
                  </p>
                  <div className="text-center mb-4">
                    {isOnSale ? (
                      <>
                        <span className="text-lg line-through text-red-500 mb-1 block">
                          {getDisplayPrice(product)}
                        </span>
                        <span className="text-xl font-bold text-green-600">
                          {getDisplayPrice(product, true)}
                        </span>
                      </>
                    ) : (
                      <span className="text-xl font-bold">
                        {getDisplayPrice(product)}
                      </span>
                    )}
                  </div>
                  <button className="w-full bg-foreground text-background py-2 rounded-lg hover:opacity-90 hover:text-blue-400 transition-all">
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
        />
      )}
    </section>
  );
};

export default Shop; 
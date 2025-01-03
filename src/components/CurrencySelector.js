'use client'
import { useState, useEffect } from 'react'
import { ChevronDown } from 'lucide-react'

const CURRENCIES = {
    USD: {
        symbol: '$',
        flag: '🇺🇸',
        label: 'USD ($)'
    },
    INR: {
        symbol: '₹',
        flag: '🇮🇳',
        label: 'INR (₹)'
    }
}

const CurrencySelector = ({ currency: propCurrency, setCurrency: setPropCurrency }) => {
    const [isOpen, setIsOpen] = useState(false)
    
    // Auto-detect currency based on user's location
    useEffect(() => {
        const detectCurrency = async () => {
            try {
                const response = await fetch('https://ipapi.co/json/');
                const data = await response.json();
                setPropCurrency(data.country === 'IN' ? 'INR' : 'USD');
            } catch (error) {
                console.error('Error detecting currency:', error);
                setPropCurrency('USD'); // Default to USD if detection fails
            }
        };

        detectCurrency();
    }, [setPropCurrency]);

    return (
        <div className="relative group">
            <button 
                className="flex items-center gap-2 px-3 py-2 text-sm font-medium hover:text-gray-300 transition-colors"
                onClick={() => setIsOpen(!isOpen)}
            >
                <span>{CURRENCIES[propCurrency].flag}</span>
                <span>{CURRENCIES[propCurrency].label}</span>
                <ChevronDown className="h-4 w-4" />
            </button>
            
            <div className={`${isOpen ? 'block' : 'hidden'} absolute right-0 mt-2 w-36 bg-background border border-foreground rounded-md shadow-lg`}>
                <div className="py-1">
                    {Object.entries(CURRENCIES).map(([code, { flag, label }]) => (
                        <button 
                            key={code}
                            onClick={() => {
                                setPropCurrency(code)
                                setIsOpen(false)
                            }}
                            className="flex items-center gap-2 w-full px-4 py-2 text-sm text-left hover:bg-gray-100 dark:hover:bg-gray-800"
                        >
                            <span>{flag}</span>
                            <span>{label}</span>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default CurrencySelector 
import { Building2 } from 'lucide-react';

const WhyUs = () => {
  const affiliateLinks = [
    { 
      name: "The5ers", 
      url: "http://www.the5ers.com/?afmc=nsy",
      logo: "https://the5ers.com/wp-content/uploads/2020/02/SSSS.png",
      description: "AAA rated proprietary trading firm offering beginner friendly challanges for trading forex and commodities"
    },
    { 
      name: "TradeThePool", 
      url: "http://www.tradethepool.com/?afmc=24x",
      logo: "https://lirp.cdn-website.com/b69e2f40/dms3rep/multi/opt/trade-the-pool-logo-640w.jpg",
      description: "Proprietary trading firm best for swing and position trading stocks listed in NYSE and NASDAQ"
    },
    { 
      name: "QuantCopier", 
      url: "http://www.quanttradertools.com", 
      description: "Our in-house trade copier built for both Discord and Telegram",
      logo: "/QuantCopierLogo.png"
    }
  ];

  return (
    <>
      <section id="why-us" className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">About Us</h2>
          
          <div className="space-y-8">
            <p className="text-lg">
              We have all been through dozens of trading courses which teaches various forms of technical 
              and fundamental analysis, but still there seems to something missing in the analysis of a 
              retail investor or trader. This is because all technical analysis is simply a function of <i style={{ fontFamily: 'Times New Roman' , fontWeight: 'bold'}}>f (price, volume) </i> 
              and no technical analysis indicator actually considers <i style={{ fontFamily: 'Times New Roman', fontWeight: 'bold' }}>time</i> as a factor in their analysis. Financial Astrology exclusively 
              deals with this all powerful <i style={{ fontFamily: 'Times New Roman' , fontWeight: 'bold'}}>time</i> component (signified by the motion of the celestial bodies in our solar system) 
              enabling an all inclusive analysis of <br></br>
              <i style={{ fontFamily: 'Times New Roman' , fontWeight: 'bold' }}> f (time, price, volume)</i>
            </p>

            <p className="text-lg">
              <b>StarLightTraders</b> is a community that brings together like-minded people who want to trade and profit from the markets in a peaceful manner. 
              The founding members of the community are also data scientists by profession and stock market investors and traders by passion. 
              Our collective experience exceeds several 1000 hrs in trading and analyzing the financial markets, and studying various courses in technical analysis and financial astrology. 
              We are inspired to teach the knowledge gathered by us, as well as share what worked and did not work for us.
              We continuously strive to improve our offerings and tools, by performing data-driven finastro analysis on financial markets and building software tools that make trading easier for our members.
            </p>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Our Affiliates</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center">
            {affiliateLinks.map((link) => (
              <a
                key={link.name}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full max-w-sm bg-background/50 backdrop-blur-sm border border-gray-200 dark:border-gray-700 rounded-xl p-6 hover:bg-background/70 transition-all duration-300 group"
              >
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className="w-24 h-24 flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                    {link.logo ? (
                      <img 
                        src={link.logo} 
                        alt={`${link.name} logo`}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Building2 className="w-12 h-12 text-gray-400" />
                    )}
                  </div>
                  
                  <div>
                    <h3 className="text-xl font-semibold mb-2">{link.name}</h3>
                    {link.description && (
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {link.description}
                      </p>
                    )}
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default WhyUs; 
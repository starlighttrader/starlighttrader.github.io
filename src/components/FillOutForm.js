import { useEffect } from 'react';

const FillOutForm = () => {
  useEffect(() => {
    // Load the Fillout script
    const script = document.createElement('script');
    script.src = 'https://server.fillout.com/embed/v1/';
    script.async = true;
    document.body.appendChild(script);

    // Cleanup on unmount
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <section id="contact" className="py-20 px-4 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12">Contact Us</h2>
        
        <div 
          data-fillout-id="xBedCxkJwYus"
          data-fillout-embed-type="standard"
          data-fillout-inherit-parameters
          data-fillout-dynamic-resize
          style={{ width: '100%', height: '500px' }}
        />
      </div>
    </section>
  );
};

export default FillOutForm; 
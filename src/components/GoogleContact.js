const GoogleContact = () => {
  return (
    <section id="contact" className="py-20 px-4 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12">Contact Us</h2>
        
        <iframe
          src="https://docs.google.com/forms/d/e/1FAIpQLSeUYiBrCNIZ-ll23lq5YLmhdIZV_mTwKPefAsl9H1CP4jKh4Q/viewform?embedded=true"
          width="100%"
          height="1146"
          className="w-full"
        >
          Loading...
        </iframe>
      </div>
    </section>
  );
};

export default GoogleContact; 
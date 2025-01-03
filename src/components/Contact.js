import { useState } from 'react';

const Contact = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    whatsapp: '',
    enquiryType: '',
    message: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Here you would typically handle the form submission
    // For Google Forms, you'll need to replace this with your form submission URL
    // Example Google Forms submission URL format:
    // https://docs.google.com/forms/d/e/YOUR_FORM_ID/formResponse
    
    try {
      const formUrl = 'YOUR_GOOGLE_FORM_URL';
      const formBody = new URLSearchParams({
        'entry.123': formData.firstName,  // Replace entry.123 with your actual form field IDs
        'entry.456': formData.lastName,
        'entry.789': formData.email,
        // ... add other fields
      });

      const response = await fetch(formUrl, {
        method: 'POST',
        body: formBody,
        mode: 'no-cors',
      });

      // Clear form after submission
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        whatsapp: '',
        enquiryType: '',
        message: ''
      });

      alert('Thank you for your message. We will get back to you soon!');
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('There was an error submitting the form. Please try again.');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <section id="contact" className="py-20 px-4 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12">Contact Us</h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="firstName" className="block mb-2">First Name</label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 rounded-lg border bg-background"
              />
            </div>
            
            <div>
              <label htmlFor="lastName" className="block mb-2">Last Name</label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 rounded-lg border bg-background"
              />
            </div>
          </div>

          <div>
            <label htmlFor="email" className="block mb-2">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 rounded-lg border bg-background"
            />
          </div>

          <div>
            <label htmlFor="whatsapp" className="block mb-2">WhatsApp Number</label>
            <input
              type="tel"
              id="whatsapp"
              name="whatsapp"
              value={formData.whatsapp}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg border bg-background"
            />
          </div>

          <div>
            <label htmlFor="enquiryType" className="block mb-2">Enquiry About</label>
            <select
              id="enquiryType"
              name="enquiryType"
              value={formData.enquiryType}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 rounded-lg border bg-background"
            >
              <option value="">Select an option</option>
              <option value="courses">Courses</option>
              <option value="indicators">Indicators</option>
              <option value="bundle">Complete Bundle</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div>
            <label htmlFor="message" className="block mb-2">Message</label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              required
              minLength={100}
              maxLength={5000}
              rows={6}
              className="w-full px-4 py-2 rounded-lg border bg-background"
              placeholder="Minimum 100 words"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-foreground text-background py-3 rounded-lg hover:opacity-90 transition-opacity"
          >
            Send Message
          </button>
        </form>
      </div>
    </section>
  );
};

export default Contact; 
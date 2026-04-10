"use client";

import { useState } from 'react';

export default function FeedbackForm() {
  const [rating, setRating] = useState(0);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    
    try {
      setSubmitted(true);
      setTimeout(() => setSubmitted(false), 3000);
    } catch (error) {
      console.error('Error submitting feedback:', error);
    }
  };

  if (submitted) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">Thank You!</h3>
        <p className="text-gray-600">Your feedback has been submitted successfully.</p>
      </div>
    );
  }

  return (
    <div>
      <iframe 
        src="https://docs.google.com/forms/d/e/1FAIpQLSeQCFeJ0eFvcmw34b7mi2TRiRe2jih5tr-MdOilQj1LPKHzdQ/viewform?embedded=true"
        className="w-full h-[500px] border-0 rounded-lg"
        title="Fortitude IoT Feedback Form"
      >
        Loading…
      </iframe>

      <div className="mt-8 text-center">
        <p className="text-sm text-gray-500">
          Having trouble with the form? Email us at{" "}
          <a href="mailto:info@fortitudeiot.com" className="text-accent hover:underline">
            info@fortitudeiot.com
          </a>
        </p>
      </div>
    </div>
  );
}
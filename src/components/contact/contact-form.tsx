"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import axiosCustomer from "@/utils/fetch-function-no-auth"
import { AxiosError } from "axios"

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    subject: "",
    message: "",
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [phoneError, setPhoneError] = useState<string | null>(null)

  const validatePhoneNumber = (phone: string): string | null => {
    const digitsOnly = phone.replace(/\D/g, '')
    
    if (digitsOnly.length === 0) return null
    
    if (digitsOnly.length !== 11) {
      return "Phone number must be exactly 11 digits"
    }
    
    return null
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))

    if (name === "phoneNumber") {
      const error = validatePhoneNumber(value)
      setPhoneError(error)
    }

    if (error) setError(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const phoneValidationError = validatePhoneNumber(formData.phoneNumber)
    if (phoneValidationError) {
      setPhoneError(phoneValidationError)
      return
    }
    
    setIsSubmitting(true)
    setError(null)
    
    try {
      const requestBody = {
        fullName: formData.name,
        email: formData.email,
        phoneNumber: formData.phoneNumber.replace(/\D/g, ''),
        subject: formData.subject,
        message: formData.message,
        entityCode: process.env.NEXT_PUBLIC_ENTITYCODE || "FTD"
      }

      // console.log("Sending contact form data:", requestBody)

      const response = await axiosCustomer.post(
        "/customer-info/send-contactus-mail",
        requestBody,
        {
          headers: {
            "Content-Type": "application/json",
          }
        }
      )

      // console.log("API response:", response.data)

      setSubmitSuccess(true)
      setFormData({
        name: "",
        email: "",
        phoneNumber: "",
        subject: "",
        message: "",
      })
      setPhoneError(null)
      
    } catch (err) {
      console.error("Error submitting contact form:", err)
      
      if (err instanceof AxiosError) {
        if (err.response) {
          setError(err.response.data?.message || `Error: ${err.response.status} - ${err.response.statusText}`)
        } else if (err.request) {
          setError("Network error: Unable to connect to the server. Please check your connection and try again.")
        } else {
          setError("An unexpected error occurred. Please try again.")
        }
      } else {
        setError("An unexpected error occurred. Please try again.")
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-8 border border-gray-100">
      <h2 className="text-2xl font-bold mb-6">Send Us a Message</h2>
      
      {submitSuccess ? (
        <div className="text-center py-8 bg-accent/20 rounded-xl p-8 shadow-md border border-gray-100 mt-24">
          <h3 className="text-xl font-bold mb-2">Thank You!</h3>
          <p>Your message has been sent successfully.</p>
          <p>We'll get back to you soon.</p>
          <div className="mt-10">
            <Button 
              onClick={() => setSubmitSuccess(false)}
              className="bg-accent text-white hover:bg-accent/90"
            >
              Send another message
            </Button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
              <p className="text-sm">{error}</p>
            </div>
          )}
          
          <div className="grid grid-cols-1 gap-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium mb-1">
                Name *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent bg-white"
                placeholder="Your Name"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-1">
                Email *
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent bg-white"
                placeholder="your@email.com"
              />
            </div>
          </div>

          <div>
            <label htmlFor="phoneNumber" className="block text-sm font-medium mb-1">
              Phone Number
            </label>
            <input
              type="tel"
              id="phoneNumber"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              className={`w-full px-4 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-accent bg-white ${
                phoneError ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="your mobile number"
              pattern="[0-9]{11}"
              title="Please enter exactly 11 digits"
            />
            {phoneError && (
              <p className="text-red-500 text-sm mt-1">{phoneError}</p>
            )}
          </div>

          <div>
            <label htmlFor="subject" className="block text-sm font-medium mb-1">
              Subject *
            </label>
            <select
              id="subject"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent bg-white appearance-none"
            >
              <option value="">Select a Subject</option>
              <option value="General Inquiry">General Inquiry</option>
              <option value="Technical Support">Technical Support</option>
              <option value="Billing Question">Billing Question</option>
              <option value="Partnership">Partnership Opportunity</option>
              <option value="Seller Account">Seller Account Inquiry</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div>
            <label htmlFor="message" className="block text-sm font-medium mb-1">
              Message *
            </label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              required
              rows={5}
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent bg-white"
              placeholder="How can we help you?"
            ></textarea>
          </div>

          <Button 
            type="submit" 
            className="w-full bg-accent hover:bg-accent/90 text-white py-3 font-bold transition-colors duration-200"
            disabled={isSubmitting || !!phoneError}
          >
            {isSubmitting ? 'Sending...' : 'Send Message'}
          </Button>
        </form>
      )}
    </div>
  )
}
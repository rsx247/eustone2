"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Mail, MapPin, Phone } from "lucide-react";
import { useState } from "react";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, handle form submission here
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-stone-50 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="grid md:grid-cols-2">
            
            {/* Contact Info */}
            <div className="bg-stone-900 text-white p-12 flex flex-col justify-between">
              <div>
                <h1 className="text-4xl font-bold mb-6">Get in Touch</h1>
                <p className="text-stone-300 mb-12 text-lg">
                  Have a question about a product, or need a custom quote for a large project? 
                  Our team of stone experts is here to help.
                </p>
                
                <div className="space-y-8">
                  <div className="flex items-start space-x-4">
                    <MapPin className="w-6 h-6 text-stone-400 mt-1" />
                    <div>
                      <h3 className="font-semibold text-lg">Visit Us</h3>
                      <p className="text-stone-400">Schiedamsedijk 106a<br />3134 KK Vlaardingen, Netherlands</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4">
                    <Mail className="w-6 h-6 text-stone-400 mt-1" />
                    <div>
                      <h3 className="font-semibold text-lg">Email Us</h3>
                      <a href="mailto:contact@eustone.com" className="text-stone-400 hover:text-white transition-colors block">contact@eustone.com</a>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <Phone className="w-6 h-6 text-stone-400 mt-1" />
                    <div>
                      <h3 className="font-semibold text-lg">Call Us</h3>
                      <a href="tel:+31103071990" className="text-stone-400 hover:text-white transition-colors block">+31 10 307 1990</a>
                      <p className="text-stone-500 text-sm mt-1">Mon-Fri, 9am - 6pm CET</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-12 pt-12 border-t border-stone-800">
                <p className="text-stone-500 text-sm">
                  © {new Date().getFullYear()} EU Stone. All rights reserved.
                </p>
              </div>
            </div>

            {/* Contact Form */}
            <div className="p-12 bg-white">
              {submitted ? (
                <div className="h-full flex flex-col items-center justify-center text-center">
                  <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6">
                    <span className="text-3xl">✓</span>
                  </div>
                  <h2 className="text-2xl font-bold text-stone-900 mb-2">Message Sent!</h2>
                  <p className="text-stone-500">
                    Thank you for contacting us. We'll get back to you shortly.
                  </p>
                  <Button 
                    variant="outline" 
                    className="mt-8"
                    onClick={() => setSubmitted(false)}
                  >
                    Send Another Message
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <Input id="firstName" placeholder="John" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input id="lastName" placeholder="Doe" required />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input id="email" type="email" placeholder="john@company.com" required />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="subject">Subject</Label>
                    <Input id="subject" placeholder="Project inquiry..." required />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">Message</Label>
                    <Textarea 
                      id="message" 
                      placeholder="Tell us about your project requirements..." 
                      className="min-h-[150px]"
                      required 
                    />
                  </div>

                  <Button type="submit" className="w-full py-6 text-lg">
                    Send Message
                  </Button>
                </form>
              )}
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}




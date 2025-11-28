"use client";

import Link from "next/link";
import { Facebook, Instagram, Linkedin, Twitter, Send, Mail, Phone, MapPin, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useState } from "react";

export function SiteFooter() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState("");

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');

    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });

      const data = await res.json();

      if (res.ok) {
        setStatus('success');
        setMessage(data.message || "Subscribed successfully!");
        setEmail("");
      } else {
        setStatus('error');
        setMessage(data.error || "Failed to subscribe");
      }
    } catch (error) {
      setStatus('error');
      setMessage("Something went wrong. Please try again.");
    }
  };

  return (
    <footer className="bg-stone-900 text-stone-50 border-t border-stone-800">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-12">
          {/* Brand Column */}
          <div className="col-span-1 md:col-span-2 space-y-4">
            <h3 className="text-2xl font-bold tracking-tighter text-white">EU STONE</h3>
            <p className="text-stone-400 max-w-sm text-sm leading-relaxed">
              Premium wholesale natural stone and tile marketplace for trade professionals. 
              Direct from quarry to project.
            </p>
            <div className="flex flex-col space-y-2 pt-2">
              <div className="flex items-center space-x-2 text-stone-400 text-sm">
                <MapPin className="h-4 w-4" />
                <span>Schiedamsedijk 106a - 3134 KK Vlaardingen, Netherlands</span>
              </div>
              <div className="flex items-center space-x-2 text-stone-400 text-sm">
                <Phone className="h-4 w-4" />
                <a href="tel:+31103071990" className="hover:text-white transition-colors">
                  +31 10 307 1990
                </a>
              </div>
              <div className="flex items-center space-x-2 text-stone-400 text-sm">
                <Mail className="h-4 w-4" />
                <a href="mailto:contact@eustone.com" className="hover:text-white transition-colors">
                  contact@eustone.com
                </a>
              </div>
              <div className="flex items-center space-x-2 text-stone-400 text-sm pt-1">
                <Link href="https://eustone.nl" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                  www.eustone.nl
                </Link>
              </div>
            </div>
            <div className="flex space-x-4 pt-4">
              <Link 
                href="https://www.facebook.com/eustone" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-stone-400 hover:text-white transition-colors p-2 hover:bg-stone-800 rounded-full"
              >
                <Facebook className="h-5 w-5" />
                <span className="sr-only">Facebook</span>
              </Link>
              <Link 
                href="https://www.instagram.com/eustone" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-stone-400 hover:text-white transition-colors p-2 hover:bg-stone-800 rounded-full"
              >
                <Instagram className="h-5 w-5" />
                <span className="sr-only">Instagram</span>
              </Link>
              <Link 
                href="https://www.linkedin.com/company/eustone" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-stone-400 hover:text-white transition-colors p-2 hover:bg-stone-800 rounded-full"
              >
                <Linkedin className="h-5 w-5" />
                <span className="sr-only">LinkedIn</span>
              </Link>
            </div>
          </div>

          {/* Links Column */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white">Company</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="text-stone-400 hover:text-white transition-colors text-sm">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/showroom" className="text-stone-400 hover:text-white transition-colors text-sm">
                  Showroom
                </Link>
              </li>
              <li>
                <Link href="/trade/register" className="text-stone-400 hover:text-white transition-colors text-sm">
                  Trade Account
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-stone-400 hover:text-white transition-colors text-sm">
                  Contact Support
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter Column */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white">Newsletter</h4>
            <p className="text-sm text-stone-400">
              Subscribe for latest arrivals, trade offers and industry news.
            </p>
            <div className="flex flex-col space-y-2">
              {status === 'success' ? (
                <div className="p-4 bg-green-900/20 border border-green-900 rounded text-green-400 text-sm">
                  {message}
                </div>
              ) : (
                <form className="flex flex-col space-y-2" onSubmit={handleSubscribe}>
                  <div className="relative">
                    <Input 
                      type="email" 
                      placeholder="Email address" 
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={status === 'loading'}
                      className="bg-stone-800 border-stone-700 text-white placeholder:text-stone-500 focus-visible:ring-stone-600 pr-10"
                    />
                    <Button 
                      type="submit" 
                      size="icon" 
                      variant="ghost" 
                      disabled={status === 'loading'}
                      className="absolute right-0 top-0 h-full text-stone-400 hover:text-white hover:bg-transparent"
                    >
                      {status === 'loading' ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Send className="h-4 w-4" />
                      )}
                      <span className="sr-only">Subscribe</span>
                    </Button>
                  </div>
                  {status === 'error' && (
                    <p className="text-xs text-red-400">{message}</p>
                  )}
                </form>
              )}
              <p className="text-xs text-stone-500">
                By subscribing you agree to our Privacy Policy.
              </p>
            </div>
          </div>
        </div>

        <Separator className="my-8 md:my-10 bg-stone-800" />

        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-stone-500 text-center md:text-left">
            © {new Date().getFullYear()} EU Stone. All rights reserved.
          </p>
          <div className="flex space-x-6 text-sm text-stone-500">
            <Link href="/privacy" className="hover:text-white transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-white transition-colors">
              Terms & Conditions
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}


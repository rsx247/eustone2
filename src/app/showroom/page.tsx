import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { MapPin, Clock, Calendar } from "lucide-react";

export default function ShowroomPage() {
  return (
    <div className="min-h-screen bg-stone-50">
      {/* Hero */}
      <div className="relative h-[50vh] bg-stone-900 flex items-center justify-center overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&q=80&w=2000"
          alt="Stone Showroom"
          fill
          className="object-cover opacity-60"
        />
        <div className="relative z-10 text-center text-white p-4">
          <h1 className="text-5xl font-bold mb-4">Visit Our Showroom</h1>
          <p className="text-xl max-w-2xl mx-auto text-stone-200">
            Experience the texture and beauty of our natural stone collection in person.
          </p>
        </div>
      </div>

      {/* Info Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 gap-12">
          
          <div className="space-y-8">
            <div className="bg-white p-8 rounded-xl shadow-sm border border-stone-100">
              <div className="flex items-start gap-4">
                <div className="bg-stone-100 p-3 rounded-full">
                  <MapPin className="w-6 h-6 text-stone-900" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-stone-900 mb-2">Location</h3>
                  <p className="text-stone-600">
                    EU Stone Showroom<br />
                    123 Stone Avenue<br />
                    Design District, London, UK
                  </p>
                  <Button variant="link" className="px-0 text-blue-600 mt-2">
                    Get Directions →
                  </Button>
                </div>
              </div>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-sm border border-stone-100">
              <div className="flex items-start gap-4">
                <div className="bg-stone-100 p-3 rounded-full">
                  <Clock className="w-6 h-6 text-stone-900" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-stone-900 mb-2">Opening Hours</h3>
                  <div className="space-y-1 text-stone-600">
                    <div className="flex justify-between w-48">
                      <span>Mon - Fri:</span>
                      <span>9:00 - 18:00</span>
                    </div>
                    <div className="flex justify-between w-48">
                      <span>Saturday:</span>
                      <span>10:00 - 16:00</span>
                    </div>
                    <div className="flex justify-between w-48">
                      <span>Sunday:</span>
                      <span>Closed</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-stone-900 text-white p-10 rounded-xl flex flex-col justify-center">
            <Calendar className="w-12 h-12 mb-6 text-stone-400" />
            <h2 className="text-3xl font-bold mb-4">Book an Appointment</h2>
            <p className="text-stone-300 mb-8 text-lg">
              Our experts are available for dedicated consultations to help you select the perfect materials for your project.
            </p>
            <Button size="lg" className="w-full bg-white text-stone-900 hover:bg-stone-200" asChild>
              <Link href="/contact">Contact to Book</Link>
            </Button>
          </div>

        </div>
      </div>

      {/* Gallery Grid */}
      <div className="container mx-auto px-4 pb-20">
        <h2 className="text-3xl font-bold text-stone-900 mb-8">Inside the Showroom</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 h-[600px]">
          <div className="relative rounded-lg overflow-hidden md:col-span-2 md:row-span-2">
            <Image
              src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&q=80&w=1000"
              alt="Showroom Interior"
              fill
              className="object-cover hover:scale-105 transition-transform duration-700"
            />
          </div>
          <div className="relative rounded-lg overflow-hidden">
            <Image
              src="https://images.unsplash.com/photo-1600607687644-c7171b42498f?auto=format&fit=crop&q=80&w=600"
              alt="Stone Sample Display"
              fill
              className="object-cover hover:scale-105 transition-transform duration-700"
            />
          </div>
          <div className="relative rounded-lg overflow-hidden">
            <Image
              src="https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&q=80&w=600"
              alt="Marble Texture"
              fill
              className="object-cover hover:scale-105 transition-transform duration-700"
            />
          </div>
        </div>
      </div>
    </div>
  )
}




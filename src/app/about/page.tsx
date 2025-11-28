import Image from "next/image";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="relative h-[400px] bg-stone-900 flex items-center justify-center">
        <div className="absolute inset-0 bg-black/40 z-10" />
        <Image
          src="https://images.unsplash.com/photo-1600607686527-6fb886090705?auto=format&fit=crop&q=80&w=2000"
          alt="Stone Quarry"
          fill
          className="object-cover opacity-50"
        />
        <div className="relative z-20 text-center text-white px-4">
          <h1 className="text-5xl font-bold mb-4 tracking-tight">Our Story</h1>
          <p className="text-xl max-w-2xl mx-auto text-stone-200">
            Connecting the world's finest quarries directly to trade professionals.
          </p>
        </div>
      </div>

      {/* Mission Section */}
      <div className="container mx-auto px-4 py-20">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold text-stone-900 mb-6">Bridging the Gap</h2>
            <p className="text-stone-600 mb-4 leading-relaxed">
              EU Stone was founded with a simple mission: to eliminate the inefficiencies in the natural stone supply chain. 
              For too long, architects, developers, and contractors have had to navigate a complex web of middlemen, 
              resulting in inflated prices and uncertain lead times.
            </p>
            <p className="text-stone-600 leading-relaxed">
              We partner directly with premium quarries across Europe and beyond, ensuring that you get the highest 
              quality materials at wholesale prices. Our digital platform brings transparency to an opaque industry, 
              allowing you to source, quote, and order with confidence.
            </p>
          </div>
          <div className="relative h-[400px] rounded-lg overflow-hidden shadow-xl">
             <Image
              src="https://images.unsplash.com/photo-1618221639263-3807b48f501b?auto=format&fit=crop&q=80&w=1000"
              alt="Marble Slab"
              fill
              className="object-cover"
            />
          </div>
        </div>
      </div>

      {/* Values Section */}
      <div className="bg-stone-50 py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-stone-900">Our Core Values</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-lg shadow-sm text-center">
              <div className="w-12 h-12 bg-stone-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl">💎</span>
              </div>
              <h3 className="text-xl font-bold text-stone-900 mb-3">Quality First</h3>
              <p className="text-stone-600">
                We strictly vet every quarry and supplier to ensure that only the finest materials make it to our marketplace.
              </p>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-sm text-center">
              <div className="w-12 h-12 bg-stone-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl">🤝</span>
              </div>
              <h3 className="text-xl font-bold text-stone-900 mb-3">Transparency</h3>
              <p className="text-stone-600">
                No hidden fees, no mysterious markups. We believe in honest pricing and clear communication at every step.
              </p>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-sm text-center">
              <div className="w-12 h-12 bg-stone-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl">🌍</span>
              </div>
              <h3 className="text-xl font-bold text-stone-900 mb-3">Sustainability</h3>
              <p className="text-stone-600">
                We prioritize suppliers who adhere to responsible mining practices and ethical labor standards.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}




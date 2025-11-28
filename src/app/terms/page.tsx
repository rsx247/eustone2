import { Separator } from "@/components/ui/separator"

export default function TermsOfService() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl">
      <h1 className="text-4xl font-bold mb-6 text-stone-900">Terms of Service</h1>
      <p className="text-stone-500 mb-8">Last updated: {new Date().toLocaleDateString()}</p>
      
      <div className="prose prose-stone max-w-none space-y-8">
        <section>
          <h2 className="text-2xl font-semibold mb-4">1. Agreement to Terms</h2>
          <p>
            These Terms of Service constitute a legally binding agreement made between you, whether personally or on behalf of an entity ("you") and EU Stone ("we", "us", or "our"), concerning your access to and use of the EU Stone website as well as any other media form, media channel, mobile website or mobile application related, linked, or otherwise connected thereto (collectively, the "Site").
          </p>
        </section>

        <Separator />

        <section>
          <h2 className="text-2xl font-semibold mb-4">2. Intellectual Property Rights</h2>
          <p>
            Unless otherwise indicated, the Site is our proprietary property and all source code, databases, functionality, software, website designs, audio, video, text, photographs, and graphics on the Site (collectively, the "Content") and the trademarks, service marks, and logos contained therein (the "Marks") are owned or controlled by us or licensed to us, and are protected by copyright and trademark laws.
          </p>
        </section>

        <Separator />

        <section>
          <h2 className="text-2xl font-semibold mb-4">3. User Representations</h2>
          <p>
            By using the Site, you represent and warrant that:
          </p>
          <ul className="list-disc pl-6 mt-4 space-y-2">
            <li>All registration information you submit will be true, accurate, current, and complete.</li>
            <li>You will maintain the accuracy of such information and promptly update such registration information as necessary.</li>
            <li>You have the legal capacity and you agree to comply with these Terms of Service.</li>
            <li>You are not a minor in the jurisdiction in which you reside.</li>
          </ul>
        </section>

        <Separator />

        <section>
          <h2 className="text-2xl font-semibold mb-4">4. Products</h2>
          <p>
            We make every effort to display as accurately as possible the colors, features, specifications, and details of the products available on the Site. However, we do not guarantee that the colors, features, specifications, and details of the products will be accurate, complete, reliable, current, or free of other errors, and your electronic display may not accurately reflect the actual colors and details of the products.
          </p>
        </section>

        <Separator />

        <section>
          <h2 className="text-2xl font-semibold mb-4">5. Contact Us</h2>
          <p>
            In order to resolve a complaint regarding the Site or to receive further information regarding use of the Site, please contact us at:
          </p>
          <div className="mt-4 bg-stone-50 p-4 rounded-lg">
            <p><strong>EU Stone</strong></p>
            <p>Schiedamsedijk 106a</p>
            <p>3134 KK Vlaardingen, Netherlands</p>
            <p>Phone: <a href="tel:+31103071990" className="text-blue-600 hover:underline">+31 10 307 1990</a></p>
            <p>Email: <a href="mailto:contact@eustone.com" className="text-blue-600 hover:underline">contact@eustone.com</a></p>
            <p>Website: <a href="https://eustone.nl" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">www.eustone.nl</a></p>
          </div>
        </section>
      </div>
    </div>
  )
}




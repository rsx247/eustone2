import { Separator } from "@/components/ui/separator"

export default function PrivacyPolicy() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl">
      <h1 className="text-4xl font-bold mb-6 text-stone-900">Privacy Policy</h1>
      <p className="text-stone-500 mb-8">Last updated: {new Date().toLocaleDateString()}</p>
      
      <div className="prose prose-stone max-w-none space-y-8">
        <section>
          <h2 className="text-2xl font-semibold mb-4">1. Introduction</h2>
          <p>
            EU Stone ("we", "our", or "us") respects your privacy and is committed to protecting your personal data. 
            This privacy policy will inform you as to how we look after your personal data when you visit our website 
            (regardless of where you visit it from) and tell you about your privacy rights and how the law protects you.
          </p>
        </section>

        <Separator />

        <section>
          <h2 className="text-2xl font-semibold mb-4">2. The Data We Collect</h2>
          <p>
            We may collect, use, store and transfer different kinds of personal data about you which we have grouped together follows:
          </p>
          <ul className="list-disc pl-6 mt-4 space-y-2">
            <li><strong>Identity Data</strong> includes first name, last name, username or similar identifier.</li>
            <li><strong>Contact Data</strong> includes billing address, delivery address, email address and telephone numbers.</li>
            <li><strong>Technical Data</strong> includes internet protocol (IP) address, your login data, browser type and version, time zone setting and location, browser plug-in types and versions, operating system and platform and other technology on the devices you use to access this website.</li>
            <li><strong>Usage Data</strong> includes information about how you use our website, products and services.</li>
          </ul>
        </section>

        <Separator />

        <section>
          <h2 className="text-2xl font-semibold mb-4">3. How We Use Your Data</h2>
          <p>
            We will only use your personal data when the law allows us to. Most commonly, we will use your personal data in the following circumstances:
          </p>
          <ul className="list-disc pl-6 mt-4 space-y-2">
            <li>Where we need to perform the contract we are about to enter into or have entered into with you.</li>
            <li>Where it is necessary for our legitimate interests (or those of a third party) and your interests and fundamental rights do not override those interests.</li>
            <li>Where we need to comply with a legal or regulatory obligation.</li>
          </ul>
        </section>

        <Separator />

        <section>
          <h2 className="text-2xl font-semibold mb-4">4. Contact Us</h2>
          <p>
            If you have any questions about this privacy policy or our privacy practices, please contact us at:
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




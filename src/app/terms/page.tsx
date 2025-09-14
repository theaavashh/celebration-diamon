"use client"

import React from "react"
import Link from "next/link"

const TermsOfService = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 py-6">
        <div className="container mx-auto px-4">
          <Link href="/" className="text-2xl font-serif font-bold text-gray-800">
            Celebration Diamond Studio
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="prose prose-lg max-w-none">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">Terms of Service</h1>

          {/* Background */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Background</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              These Terms of Sale, together with any and all other documents referred to herein, set out the terms under which Goods are sold by Us to consumers through this website, celebrationdiamondstudio.com (&ldquo;Our Site&rdquo;). Please read these Terms of Sale carefully and ensure that you understand them before ordering any Goods from Our Site. You will be required to read and accept these Terms of Sale when ordering Goods. If you do not agree to comply with and be bound by these Terms of Sale, you will not be able to order Goods through Our Site.
            </p>
          </section>

          {/* Definitions */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">1. Definitions and Interpretation</h2>
            <div className="space-y-4">
              <div>
                <strong className="text-gray-800">&ldquo;Contract&rdquo;</strong> means a contract for the purchase and sale of Goods, as explained in Clause 8;
              </div>
              <div>
                <strong className="text-gray-800">&ldquo;Goods&rdquo;</strong> means the jewelry and related products sold by Us through Our Site;
              </div>
              <div>
                <strong className="text-gray-800">&ldquo;Order&rdquo;</strong> means your order for Goods;
              </div>
              <div>
                <strong className="text-gray-800">&ldquo;Order Confirmation&rdquo;</strong> means our acceptance and confirmation of your Order;
              </div>
              <div>
                <strong className="text-gray-800">&ldquo;We/Us/Our&rdquo;</strong> means Celebration Diamond Studio with its registered office at [Your Address].
              </div>
            </div>
          </section>

          {/* Information About Us */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">2. Information About Us</h2>
            <p className="text-gray-700 leading-relaxed">
              Our Site, celebrationdiamondstudio.com, is owned and operated by Celebration Diamond Studio, specializing in fine jewelry, engagement rings, and diamond certification services.
            </p>
          </section>

          {/* Age Restrictions */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">3. Age Restrictions</h2>
            <p className="text-gray-700 leading-relaxed">
              Consumers may only purchase Goods through Our Site if they are at least 18 years of age. For engagement rings and high-value items, we may require additional verification.
            </p>
          </section>

          {/* Goods, Pricing and Availability */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">4. Goods, Pricing and Availability</h2>
            <div className="space-y-4">
              <p className="text-gray-700 leading-relaxed">
                We make all reasonable efforts to ensure that all descriptions and graphical representations of Goods available from Us correspond to the actual Goods. Please note, however, the following:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>Images of Goods are for illustrative purposes only. There may be slight variations in color between the image of a product and the actual product sold due to differences in computer displays and lighting conditions;</li>
                <li>Due to the nature of the Goods sold through Our Site, there may be variance in the size, capacity, dimensions, measurements, or weight, of those Goods between the actual Goods and the description.</li>
                <li>All diamonds are certified by recognized gemological laboratories and come with detailed certification reports.</li>
              </ul>
            </div>
          </section>

          {/* Payment and Pricing */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">5. Payment and Pricing</h2>
            <div className="space-y-4">
              <p className="text-gray-700 leading-relaxed">
                We make all reasonable efforts to ensure that all prices shown on Our Site are correct at the time of going online. We reserve the right to change prices and to add, alter, or remove special offers from time to time and as necessary.
              </p>
              <p className="text-gray-700 leading-relaxed">
                All prices are checked by Us before We accept your Order. In the unlikely event that We have shown incorrect pricing information, We will contact you in writing to inform you of the mistake.
              </p>
            </div>
          </section>

          {/* Delivery */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">6. Delivery</h2>
            <div className="space-y-4">
              <p className="text-gray-700 leading-relaxed">
                We offer secure delivery services for all our jewelry items. Delivery times may vary depending on the item and your location:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>Standard delivery: 3-5 business days</li>
                <li>Express delivery: 1-2 business days</li>
                <li>Custom orders: 2-4 weeks depending on complexity</li>
              </ul>
              <p className="text-gray-700 leading-relaxed">
                All items are shipped with full insurance and tracking. Signature confirmation is required for orders over $1,000.
              </p>
            </div>
          </section>

          {/* Returns and Refunds */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">7. Returns and Refunds</h2>
            <div className="space-y-4">
              <p className="text-gray-700 leading-relaxed">
                We offer a 30-day return policy for most items, subject to the following conditions:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>Items must be returned in their original condition and packaging</li>
                <li>Custom or engraved items cannot be returned</li>
                <li>Return shipping costs are the responsibility of the customer</li>
                <li>Refunds will be processed within 14 days of receiving the returned item</li>
              </ul>
            </div>
          </section>

          {/* Diamond Certification */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">8. Diamond Certification</h2>
            <div className="space-y-4">
              <p className="text-gray-700 leading-relaxed">
                All diamonds sold through Our Site are certified by recognized gemological laboratories including:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>International Gemological Institute (IGI)</li>
                <li>Gemological Institute of America (GIA)</li>
                <li>American Gem Society (AGS)</li>
              </ul>
              <p className="text-gray-700 leading-relaxed">
                Each diamond comes with a detailed certification report including the 4Cs (Cut, Color, Clarity, Carat Weight) and other relevant specifications.
              </p>
            </div>
          </section>

          {/* Privacy and Data Protection */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">9. Privacy and Data Protection</h2>
            <div className="space-y-4">
              <p className="text-gray-700 leading-relaxed">
                All personal information that We may collect (including, but not limited to, your name, address and telephone number) will be collected, used and held in accordance with our Privacy Policy.
              </p>
              <p className="text-gray-700 leading-relaxed">
                We may use your personal information to:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>Provide Our Goods and services to you</li>
                <li>Process your Order (including payment) for the Goods</li>
                <li>Inform you of new products and/or services available from Us</li>
              </ul>
            </div>
          </section>

          {/* Limitation of Liability */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">10. Limitation of Liability</h2>
            <p className="text-gray-700 leading-relaxed">
              We will be responsible for any foreseeable loss or damage that you may suffer as a result of Our breach of these Terms of Sale or as a result of Our negligence. We will not be responsible for any loss or damage that is not foreseeable.
            </p>
          </section>

          {/* Governing Law */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">11. Governing Law</h2>
            <p className="text-gray-700 leading-relaxed">
              These Terms of Sale, and the relationship between you and Us, shall be governed by and construed in accordance with the laws of [Your Jurisdiction]. Any disputes shall be subject to the jurisdiction of the courts of [Your Jurisdiction].
            </p>
          </section>

          {/* Contact Information */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">12. Contact Information</h2>
            <div className="space-y-2 text-gray-700">
              <p>For questions about these Terms of Service, please contact us:</p>
              <p>Email: support@celebrationdiamondstudio.com</p>
              <p>Phone: +1 (555) 123-4567</p>
              <p>Address: [Your Business Address]</p>
            </div>
          </section>

          {/* Last Updated */}
          <section className="mb-12">
            <p className="text-sm text-gray-500 italic">
              Last updated: January 2025
            </p>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-100 border-t border-gray-200 py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-gray-600 mb-4 md:mb-0">
              © 2025 Celebration Diamond Studio. All rights reserved.
            </div>
            <div className="flex space-x-6">
              <Link href="/privacy" className="text-gray-600 hover:text-gray-800">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-gray-600 hover:text-gray-800">
                Terms of Service
              </Link>
              <Link href="/contact" className="text-gray-600 hover:text-gray-800">
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default TermsOfService 
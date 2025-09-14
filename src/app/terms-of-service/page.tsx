"use client"

import React from "react"
import Link from "next/link"

const TermsOfServicePage = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
    

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12 max-w-4xl pt-24">
        <div className="prose prose-lg max-w-none">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">Terms & Conditions</h1>

          {/* Introduction */}
          <section className="mb-12">
            <p className="text-gray-700 leading-relaxed mb-4">
              Welcome to Celebration Diamonds, based in Kathmandu, Nepal. By accessing or using our website, you agree to comply with the following terms and conditions. These terms apply to all visitors, customers, and partners who interact with our services either online or in-store.
            </p>
          </section>

          {/* 1. Eligibility */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">1. Eligibility</h2>
            <p className="text-gray-700 leading-relaxed">
              You must be at least 18 years old or use the site under the supervision of a parent or legal guardian.
            </p>
          </section>

          {/* 2. Product Information */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">2. Product Information</h2>
            <p className="text-gray-700 leading-relaxed">
              We make every effort to display our products accurately. However, slight variations in gemstones and gemstone colour, metal finishes and metal, metal appearance, and design details may occur due to natural materials and craftsmanship.
            </p>
          </section>

          {/* 3. Pricing */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">3. Pricing</h2>
            <div className="space-y-4">
              <p className="text-gray-700 leading-relaxed">
                All prices listed are in Nepalese Rupees (NPR) and are inclusive of applicable local taxes unless stated otherwise.
              </p>
              <p className="text-gray-700 leading-relaxed">
                International pricing will be calculated as per the currency rates provided by authorised bank.
              </p>
              <p className="text-gray-700 leading-relaxed">
                Prices are subject to change without prior notice.
              </p>
            </div>
          </section>

          {/* 4. Orders & Payment */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">4. Orders & Payment</h2>
            <p className="text-gray-700 leading-relaxed">
              Orders are confirmed only after full or agreed partial payment. We accept online payment, mobile banking, cash, or card transactions via secure gateways.
            </p>
          </section>

          {/* 5. Custom Orders */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">5. Custom Orders</h2>
            <div className="space-y-4">
              <p className="text-gray-700 leading-relaxed">
                Customized jewelry is refundable as per our return and refund policies.
              </p>
              <p className="text-gray-700 leading-relaxed">
                Production begins only after design approval and agreed-upon advance payment.
              </p>
            </div>
          </section>

          {/* 6. Intellectual Property */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">6. Intellectual Property</h2>
            <p className="text-gray-700 leading-relaxed">
              All content on this website, including text, images, logos, and designs, is the property of Celebration Diamonds and may not be reproduced or republished without permission.
            </p>
          </section>

          {/* 7. Limitation of Liability */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">7. Limitation of Liability</h2>
            <p className="text-gray-700 leading-relaxed">
              We are not liable for any indirect or consequential damages arising from the use of our products or website.
            </p>
          </section>

          {/* 8. Governing Law */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">8. Governing Law</h2>
            <p className="text-gray-700 leading-relaxed">
              These terms are governed by the laws of Nepal and applicable international commerce practices.
            </p>
          </section>

          {/* Contact Information */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Contact Information</h2>
            <div className="space-y-2 text-gray-700">
              <p>For questions about these Terms & Conditions, please contact us:</p>
              <p>Email: support@celebrationdiamondstudio.com</p>
              <p>Phone: +977-9808080808</p>
              <p>Address: Baneshwor, Kathmandu, Nepal</p>
            </div>
          </section>

          {/* Last Updated */}
          <section className="mb-12">
            <p className="text-sm text-gray-500 italic">
              Last updated: August 2025
            </p>
          </section>
        </div>
      </main>

      
    </div>
  )
}

export default TermsOfServicePage
"use client"

import React, { useState } from "react"
import Link from "next/link"

const FAQPage = () => {
  const [activeCategory, setActiveCategory] = useState("orders-delivery")
  const [openItems, setOpenItems] = useState<{ [key: string]: boolean }>({})

  const toggleItem = (itemId: string) => {
    setOpenItems(prev => ({
      ...prev,
      [itemId]: !prev[itemId]
    }))
  }

  const faqData = {
    "orders-delivery": [
      {
        id: "shipping-countries",
        question: "Which countries do you ship to?",
        answer: `We currently ship to most countries worldwide including:

NORTH AMERICA:
United States, Canada, Mexico, and Caribbean nations

EUROPE:
United Kingdom, Ireland, France, Germany, Spain, Italy, Portugal, and most European countries

ASIA:
China, Japan, Korea, Singapore, Malaysia, Thailand, Vietnam, Indonesia, Philippines, India, and most Asian countries

AUSTRALIA & NEW ZEALAND:
Full coverage across both countries

If your country is not listed, please contact support@celebrationdiamondstudio.com before placing an order.`
      },
      {
        id: "shipping-cost",
        question: "How much does shipping cost?",
        answer: `Shipping fees vary based on weight, size, and destination. The exact cost will be calculated and displayed at checkout.

Standard shipping: $15-25 USD
Express shipping: $25-45 USD
Overnight shipping: $50-75 USD

All prices include insurance and tracking. For international deliveries, additional import duties, taxes, and customs processing fees may apply.`
      },
      {
        id: "delivery-time",
        question: "When can I expect my order to be delivered?",
        answer: `Estimated delivery times:

International orders: 5-7 business days
Domestic orders: 2-3 business days
Express delivery: 1-2 business days
Overnight delivery: Next business day

Important notes:
- Deliveries are made Monday–Friday between 8:00 a.m. and 6:00 p.m.
- A valid contact number is required to avoid delivery delays
- Signature confirmation is required for orders over $1,000
- Shipping times are estimates and may be longer during peak seasons`
      },
      {
        id: "track-order",
        question: "How can I track my order?",
        answer: "Once your order has shipped, you will receive a confirmation email with a tracking number and a link to track your shipment in real time. You can also track your order through your account dashboard."
      },
      {
        id: "duties-taxes",
        question: "Are product prices inclusive of duties and taxes?",
        answer: "No, product prices displayed on our website do not include duties and taxes. For international orders, local import duties and taxes may apply and are required to release your order from customs. These fees will be shown at checkout."
      },
      {
        id: "gift-wrapping",
        question: "Do you offer gift wrapping services?",
        answer: "Yes, we offer premium gift wrapping for all items. You can add this option at checkout for an additional $10 fee. Gift wrapping includes elegant packaging, ribbon, and a personalized message card."
      }
    ],
    "exchanges-returns": [
      {
        id: "return-policy",
        question: "What is your return policy?",
        answer: `Returns are accepted within 30 days of receiving your order.

Items must be:
- Unused and in original condition
- Unworn and with all original tags attached
- Include full packaging and documentation
- Not customized or engraved

Non-returnable items:
- Custom or engraved jewelry
- Items on final sale (marked as non-returnable)
- Items that fail to meet return conditions

Returns can be shipped via any carrier, but we recommend using a trackable service.`
      },
      {
        id: "return-process",
        question: "How do I return an item?",
        answer: `To return an item:

1. Contact our customer service team within 30 days of delivery
2. Provide your order number and reason for return
3. We'll send you a return authorization and shipping label
4. Package the item securely with all original packaging
5. Ship the item back to us
6. Once received and inspected, we'll process your refund within 14 days

For defective or damaged items, please include photos of the damage.`
      },
      {
        id: "exchanges",
        question: "Do you offer exchanges?",
        answer: "Yes, exchanges for a different size or style are accepted within the return period, subject to stock availability. To request an exchange, please contact customer service before returning the item. Exchange timeframes follow the same 30-day policy as returns."
      },
      {
        id: "refund-time",
        question: "How long does it take to receive a refund?",
        answer: "Refunds are processed within 14 days of receiving your returned item. The time it takes for the refund to appear in your account depends on your bank or credit card issuer, typically 3-5 business days."
      }
    ],
    "payment-methods": [
      {
        id: "accepted-payments",
        question: "What payment methods do you accept?",
        answer: `We accept the following payment methods:

Credit/Debit Cards:
- Visa
- MasterCard
- American Express
- Discover

Digital Wallets:
- PayPal
- Apple Pay
- Google Pay

Bank Transfers:
- Available for orders over $500 (upon request)

All payments are securely processed with encryption to protect your information.`
      },
      {
        id: "payment-security",
        question: "Is my payment information secure?",
        answer: "Yes, we prioritize your security. All payments are processed through secure gateways with SSL encryption to ensure your data is protected. We do not store your payment details on our servers. We use industry-standard security measures and are PCI DSS compliant."
      },
      {
        id: "international-fees",
        question: "Are there additional fees for international transactions?",
        answer: "Depending on your bank or card issuer, you may incur foreign transaction fees or currency conversion charges. These fees are typically 1-3% of the transaction amount. Please check with your financial institution for specific details about international transaction fees."
      },
      {
        id: "installment-payments",
        question: "Do you offer installment payment options?",
        answer: "Yes, we offer installment payment options through our financing partners. You can split your purchase into 3, 6, or 12 monthly payments with 0% APR for qualified customers. This option is available at checkout for orders over $500."
      }
    ],
    "membership": [
      {
        id: "earn-points",
        question: "How do I earn points with my membership?",
        answer: `You can earn points in the following ways:

Online purchases: Earn 1 point for every $1 spent
In-store purchases: Earn 1 point for every $1 spent
Referrals: Earn 100 points for each friend who makes a purchase
Birthday bonus: Earn 500 points on your birthday month
Social media engagement: Earn points for following and engaging with us

Points are credited to your account within 24 hours of purchase.`
      },
      {
        id: "membership-tiers",
        question: "What are the membership tiers and benefits?",
        answer: `| Tier | Qualification | Points Required | Key Benefits |
|------|---------------|-----------------|--------------|
| Bronze | New Member | 0 | 5% discount, free shipping |
| Silver | 1,000 points | 1,000 | 10% discount, priority support |
| Gold | 5,000 points | 5,000 | 15% discount, exclusive access |
| Platinum | 10,000 points | 10,000 | 20% discount, VIP events |

Each tier includes all benefits from lower tiers plus additional perks.`
      },
      {
        id: "redeem-points",
        question: "How do I redeem my membership points?",
        answer: "You can redeem points for discounts on future purchases. 100 points = $1 discount. Points can be redeemed at checkout by selecting the 'Use Points' option. You can also redeem points for exclusive products and experiences available only to members."
      },
      {
        id: "points-expiry",
        question: "Do points expire?",
        answer: "Points are valid for 24 months from the date they are earned. If you don't use your points within this period, they will expire. We'll send you reminders before your points expire so you don't lose them."
      },
      {
        id: "transfer-points",
        question: "Can I transfer points to another account?",
        answer: "No, membership points are non-transferable and can only be used by the account holder. However, you can use your points to purchase gifts for others."
      }
    ]
  }

  const categories = [
    { id: "orders-delivery", name: "Orders & Delivery" },
    { id: "exchanges-returns", name: "Exchanges & Returns" },
    { id: "payment-methods", name: "Payment Methods" },
    { id: "membership", name: "Membership" }
  ]

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
      <main className="container mx-auto px-4 py-12 max-w-6xl">
        {/* Page Title */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">FAQs</h1>
          <p className="text-gray-600 text-lg">Find answers to commonly asked questions</p>
        </div>

        {/* Category Navigation */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`px-6 py-3 rounded-full text-sm font-medium transition-colors duration-200 ${
                activeCategory === category.id
                  ? "bg-gray-900 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>

        {/* FAQ Content */}
        <div className="max-w-4xl mx-auto">
          {faqData[activeCategory as keyof typeof faqData]?.map((item) => (
            <div key={item.id} className="border-b border-gray-200 last:border-b-0">
              <button
                onClick={() => toggleItem(item.id)}
                className="w-full text-left py-6 px-4 hover:bg-gray-50 transition-colors duration-200"
              >
                <div className="flex justify-between items-start">
                  <h3 className="text-lg font-medium text-gray-900 pr-8">
                    {item.question}
                  </h3>
                  <span className="text-gray-400 text-xl font-light">
                    {openItems[item.id] ? "−" : "+"}
                  </span>
                </div>
              </button>
              {openItems[item.id] && (
                <div className="px-4 pb-6">
                  <div className="text-gray-700 leading-relaxed whitespace-pre-line">
                    {item.answer}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Contact Section */}
        <div className="mt-16 text-center bg-gray-50 rounded-lg p-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            Still have questions?
          </h2>
          <p className="text-gray-600 mb-6">
            Can&apos;t find what you&apos;re looking for? Our customer service team is here to help.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="mailto:support@celebrationdiamondstudio.com"
              className="inline-flex items-center px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors duration-200"
            >
              Email Us
            </a>
            <a
              href="tel:+15551234567"
              className="inline-flex items-center px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
            >
              Call Us
            </a>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-100 border-t border-gray-200 py-8 mt-16">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-gray-600 mb-4 md:mb-0">
              © 2025 Celebration Diamond Studio. All rights reserved.
            </div>
            <div className="flex space-x-6">
              <Link href="/privacy" className="text-gray-600 hover:text-gray-800">
                Privacy Policy
              </Link>
              <Link href="/terms-of-service" className="text-gray-600 hover:text-gray-800">
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

export default FAQPage 
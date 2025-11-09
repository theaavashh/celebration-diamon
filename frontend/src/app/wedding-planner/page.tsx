"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { FaArrowRight, FaCheckCircle, FaCalendarAlt, FaPhone, FaEnvelope } from "react-icons/fa";

interface WeddingPlannerData {
  id: string;
  title: string;
  description: string;
  ctaText: string;
  ctaLink: string | null;
  imageUrl: string | null;
  badgeText: string | null;
  badgeSubtext: string | null;
}

const WeddingPlannerPage = () => {
  const [weddingPlannerData, setWeddingPlannerData] = useState<WeddingPlannerData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchWeddingPlanner = async () => {
      try {
        const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000';
        const response = await fetch(`${API_BASE_URL}/api/wedding-planners`);
        if (response.ok) {
          const result = await response.json();
          if (result.data && result.data.length > 0) {
            setWeddingPlannerData(result.data[0]);
          }
        }
      } catch (error) {
        console.error('Error fetching wedding planner data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchWeddingPlanner();
  }, []);

  const jewelryStyles = [
    {
      id: 1,
      name: "Classic Elegance",
      description: "Timeless pieces featuring traditional designs with solitaire diamonds and simple, elegant settings. Perfect for the bride who appreciates understated sophistication.",
      features: ["Solitaire diamond rings", "Pearl necklaces", "Simple stud earrings", "Classic tennis bracelets"],
      image: "/classic-elegance.jpg",
      bestFor: "Traditional ceremonies, formal weddings"
    },
    {
      id: 2,
      name: "Modern Glamour",
      description: "Contemporary designs with bold statement pieces, geometric shapes, and unique settings. Ideal for the fashion-forward bride.",
      features: ["Geometric designs", "Statement necklaces", "Chandelier earrings", "Stackable rings"],
      image: "/modern-glamour.jpg",
      bestFor: "Modern venues, contemporary celebrations"
    },
    {
      id: 3,
      name: "Vintage Romance",
      description: "Inspired by bygone eras with intricate details, filigree work, and antique-inspired settings. Perfect for the romantic bride.",
      features: ["Art Deco designs", "Vintage-inspired settings", "Antique finishes", "Ornate details"],
      image: "/vintage-romance.jpg",
      bestFor: "Garden weddings, vintage themes"
    },
    {
      id: 4,
      name: "Cultural Heritage",
      description: "Traditional designs that honor cultural heritage with authentic craftsmanship and meaningful symbols. Celebrating your roots with elegance.",
      features: ["Cultural motifs", "Traditional patterns", "Heritage designs", "Custom engravings"],
      image: "/cultural-heritage.jpg",
      bestFor: "Cultural ceremonies, traditional weddings"
    },
    {
      id: 5,
      name: "Minimalist Chic",
      description: "Clean lines, simple designs, and focus on quality over quantity. Less is more for the minimalist bride.",
      features: ["Delicate pieces", "Thin bands", "Small diamonds", "Subtle elegance"],
      image: "/minimalist-chic.jpg",
      bestFor: "Intimate ceremonies, modern minimalism"
    },
    {
      id: 6,
      name: "Bridal Set Collection",
      description: "Coordinated sets including necklace, earrings, ring, and bracelet designed to work harmoniously together.",
      features: ["Matching sets", "Coordinated designs", "Complete bridal look", "Harmonious styling"],
      image: "/bridal-set.jpg",
      bestFor: "Complete bridal styling, coordinated looks"
    }
  ];

  const planningTimeline = [
    {
      month: "6-12 Months Before",
      tasks: [
        "Research jewelry styles and preferences",
        "Set a budget for wedding jewelry",
        "Schedule initial consultation",
        "Browse collections and gather inspiration"
      ]
    },
    {
      month: "4-6 Months Before",
      tasks: [
        "Finalize jewelry style selection",
        "Order custom pieces if needed",
        "Try on different pieces",
        "Confirm delivery timeline"
      ]
    },
    {
      month: "2-3 Months Before",
      tasks: [
        "Final fittings and adjustments",
        "Complete payment",
        "Schedule cleaning and maintenance",
        "Plan jewelry storage and security"
      ]
    },
    {
      month: "1 Month Before",
      tasks: [
        "Final inspection of all pieces",
        "Pick up or confirm delivery",
        "Practice wearing jewelry",
        "Prepare backup options if needed"
      ]
    },
    {
      month: "Week of Wedding",
      tasks: [
        "Final cleaning and polishing",
        "Pack jewelry securely",
        "Assign someone to help with jewelry",
        "Enjoy your special day!"
      ]
    }
  ];

  const stylingTips = [
    {
      title: "Match Your Dress",
      description: "Choose jewelry that complements your wedding dress style. A simple dress pairs well with statement pieces, while an ornate dress calls for more subtle jewelry.",
      icon: "👗"
    },
    {
      title: "Consider Your Neckline",
      description: "V-neck dresses work beautifully with pendants, while high necklines are perfect for statement earrings. Off-shoulder dresses pair well with chokers or short necklaces.",
      icon: "💎"
    },
    {
      title: "Balance is Key",
      description: "If you're wearing a statement necklace, opt for simpler earrings. Conversely, bold earrings work best with a delicate necklace or no necklace at all.",
      icon: "⚖️"
    },
    {
      title: "Think About Your Hairstyle",
      description: "Updos showcase earrings beautifully, while down hairstyles might call for a statement necklace. Consider how your hair will interact with your jewelry.",
      icon: "💇"
    },
    {
      title: "Comfort Matters",
      description: "You'll be wearing your jewelry for many hours. Ensure pieces are comfortable, secure, and won't snag on your dress or hair.",
      icon: "✨"
    },
    {
      title: "Photography Considerations",
      description: "Some jewelry photographs better than others. Consider how your pieces will look in photos, especially close-up shots of your hands and face.",
      icon: "📸"
    }
  ];

  const essentialPieces = [
    {
      name: "Engagement Ring",
      description: "The centerpiece of your bridal jewelry, often worn with a wedding band.",
      importance: "Essential"
    },
    {
      name: "Wedding Band",
      description: "Symbol of your commitment, worn alongside or instead of engagement ring.",
      importance: "Essential"
    },
    {
      name: "Earrings",
      description: "Frame your face and complement your hairstyle. Choose based on your dress neckline.",
      importance: "Highly Recommended"
    },
    {
      name: "Necklace",
      description: "Adds elegance and draws attention to your neckline. Can be statement or subtle.",
      importance: "Recommended"
    },
    {
      name: "Bracelet",
      description: "Adds sparkle to your wrist. Consider if your dress has sleeves or is sleeveless.",
      importance: "Optional"
    },
    {
      name: "Hair Accessories",
      description: "Tiaras, hairpins, or combs can add a regal touch to your bridal look.",
      importance: "Optional"
    }
  ];

  if (isLoading) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center bg-white">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="w-full bg-white">
      {/* Hero Section */}
      <section className="relative w-full h-[70vh] min-h-[600px] flex items-center justify-center overflow-hidden bg-gradient-to-br from-rose-50 via-white to-amber-50">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, #000 1px, transparent 0)`,
            backgroundSize: '40px 40px'
          }}></div>
        </div>
        <div className="relative z-10 text-center px-4 sm:px-6 md:px-8 max-w-5xl mx-auto">
          {weddingPlannerData?.badgeText && (
            <div className="inline-block mb-4 px-4 py-2 bg-rose-100 text-rose-800 rounded-full text-sm font-semibold">
              {weddingPlannerData.badgeText}
            </div>
          )}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 jimthompson mb-6 leading-tight">
            {weddingPlannerData?.title || "YOURS WEDDING JEWELRY PLANNER"}
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl text-gray-700 jimthompson max-w-3xl mx-auto mb-8">
            {weddingPlannerData?.description || "Plan your perfect bridal jewelry ensemble with expert guidance and timeless elegance"}
          </p>
          <Link
            href={weddingPlannerData?.ctaLink || "/appointments"}
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-rose-500 to-amber-500 text-white rounded-full font-semibold hover:from-rose-600 hover:to-amber-600 transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            {weddingPlannerData?.ctaText || "SCHEDULE CONSULTATION"}
            <FaArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Essential Pieces Section */}
      <section className="w-full py-16 sm:py-20 md:py-24 px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 jimthompson uppercase tracking-wide mb-4">
              Essential Bridal Jewelry Pieces
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Discover the key pieces that complete your bridal look
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {essentialPieces.map((piece, index) => (
              <div
                key={index}
                className="bg-gradient-to-br from-rose-50 to-amber-50 rounded-2xl p-6 hover:shadow-lg transition-shadow duration-300 border border-rose-100"
              >
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-xl font-bold text-gray-900 jimthompson">{piece.name}</h3>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    piece.importance === 'Essential' 
                      ? 'bg-rose-100 text-rose-800'
                      : piece.importance === 'Highly Recommended'
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {piece.importance}
                  </span>
                </div>
                <p className="text-gray-700 leading-relaxed">{piece.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Jewelry Styles Section */}
      <section className="w-full py-16 sm:py-20 md:py-24 px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 jimthompson uppercase tracking-wide mb-4">
              Wedding Jewelry Styles
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Explore different styles to find the perfect match for your wedding theme
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {jewelryStyles.map((style) => (
              <div
                key={style.id}
                className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300"
              >
                <div className="relative w-full h-64 bg-gradient-to-br from-rose-100 to-amber-100">
                  <Image
                    src={style.image}
                    alt={style.name}
                    fill
                    className="object-cover"
                    onError={(e) => {
                      e.currentTarget.src = '/model.jpeg';
                    }}
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-2xl font-bold text-gray-900 jimthompson mb-3">
                    {style.name}
                  </h3>
                  <p className="text-gray-700 mb-4 leading-relaxed">
                    {style.description}
                  </p>
                  <div className="mb-4">
                    <h4 className="text-sm font-semibold text-gray-900 mb-2">Key Features:</h4>
                    <ul className="space-y-1">
                      {style.features.map((feature, idx) => (
                        <li key={idx} className="flex items-center text-sm text-gray-600">
                          <FaCheckCircle className="w-4 h-4 text-rose-500 mr-2 flex-shrink-0" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="pt-4 border-t border-gray-200">
                    <p className="text-sm text-gray-600">
                      <span className="font-semibold">Best for:</span> {style.bestFor}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Planning Timeline Section */}
      <section className="w-full py-16 sm:py-20 md:py-24 px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 jimthompson uppercase tracking-wide mb-4">
              Planning Timeline
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              A step-by-step guide to planning your wedding jewelry
            </p>
          </div>
          <div className="relative">
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-rose-400 to-amber-400 hidden md:block"></div>
            <div className="space-y-8">
              {planningTimeline.map((timeline, index) => (
                <div key={index} className="relative pl-8 md:pl-12">
                  <div className="absolute left-0 top-2 w-4 h-4 bg-rose-500 rounded-full border-4 border-white shadow-lg z-10"></div>
                  <div className="bg-gradient-to-br from-rose-50 to-amber-50 rounded-xl p-6 shadow-md">
                    <h3 className="text-xl font-bold text-gray-900 jimthompson mb-4">
                      {timeline.month}
                    </h3>
                    <ul className="space-y-2">
                      {timeline.tasks.map((task, taskIndex) => (
                        <li key={taskIndex} className="flex items-start text-gray-700">
                          <FaCheckCircle className="w-5 h-5 text-rose-500 mr-3 mt-0.5 flex-shrink-0" />
                          <span>{task}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Styling Tips Section */}
      <section className="w-full py-16 sm:py-20 md:py-24 px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 jimthompson uppercase tracking-wide mb-4">
              Expert Styling Tips
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Professional advice to help you create the perfect bridal look
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {stylingTips.map((tip, index) => (
              <div
                key={index}
                className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow duration-300"
              >
                <div className="text-4xl mb-4">{tip.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 jimthompson mb-3">
                  {tip.title}
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  {tip.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Consultation CTA Section */}
      <section className="w-full py-16 sm:py-20 md:py-24 px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 bg-gradient-to-br from-rose-500 to-amber-500">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white jimthompson mb-6">
            Ready to Plan Your Perfect Bridal Jewelry?
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Schedule a consultation with our expert jewelry consultants to create a personalized bridal jewelry plan tailored to your style and budget.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              href="/appointments"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white text-rose-600 rounded-full font-semibold hover:bg-gray-100 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              <FaCalendarAlt className="w-5 h-5" />
              Schedule Consultation
            </Link>
            <a
              href="tel:+977-1-XXXXXXX"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white/10 text-white border-2 border-white rounded-full font-semibold hover:bg-white/20 transition-all duration-300"
            >
              <FaPhone className="w-5 h-5" />
              Call Us Now
            </a>
            <a
              href="mailto:info@celebrationdiamond.com"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white/10 text-white border-2 border-white rounded-full font-semibold hover:bg-white/20 transition-all duration-300"
            >
              <FaEnvelope className="w-5 h-5" />
              Email Us
            </a>
          </div>
        </div>
      </section>

      {/* Additional Services Section */}
      <section className="w-full py-16 sm:py-20 md:py-24 px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 jimthompson uppercase tracking-wide mb-4">
              Additional Services
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              We offer comprehensive services to ensure your jewelry is perfect for your special day
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center p-6 bg-gray-50 rounded-xl">
              <div className="text-4xl mb-4">🔬</div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">In-House Lab</h3>
              <p className="text-gray-600 text-sm">Quality certification and verification</p>
            </div>
            <div className="text-center p-6 bg-gray-50 rounded-xl">
              <div className="text-4xl mb-4">✏️</div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Custom Design</h3>
              <p className="text-gray-600 text-sm">Personalized jewelry creation</p>
            </div>
            <div className="text-center p-6 bg-gray-50 rounded-xl">
              <div className="text-4xl mb-4">✨</div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Cleaning Service</h3>
              <p className="text-gray-600 text-sm">Complimentary maintenance</p>
            </div>
            <div className="text-center p-6 bg-gray-50 rounded-xl">
              <div className="text-4xl mb-4">🚗</div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Free Pickup</h3>
              <p className="text-gray-600 text-sm">Convenient delivery service</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default WeddingPlannerPage;







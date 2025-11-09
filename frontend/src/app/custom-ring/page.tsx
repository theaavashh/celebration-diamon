"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { FaArrowRight, FaCheckCircle, FaGem, FaPalette, FaRuler, FaMagic, FaPhone, FaEnvelope, FaCalendarAlt } from "react-icons/fa";

interface RingCustomizationData {
  id: string;
  title: string;
  description: string;
  ctaText: string;
  ctaLink: string | null;
  processImageUrl: string | null;
  example1Title: string | null;
  example1Desc: string | null;
  example1ImageUrl: string | null;
  example2Title: string | null;
  example2Desc: string | null;
  example2ImageUrl: string | null;
}

const CustomRingPage = () => {
  const [customizationData, setCustomizationData] = useState<RingCustomizationData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedOptions, setSelectedOptions] = useState({
    metalType: '',
    ringStyle: '',
    stoneType: '',
    stoneShape: '',
    ringSize: '',
    setting: '',
    finish: ''
  });

  useEffect(() => {
    const fetchCustomizationData = async () => {
      try {
        const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000';
        const response = await fetch(`${API_BASE_URL}/api/ring-customizations`);
        if (response.ok) {
          const result = await response.json();
          if (result.data && result.data.length > 0) {
            setCustomizationData(result.data[0]);
          }
        }
      } catch (error) {
        console.error('Error fetching ring customization data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCustomizationData();
  }, []);

  const metalTypes = [
    { value: '14k-yellow', label: '14K Yellow Gold', color: '#FFD700', price: '+$500' },
    { value: '14k-white', label: '14K White Gold', color: '#F5F5DC', price: '+$500' },
    { value: '14k-rose', label: '14K Rose Gold', color: '#E8B4B8', price: '+$500' },
    { value: '18k-yellow', label: '18K Yellow Gold', color: '#FFC125', price: '+$800' },
    { value: '18k-white', label: '18K White Gold', color: '#FFF8DC', price: '+$800' },
    { value: '18k-rose', label: '18K Rose Gold', color: '#E9967A', price: '+$800' },
    { value: 'platinum', label: 'Platinum', color: '#E5E4E2', price: '+$1200' }
  ];

  const ringStyles = [
    {
      value: 'solitaire',
      label: 'Solitaire',
      description: 'Classic single stone setting',
      image: '/ring-solitaire.jpg'
    },
    {
      value: 'three-stone',
      label: 'Three Stone',
      description: 'Center stone with side stones',
      image: '/ring-three-stone.jpg'
    },
    {
      value: 'halo',
      label: 'Halo',
      description: 'Center stone surrounded by smaller diamonds',
      image: '/ring-halo.jpg'
    },
    {
      value: 'vintage',
      label: 'Vintage',
      description: 'Art Deco and antique-inspired designs',
      image: '/ring-vintage.jpg'
    },
    {
      value: 'ornate',
      label: 'Ornate Band',
      description: 'Intricate carvings and detailed work',
      image: '/ring-ornate.jpg'
    },
    {
      value: 'minimalist',
      label: 'Minimalist',
      description: 'Clean lines and simple elegance',
      image: '/ring-minimalist.jpg'
    }
  ];

  const stoneTypes = [
    { value: 'diamond', label: 'Diamond', icon: '💎' },
    { value: 'moissanite', label: 'Moissanite', icon: '✨' },
    { value: 'sapphire', label: 'Sapphire', icon: '💙' },
    { value: 'ruby', label: 'Ruby', icon: '❤️' },
    { value: 'emerald', label: 'Emerald', icon: '💚' },
    { value: 'salt-pepper', label: 'Salt & Pepper Diamond', icon: '⚫' }
  ];

  const stoneShapes = [
    { value: 'round', label: 'Round Brilliant' },
    { value: 'princess', label: 'Princess Cut' },
    { value: 'cushion', label: 'Cushion Cut' },
    { value: 'oval', label: 'Oval' },
    { value: 'emerald', label: 'Emerald Cut' },
    { value: 'pear', label: 'Pear Shape' },
    { value: 'marquise', label: 'Marquise' },
    { value: 'heart', label: 'Heart Shape' }
  ];

  const settings = [
    { value: 'prong', label: 'Prong Setting', description: 'Classic and secure' },
    { value: 'bezel', label: 'Bezel Setting', description: 'Modern and protective' },
    { value: 'pave', label: 'Pavé Setting', description: 'Maximum sparkle' },
    { value: 'channel', label: 'Channel Setting', description: 'Smooth and elegant' }
  ];

  const finishes = [
    { value: 'polished', label: 'Polished', description: 'High shine finish' },
    { value: 'brushed', label: 'Brushed', description: 'Matte satin finish' },
    { value: 'hammered', label: 'Hammered', description: 'Textured finish' },
    { value: 'mixed', label: 'Mixed', description: 'Combination of finishes' }
  ];

  const ringSizes = Array.from({ length: 13 }, (_, i) => {
    const size = 4 + i * 0.5;
    return { value: size.toString(), label: size.toString() };
  });

  const processSteps = [
    {
      number: 1,
      title: 'Consultation & Vision',
      description: 'Share your ideas and preferences with our expert designers',
      icon: '💬'
    },
    {
      number: 2,
      title: 'Design & Quote',
      description: 'We create a custom design and provide a detailed quote',
      icon: '✏️'
    },
    {
      number: 3,
      title: 'Approval & Creation',
      description: 'Review the design, approve, and we begin crafting your ring',
      icon: '✨'
    },
    {
      number: 4,
      title: 'Delivery & Care',
      description: 'Receive your ring with care instructions and warranty',
      icon: '🎁'
    }
  ];

  const handleOptionChange = (category: string, value: string) => {
    setSelectedOptions(prev => ({
      ...prev,
      [category]: value
    }));
  };

  const handleSubmitDesign = () => {
    // In a real application, this would send the design to the backend
    console.log('Design submitted:', selectedOptions);
    // You could redirect to a quote request page or show a modal
    alert('Your design preferences have been saved! Our team will contact you soon.');
  };

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
      <section className="relative w-full h-[80vh] min-h-[700px] flex items-center justify-center overflow-hidden bg-gradient-to-br from-amber-50 via-white to-rose-50">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, #000 1px, transparent 0)`,
            backgroundSize: '40px 40px'
          }}></div>
        </div>
        <div className="relative z-10 text-center px-4 sm:px-6 md:px-8 max-w-6xl mx-auto">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 jimthompson mb-6 leading-tight">
            {customizationData?.title || "CREATE YOUR RING ONLINE"}
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl text-gray-700 jimthompson max-w-3xl mx-auto mb-8">
            {customizationData?.description || "Design your dream ring with our interactive customization tool. Every detail matters, and we're here to bring your vision to life."}
          </p>
          <Link
            href="#design-tool"
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-amber-500 to-rose-500 text-white rounded-full font-semibold hover:from-amber-600 hover:to-rose-600 transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            {customizationData?.ctaText || "START DESIGNING"}
            <FaArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Design Tool Section */}
      <section id="design-tool" className="w-full py-16 sm:py-20 md:py-24 px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 jimthompson uppercase tracking-wide mb-4">
              Design Your Ring
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Customize every aspect of your ring to create a piece that's uniquely yours
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Left Column - Design Options */}
            <div className="space-y-8">
              {/* Metal Type */}
              <div className="bg-gray-50 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <FaPalette className="w-6 h-6 text-amber-600" />
                  <h3 className="text-xl font-bold text-gray-900 jimthompson">Metal Type</h3>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {metalTypes.map((metal) => (
                    <button
                      key={metal.value}
                      onClick={() => handleOptionChange('metalType', metal.value)}
                      className={`p-4 rounded-lg border-2 transition-all ${
                        selectedOptions.metalType === metal.value
                          ? 'border-amber-600 bg-amber-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <div
                          className="w-6 h-6 rounded-full border-2 border-gray-300"
                          style={{ backgroundColor: metal.color }}
                        ></div>
                        <span className="text-sm font-semibold text-gray-900">{metal.label}</span>
                      </div>
                      <p className="text-xs text-gray-600 text-left">{metal.price}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Ring Style */}
              <div className="bg-gray-50 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <FaGem className="w-6 h-6 text-amber-600" />
                  <h3 className="text-xl font-bold text-gray-900 jimthompson">Ring Style</h3>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  {ringStyles.map((style) => (
                    <button
                      key={style.value}
                      onClick={() => handleOptionChange('ringStyle', style.value)}
                      className={`relative h-32 rounded-lg overflow-hidden border-2 transition-all ${
                        selectedOptions.ringStyle === style.value
                          ? 'border-amber-600 ring-2 ring-amber-200'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                        <span className="text-4xl">💍</span>
                      </div>
                      <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white p-2">
                        <p className="text-xs font-semibold">{style.label}</p>
                        <p className="text-xs text-gray-300">{style.description}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Stone Type */}
              <div className="bg-gray-50 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <FaGem className="w-6 h-6 text-amber-600" />
                  <h3 className="text-xl font-bold text-gray-900 jimthompson">Stone Type</h3>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  {stoneTypes.map((stone) => (
                    <button
                      key={stone.value}
                      onClick={() => handleOptionChange('stoneType', stone.value)}
                      className={`p-4 rounded-lg border-2 transition-all text-center ${
                        selectedOptions.stoneType === stone.value
                          ? 'border-amber-600 bg-amber-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="text-3xl mb-2">{stone.icon}</div>
                      <p className="text-sm font-semibold text-gray-900">{stone.label}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Stone Shape */}
              {selectedOptions.stoneType && (
                <div className="bg-gray-50 rounded-xl p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <FaRuler className="w-6 h-6 text-amber-600" />
                    <h3 className="text-xl font-bold text-gray-900 jimthompson">Stone Shape</h3>
                  </div>
                  <div className="grid grid-cols-4 gap-3">
                    {stoneShapes.map((shape) => (
                      <button
                        key={shape.value}
                        onClick={() => handleOptionChange('stoneShape', shape.value)}
                        className={`p-3 rounded-lg border-2 transition-all text-center ${
                          selectedOptions.stoneShape === shape.value
                            ? 'border-amber-600 bg-amber-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <p className="text-xs font-semibold text-gray-900">{shape.label}</p>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Setting */}
              <div className="bg-gray-50 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <FaMagic className="w-6 h-6 text-amber-600" />
                  <h3 className="text-xl font-bold text-gray-900 jimthompson">Setting Style</h3>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {settings.map((setting) => (
                    <button
                      key={setting.value}
                      onClick={() => handleOptionChange('setting', setting.value)}
                      className={`p-4 rounded-lg border-2 transition-all text-left ${
                        selectedOptions.setting === setting.value
                          ? 'border-amber-600 bg-amber-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <p className="font-semibold text-gray-900 mb-1">{setting.label}</p>
                      <p className="text-xs text-gray-600">{setting.description}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Ring Size */}
              <div className="bg-gray-50 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <FaRuler className="w-6 h-6 text-amber-600" />
                  <h3 className="text-xl font-bold text-gray-900 jimthompson">Ring Size</h3>
                </div>
                <div className="grid grid-cols-8 gap-2">
                  {ringSizes.map((size) => (
                    <button
                      key={size.value}
                      onClick={() => handleOptionChange('ringSize', size.value)}
                      className={`p-3 rounded-lg border-2 transition-all text-center ${
                        selectedOptions.ringSize === size.value
                          ? 'border-amber-600 bg-amber-50 font-bold'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      {size.label}
                    </button>
                  ))}
                </div>
                <p className="text-xs text-gray-600 mt-4">
                  Not sure? We can help you measure at our store or during consultation.
                </p>
              </div>

              {/* Finish */}
              <div className="bg-gray-50 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <FaPalette className="w-6 h-6 text-amber-600" />
                  <h3 className="text-xl font-bold text-gray-900 jimthompson">Finish</h3>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {finishes.map((finish) => (
                    <button
                      key={finish.value}
                      onClick={() => handleOptionChange('finish', finish.value)}
                      className={`p-4 rounded-lg border-2 transition-all text-left ${
                        selectedOptions.finish === finish.value
                          ? 'border-amber-600 bg-amber-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <p className="font-semibold text-gray-900 mb-1">{finish.label}</p>
                      <p className="text-xs text-gray-600">{finish.description}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Submit Button */}
              <button
                onClick={handleSubmitDesign}
                className="w-full py-4 bg-gradient-to-r from-amber-500 to-rose-500 text-white rounded-lg font-semibold hover:from-amber-600 hover:to-rose-600 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                Submit Design Request
              </button>
            </div>

            {/* Right Column - Preview & Examples */}
            <div className="space-y-8">
              {/* Design Preview */}
              <div className="bg-gradient-to-br from-amber-50 to-rose-50 rounded-xl p-8 sticky top-8">
                <h3 className="text-2xl font-bold text-gray-900 jimthompson mb-6 text-center">
                  Your Design Preview
                </h3>
                <div className="relative h-96 bg-white rounded-lg shadow-lg flex items-center justify-center mb-6">
                  <div className="text-center">
                    <div className="text-6xl mb-4">💍</div>
                    <p className="text-gray-600">
                      {Object.values(selectedOptions).some(v => v) 
                        ? 'Your custom design will appear here'
                        : 'Start customizing to see your design'}
                    </p>
                  </div>
                </div>
                <div className="space-y-2 text-sm">
                  {selectedOptions.metalType && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Metal:</span>
                      <span className="font-semibold text-gray-900">
                        {metalTypes.find(m => m.value === selectedOptions.metalType)?.label}
                      </span>
                    </div>
                  )}
                  {selectedOptions.ringStyle && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Style:</span>
                      <span className="font-semibold text-gray-900">
                        {ringStyles.find(s => s.value === selectedOptions.ringStyle)?.label}
                      </span>
                    </div>
                  )}
                  {selectedOptions.stoneType && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Stone:</span>
                      <span className="font-semibold text-gray-900">
                        {stoneTypes.find(s => s.value === selectedOptions.stoneType)?.label}
                      </span>
                    </div>
                  )}
                  {selectedOptions.ringSize && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Size:</span>
                      <span className="font-semibold text-gray-900">{selectedOptions.ringSize}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Example Designs */}
              {(customizationData?.example1ImageUrl || customizationData?.example2ImageUrl) && (
                <div className="space-y-6">
                  <h3 className="text-xl font-bold text-gray-900 jimthompson">Design Inspirations</h3>
                  <div className="grid grid-cols-1 gap-6">
                    {customizationData.example1ImageUrl && (
                      <div className="bg-white rounded-xl overflow-hidden shadow-lg">
                        <div className="relative h-48 bg-gray-100">
                          <Image
                            src={`http://localhost:5000${customizationData.example1ImageUrl}`}
                            alt={customizationData.example1Title || 'Example Design 1'}
                            fill
                            className="object-cover"
                            onError={(e) => {
                              e.currentTarget.src = '/ring.jpeg';
                            }}
                          />
                        </div>
                        <div className="p-4">
                          <h4 className="font-bold text-gray-900 mb-1">
                            {customizationData.example1Title || 'Ornate Band Design'}
                          </h4>
                          <p className="text-sm text-gray-600">
                            {customizationData.example1Desc || 'V-shaped with leaf carvings'}
                          </p>
                        </div>
                      </div>
                    )}
                    {customizationData.example2ImageUrl && (
                      <div className="bg-white rounded-xl overflow-hidden shadow-lg">
                        <div className="relative h-48 bg-gray-100">
                          <Image
                            src={`http://localhost:5000${customizationData.example2ImageUrl}`}
                            alt={customizationData.example2Title || 'Example Design 2'}
                            fill
                            className="object-cover"
                            onError={(e) => {
                              e.currentTarget.src = '/ring.png';
                            }}
                          />
                        </div>
                        <div className="p-4">
                          <h4 className="font-bold text-gray-900 mb-1">
                            {customizationData.example2Title || 'Salt & Pepper Diamond'}
                          </h4>
                          <p className="text-sm text-gray-600">
                            {customizationData.example2Desc || 'Unique speckled gemstone'}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="w-full py-16 sm:py-20 md:py-24 px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 jimthompson uppercase tracking-wide mb-4">
              Our Process
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              From concept to creation, we guide you through every step
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {processSteps.map((step, index) => (
              <div key={index} className="relative">
                <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
                  <div className="text-4xl mb-4">{step.icon}</div>
                  <div className="absolute top-4 right-4 w-10 h-10 bg-amber-500 text-white rounded-full flex items-center justify-center font-bold">
                    {step.number}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 jimthompson mb-3">
                    {step.title}
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    {step.description}
                  </p>
                </div>
                {index < processSteps.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                    <FaArrowRight className="w-6 h-6 text-amber-500" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-full py-16 sm:py-20 md:py-24 px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 bg-gradient-to-br from-amber-500 to-rose-500">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white jimthompson mb-6">
            Ready to Create Your Dream Ring?
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Schedule a consultation with our expert designers to bring your vision to life
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              href="/appointments"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white text-amber-600 rounded-full font-semibold hover:bg-gray-100 transition-all duration-300 shadow-lg hover:shadow-xl"
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
    </div>
  );
};

export default CustomRingPage;







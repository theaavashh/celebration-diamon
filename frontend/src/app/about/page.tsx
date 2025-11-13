"use client";

import React from "react";
import Image from "next/image";

const AboutPage = () => {
  const teamMembers = [
    {
      id: 1,
      name: "Rajesh Shrestha",
      role: "Founder & CEO",
      image: "/team-member-1.jpg",
      bio: "With over 20 years of experience in the diamond industry, Rajesh brings unparalleled expertise and passion to Celebration Diamond.",
      linkedin: "#",
      email: "rajesh@celebrationdiamond.com"
    },
    {
      id: 2,
      name: "Priya Maharjan",
      role: "Creative Director",
      image: "/team-member-2.jpg",
      bio: "Priya's artistic vision transforms diamonds into timeless pieces of art, combining traditional craftsmanship with modern design.",
      linkedin: "#",
      email: "priya@celebrationdiamond.com"
    },
    {
      id: 3,
      name: "Amit Kumar",
      role: "Master Craftsman",
      image: "/team-member-3.jpg",
      bio: "Amit's precision and attention to detail ensure every piece meets our highest standards of excellence and perfection.",
      linkedin: "#",
      email: "amit@celebrationdiamond.com"
    },
    {
      id: 4,
      name: "Sita Thapa",
      role: "Quality Assurance Manager",
      image: "/team-member-4.jpg",
      bio: "Sita ensures every diamond meets our rigorous quality standards, from sourcing to final inspection.",
      linkedin: "#",
      email: "sita@celebrationdiamond.com"
    }
  ];

  const values = [
    {
      title: "Authenticity",
      description: "Every diamond is certified and verified through our in-house lab and advanced SJI machines.",
      icon: "✓"
    },
    {
      title: "Ethical Sourcing",
      description: "We are committed to ethical practices, ensuring conflict-free diamonds and responsible sourcing.",
      icon: "🌍"
    },
    {
      title: "Craftsmanship",
      description: "Traditional techniques meet modern precision in every piece we create.",
      icon: "✨"
    },
    {
      title: "Innovation",
      description: "We continuously invest in cutting-edge technology to deliver the finest quality.",
      icon: "💎"
    }
  ];

  const milestones = [
    { year: "2010", event: "Founded in Kathmandu" },
    { year: "2015", event: "Opened in-house diamond lab" },
    { year: "2018", event: "Installed first SJI machine" },
    { year: "2020", event: "Expanded to 3 advanced SJI machines" },
    { year: "2024", event: "Serving thousands of satisfied customers" }
  ];

  return (
    <div className="w-full bg-white">
      {/* Hero Section */}
      <section className="relative w-full h-[60vh] min-h-[500px] flex items-center justify-center overflow-hidden bg-gradient-to-br from-amber-50 via-white to-orange-50">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, #000 1px, transparent 0)`,
            backgroundSize: '40px 40px'
          }}></div>
        </div>
        <div className="relative z-10 text-center px-4 sm:px-6 md:px-8 max-w-4xl mx-auto">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 jimthompson mb-6 leading-tight">
            About Celebration Diamond
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl text-gray-700 jimthompson max-w-2xl mx-auto">
            Nepal's First and Finest Diamond Studio
          </p>
        </div>
      </section>

      {/* Company Story Section */}
      <section className="w-full py-16 sm:py-20 md:py-24 px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left Column - Image */}
            <div className="relative w-full h-[400px] lg:h-[500px] rounded-2xl overflow-hidden shadow-2xl">
              <Image
                src="/about-image.jpg"
                alt="Celebration Diamond Studio"
                fill
                className="object-cover"
                onError={(e) => {
                  e.currentTarget.src = '/model.jpeg';
                }}
              />
            </div>

            {/* Right Column - Content */}
            <div className="space-y-6">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 jimthompson uppercase tracking-wide">
                Our Story
              </h2>
              <div className="space-y-4 text-lg text-gray-700 leading-relaxed">
                <p>
                  <span className="font-semibold text-gray-900">Based in the heart of Kathmandu, we blend timeless elegance with modern precision.</span>{" "}
                  With an in-house diamond lab and 3 advanced SJI machines, we ensure authenticity, ethical sourcing, and unmatched craftsmanship.
                </p>
                <p>
                  Each piece is a fusion of tradition and innovation, designed with soul, delivered with meaning. We believe that every diamond tells a story, and we're here to help you create yours.
                </p>
                <p>
                  From engagement rings to custom jewelry, we combine the finest materials with expert craftsmanship to create pieces that will be treasured for generations.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision Section */}
      <section className="w-full py-16 sm:py-20 md:py-24 px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16">
            {/* Mission */}
            <div className="bg-white p-8 sm:p-10 rounded-2xl shadow-lg">
              <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mb-6">
                <span className="text-3xl">🎯</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 jimthompson mb-4">
                Our Mission
              </h3>
              <p className="text-lg text-gray-700 leading-relaxed">
                To provide authentic, ethically sourced diamonds with unparalleled craftsmanship, creating timeless pieces that celebrate life's most precious moments.
              </p>
            </div>

            {/* Vision */}
            <div className="bg-white p-8 sm:p-10 rounded-2xl shadow-lg">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mb-6">
                <span className="text-3xl">👁️</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 jimthompson mb-4">
                Our Vision
              </h3>
              <p className="text-lg text-gray-700 leading-relaxed">
                To become Nepal's leading diamond studio, recognized globally for our commitment to quality, authenticity, and ethical practices in the jewelry industry.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="w-full py-16 sm:py-20 md:py-24 px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 jimthompson uppercase tracking-wide mb-4">
              Our Values
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              The principles that guide everything we do
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div
                key={index}
                className="bg-gray-50 p-6 sm:p-8 rounded-xl hover:shadow-lg transition-shadow duration-300 border border-gray-100"
              >
                <div className="text-4xl mb-4">{value.icon}</div>
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 jimthompson mb-3">
                  {value.title}
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Team Section */}
      <section className="w-full py-16 sm:py-20 md:py-24 px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 jimthompson uppercase tracking-wide mb-4">
              Our Team
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Meet the passionate experts behind Celebration Diamond
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member) => (
              <div
                key={member.id}
                className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300"
              >
                <div className="relative w-full h-64 bg-gradient-to-br from-amber-100 to-orange-100">
                  <Image
                    src={member.image}
                    alt={member.name}
                    fill
                    className="object-cover"
                    onError={(e) => {
                      e.currentTarget.src = '/model.jpeg';
                    }}
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 jimthompson mb-1">
                    {member.name}
                  </h3>
                  <p className="text-amber-600 font-semibold mb-3">
                    {member.role}
                  </p>
                  <p className="text-gray-600 text-sm leading-relaxed mb-4">
                    {member.bio}
                  </p>
                  <div className="flex space-x-3">
                    <a
                      href={`mailto:${member.email}`}
                      className="text-gray-400 hover:text-amber-600 transition-colors"
                      aria-label={`Email ${member.name}`}
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </a>
                    <a
                      href={member.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-400 hover:text-amber-600 transition-colors"
                      aria-label={`LinkedIn ${member.name}`}
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="w-full py-16 sm:py-20 md:py-24 px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 jimthompson uppercase tracking-wide mb-4">
              Why Choose Us
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
            <div className="text-center">
              <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-4xl">🔬</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 jimthompson mb-3">
                In-House Diamond Lab
              </h3>
              <p className="text-gray-600">
                Our state-of-the-art lab ensures every diamond is authenticated and certified to the highest standards.
              </p>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-4xl">⚙️</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 jimthompson mb-3">
                3 Advanced SJI Machines
              </h3>
              <p className="text-gray-600">
                Cutting-edge technology for precision cutting and certification, ensuring unmatched quality.
              </p>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-4xl">👨‍🎨</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 jimthompson mb-3">
                Expert Craftsmanship
              </h3>
              <p className="text-gray-600">
                Master craftsmen with decades of experience create each piece with meticulous attention to detail.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Milestones Section */}
      <section className="w-full py-16 sm:py-20 md:py-24 px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 jimthompson uppercase tracking-wide mb-4">
              Our Journey
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Key milestones in our growth
            </p>
          </div>
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-amber-400 to-orange-400 hidden md:block"></div>
            
            <div className="space-y-12">
              {milestones.map((milestone, index) => (
                <div
                  key={index}
                  className={`flex flex-col md:flex-row items-center ${
                    index % 2 === 0 ? 'md:flex-row-reverse' : ''
                  }`}
                >
                  <div className={`w-full md:w-5/12 ${index % 2 === 0 ? 'md:text-right md:pr-8' : 'md:text-left md:pl-8'}`}>
                    <div className="bg-white p-6 rounded-xl shadow-lg">
                      <div className="text-3xl font-bold text-amber-600 mb-2">
                        {milestone.year}
                      </div>
                      <div className="text-lg text-gray-700">
                        {milestone.event}
                      </div>
                    </div>
                  </div>
                  <div className="w-4 h-4 bg-amber-500 rounded-full border-4 border-white shadow-lg z-10 my-4 md:my-0"></div>
                  <div className="w-full md:w-5/12"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="w-full py-16 sm:py-20 md:py-24 px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-8 sm:p-12 lg:p-16">
            <div className="text-center mb-8">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 jimthompson uppercase tracking-wide mb-4">
                Visit Our Studio
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Experience our craftsmanship firsthand at our Kathmandu studio
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-md">
                  <span className="text-2xl">📍</span>
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Location</h3>
                <p className="text-gray-600">
                  Kathmandu, Nepal
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-md">
                  <span className="text-2xl">📞</span>
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Contact</h3>
                <p className="text-gray-600">
                  +977-1-XXXXXXX
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-md">
                  <span className="text-2xl">✉️</span>
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Email</h3>
                <p className="text-gray-600">
                  info@celebrationdiamond.com
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;








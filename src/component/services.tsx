"use client";

import React from "react";
import Link from "next/link";

const ServiceInfo = () => {
  const services = [
    {
      title: "CUSTOMER CARE",
      description: "Our Client Services team is available to assist with online orders, returns, and other enquiries.",
      cta: "Learn More",
      href: "/customer-care"
    },
    {
      title: "APPOINTMENTS",
      description: "Connect with an in-house stylist for a shopping experience tailored for you.",
      cta: "Request an Appointment",
      href: "/appointments"
    },
    {
      title: "BRIDAL SERVICES",
      description: "Say 'I do' to our bespoke bridal services, available by appointment only.",
      cta: "Learn More",
      href: "/bridal-services"
    }
  ];

  return (
    <section className="w-full py-12 sm:py-16 md:py-24 px-4 sm:px-6 md:px-16 relative bg-[#fafafa]">
      <div className="mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-10">
          {services.map((service, index) => (
            <div key={index} className="text-center bg-gray-300 p-4 rounded-lg w-[400px]">
              {/* Service Title */}
              <h3 className="text-2xl md:text-3xl jimthompson font-bold text-black mb-4 tracking-wide">
                {service.title}
              </h3>
              
              {/* Service Description */}
              <p className="text-base md:text-lg text-black mb-6 leading-relaxed max-w-xs mx-auto">
                {service.description}
              </p>
              
              {/* Call to Action Link */}
              <Link
                href={service.href}
                className="inline-block text-black underline underline-offset-4 hover:underline-offset-2 transition-all duration-200 font-medium"
              >
                {service.cta}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServiceInfo;
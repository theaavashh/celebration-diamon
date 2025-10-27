import React from 'react';

const features = ['Luxury', 'Elegant', 'Exclusive', 'Timeless'];

const Service: React.FC = () => {
  return (
    <section className="w-full h-16 sm:h-20 md:h-24 bg-gradient-to-r from-amber-500 to-amber-600 text-white flex items-center justify-evenly px-4 overflow-hidden">
      <div className="flex items-center justify-evenly w-full max-w-6xl">
        {features.map((feature, index) => (
          <span key={index} className="text-md sm:text-lg md:text-2xl lg:text-4xl font-medium whitespace-nowrap">
            {feature}
          </span>
        ))}
      </div>
    </section>
  );
};

export default Service;

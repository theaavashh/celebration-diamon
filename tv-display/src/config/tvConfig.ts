export const TV_DISPLAY_CONFIG = {
  // Carousel settings
  autoplayDelay: 10000, // 10 seconds per slide for better viewing
  transitionDuration: 1500, // 1.5 second transition for smooth effect
  
  // API settings
  apiBaseUrl: 'http://localhost:5000/api',
  fallbackProducts: [
    {
      id: '1',
      name: 'Eternal Love Diamond Ring',
      description: 'A masterpiece of elegance featuring a brilliant-cut diamond in a timeless platinum setting, symbolizing eternal love and commitment',
      price: 25000,
      category: 'Rings',
      images: ['/diamond-placeholder.svg'],
      stock: 10,
      isActive: true
    },
    {
      id: '2',
      name: 'Royal Cascade Diamond Necklace',
      description: 'An exquisite cascade of diamonds flowing like starlight, crafted with precision and adorned with the finest stones for unforgettable moments',
      price: 45000,
      category: 'Necklaces',
      images: ['/diamond-placeholder.svg'],
      stock: 8,
      isActive: true
    },
    {
      id: '3',
      name: 'Celestial Diamond Earrings',
      description: 'Dazzling diamond earrings that capture the essence of celestial beauty, featuring brilliant-cut diamonds in a sophisticated design',
      price: 18000,
      category: 'Earrings',
      images: ['/diamond-placeholder.svg'],
      stock: 15,
      isActive: true
    },
    {
      id: '4',
      name: 'Majestic Diamond Bracelet',
      description: 'A regal bracelet showcasing the finest diamonds in an intricate pattern, representing luxury and sophistication at its finest',
      price: 32000,
      category: 'Bracelets',
      images: ['/diamond-placeholder.svg'],
      stock: 12,
      isActive: true
    },
    {
      id: '5',
      name: 'Infinity Diamond Pendant',
      description: 'A timeless pendant featuring a perfect diamond suspended in elegance, representing infinite beauty and everlasting grace',
      price: 15000,
      category: 'Pendants',
      images: ['/diamond-placeholder.svg'],
      stock: 20,
      isActive: true
    },
    {
      id: '6',
      name: 'Crown Jewel Diamond Set',
      description: 'A complete diamond set including ring, earrings, and necklace, designed for the most special occasions and royal celebrations',
      price: 85000,
      category: 'Sets',
      images: ['/diamond-placeholder.svg'],
      stock: 5,
      isActive: true
    }
  ] as any,
  
  // Display settings
  showTime: true,
  showDate: true,
  showContactInfo: true,
  showHours: true,
  
  // Styling
  primaryColor: '#3B82F6', // Blue
  accentColor: '#FBBF24', // Yellow/Gold
  backgroundColor: 'linear-gradient(135deg, #581C87 0%, #1E3A8A 50%, #312E81 100%)',
  
  // Company info
  companyName: 'Celebration Diamond',
  tagline: 'Premium Diamond Collection',
  contactPhone: '+977-1-XXXXXXX',
  contactEmail: 'info@celebrationdiamond.com',
  showroomHours: 'Mon-Sat: 10AM-8PM | Sun: 12PM-6PM',
  
  // TV-specific settings
  tvMode: true,
  preventSleep: true,
  fullScreen: true,
  hideCursor: true,
  
  // Error handling
  retryAttempts: 3,
  retryDelay: 5000, // 5 seconds
  showErrorMessages: false, // Hide errors on TV display
};

export default TV_DISPLAY_CONFIG;
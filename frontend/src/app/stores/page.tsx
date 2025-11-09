"use client"

import React, { useEffect, useRef, useState } from 'react';

interface Store {
  id: string;
  title: string;
  location: string;
  phone: string | null;
  email: string | null;
  hours: string | null;
  latitude: number | null;
  longitude: number | null;
  description: string | null;
  mediaType: string;
  imageUrl: string | null;
  videoUrl: string | null;
  isActive: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

const StoresPage = () => {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<{ remove: () => void } | null>(null)
  const [stores, setStores] = useState<Store[]>([]);
  const [currentStoreIndex, setCurrentStoreIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch stores from API
  useEffect(() => {
    const fetchStores = async () => {
      try {
        setIsLoading(true);
        const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000/api';
        const response = await fetch(`${apiBaseUrl}/stores`);
        if (response.ok) {
          const data = await response.json();
          if (data.success && data.data) {
            // Filter active stores and sort by sortOrder
            const activeStores = data.data
              .filter((store: Store) => store.isActive)
              .sort((a: Store, b: Store) => a.sortOrder - b.sortOrder);
            setStores(activeStores);
          }
        } else {
          setError('Failed to fetch stores');
        }
      } catch (error) {
        console.error('Error fetching stores:', error);
        setError('Failed to fetch stores');
      } finally {
        setIsLoading(false);
      }
    };

    fetchStores();
  }, []);

  // Get current store or use default
  const currentStore = stores.length > 0 ? stores[currentStoreIndex] : null;
  
  const storeLocation = currentStore ? {
    name: currentStore.title,
    address: currentStore.location,
    coordinates: {
      lat: currentStore.latitude || 27.7172,
      lng: currentStore.longitude || 85.3240
    },
    phone: currentStore.phone || "+977-9808080808",
    email: currentStore.email || "info@celebrationdiamondstudio.com",
    hours: currentStore.hours || "Mon-Sat: 10:00 AM - 7:00 PM, Sun: 11:00 AM - 5:00 PM"
  } : {
    name: "Celebration Diamond Studio",
    address: "Baneshwor, Kathmandu, Nepal",
    coordinates: {
      lat: 27.7172,
      lng: 85.3240
    },
    phone: "+977-9808080808",
    email: "info@celebrationdiamondstudio.com",
    hours: "Mon-Sat: 10:00 AM - 7:00 PM, Sun: 11:00 AM - 5:00 PM"
  }

  useEffect(() => {
    if (!currentStore || !storeLocation.coordinates.lat || !storeLocation.coordinates.lng) return;

    // Load Leaflet CSS
    const link = document.createElement('link')
    link.rel = 'stylesheet'
    link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css'
    link.integrity = 'sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY='
    link.crossOrigin = ''
    document.head.appendChild(link)

    // Load Leaflet JavaScript
    const script = document.createElement('script')
    script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js'
    script.integrity = 'sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo='
    script.crossOrigin = ''
    
    script.onload = () => {
      if (mapRef.current) {
        // Remove existing map if it exists
        if (mapInstanceRef.current) {
          mapInstanceRef.current.remove()
          mapInstanceRef.current = null
        }

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const L = (window as any).L
        
        // Initialize map
        mapInstanceRef.current = L.map(mapRef.current).setView(
          [storeLocation.coordinates.lat, storeLocation.coordinates.lng], 
          15
        )

        // Add OpenStreetMap tiles
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(mapInstanceRef.current)

        // Add custom marker icon
        const customIcon = L.divIcon({
          className: 'custom-marker',
          html: `
            <div style="
              background: #1f2937;
              color: white;
              padding: 8px 12px;
              border-radius: 20px;
              font-size: 12px;
              font-weight: 600;
              white-space: nowrap;
              box-shadow: 0 2px 8px rgba(0,0,0,0.3);
              border: 2px solid white;
            ">
              ${storeLocation.name}
            </div>
          `,
          iconSize: [120, 40],
          iconAnchor: [60, 40]
        })

        // Add marker
        L.marker([storeLocation.coordinates.lat, storeLocation.coordinates.lng], {
          icon: customIcon
        }).addTo(mapInstanceRef.current)

        // Add popup with store info
        const popupContent = `
          <div style="padding: 10px;">
            <h3 style="margin: 0 0 8px 0; font-weight: 600; color: #1f2937;">${storeLocation.name}</h3>
            <p style="margin: 0 0 4px 0; color: #6b7280; font-size: 14px;">📍 ${storeLocation.address}</p>
            ${storeLocation.phone ? `<p style="margin: 0 0 4px 0; color: #6b7280; font-size: 14px;">📞 ${storeLocation.phone}</p>` : ''}
            ${storeLocation.hours ? `<p style="margin: 0; color: #6b7280; font-size: 14px;">🕒 ${storeLocation.hours}</p>` : ''}
          </div>
        `;

        L.popup({
          maxWidth: 300,
          className: 'store-popup'
        })
        .setLatLng([storeLocation.coordinates.lat, storeLocation.coordinates.lng])
        .setContent(popupContent)
        .addTo(mapInstanceRef.current)
      }
    }

    document.head.appendChild(script)

    // Cleanup function
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove()
        mapInstanceRef.current = null
      }
      // Remove script and link
      const existingScript = document.querySelector('script[src*="leaflet"]')
      const existingLink = document.querySelector('link[href*="leaflet"]')
      if (existingScript) existingScript.remove()
      if (existingLink) existingLink.remove()
    }
  }, [currentStore, storeLocation.coordinates.lat, storeLocation.coordinates.lng, storeLocation.name, storeLocation.address, storeLocation.phone, storeLocation.hours])

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading stores...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Main Content */}
      <main className="container mt-5 mx-auto px-4 py-12 max-w-6xl">
        {/* Page Title */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">STORES</h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            {currentStore?.description || "Step into our store and immerse yourself in a world of timeless elegance and quality craftsmanship. Experience our collection of fine jewelry and diamond certification services in person."}
          </p>
        </div>

        {/* Store Selector (if multiple stores) */}
        {stores.length > 1 && (
          <div className="flex justify-center mb-8">
            <div className="flex gap-2">
              {stores.map((store, index) => (
                <button
                  key={store.id}
                  onClick={() => setCurrentStoreIndex(index)}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    index === currentStoreIndex
                      ? 'bg-gray-900 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {store.title}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Store Information */}
        {currentStore ? (
          <div className="grid lg:grid-cols-2 gap-12 mb-16">
            {/* Store Details */}
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                  {storeLocation.name}
                </h2>
              <div className="space-y-4 text-gray-700">
                <div className="flex items-start space-x-3">
                  <svg className="w-5 h-5 text-gray-400 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <div>
                    <p className="font-medium">Address</p>
                    <p>{storeLocation.address}</p>
                  </div>
                </div>
                
                {storeLocation.phone && (
                  <div className="flex items-start space-x-3">
                    <svg className="w-5 h-5 text-gray-400 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    <div>
                      <p className="font-medium">Phone</p>
                      <p>{storeLocation.phone}</p>
                    </div>
                  </div>
                )}
                
                {storeLocation.email && (
                  <div className="flex items-start space-x-3">
                    <svg className="w-5 h-5 text-gray-400 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <div>
                      <p className="font-medium">Email</p>
                      <p>{storeLocation.email}</p>
                    </div>
                  </div>
                )}
                
                {storeLocation.hours && (
                  <div className="flex items-start space-x-3">
                    <svg className="w-5 h-5 text-gray-400 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div>
                      <p className="font-medium">Opening Hours</p>
                      <p>{storeLocation.hours}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Services */}
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Our Services</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-2">Diamond Certification</h4>
                  <p className="text-sm text-gray-600">IGI, GIA, and AGS certified diamonds</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-2">Custom Design</h4>
                  <p className="text-sm text-gray-600">Personalized jewelry creation</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-2">Appraisal</h4>
                  <p className="text-sm text-gray-600">Professional jewelry appraisal</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-2">Repair & Maintenance</h4>
                  <p className="text-sm text-gray-600">Expert jewelry care services</p>
                </div>
              </div>
            </div>

            {/* Contact CTA */}
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Plan Your Visit</h3>
              <p className="text-gray-600 mb-4">
                Book an appointment for a personalized consultation with our diamond experts.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                {storeLocation.phone && (
                  <a
                    href={`tel:${storeLocation.phone}`}
                    className="inline-flex items-center justify-center px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors duration-200"
                  >
                    Call Now
                  </a>
                )}
                {storeLocation.email && (
                  <a
                    href={`mailto:${storeLocation.email}`}
                    className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                  >
                    Email Us
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Map */}
          <div className="space-y-6">
            <div className="bg-gray-100 rounded-lg overflow-hidden" style={{ height: '400px' }}>
              <div 
                ref={mapRef} 
                className="w-full h-full"
                style={{ 
                  minHeight: '400px',
                  zIndex: 1
                }}
              />
            </div>
            
            {/* Directions */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Getting Here</h3>
              <div className="space-y-3 text-sm text-gray-600">
                <div>
                  <strong>By Public Transport:</strong>
                  <p>Take a bus or taxi to Baneshwor Chowk. We are located near the main intersection.</p>
                </div>
                <div>
                  <strong>By Car:</strong>
                  <p>Parking available on-site. Enter from the main road and follow signs to our store.</p>
                </div>
                <div>
                  <strong>Landmarks:</strong>
                  <p>Near Baneshwor Chowk, opposite the main bus station, next to the shopping complex.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-600">No stores available</p>
          </div>
        )}

        {/* Additional Information */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Certified Diamonds</h3>
            <p className="text-gray-600">All our diamonds come with international certification from recognized laboratories.</p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Expert Consultation</h3>
            <p className="text-gray-600">Our certified gemologists provide personalized guidance for your jewelry selection.</p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Lifetime Care</h3>
            <p className="text-gray-600">We provide ongoing care and maintenance services for all our jewelry pieces.</p>
          </div>
        </div>

        {/* Newsletter Signup */}
        <div className="bg-gray-50 rounded-lg p-8 text-center">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            Join Our Newsletter
          </h2>
          <p className="text-gray-600 mb-6">
            Subscribe for updates on our latest collections and exclusive offers.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
            />
            <button className="px-6 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors duration-200">
              Subscribe
            </button>
          </div>
        </div>
      </main>

     
    </div>
  )
}

export default StoresPage;

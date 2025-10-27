import Category from '@/component/category'
import HeroSection from '@/component/hero-section'
import PromotionalBanner from '@/component/promotional-banner'
import SerenityGallery from '@/component/serenity-gallery'
import NewCollection from '@/component/new-collection'
import CustomRing from '@/component/custom-ring'
import FAQ from '@/component/faq'
import DiamondCertification from '@/component/diamond-certification'
import WhatsAppButton from '@/component/WhatsAppButton'
import React from 'react'
import Image from 'next/image'

import Section from '@/component/banner'
import BridgePlanning from '@/component/bridge-planning'
import CultureCollection from '@/component/CulturalTriptych'
import HowItWorks from '@/component/how-it-works'
import AboutUs from '@/component/about-us'
import WeddingPlanning from '@/component/wedding-planning'
import TestimonialsSection from '@/component/testimonials-section'
import SelfExpression from '@/component/self-expression'
import VisitStore from '@/component/visit-store'

const HomePage = () => {
  return (
   <>
   <HeroSection/>
   <PromotionalBanner/>
    <Category/>
     <NewCollection/>
     <AboutUs/>
     <WeddingPlanning/>
     <SelfExpression/>
     <VisitStore/>

    

   

    
 
   {/* Banner Section */}
   <section className="w-full py-8 sm:py-12 md:py-16 px-4 sm:px-6 md:px-16 ">
     <div className="w-full h-[200px] sm:h-[300px] md:h-[400px] relative overflow-hidden rounded-lg">
       <Image 
         src="/image copy.png" 
         alt="Banner" 
         fill
         className="object-cover"
       />
     </div>
   </section>

   <Section/>

   {/* <TabsSection/> */}

   {/* <Aboutus/> */}
 

    
     
     <BridgePlanning/>

     <CultureCollection/>
     

     
   


     {/* Three Cards Section */}
      <section className="w-full py-12 sm:py-16 md:py-20 px-8 sm:px-12 md:px-20 lg:px-24 bg-white">
       <div className="max-w-7xl mx-auto">
         <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
           {/* Customer Care Card */}
            <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
             <div className="flex justify-between items-start mb-4">
               <h3 className="text-lg font-bold text-black uppercase tracking-wide">Customer Care</h3>
               <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                 <svg className="w-5 h-5 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                   <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                 </svg>
               </div>
             </div>
             <p className="text-sm text-gray-700 mb-4 leading-relaxed">
               Our Client Services team is available to assist with online orders, returns, and other enquiries.
             </p>
             <a href="#" className="text-sm text-black underline hover:text-gray-600 transition-colors">
               Learn More
             </a>
           </div> 

           {/* Appointments Card */}
            <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
             <div className="flex justify-between items-start mb-4">
               <h3 className="text-lg font-bold text-black uppercase tracking-wide">Appointments</h3>
               <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                 <svg className="w-5 h-5 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                   <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                 </svg>
               </div>
             </div>
             <p className="text-sm text-gray-700 mb-4 leading-relaxed">
               Connect with an in-house stylist for a shopping experience tailored for you.
             </p>
             <a href="#" className="text-sm text-black underline hover:text-gray-600 transition-colors">
               Request an Appointment
             </a>
           </div>

           {/* Bridal Services Card */}
            <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
             <div className="flex justify-between items-start mb-4">
               <h3 className="text-lg font-bold text-black uppercase tracking-wide">Bridal Services</h3>
               <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                 <svg className="w-5 h-5 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                   <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                 </svg>
               </div>
             </div>
             <p className="text-sm text-gray-700 mb-4 leading-relaxed">
               Say &apos;I do&apos; to our bespoke bridal services, available by appointment only.
             </p>
             <a href="#" className="text-sm text-black underline hover:text-gray-600 transition-colors">
               Learn More
             </a>
           </div> 
          </div> 
        </div> 
      </section> 

      <CustomRing />
      <DiamondCertification />

     <HowItWorks/>
     <FAQ />
     <TestimonialsSection/>
     <SerenityGallery/> 
     <WhatsAppButton />
   </>
  )
}

export default HomePage
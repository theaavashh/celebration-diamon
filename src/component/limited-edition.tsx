import { CardCarousel } from "@/components/ui/card-carousel"

function BasicExample() {
    const images = [
      { src: "/bracelet.jpeg", alt: "Image 1" },
      { src: "/earring.jpeg", alt: "Image 2" },
      { src: "/footer-pendant.jpg", alt: "Image 3" },
      { src: "/bracelet.jpeg", alt: "Image 1" },
      { src: "/earring.jpeg", alt: "Image 2" },
      { src: "/footer-pendant.jpg", alt: "Image 3" },
      
    ]
  
    return (
      <div className="pt-20 sm:pt-24 md:pt-32 lg:pt-40">
        <CardCarousel
          images={images}
          autoplayDelay={3000}
          showPagination={true}
          showNavigation={true}
        />
      </div>
    )
  }

  export default BasicExample;
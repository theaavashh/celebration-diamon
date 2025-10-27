import { Heart } from "lucide-react";
import { Product } from "../types/product";
import Image from "next/image";

interface ProductCardProps {
  product: Product & {
    bestseller?: boolean;
    oldPrice?: number;
    discount?: string;
  };
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden relative group transition-all duration-300 hover:shadow-lg">
      {/* BESTSELLERS badge */}
      {product.bestseller && (
        <span className="absolute top-3 left-3 bg-[#a15c5c] text-white text-xs font-bold px-3 py-1 rounded-md z-10 flex items-center gap-1">
          <svg width="14" height="14" fill="none" viewBox="0 0 24 24"><path d="M12 2l2.09 6.26L20 9.27l-5 3.64L16.18 20 12 16.77 7.82 20 9 12.91l-5-3.64 5.91-.01z" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
          BESTSELLERS
        </span>
      )}
      {/* Heart icon */}
      <button className="absolute top-3 right-3 bg-white/90 rounded-full p-2 shadow hover:bg-white z-10">
        <Heart className="w-5 h-5 text-gray-700" />
      </button>
      {/* Product Image */}
        <Image
          src="/footer-earring.jpg"
          alt={product.name}
          width={100}
          height={100}
        className="w-full h-64 object-cover rounded-t-xl"
        />
      {/* Product Info */}
      <div className="p-4">
        <div className="font-serif text-lg font-semibold text-black mb-1 truncate" title={product.name}>{product.name}</div>
        {/* Removed price and old price */}
        {product.discount && (
          <div className="bg-[#f9ede3] text-[#a15c5c] text-sm font-medium rounded-md px-4 py-2 flex items-center gap-2 w-fit mt-2">
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24"><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2m16 0h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" stroke="#a15c5c" strokeWidth="1.5" strokeLinecap="round"/><circle cx="12" cy="12" r="5" stroke="#a15c5c" strokeWidth="1.5"/></svg>
            {product.discount}
          </div>
        )}
        </div>
        </div>
  );
}

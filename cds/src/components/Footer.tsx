import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-[#f2f2f2] pt-16 pb-8 text-gray-800 font-sans">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {/* ABOUT COMPANY */}
          <div>
            <h3 className="text-sm font-bold mb-6 uppercase tracking-wider">ABOUT COMPANY</h3>
            <ul className="space-y-3">
              <li><Link href="#" className="text-[11px] font-medium text-gray-600 hover:text-gray-900 uppercase tracking-wide">ABOUT US</Link></li>
              <li><Link href="#" className="text-[11px] font-medium text-gray-600 hover:text-gray-900 uppercase tracking-wide">JEWELLERY GUIDE</Link></li>
              <li><Link href="#" className="text-[11px] font-medium text-gray-600 hover:text-gray-900 uppercase tracking-wide">REVIEW & RATING</Link></li>
              <li><Link href="#" className="text-[11px] font-medium text-gray-600 hover:text-gray-900 uppercase tracking-wide">CAREER</Link></li>
              <li><Link href="#" className="text-[11px] font-medium text-gray-600 hover:text-gray-900 uppercase tracking-wide">EVENTS</Link></li>
              <li><Link href="#" className="text-[11px] font-medium text-gray-600 hover:text-gray-900 uppercase tracking-wide">BLOG</Link></li>
            </ul>
          </div>

          {/* POLICIES */}
          <div>
            <h3 className="text-sm font-bold mb-6 uppercase tracking-wider">POLICIES</h3>
            <ul className="space-y-3">
              <li><Link href="#" className="text-[11px] font-medium text-gray-600 hover:text-gray-900 uppercase tracking-wide">PRIVACY POLICY</Link></li>
              <li><Link href="#" className="text-[11px] font-medium text-gray-600 hover:text-gray-900 uppercase tracking-wide">TERMS OF USE</Link></li>
            </ul>
          </div>

          {/* HELP */}
          <div>
            <h3 className="text-sm font-bold mb-6 uppercase tracking-wider">HELP</h3>
            <ul className="space-y-3">
              <li><Link href="#" className="text-[11px] font-medium text-gray-600 hover:text-gray-900 uppercase tracking-wide">FAQ'S</Link></li>
              <li><Link href="#" className="text-[11px] font-medium text-gray-600 hover:text-gray-900 uppercase tracking-wide">CONTACT US</Link></li>
            </ul>
          </div>

          {/* DIRECT CONTACT */}
          <div>
            <h3 className="text-sm font-bold mb-6 uppercase tracking-wider">DIRECT CONTACT</h3>
            <ul className="space-y-4">
              <li>
                <p className="text-[11px] font-medium text-gray-600 uppercase tracking-wide">+91 97230 98500</p>
              </li>
              <li>
                <p className="text-[11px] font-medium text-gray-600 uppercase tracking-wide">info@dharmajewels.in</p>
              </li>
              <li>
                <p className="text-[11px] font-medium text-gray-600 uppercase tracking-wide leading-relaxed">
                  Dharma House Plot No. 17,<br />
                  near Mehta Petrol Pump, Katargam Road,<br />
                  Surat, Gujarat- 395004
                </p>
              </li>
            </ul>
          </div>
        </div>

        <div className="text-center">
          <p className="text-[10px] font-medium text-gray-500 uppercase tracking-widest">
            &copy; Dharma Jewels -2025- ALL RIGHTS RESERVED
          </p>
        </div>
      </div>
    </footer>
  );
}

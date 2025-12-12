"use client";

import React from "react";
import { getApiBaseUrl } from "@/lib/api";
import { Public_Sans } from "next/font/google";

const publicSans = Public_Sans({ subsets: ["latin"], weight: ["400", "500", "600", "700"], display: "swap" });

export default function AppointmentsPage() {
  const [showAppointment, setShowAppointment] = React.useState(false);
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [appointmentType, setAppointmentType] = React.useState("in-store");
  const [preferredDate, setPreferredDate] = React.useState("");
  const [preferredTime, setPreferredTime] = React.useState("");
  const [additionalNotes, setAdditionalNotes] = React.useState("");
  const [submitting, setSubmitting] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!name.trim() || !phone.trim()) {
      setError("Name and phone are required");
      return;
    }
    try {
      setSubmitting(true);
      const res = await fetch(`${getApiBaseUrl()}/appointments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          phone,
          appointmentType,
          preferredDate,
          preferredTime,
          additionalNotes,
        }),
      });
      const json = await res.json();
      if (json.success) {
        setName("");
        setEmail("");
        setPhone("");
        setAppointmentType("in-store");
        setPreferredDate("");
        setPreferredTime("");
        setAdditionalNotes("");
        setShowAppointment(false);
        alert("Thank you! We will contact you soon to arrange your appointment.");
      } else {
        setError("Error submitting appointment. Please try again.");
      }
    } catch (_) {
      setError("Error submitting appointment. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className={`${publicSans.className} w-full bg-white`}>
      <section className="w-full py-14 md:py-20 px-4 sm:px-6 md:px-8 mt-6">
        <div className="max-w-9xl mx-auto">
          <div className="mb-10 text-center">
            <h1 className="text-2xl  font-extrabold tracking-tight uppercase jimthompson text-[#E1C16E]">Book an In-Store Consultation</h1>
            <p className="mt-4 text-base sm:text-xl text-black max-w-6xl mx-auto">
              Our consultants offer personalized guidance to help you find the perfect piece. Explore collections, discuss custom designs,
              and enjoy a welcoming environment where your vision is brought to life.
            </p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
            <div className="relative h-[280px] sm:h-[360px] md:h-[420px] lg:h-full">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_10px_10px,#000_1px,transparent_0)] opacity-[0.06]" />
              <div className="absolute inset-0 bg-gradient-to-br from-rose-200/30 via-transparent to-amber-200/30" />
            </div>
            <div className="p-6 md:p-10">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3 jimthompson">Main Branch</h2>
              <p className="text-gray-800 mb-6">
                NB Center, New Baneshwor • (760) 347-3547
              </p>
              <div className="flex gap-3">
                <a href="tel:+17603473547" className="px-6 py-3 rounded-full border border-gray-300 text-gray-900 hover:bg-gray-50 min-w-[160px] text-center">Call</a>
                <a href="/stores" onClick={(e) => { e.preventDefault(); setShowAppointment(true); }} className="px-6 py-3 rounded-full bg-[#E1C16E] text-white font-semibold hover:bg-red-800">Book Consultation</a>
              </div>
              <div className="mt-8 text-sm text-gray-700">
                Enjoy an intimate, hands-on shopping experience tailored to your style and preferences.
              </div>
            </div>
          </div>
        </div>
      </section>
      {showAppointment && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40" onClick={() => setShowAppointment(false)} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md sm:max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
            <button
              className="absolute top-4 right-4 text-black hover:text-gray-600"
              onClick={() => setShowAppointment(false)}
              aria-label="Close"
            >
              ✕
            </button>
            <div className="p-5 sm:p-6 md:p-8">
              <h3 className="text-2xl sm:text-3xl font-extrabold jimthompson text-[#E1C16E] mb-4">Book Appointment</h3>
              {error && <div className="mb-4 text-sm text-red-600">{error}</div>}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm sm:text-base font-medium text-gray-700 mb-1">Name</label>
                  <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500" required />
                </div>
                <div>
                  <label className="block text-sm sm:text-base font-medium text-gray-700 mb-1">Email</label>
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500" />
                </div>
                <div>
                  <label className="block text-sm sm:text-base font-medium text-gray-700 mb-1">Phone</label>
                  <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500" required />
                </div>
                <div>
                  <label className="block text-sm sm:text-base font-medium text-gray-700 mb-1">Appointment Type</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button type="button" onClick={() => setAppointmentType("in-store")} className={`px-3 py-2 rounded-lg border ${appointmentType === "in-store" ? "border-amber-600 bg-amber-50" : "border-gray-300"}`}>In-Store</button>
                    <button type="button" onClick={() => setAppointmentType("online")} className={`px-3 py-2 rounded-lg border ${appointmentType === "online" ? "border-amber-600 bg-amber-50" : "border-gray-300"}`}>Online</button>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm sm:text-base font-medium text-gray-700 mb-1">Preferred Date</label>
                    <input type="date" value={preferredDate} onChange={(e) => setPreferredDate(e.target.value)} className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500" />
                  </div>
                  <div>
                    <label className="block text-sm sm:text-base font-medium text-gray-700 mb-1">Preferred Time</label>
                    <input type="time" value={preferredTime} onChange={(e) => setPreferredTime(e.target.value)} className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm sm:text-base font-medium text-gray-700 mb-1">Notes</label>
                  <textarea value={additionalNotes} onChange={(e) => setAdditionalNotes(e.target.value)} className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500" rows={3} />
                </div>
                <button type="submit" disabled={submitting} className="w-full inline-flex items-center justify-center gap-2 bg-amber-600 text-white px-4 py-2 rounded-full hover:bg-amber-700 disabled:opacity-60">
                  {submitting ? "Submitting..." : "Submit"}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
      <section className="w-full px-4 sm:px-6 md:px-8 bg-white mb-10">
        <div className="max-w-7xl mx-auto">
          <div className="rounded-2xl overflow-hidden mb-10">
            <div className="bg-[#5b4a37] text-white px-6 md:px-8 py-12">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold leading-[1.1] tracking-tight md:col-span-5 jimthompson">Meet Our Experts</h2>
                <p className="text-base sm:text-lg text-white/90 md:col-span-7 max-w-xl">Personalized guidance, bespoke design expertise, and styling advice for every occasion.</p>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="rounded-2xl overflow-hidden border border-[#5b4a37]  shadow-sm">
              <div className="h-3 bg-[#5b4a37]"></div>
              <div className="p-6">
                <h3 className="text-2xl font-semibold text-gray-900 mb-4">Senior Consultant</h3>
                <ul className="space-y-3 text-gray-800">
                  <li className="flex items-start gap-2"><span className="mt-1 h-1.5 w-1.5 rounded-full bg-gray-700"></span><span>Personalized guidance and style curation</span></li>
                  <li className="flex items-start gap-2"><span className="mt-1 h-1.5 w-1.5 rounded-full bg-gray-700"></span><span>Helps narrow choices across collections</span></li>
                  <li className="flex items-start gap-2"><span className="mt-1 h-1.5 w-1.5 rounded-full bg-gray-700"></span><span>Prepares you for a seamless in-store visit</span></li>
                </ul>
              </div>
            </div>
            <div className="rounded-2xl overflow-hidden border border-[#5b4a37]  shadow-sm">
              <div className="h-3 bg-[#5b4a37]"></div>
              <div className="p-6">
                <h3 className="text-2xl font-semibold text-gray-900 mb-4">Design Specialist</h3>
                <ul className="space-y-3 text-gray-800">
                  <li className="flex items-start gap-2"><span className="mt-1 h-1.5 w-1.5 rounded-full bg-gray-700"></span><span>Bespoke design workflow and CAD previews</span></li>
                  <li className="flex items-start gap-2"><span className="mt-1 h-1.5 w-1.5 rounded-full bg-gray-700"></span><span>Material selection and gemstone matching</span></li>
                  <li className="flex items-start gap-2"><span className="mt-1 h-1.5 w-1.5 rounded-full bg-gray-700"></span><span>Iterates until the design fits perfectly</span></li>
                </ul>
              </div>
            </div>
            <div className="rounded-2xl overflow-hidden border border-[#5b4a37]  shadow-sm">
              <div className="h-3 bg-[#5b4a37]"></div>
              <div className="p-6">
                <h3 className="text-2xl font-semibold text-gray-900 mb-4">Styling Advisor</h3>
                <ul className="space-y-3 text-gray-800">
                  <li className="flex items-start gap-2"><span className="mt-1 h-1.5 w-1.5 rounded-full bg-gray-700"></span><span>Bridal set coordination and layering</span></li>
                  <li className="flex items-start gap-2"><span className="mt-1 h-1.5 w-1.5 rounded-full bg-gray-700"></span><span>Cultural motif matching and symbolism</span></li>
                  <li className="flex items-start gap-2"><span className="mt-1 h-1.5 w-1.5 rounded-full bg-gray-700"></span><span>Photo-ready looks for your big day</span></li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

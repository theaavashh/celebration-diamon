"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Public_Sans } from "next/font/google";
import { getApiBaseUrl } from "@/lib/api";
import { FaEnvelope, FaPhone } from "react-icons/fa";

const publicSans = Public_Sans({ subsets: ["latin"], weight: ["400", "600", "700"], display: "swap" });

type SiteSettings = {
  email?: string;
  phone?: string;
  address?: string;
};

export default function ContactPage() {
  const [settings, setSettings] = useState<SiteSettings>({});
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [countryCode, setCountryCode] = useState("+66");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const apiBase = getApiBaseUrl();
        const res = await fetch(`${apiBase}/settings`, { credentials: "include" });
        const json = await res.json();
        if (res.ok && json?.success && json?.data) {
          setSettings({
            email: json.data.email || "support@celebrationdiamon.com",
            phone: json.data.phone || "+977-981282828",
            address: json.data.address || "NB Center, Sankhamul, Kathmandu",
          });
        }
      } catch {}
    };
    loadSettings();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await new Promise((r) => setTimeout(r, 600));
      setSubmitted(true);
      setName("");
      setEmail("");
      setCountryCode("+66");
      setPhone("");
      setMessage("");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className={`${publicSans.className} min-h-screen bg-white`}>
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-16 mt-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <section>
            <h1 className="text-5xl md:text-6xl jimthompson tracking-wide mb-8">GET IN TOUCH WITH US</h1>

            {settings.email && (
              <a href={`mailto:${settings.email}`} className="flex items-center gap-3 text-gray-900 mb-4">
                <FaEnvelope className="text-gray-700" />
                <span className="uppercase">{settings.email}</span>
              </a>
            )}

            {settings.phone && (
              <a href={`tel:${settings.phone}`} className="flex items-center gap-3 text-gray-900 mb-8">
                <FaPhone className="text-gray-700" />
                <span className="uppercase">{settings.phone}</span>
              </a>
            )}

            <hr className="border-t border-gray-300 my-8" />

            <div className="space-y-3">
              <h2 className="text-2xl jimthompson">Speak to Our CEO</h2>
              <p className="text-gray-700">Every Celebration Diamond experience tells a story, and yours is important to us.</p>
              <p className="text-gray-700">
                Share your thoughts with our Group CEO at
                {" "}
                <a href="mailto:frank.cancelloni@jimthompson.com" className="underline">frank.cancelloni@jimthompson.com</a>.
              </p>
              <p className="text-gray-700">You’ll receive a personal response within 48 hours.</p>
            </div>
          </section>

          <section>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                placeholder="Name*"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full h-12 border border-gray-300 rounded px-4"
              />

              <input
                type="email"
                placeholder="Email address*"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full h-12 border border-gray-300 rounded px-4"
              />

              <div className="flex items-center h-12 border border-gray-300 rounded overflow-hidden">
                <select
                  value={countryCode}
                  onChange={(e) => setCountryCode(e.target.value)}
                  className="h-full w-24 bg-white px-3 border-r border-gray-300"
                >
                  {['+977', '+91', '+66', '+1', '+44'].map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
                <input
                  type="tel"
                  placeholder="Phone number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="flex-1 h-full px-4"
                />
              </div>

              <textarea
                placeholder="Message*"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
                className="w-full min-h-[140px] border border-gray-300 rounded px-4 py-3"
              />

              <button
                type="submit"
                disabled={submitting}
                className="w-full h-14 bg-gray-400 text-white tracking-widest rounded hover:bg-gray-500 disabled:opacity-60"
              >
                {submitting ? "SENDING..." : "SEND"}
              </button>

              {submitted && (
                <div className="text-center text-green-700">Thanks! We’ve received your message.</div>
              )}
            </form>
          </section>
        </div>
      </div>
      <section className="w-full py-12 md:py-16 px-4 md:px-8 mt-16">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="relative w-full h-[320px] md:h-[420px] rounded-xl overflow-hidden">
            <Image src="/store.png" alt="Visit our stores" fill className="object-cover" />
          </div>
          <div>
            <h2 className="text-3xl md:text-4xl jimthompson mb-4">VISIT US</h2>
            <p className="text-gray-700 mb-6">Visit our stores and experience the artistry of design, the richness of materials, and the exceptional service that define Celebration Diamond.</p>
            <a href="/stores" className="underline">SEE OUR LOCATIONS</a>
          </div>
        </div>
      </section>
    </main>
  );
}

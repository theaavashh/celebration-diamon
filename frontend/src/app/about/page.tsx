"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { getApiBaseUrl, getImageUrl } from "@/lib/api";

type TeamMember = {
  id: string;
  name: string;
  role: string;
  bio: string;
  imageUrl?: string;
  sortOrder: number;
  isActive: boolean;
};

type AboutUsData = {
  heroTitle: string;
  heroSubtitle?: string;
  storyTitle: string;
  storyContent: string;
  storyImageUrl?: string;
  missionTitle: string;
  missionContent: string;
  visionTitle: string;
  visionContent: string;
};

const AboutPage = () => {
  const [about, setAbout] = useState<AboutUsData | null>(null);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadAbout = async () => {
      try {
        const res = await fetch(`${getApiBaseUrl()}/about-us`, { credentials: "include" });
        const json = await res.json();
        if (res.ok && json?.success && json.data) {
          const { teamMembers: tm, ...rest } = json.data;
          setAbout(rest as AboutUsData);
          setTeamMembers(Array.isArray(tm) ? tm : []);
        } else {
          setError("Failed to load About Us content");
        }
      } catch {
        setError("Failed to load About Us content");
      } finally {
        setLoading(false);
      }
    };
    loadAbout();
  }, []);

  return (
    <div className="w-full bg-white">
      {/* Split About Section */}
      <section className="w-full grid grid-cols-1 md:grid-cols-2 min-h-[70vh] md:h-screen">
        <div className="flex items-end md:items-center justify-start px-6 sm:px-10 md:px-16 lg:px-24 py-16">
          <div className="max-w-xl md:max-w-2xl">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 jimthompson mb-6 uppercase tracking-wide">
              {about?.heroTitle || "About Us"}
            </h2>
            {about?.heroSubtitle && (
              <div className="space-y-4 text-gray-700 leading-relaxed">
                <p>{about.heroSubtitle}</p>
              </div>
            )}
          </div>
        </div>

        <div className="relative h-[40vh] md:h-auto">
          <Image
            src={getImageUrl(about?.storyImageUrl) || "/abstract-gold-chain-presentation-rocks.jpg"}
            alt="Celebration Diamond studio"
            fill
            className="object-cover"
            onError={(e) => {
              // @ts-ignore
              e.currentTarget.src = '/Untitled.jpeg';
            }}
          />
        </div>
      </section>

      <section className="w-full py-16 sm:py-20 md:py-24 px-6 sm:px-10 md:px-16 lg:px-24 bg-white">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          <div className="rounded-xl border border-gray-200 bg-white p-6 sm:p-8 shadow-sm">
            <h3 className="text-2xl font-bold text-gray-900 jimthompson">{about?.missionTitle || "Our Mission"}</h3>
            <p className="mt-1 text-sm font-medium text-gray-800">Guides our craft</p>
            <p className="mt-3 text-gray-700 leading-relaxed">{about?.missionContent || ""}</p>
          </div>
          <div className="rounded-xl border border-gray-200 bg-white p-6 sm:p-8 shadow-sm">
            <h3 className="text-2xl font-bold text-gray-900 jimthompson">{about?.visionTitle || "Our Vision"}</h3>
            <p className="mt-1 text-sm font-medium text-gray-800">Inspires our future</p>
            <p className="mt-3 text-gray-700 leading-relaxed">{about?.visionContent || ""}</p>
          </div>
        </div>
      </section>

      <section className="w-full py-16 sm:py-20 md:py-24 px-6 sm:px-10 md:px-16 lg:px-24 bg-white">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div className="relative w-full h-[380px] sm:h-[420px] lg:h-[520px] rounded-2xl overflow-hidden shadow-xl">
            <Image
              src={getImageUrl(about?.storyImageUrl) || "/Elegant Gold Necklace.png"}
              alt="Crafting timeless beauty at Celebration Diamond"
              fill
              className="object-cover"
              onError={(e) => {
                // @ts-ignore
                e.currentTarget.src = '/Untitled.jpeg';
              }}
            />
          </div>
          <div>
            <p className="text-amber-700 font-semibold mb-2">Our Story</p>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 jimthompson uppercase tracking-wide mb-6">
              {about?.storyTitle || "Crafting Timeless Beauty"}
            </h2>
            <div className="space-y-4 text-lg text-gray-700 leading-relaxed">
              {about?.storyContent ? (
                <div dangerouslySetInnerHTML={{ __html: about.storyContent }} />
              ) : null}
            </div>
          </div>
        </div>
      </section>

      <section className="w-full py-16 sm:py-20 md:py-24 px-6 sm:px-10 md:px-16 lg:px-24 bg-emerald-50">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
          <div>
            <h2 className="text-4xl sm:text-5xl font-bold text-emerald-900 jimthompson">
              Meet Our Expert Team
            </h2>
            <p className="mt-4 text-emerald-900/80">
              Guided by seasoned artisans and specialists, our studio blends craft,
              innovation, and meticulous quality. Meet a few of the people behind
              our work.
            </p>
          </div>
          <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {teamMembers.map((member) => (
              <div key={member.id} className="relative rounded-2xl border border-emerald-200 bg-emerald-50/60 p-6 shadow-sm">
                <button aria-hidden className="absolute top-4 right-4 w-8 h-8 rounded-full bg-emerald-300 text-emerald-900 grid place-items-center">
                  +
                </button>
                <div className="flex items-center gap-4">
                  <div className="relative w-16 h-16 shrink-0 rounded-full overflow-hidden border border-emerald-200">
                    <Image
                      src={getImageUrl(member.imageUrl) || "/abstract-gold-chain-presentation-rocks.jpg"}
                      alt={member.name}
                      fill
                      className="object-cover"
                      onError={(e) => {
                        // @ts-ignore
                        e.currentTarget.src = '/Untitled.jpeg';
                      }}
                    />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-emerald-900 jimthompson">{member.name}</h3>
                    <p className="text-emerald-900/80">{member.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      {loading && (
        <div className="px-6 sm:px-10 md:px-16 lg:px-24 pb-12 text-gray-600">Loading...</div>
      )}
      {error && !loading && (
        <div className="px-6 sm:px-10 md:px-16 lg:px-24 pb-12 text-red-600">{error}</div>
      )}
    </div>
  );
};

export default AboutPage;








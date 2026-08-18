import React, { useEffect, useState } from 'react';
import { Language, PageId, TeamMember } from '../types';
import { translations } from '../translations';
import { 
  ShieldCheck, 
  Award, 
  Users, 
  Compass, 
  HeartHandshake, 
  Building2, 
  ArrowRight,
  Loader2,
  User
} from 'lucide-react';
import { getPublicTeamMembersApi, getFullImageUrl } from '../api/client';

interface AboutProps {
  setActivePage: (page: PageId) => void;
  lang: Language;
}

export const About: React.FC<AboutProps> = ({ setActivePage, lang }) => {
  const t = translations[lang] || translations.EN;
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadTeamMembers();
  }, []);

  const loadTeamMembers = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getPublicTeamMembersApi();
      console.log('📥 Team members loaded:', data);
      setTeamMembers(data);
    } catch (err) {
      setError('Failed to load team members. Please refresh the page.');
      console.error('Error loading team members:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-16 pb-16">
      
      {/* Banner */}
      <section className="bg-[#0b0f19] text-white py-14 px-4 text-center relative overflow-hidden border-b border-slate-800">
        <div className="max-w-4xl mx-auto space-y-3 relative z-10">
          <span className="inline-block px-3.5 py-1 rounded-full bg-red-900/50 text-red-400 font-bold text-xs uppercase tracking-wider border border-red-800/60">
            About Delta Travel & Tour
          </span>
          <h1 className="text-3xl sm:text-4xl font-black font-sans text-white">
            Decade of Spiritual Dedication & Service
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Established in 2021, Delta Travel & Tour is a premier licensed travel agency dedicated to facilitating comfortable, spiritually enriching, and seamless Umrah and Hajj journeys.
          </p>
        </div>
      </section>

      {/* History & Mission */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8 grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
        <div className="space-y-4">
          <span className="text-xs font-bold uppercase tracking-widest text-[#C8102E]">
            OUR JOURNEY
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
           5+ Years of Excellence in Holy Land Hospitality
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Delta Travel & Tour was founded with a singular vision: to remove all logistical anxiety from the sacred pilgrimage process, allowing worshippers to immerse themselves entirely in worship and contemplation.
          </p>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            With over 5 years of experience, Delta Travel stands out by offering well-organized umrah packages, personalized customer service, reliable travel arrangements, and dedicated support throughout the entire journey. We focus on making every pilgrim feel valued and ensuring a comfortable, peaceful, and memorable umrah experience.
          </p>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Delta travel operates with the required licenses and certifications from the relevant authorities and maintains the necessary approvals to provide travel and umrah services. we are committed to operating legally, professionally, and transparently while ensuring the safety and satisfaction of our customers.
          </p>

          <div className="grid grid-cols-2 gap-4 pt-2 text-xs">
            <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm">
              <h4 className="font-bold text-[#C8102E] text-sm">Our Mission</h4>
              <p className="text-[11px] text-slate-600 mt-1 leading-normal">To provide reliable, comfortable, and high quality umrah travel services, supporting pilgrims throughout their journey from travel arrangements to the their safe return. While serving them with professionalism, cares, and respect.</p>
            </div>
            <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm">
              <h4 className="font-bold text-[#C8102E] text-sm">Our Vision</h4>
              <p className="text-[11px] text-slate-600 mt-1 leading-normal">To remain the most trusted and tech-forward spiritual travel partner in the region.</p>
            </div>
          </div>
        </div>

        <div className="relative">
          <div className="rounded-2xl overflow-hidden shadow-lg border border-slate-200">
            <img 
              src="https://images.unsplash.com/photo-1564769625905-50e93615e769?auto=format&fit=crop&q=80&w=1000" 
              alt="Madinah Prophet Mosque" 
              className="w-full h-80 object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src = 'https://via.placeholder.com/1000x320/0b0f19/ffffff?text=Madinah+Mosque';
              }}
            />
          </div>
          <div className="absolute -bottom-5 -left-5 bg-white p-4 rounded-xl shadow-xl border border-slate-200 flex items-center gap-3 hidden sm:flex">
            <div className="w-10 h-10 rounded-lg bg-red-600 text-white flex items-center justify-center font-bold">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <p className="font-bold text-slate-900 text-xs">Ministry License #4812</p>
              <p className="text-[11px] text-slate-500">Officially Approved Hajj & Umrah Agency</p>
            </div>
          </div>
        </div>
      </section>

      {/* Certified Mutawwif Team - Fully Dynamic */}
      <section className="bg-white py-14 px-4 sm:px-8 border-y border-slate-200">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="text-center space-y-2">
            <span className="text-xs font-bold uppercase tracking-widest text-[#C8102E]">
              GUIDED BY KNOWLEDGE
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
              Meet Our Scholars & Mutawwif Team
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 max-w-xl mx-auto">
              Experienced religious leaders and ground logistics coordinators who accompany your group at every step.
            </p>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-12 space-y-3">
              <Loader2 className="w-8 h-8 animate-spin text-[#C8102E]" />
              <p className="text-xs text-slate-500">Loading team members...</p>
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <p className="text-red-600 text-sm">{error}</p>
              <button 
                onClick={loadTeamMembers} 
                className="mt-3 text-[#C8102E] text-xs font-bold underline hover:no-underline"
              >
                Retry
              </button>
            </div>
          ) : teamMembers.length === 0 ? (
            <div className="text-center py-12 bg-slate-50 rounded-xl border border-slate-200">
              <User className="w-12 h-12 mx-auto text-slate-300" />
              <p className="text-slate-500 text-sm mt-3">No team members available yet.</p>
              <p className="text-xs text-slate-400">Check back soon for updates.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {teamMembers.map((member) => {
                // Use getFullImageUrl to correctly map the image path
                const imageUrl = getFullImageUrl(member.imageUrl);
                console.log(`🖼️ Team member image URL: ${imageUrl}`);
                
                return (
                  <div 
                    key={member.id} 
                    className="bg-slate-50 rounded-xl p-6 shadow-sm border border-slate-200 text-center space-y-3 transition-all hover:shadow-md hover:border-[#C8102E]/30"
                  >
                    <img 
                      src={imageUrl} 
                      alt={member.name} 
                      className="w-20 h-20 rounded-full mx-auto object-cover border-2 border-red-600 shadow-sm"
                      onError={(e) => {
                        console.error(`❌ Failed to load image: ${imageUrl}`);
                        (e.target as HTMLImageElement).src = 'https://via.placeholder.com/80x80/cccccc/666666?text=?';
                      }}
                    />
                    <div>
                      <h3 className="font-bold text-slate-900 text-sm">{member.name}</h3>
                      <p className="text-xs text-[#C8102E] font-bold">{member.role}</p>
                    </div>
                    <p className="text-xs text-slate-600">{member.bio}</p>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Trust Badges & Licenses */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8 text-center space-y-8">
        <h3 className="text-xl font-bold text-slate-900">
          Licensed & Recognized by Official Authorities
        </h3>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto text-xs font-semibold text-slate-700">
          <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col items-center gap-2">
            <ShieldCheck className="w-7 h-7 text-red-600" />
            <span>Ministry of Hajj & Umrah (#4812)</span>
          </div>
          <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col items-center gap-2">
            <Award className="w-7 h-7 text-red-600" />
            <span>Saudi Tourism Authority Partner</span>
          </div>
          <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col items-center gap-2">
            <Building2 className="w-7 h-7 text-red-600" />
            <span>IATA Accredited Travel Agency</span>
          </div>
          <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col items-center gap-2">
            <HeartHandshake className="w-7 h-7 text-red-600" />
            <span>Nusuk Official Service Provider</span>
          </div>
        </div>

        <div className="pt-2">
          <button
            onClick={() => setActivePage('packages')}
            className="bg-[#C8102E] hover:bg-[#a60d25] text-white font-bold text-xs px-8 py-3 rounded-lg shadow transition-all inline-flex items-center gap-2"
          >
            <span>Explore Umrah Packages</span>
            <ArrowRight className="w-4 h-4 rtl:rotate-180" />
          </button>
        </div>
      </section>

    </div>
  );
};
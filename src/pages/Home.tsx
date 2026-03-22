import React from 'react';
import { Link } from 'react-router-dom';
import {
  Calendar, ArrowRight, Shield, BookOpen, Users, Award,
  MapPin, Clock, ChevronRight, Quote, Globe, Zap, Lock, Eye,
} from 'lucide-react';
import HeroCarousel from '../components/HeroCarousel';
import { useApi } from '../hooks/useApi';
import { contentAPI } from '../services/api';

const Home = () => {
  const { data: announcements, loading: aLoading } = useApi(contentAPI.getAnnouncements);
  const { data: events, loading: eLoading } = useApi(contentAPI.getEvents);
  const { data: founderMessages } = useApi(contentAPI.getFounderMessages);
  const latestMessage = founderMessages?.[0] ?? null;

  const stats = [
    { value: '5,000+', label: 'Members', icon: Users },
    { value: '30+', label: 'Countries', icon: Globe },
    { value: '100+', label: 'Events Hosted', icon: Calendar },
    { value: '50+', label: 'Certifications', icon: Award },
  ];

  const services = [
    { icon: Shield, title: 'Training & Certification', desc: 'Industry-recognised cybersecurity training programmes designed for practitioners at every level.', color: 'bg-blue-50 text-blue-600' },
    { icon: BookOpen, title: 'Research & Policy', desc: 'Cutting-edge research and advocacy shaping Africa\'s digital security landscape.', color: 'bg-violet-50 text-violet-600' },
    { icon: Users, title: 'Expert Consulting', desc: 'Specialised security consulting for organisations, governments, and critical infrastructure.', color: 'bg-emerald-50 text-emerald-600' },
    { icon: Zap, title: 'Cyber Awareness', desc: 'Public education campaigns promoting digital hygiene and cyber-safe behaviour.', color: 'bg-amber-50 text-amber-600' },
    { icon: Lock, title: 'Incident Response', desc: 'Rapid response frameworks and playbooks for handling security breaches effectively.', color: 'bg-red-50 text-red-600' },
    { icon: Eye, title: 'Threat Intelligence', desc: 'Actionable intelligence feeds and reports to keep your organisation ahead of threats.', color: 'bg-cyan-50 text-cyan-600' },
  ];

  return (
    <div className="flex flex-col bg-white">
      {/* ── Hero ── */}
      <HeroCarousel />

      {/* ── Stats bar ── */}
      <div className="bg-[#0A1A4A] border-t border-white/5">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-white/10">
            {stats.map((s) => (
              <div key={s.label} className="flex items-center gap-4 px-8 py-6">
                <div className="w-10 h-10 rounded-lg bg-[#1DB954]/15 flex items-center justify-center flex-shrink-0">
                  <s.icon className="h-5 w-5 text-[#1DB954]" />
                </div>
                <div>
                  <p className="text-white font-bold text-xl leading-tight">{s.value}</p>
                  <p className="text-white/45 text-xs mt-0.5">{s.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Announcements ── */}
      <section className="py-20 bg-[#F5F7FA]">
        <div className="container mx-auto px-4">
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="text-[#1DB954] text-xs font-bold uppercase tracking-widest mb-2">What's New</p>
              <h2 className="text-3xl md:text-4xl font-bold text-[#0A1A4A] leading-tight">Latest Announcements</h2>
            </div>
            <Link to="/announcements" className="hidden md:flex items-center gap-1.5 text-sm font-semibold text-[#0A1A4A] hover:text-[#1DB954] transition-colors">
              View all <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {aLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1,2,3].map(i => <div key={i} className="h-52 bg-gray-200 rounded-2xl animate-pulse" />)}
            </div>
          ) : announcements && announcements.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {announcements.slice(0, 3).map((item: any, idx: number) => (
                <Link
                  key={item._id}
                  to={`/announcements/${item._id}`}
                  className="group bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col"
                >
                  <div className="flex items-start justify-between mb-4">
                    <span className="text-[10px] font-bold uppercase tracking-widest bg-[#1DB954]/10 text-[#1DB954] px-2.5 py-1 rounded-full">
                      {item.category}
                    </span>
                    <span className="text-[10px] text-gray-400">
                      {item.date ? new Date(item.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : ''}
                    </span>
                  </div>
                  <h3 className="font-bold text-[#0A1A4A] text-base leading-snug mb-3 group-hover:text-[#1DB954] transition-colors line-clamp-2">
                    {item.title}
                  </h3>
                  <p className="text-gray-500 text-sm leading-relaxed line-clamp-3 flex-1">{item.description}</p>
                  <div className="flex items-center gap-1 mt-5 text-xs font-semibold text-[#1DB954]">
                    Read more <ChevronRight className="h-3.5 w-3.5" />
                  </div>
                  {/* Bottom accent */}
                  <div className={`absolute bottom-0 left-0 right-0 h-0.5 rounded-b-2xl bg-[#1DB954] scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left`} />
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-400 py-10">No announcements at the moment.</p>
          )}

          <div className="mt-8 flex md:hidden justify-center">
            <Link to="/announcements" className="flex items-center gap-1.5 text-sm font-semibold text-[#0A1A4A] hover:text-[#1DB954] transition-colors">
              View all announcements <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── About ACSP ── */}
      <section className="py-20 bg-white overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

            {/* Image side */}
            <div className="relative order-2 lg:order-1">
              <div className="absolute -inset-4 bg-[#1DB954]/8 rounded-3xl rotate-2" />
              <div className="absolute -inset-4 bg-[#0A1A4A]/5 rounded-3xl -rotate-1" />
              <img
                src="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=800&q=80"
                alt="Cybersecurity Professionals"
                className="relative rounded-2xl shadow-2xl w-full object-cover aspect-[4/3]"
              />
              {/* Floating stat card */}
              <div className="absolute -bottom-6 -right-4 bg-[#0A1A4A] text-white rounded-2xl px-5 py-4 shadow-xl">
                <p className="text-[#1DB954] text-2xl font-bold">12+</p>
                <p className="text-white/60 text-xs mt-0.5">Years of Excellence</p>
              </div>
              {/* Floating badge */}
              <div className="absolute -top-4 -left-4 bg-[#1DB954] rounded-xl px-4 py-2.5 shadow-lg">
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-[#0A1A4A]" />
                  <span className="text-[#0A1A4A] text-xs font-bold">Trusted Body</span>
                </div>
              </div>
            </div>

            {/* Text side */}
            <div className="order-1 lg:order-2">
              <p className="text-[#1DB954] text-xs font-bold uppercase tracking-widest mb-3">Who We Are</p>
              <h2 className="text-3xl md:text-4xl font-bold text-[#0A1A4A] leading-tight mb-6">
                Africa's Premier Cybersecurity Professional Body
              </h2>
              <p className="text-gray-500 leading-relaxed mb-6">
                The Association of Cybersecurity Practitioners (ACSP) brings together experts, researchers, and practitioners to foster innovation, establish standards, and promote a secure digital future across Africa and beyond.
              </p>
              <p className="text-gray-500 leading-relaxed mb-8">
                We are committed to building a resilient cybersecurity workforce through education, collaboration, and advocacy at every level — from students to C-suite executives.
              </p>

              {/* Mini stats */}
              <div className="grid grid-cols-2 gap-4 mb-8">
                {[
                  { icon: Users, label: 'Active Members', value: '5,000+' },
                  { icon: Award, label: 'Certifications', value: '50+' },
                  { icon: Globe, label: 'Countries', value: '30+' },
                  { icon: Calendar, label: 'Annual Events', value: '20+' },
                ].map(s => (
                  <div key={s.label} className="flex items-center gap-3 bg-[#F5F7FA] rounded-xl p-4">
                    <div className="w-9 h-9 rounded-lg bg-[#0A1A4A]/8 flex items-center justify-center flex-shrink-0">
                      <s.icon className="h-4 w-4 text-[#0A1A4A]" />
                    </div>
                    <div>
                      <p className="font-bold text-[#0A1A4A] text-base leading-none">{s.value}</p>
                      <p className="text-gray-500 text-[11px] mt-0.5">{s.label}</p>
                    </div>
                  </div>
                ))}
              </div>

              <Link
                to="/about"
                className="inline-flex items-center gap-2 bg-[#0A1A4A] hover:bg-[#0D2260] text-white font-semibold py-3.5 px-7 rounded-xl text-sm transition-all duration-200 shadow-lg shadow-[#0A1A4A]/20 hover:-translate-y-0.5"
              >
                Learn More About ACSP <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Events ── */}
      <section className="py-20 bg-[#0A1A4A] relative overflow-hidden">
        {/* BG decoration */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.04]">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="events-grid" width="60" height="60" patternUnits="userSpaceOnUse">
                <path d="M 60 0 L 0 0 0 60" fill="none" stroke="white" strokeWidth="1"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#events-grid)" />
          </svg>
        </div>
        <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full border border-white/5" />
        <div className="absolute -bottom-20 -left-20 w-64 h-64 rounded-full border border-white/5" />

        <div className="container mx-auto px-4 relative z-10">
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="text-[#1DB954] text-xs font-bold uppercase tracking-widest mb-2">What's Coming</p>
              <h2 className="text-3xl md:text-4xl font-bold text-white leading-tight">Upcoming Events</h2>
            </div>
            <Link to="/events" className="hidden md:flex items-center gap-1.5 text-sm font-semibold text-white/60 hover:text-[#1DB954] transition-colors">
              View all <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {eLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[1,2].map(i => <div key={i} className="h-44 bg-white/5 rounded-2xl animate-pulse" />)}
            </div>
          ) : events && events.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {events.slice(0, 4).map((event: any) => (
                <div key={event._id} className="group bg-white/5 hover:bg-white/10 border border-white/10 hover:border-[#1DB954]/40 rounded-2xl p-6 flex gap-5 transition-all duration-300 hover:-translate-y-0.5">
                  {/* Date block */}
                  <div className="flex-shrink-0 w-14 flex flex-col items-center justify-center bg-[#1DB954]/15 border border-[#1DB954]/25 rounded-xl p-2 text-center">
                    <span className="text-[#1DB954] text-xl font-bold leading-none">
                      {event.date ? new Date(event.date).getDate() : '—'}
                    </span>
                    <span className="text-[#1DB954]/70 text-[10px] font-semibold uppercase mt-1">
                      {event.date ? new Date(event.date).toLocaleString('en', { month: 'short' }) : ''}
                    </span>
                  </div>
                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-[10px] font-bold uppercase tracking-widest bg-white/10 text-white/70 px-2 py-0.5 rounded-full">{event.type}</span>
                    </div>
                    <h3 className="text-white font-bold text-base leading-snug mb-2 group-hover:text-[#1DB954] transition-colors line-clamp-2">{event.title}</h3>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-white/50">
                      {event.venue && <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{event.venue}</span>}
                      {event.time && <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{event.time}</span>}
                    </div>
                  </div>
                  <Link to="/events" className="flex-shrink-0 self-center w-9 h-9 rounded-full bg-white/10 group-hover:bg-[#1DB954] flex items-center justify-center transition-colors duration-300">
                    <ArrowRight className="h-4 w-4 text-white" />
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-white/40 py-10">No upcoming events at the moment.</p>
          )}

          <div className="mt-8 text-center">
            <Link to="/events" className="inline-flex items-center gap-2 border border-white/20 hover:border-[#1DB954] text-white hover:text-[#1DB954] font-semibold py-3 px-7 rounded-xl text-sm transition-all duration-200">
              See All Events <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── Services ── */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-14">
            <p className="text-[#1DB954] text-xs font-bold uppercase tracking-widest mb-2">What We Offer</p>
            <h2 className="text-3xl md:text-4xl font-bold text-[#0A1A4A] mb-4">Our Services</h2>
            <p className="text-gray-500 max-w-xl mx-auto text-sm leading-relaxed">
              Empowering cybersecurity professionals with the tools, knowledge, and networks they need to thrive.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((s, i) => (
              <div key={i} className="group bg-[#F5F7FA] hover:bg-white border border-transparent hover:border-gray-100 rounded-2xl p-7 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer">
                <div className={`w-12 h-12 rounded-xl ${s.color} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300`}>
                  <s.icon className="h-5 w-5" />
                </div>
                <h3 className="font-bold text-[#0A1A4A] text-base mb-2">{s.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{s.desc}</p>
                <div className="mt-5 flex items-center gap-1 text-xs font-semibold text-[#1DB954] opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  Learn more <ChevronRight className="h-3.5 w-3.5" />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link to="/services" className="inline-flex items-center gap-2 bg-[#0A1A4A] hover:bg-[#0D2260] text-white font-semibold py-3.5 px-7 rounded-xl text-sm transition-all duration-200 shadow-lg shadow-[#0A1A4A]/20 hover:-translate-y-0.5">
              Explore All Services <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── Founder's Message ── */}
      {latestMessage && (
        <section className="py-20 bg-[#F5F7FA]">
          <div className="container mx-auto px-4">
            <div className="flex items-end justify-between mb-10">
              <div>
                <p className="text-[#1DB954] text-xs font-bold uppercase tracking-widest mb-2">From the Desk</p>
                <h2 className="text-3xl md:text-4xl font-bold text-[#0A1A4A] leading-tight">Founder's Message</h2>
              </div>
              <Link to="/newsletter" className="hidden md:flex items-center gap-1.5 text-sm font-semibold text-[#0A1A4A] hover:text-[#1DB954] transition-colors">
                All Newsletters <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="max-w-4xl mx-auto bg-white rounded-3xl p-8 md:p-10 shadow-lg border border-gray-100 relative overflow-hidden">
              {/* Large quote decoration */}
              <div className="absolute top-6 right-8 opacity-5">
                <Quote className="h-32 w-32 text-[#0A1A4A]" />
              </div>
              {/* Green bar */}
              <div className="absolute top-0 left-0 bottom-0 w-1 bg-[#1DB954] rounded-l-3xl" />

              <div className="flex flex-wrap items-center gap-3 mb-6 pl-4">
                <span className="text-xs font-bold uppercase tracking-widest bg-[#0A1A4A]/8 text-[#0A1A4A] px-3 py-1.5 rounded-full">
                  {latestMessage.edition}
                </span>
                <span className="text-gray-400 text-xs flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {latestMessage.date ? new Date(latestMessage.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }) : latestMessage.date}
                </span>
              </div>

              {latestMessage.newsletterTitle && (
                <h3 className="text-xl font-bold text-[#0A1A4A] mb-4 pl-4 leading-snug">{latestMessage.newsletterTitle}</h3>
              )}

              <p className="text-gray-600 leading-relaxed line-clamp-5 pl-4 text-base relative z-10">
                {latestMessage.content}
              </p>

              <div className="border-t border-gray-100 mt-8 pt-6 pl-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#0A1A4A]/10 flex items-center justify-center">
                    <span className="text-[#0A1A4A] text-sm font-bold">
                      {latestMessage.authorName?.split(' ').map((n: string) => n[0]).join('').slice(0, 2)}
                    </span>
                  </div>
                  <div>
                    <p className="font-bold text-[#0A1A4A] text-sm">{latestMessage.authorName}</p>
                    <p className="text-gray-400 text-xs">{latestMessage.authorTitle}</p>
                  </div>
                </div>
                <Link
                  to="/newsletter"
                  className="inline-flex items-center gap-2 bg-[#0A1A4A] text-white hover:bg-[#0D2260] font-semibold py-2.5 px-5 rounded-xl text-xs transition-all duration-200 hover:-translate-y-0.5"
                >
                  Read Full Message <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ── CTA ── */}
      <section className="py-24 bg-[#0A1A4A] relative overflow-hidden">
        {/* Decorations */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.04]">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="cta-grid" width="60" height="60" patternUnits="userSpaceOnUse">
                <path d="M 60 0 L 0 0 0 60" fill="none" stroke="white" strokeWidth="1"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#cta-grid)" />
          </svg>
        </div>
        <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full border border-white/5" />
        <div className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full border border-white/5" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full border border-[#1DB954]/5" />

        <div className="container mx-auto px-4 relative z-10 text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-[#1DB954]/15 border border-[#1DB954]/25 text-[#1DB954] text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-full mb-8">
            <Shield className="h-3.5 w-3.5" /> Join the Community
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white leading-tight mb-6">
            Ready to Advance Your Cybersecurity Career?
          </h2>
          <p className="text-white/60 text-lg leading-relaxed mb-10">
            Become a member of ACSP today and unlock exclusive resources, networking opportunities, mentorship programmes, and professional development tools.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/register"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#1DB954] hover:bg-[#17a348] text-[#0A1A4A] font-bold py-4 px-10 rounded-xl text-sm transition-all duration-200 shadow-xl shadow-[#1DB954]/20 hover:-translate-y-0.5"
            >
              Become a Member <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to="/contact"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/15 backdrop-blur-sm text-white font-semibold py-4 px-10 rounded-xl text-sm border border-white/20 transition-all duration-200 hover:-translate-y-0.5"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;

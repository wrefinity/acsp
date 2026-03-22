import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Shield } from 'lucide-react';
import { useApi } from '../hooks/useApi';
import { contentAPI } from '../services/api';

const HeroCarousel = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [progress, setProgress] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const progressRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const { data: slides, loading } = useApi(contentAPI.getCarouselSlides);

  const DURATION = 6000;

  const startTimers = (index: number) => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (progressRef.current) clearInterval(progressRef.current);
    setProgress(0);
    let p = 0;
    progressRef.current = setInterval(() => {
      p += 100 / (DURATION / 50);
      setProgress(Math.min(p, 100));
    }, 50);
    intervalRef.current = setInterval(() => {
      setCurrentSlide(prev => {
        const next = slides && prev === slides.length - 1 ? 0 : prev + 1;
        return next;
      });
    }, DURATION);
  };

  useEffect(() => {
    if (slides && slides.length > 0) startTimers(currentSlide);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (progressRef.current) clearInterval(progressRef.current);
    };
  }, [slides, currentSlide]);

  const goTo = (index: number) => {
    setCurrentSlide(index);
  };

  const prev = () => goTo(slides && currentSlide === 0 ? slides.length - 1 : currentSlide - 1);
  const next = () => goTo(slides && currentSlide === slides.length - 1 ? 0 : currentSlide + 1);

  const fallback = [
    {
      _id: 'f1',
      title: 'Securing Africa\'s Digital Future',
      subtitle: 'The premier association connecting cybersecurity professionals across the continent.',
      ctaText: 'Join ACSP Today',
      ctaLink: '/register',
      imageUrl: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=1920&q=80',
    },
  ];

  const data = (!loading && slides && slides.length > 0) ? slides : fallback;
  const slide = data[currentSlide] || data[0];

  return (
    <div className="relative h-[88vh] min-h-[560px] w-full overflow-hidden bg-[#0A1A4A]">

      {/* Slides */}
      {data.map((s: any, i: number) => (
        <div
          key={s._id || i}
          className={`absolute inset-0 transition-opacity duration-1000 ${i === currentSlide ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        >
          <img src={s.imageUrl} alt={s.title} className="w-full h-full object-cover" />
          {/* Multi-layer gradient */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#0A1A4A]/95 via-[#0A1A4A]/70 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A1A4A]/80 via-transparent to-transparent" />
        </div>
      ))}

      {/* Decorative grid */}
      <div className="absolute inset-0 z-10 pointer-events-none opacity-[0.04]">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="hero-grid" width="60" height="60" patternUnits="userSpaceOnUse">
              <path d="M 60 0 L 0 0 0 60" fill="none" stroke="white" strokeWidth="1"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#hero-grid)" />
        </svg>
      </div>

      {/* Floating accent dots */}
      <div className="absolute top-1/4 right-1/4 w-2 h-2 rounded-full bg-[#1DB954]/60 z-10 animate-pulse" />
      <div className="absolute top-1/3 right-1/3 w-1.5 h-1.5 rounded-full bg-[#1DB954]/40 z-10 animate-pulse delay-300" />
      <div className="absolute bottom-1/3 right-1/5 w-1 h-1 rounded-full bg-white/30 z-10" />

      {/* Content */}
      <div className="absolute inset-0 z-20 flex flex-col justify-center px-8 md:px-16 lg:px-24 max-w-5xl">

        {/* Tag */}
        <div className="flex items-center gap-2 mb-6">
          <div className="w-7 h-7 rounded-md bg-[#1DB954]/20 border border-[#1DB954]/30 flex items-center justify-center">
            <Shield className="h-3.5 w-3.5 text-[#1DB954]" />
          </div>
          <span className="text-[#1DB954] text-xs font-semibold tracking-widest uppercase">Association of Cybersecurity Practitioners</span>
        </div>

        {/* Title */}
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white leading-[1.05] tracking-tight mb-6 max-w-3xl">
          {slide.title}
        </h1>

        {/* Divider */}
        <div className="flex items-center gap-3 mb-6">
          <div className="h-0.5 w-12 bg-[#1DB954]" />
          <div className="h-0.5 w-4 bg-[#1DB954]/40" />
        </div>

        {/* Subtitle */}
        <p className="text-gray-300 text-lg md:text-xl leading-relaxed mb-10 max-w-xl">
          {slide.subtitle}
        </p>

        {/* CTAs */}
        <div className="flex flex-wrap gap-4">
          <Link
            to={slide.ctaLink || '/register'}
            className="inline-flex items-center gap-2 bg-[#1DB954] hover:bg-[#17a348] text-[#0A1A4A] font-bold py-3.5 px-8 rounded-xl text-sm transition-all duration-200 shadow-lg shadow-[#1DB954]/25 hover:-translate-y-0.5"
          >
            {slide.ctaText || 'Get Started'}
          </Link>
          <Link
            to="/about"
            className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white font-semibold py-3.5 px-8 rounded-xl text-sm border border-white/20 transition-all duration-200 hover:-translate-y-0.5"
          >
            Learn More
          </Link>
        </div>
      </div>

      {/* Slide counter */}
      <div className="absolute bottom-12 right-8 md:right-16 z-30 flex items-center gap-3">
        <span className="text-white font-bold text-xl tabular-nums">{String(currentSlide + 1).padStart(2, '0')}</span>
        <div className="w-px h-8 bg-white/30" />
        <span className="text-white/40 font-medium text-sm tabular-nums">{String(data.length).padStart(2, '0')}</span>
      </div>

      {/* Progress bar */}
      <div className="absolute bottom-0 left-0 right-0 z-30 h-0.5 bg-white/10">
        <div
          className="h-full bg-[#1DB954] transition-none"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Dot indicators */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2">
        {data.map((_: any, i: number) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            className={`transition-all duration-300 rounded-full ${
              i === currentSlide ? 'w-8 h-2 bg-[#1DB954]' : 'w-2 h-2 bg-white/30 hover:bg-white/60'
            }`}
          />
        ))}
      </div>

      {/* Arrow controls */}
      <button
        onClick={prev}
        className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-30 w-11 h-11 rounded-full bg-white/10 hover:bg-white/25 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white transition-all duration-200 hover:-translate-y-[calc(50%+2px)]"
      >
        <ChevronLeft size={20} />
      </button>
      <button
        onClick={next}
        className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-30 w-11 h-11 rounded-full bg-white/10 hover:bg-white/25 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white transition-all duration-200 hover:-translate-y-[calc(50%+2px)]"
      >
        <ChevronRight size={20} />
      </button>
    </div>
  );
};

export default HeroCarousel;

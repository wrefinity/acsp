import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useApi } from '../hooks/useApi';
import { contentAPI } from '../services/api';
import LoadingSpinner from './common/LoadingSpinner';

const HeroCarousel = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const { data: slides, loading, error } = useApi(contentAPI.getCarouselSlides);

  useEffect(() => {
    const interval = setInterval(() => {
      if (slides && slides.length > 0) {
        setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
      }
    }, 5000);
    return () => clearInterval(interval);
  }, [slides]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[600px] bg-primary">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-[600px] bg-primary text-white text-xl">
        Error loading carousel: {error.message}
      </div>
    );
  }

  if (!slides || slides.length === 0) {
    return (
      <div className="flex justify-center items-center h-[600px] bg-primary text-white text-xl">
        No carousel slides available.
      </div>
    );
  }

  return (
    <div className="relative h-[600px] w-full overflow-hidden bg-primary">
      {slides.map((slide: any, index: any) => (
        <div
          key={slide.id}
          className={`absolute top-0 left-0 w-full h-full transition-opacity duration-1000 ease-in-out ${
            index === currentSlide ? 'opacity-100' : 'opacity-0'
          }`}
        >
          {/* Background Image with Overlay */}
          <div className="absolute inset-0 bg-black/50 z-10"></div>
          <img
            src={slide.image}
            alt={slide.title}
            className="w-full h-full object-cover"
          />

          {/* Content */}
          <div className="absolute inset-0 z-20 flex flex-col justify-center items-center text-center px-4">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 tracking-tight animate-fade-in-up">
              {slide.title}
            </h1>
            <p className="text-xl md:text-2xl text-gray-200 mb-8 max-w-3xl animate-fade-in-up delay-100">
              {slide.subtitle}
            </p>
            <Link
              to={slide.ctaLink}
              className="bg-secondary hover:bg-secondary-light text-primary font-bold py-3 px-8 rounded-full text-lg transition-transform transform hover:scale-105 animate-fade-in-up delay-200"
            >
              {slide.ctaText}
            </Link>
          </div>
        </div>
      ))}

      {/* Controls */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 z-30 bg-white/20 hover:bg-white/40 p-2 rounded-full text-white transition-colors"
      >
        <ChevronLeft size={32} />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 z-30 bg-white/20 hover:bg-white/40 p-2 rounded-full text-white transition-colors"
      >
        <ChevronRight size={32} />
      </button>

      {/* Indicators */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-30 flex space-x-3">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-3 h-3 rounded-full transition-colors ${
              index === currentSlide ? 'bg-secondary' : 'bg-white/50'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default HeroCarousel;

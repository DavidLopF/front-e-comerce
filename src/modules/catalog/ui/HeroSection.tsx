'use client';

import { useState, useEffect } from 'react';
import { heroService, HeroSlide } from '../services/HeroService';

export default function HeroSection() {
  const [slides, setSlides] = useState<HeroSlide[]>([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [scrollY, setScrollY] = useState(0);

  // Filtrar slides activos
  const activeSlides = slides.filter(slide => slide.isActive);

  useEffect(() => {
    // Cargar slides del hero
    const loadSlides = async () => {
      try {
        console.log('🔄 Cargando slides del hero...');
        const heroSlides = await heroService.getSlides();
        console.log('✅ Slides cargados:', heroSlides);
        setSlides(heroSlides);
        setIsLoading(false);
      } catch (error) {
        console.error('❌ Error al cargar slides del hero:', error);
        setIsLoading(false);
      }
    };

    loadSlides();
  }, []);

  useEffect(() => {
    // Efecto parallax con scroll
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (activeSlides.length === 0) return;

    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % activeSlides.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [activeSlides]);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % activeSlides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + activeSlides.length) % activeSlides.length);
  };

  const scrollToCatalog = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    const catalogElement = document.getElementById('catalogo');
    if (catalogElement) {
      catalogElement.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
  };

  if (isLoading) {
    return (
      <section className="relative h-[500px] overflow-hidden rounded-2xl mb-8 bg-gray-200 animate-pulse">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Cargando contenido...</p>
          </div>
        </div>
      </section>
    );
  }

  if (activeSlides.length === 0) {
    return (
      <section className="relative h-[500px] overflow-hidden rounded-2xl mb-8 bg-gray-100">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <p className="text-gray-600">No hay contenido disponible</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="relative h-screen w-full overflow-hidden mb-8">
      {/* Slides */}
      <div className="relative h-full">
        {activeSlides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentSlide ? 'opacity-100' : 'opacity-0'
            }`}
          >
            {/* Background Image */}
            <div 
              className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/70"
              style={{
                backgroundImage: `url(${slide.imageUrl})`,
                backgroundSize: 'cover',
                backgroundPosition: `center ${scrollY * 0.5}px`,
                backgroundAttachment: 'fixed',
                transform: `translateY(${scrollY * 0.3}px)`,
              }}
            />
            
            {/* Overlay adicional para mejor contraste */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-900/40 via-purple-900/30 to-indigo-900/40"></div>
            
            {/* Content */}
            <div className="relative z-10 h-full flex items-center">
              <div className="w-full px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
                    {/* Texto principal */}
                    <div className="text-center lg:text-left">
                      <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black text-white mb-4 sm:mb-6 leading-tight">
                        <span className="bg-gradient-to-r from-white via-blue-100 to-purple-200 bg-clip-text text-transparent">
                          {slide.title}
                        </span>
                      </h1>
                      <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-blue-200 mb-4 sm:mb-6">
                        {slide.subtitle}
                      </h2>
                      <p className="text-base sm:text-lg md:text-xl text-gray-100 mb-6 sm:mb-8 lg:mb-10 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                        {slide.description}
                      </p>
                      
                      {/* Botones mejorados con mejor espaciado */}
                      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start mb-16 sm:mb-20 lg:mb-24">
                        <button
                          onClick={scrollToCatalog}
                          className="inline-block bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 sm:px-8 lg:px-10 py-3 sm:py-4 rounded-full font-bold text-base sm:text-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-2xl hero-button-glow"
                        >
                          {slide.cta}
                        </button>
                        <button
                          onClick={scrollToCatalog}
                          className="inline-block border-2 border-white text-white px-6 sm:px-8 lg:px-10 py-3 sm:py-4 rounded-full font-bold text-base sm:text-lg hover:bg-white hover:text-gray-900 transition-all duration-300 transform hover:scale-105"
                        >
                          Ver Catálogo
                        </button>
                      </div>
                    </div>
                    
                    {/* Imagen destacada - Solo en desktop */}
                    <div className="hidden lg:block">
                      <div className="relative">
                        <div className="w-full h-96 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-3xl backdrop-blur-sm border border-white/20 p-8">
                          <div className="w-full h-full bg-white/10 rounded-2xl flex items-center justify-center">
                            <div className="text-center text-white">
                              <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.293l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z" clipRule="evenodd" />
                                </svg>
                              </div>
                              <h3 className="text-2xl font-bold mb-2">Calidad Premium</h3>
                              <p className="text-blue-200">Productos seleccionados</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Arrows - Solo en desktop */}
      <button
        onClick={prevSlide}
        className="hidden lg:block absolute left-6 top-1/2 transform -translate-y-1/2 z-50 bg-black/30 hover:bg-black/50 backdrop-blur-sm text-white p-4 rounded-full transition-all duration-300 hover:scale-110 border border-white/20 cursor-pointer"
        aria-label="Slide anterior"
        style={{ pointerEvents: 'auto' }}
      >
        <svg className="w-8 h-8 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      
      <button
        onClick={nextSlide}
        className="hidden lg:block absolute right-6 top-1/2 transform -translate-y-1/2 z-50 bg-black/30 hover:bg-black/50 backdrop-blur-sm text-white p-4 rounded-full transition-all duration-300 hover:scale-110 border border-white/20 cursor-pointer"
        aria-label="Siguiente slide"
        style={{ pointerEvents: 'auto' }}
      >
        <svg className="w-8 h-8 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* Dots Indicator - Reposicionado para evitar superposición */}
      <div className="absolute bottom-16 sm:bottom-20 lg:bottom-24 left-1/2 transform -translate-x-1/2 flex space-x-3 z-40">
        {activeSlides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 sm:w-4 sm:h-4 rounded-full transition-all duration-300 border-2 cursor-pointer ${
              index === currentSlide 
                ? 'bg-white border-white scale-125' 
                : 'bg-white/30 border-white/50 hover:bg-white/50'
            }`}
            aria-label={`Ir al slide ${index + 1}`}
            style={{ pointerEvents: 'auto' }}
          />
        ))}
      </div>

      {/* Scroll Indicator - Reposicionado */}
      <div className="absolute bottom-4 sm:bottom-6 left-1/2 transform -translate-x-1/2 scroll-indicator z-40">
        <button
          onClick={(e) => {
            e.preventDefault();
            const catalogElement = document.getElementById('catalogo');
            if (catalogElement) {
              catalogElement.scrollIntoView({
                behavior: 'smooth',
                block: 'start',
              });
            }
          }}
          className="text-white/80 hover:text-white transition-colors duration-300 cursor-pointer"
          aria-label="Ir al catálogo"
          style={{ pointerEvents: 'auto' }}
        >
          <div className="flex flex-col items-center pointer-events-none">
            <span className="text-xs sm:text-sm font-medium mb-1 sm:mb-2">Explorar Productos</span>
            <svg className="w-4 h-4 sm:w-6 sm:h-6 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </div>
        </button>
      </div>
    </section>
  );
}

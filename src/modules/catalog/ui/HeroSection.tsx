'use client';

import { useState, useEffect } from 'react';
import { useStoreConfigContext } from '@/shared/providers/StoreConfigProvider';

export default function HeroSection() {
  const { config, loading } = useStoreConfigContext();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [scrollY, setScrollY] = useState(0);

  // Obtener slides de la configuración
  const slides = config?.hero?.slides || [];
  const isHeroEnabled = config?.hero?.enabled ?? true;
  const autoplay = config?.hero?.autoplay ?? true;
  const autoplayInterval = config?.hero?.autoplayInterval ?? 5000;
  const showArrows = config?.hero?.showArrows ?? true;
  const showDots = config?.hero?.showDots ?? true;

  // Colores dinámicos del tema
  const primaryColor = config?.theme?.colors?.primary || '#3b82f6';
  const primaryHover = config?.theme?.colors?.primaryHover || primaryColor;
  const secondaryColor = config?.theme?.colors?.secondary || '#8b5cf6';
  const secondaryHover = config?.theme?.colors?.secondaryHover || secondaryColor;
  const accentColor = config?.theme?.colors?.accent || '#f59e0b';

  // Función para normalizar colores (agregar # si no lo tiene)
  const normalizeColor = (color: string | undefined, fallback: string) => {
    if (!color) return fallback;
    return color.startsWith('#') ? color : `#${color}`;
  };

  // Colores normalizados
  const normalizedPrimary = normalizeColor(primaryColor, '#3b82f6');
  const normalizedSecondary = normalizeColor(secondaryColor, '#8b5cf6');
  const normalizedAccent = normalizeColor(accentColor, '#f59e0b');

  // Filtrar slides activos
  const activeSlides = slides.filter(slide => slide.isActive);

  useEffect(() => {
    // Efecto parallax con scroll
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (activeSlides.length === 0 || !autoplay) return;

    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % activeSlides.length);
    }, autoplayInterval);

    return () => clearInterval(timer);
  }, [activeSlides, autoplay, autoplayInterval]);

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

  // Si está cargando o el hero está deshabilitado
  if (loading) {
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

  if (!isHeroEnabled || activeSlides.length === 0) {
    return null; // No mostrar nada si está deshabilitado
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
              className="absolute inset-0"
              style={{
                backgroundImage: `url(${slide.imageUrl})`,
                backgroundSize: 'cover',
                backgroundPosition: `center ${scrollY * 0.5}px`,
                backgroundAttachment: 'fixed',
                transform: `translateY(${scrollY * 0.3}px)`,
                backgroundColor: slide.backgroundColor || '#000000',
              }}
            />
            
            {/* Overlay dinámico */}
            {slide.overlay && (
              <div 
                className="absolute inset-0"
                style={{
                  backgroundColor: `rgba(0, 0, 0, ${slide.overlayOpacity || 0.5})`
                }}
              />
            )}
            
            {/* Content */}
            <div className="relative z-10 h-full flex items-center">
              <div className="w-full px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
                    {/* Texto principal */}
                    <div 
                      className={`text-center ${
                        slide.alignment === 'left' ? 'lg:text-left' : 
                        slide.alignment === 'right' ? 'lg:text-right' : 
                        'lg:text-center'
                      }`}
                    >
                      <h1 
                        className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black mb-4 sm:mb-6 leading-tight"
                        style={{ color: slide.textColor || '#ffffff' }}
                      >
                        {slide.title}
                      </h1>
                      {slide.subtitle && (
                        <h2 
                          className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold mb-4 sm:mb-6"
                          style={{ color: slide.textColor || '#ffffff' }}
                        >
                          {slide.subtitle}
                        </h2>
                      )}
                      {slide.description && (
                        <p 
                          className="text-base sm:text-lg md:text-xl mb-6 sm:mb-8 lg:mb-10 max-w-2xl mx-auto lg:mx-0 leading-relaxed"
                          style={{ color: slide.textColor || '#ffffff' }}
                        >
                          {slide.description}
                        </p>
                      )}
                      
                      {/* Botones dinámicos */}
                      {(slide.cta || slide.secondaryCta) && (
                        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start mb-16 sm:mb-20 lg:mb-24">
                          {slide.cta && (
                            <a
                              href={slide.cta.link}
                              className={`inline-block px-6 sm:px-8 lg:px-10 py-3 sm:py-4 rounded-full font-bold text-base sm:text-lg transition-all duration-300 transform hover:scale-105 shadow-2xl ${
                                slide.cta.style === 'primary' ? 'text-white' :
                                slide.cta.style === 'secondary' ? 'text-white' :
                                slide.cta.style === 'accent' ? 'text-white' :
                                'border-2 border-white text-white hover:bg-white hover:text-gray-900'
                              }`}
                              style={slide.cta.style === 'primary' ? {
                                backgroundColor: normalizedPrimary,
                              } : slide.cta.style === 'secondary' ? {
                                backgroundColor: normalizedSecondary,
                              } : slide.cta.style === 'accent' ? {
                                backgroundColor: normalizedAccent,
                              } : {}}
                              onMouseEnter={(e) => {
                                if (slide.cta.style === 'primary') {
                                  e.currentTarget.style.backgroundColor = primaryHover;
                                } else if (slide.cta.style === 'secondary') {
                                  e.currentTarget.style.backgroundColor = secondaryHover;
                                }
                              }}
                              onMouseLeave={(e) => {
                                if (slide.cta.style === 'primary') {
                                  e.currentTarget.style.backgroundColor = normalizedPrimary;
                                } else if (slide.cta.style === 'secondary') {
                                  e.currentTarget.style.backgroundColor = normalizedSecondary;
                                }
                              }}
                            >
                              {slide.cta.text}
                            </a>
                          )}
                          {slide.secondaryCta && (
                            <a
                              href={slide.secondaryCta.link}
                              className={`inline-block px-6 sm:px-8 lg:px-10 py-3 sm:py-4 rounded-full font-bold text-base sm:text-lg transition-all duration-300 transform hover:scale-105 ${
                                slide.secondaryCta.style === 'primary' ? 'text-white' :
                                slide.secondaryCta.style === 'secondary' ? 'text-white' :
                                slide.secondaryCta.style === 'accent' ? 'text-white' :
                                'border-2 border-white text-white hover:bg-white hover:text-gray-900'
                              }`}
                              style={slide.secondaryCta.style === 'primary' ? {
                                backgroundColor: normalizedPrimary,
                              } : slide.secondaryCta.style === 'secondary' ? {
                                backgroundColor: normalizedSecondary,
                              } : slide.secondaryCta.style === 'accent' ? {
                                backgroundColor: normalizedAccent,
                              } : {}}
                              onMouseEnter={(e) => {
                                if (slide.secondaryCta.style === 'primary') {
                                  e.currentTarget.style.backgroundColor = primaryHover;
                                } else if (slide.secondaryCta.style === 'secondary') {
                                  e.currentTarget.style.backgroundColor = secondaryHover;
                                }
                              }}
                              onMouseLeave={(e) => {
                                if (slide.secondaryCta.style === 'primary') {
                                  e.currentTarget.style.backgroundColor = normalizedPrimary;
                                } else if (slide.secondaryCta.style === 'secondary') {
                                  e.currentTarget.style.backgroundColor = normalizedSecondary;
                                }
                              }}
                            >
                              {slide.secondaryCta.text}
                            </a>
                          )}
                        </div>
                      )}
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

      {/* Navigation Arrows - Solo en desktop y si está habilitado */}
      {showArrows && activeSlides.length > 1 && (
        <>
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
        </>
      )}

      {/* Dots Indicator - Solo si está habilitado */}
      {showDots && activeSlides.length > 1 && (
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
      )}

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

import { PrismaClient } from '@prisma/client';
import { StoreConfig } from '../types/StoreConfig';

const prisma = new PrismaClient();

/**
 * Servicio para obtener la configuración de la tienda desde Prisma
 * Este archivo muestra cómo implementar el endpoint /api/store-config
 */

export class PrismaConfigService {
  
  /**
   * Obtiene la configuración completa de una tienda por dominio
   */
  static async getStoreConfigByDomain(domain: string): Promise<StoreConfig | null> {
    try {
      const store = await prisma.store.findUnique({
        where: { 
          domain,
          isActive: true 
        },
        include: {
          config: true,
          heroSlides: {
            where: { isActive: true },
            orderBy: { order: 'asc' }
          },
          menuItems: {
            where: { isActive: true },
            orderBy: { order: 'asc' },
            include: {
              children: {
                where: { isActive: true },
                orderBy: { order: 'asc' }
              }
            }
          },
          socialMedia: {
            where: { isActive: true },
            orderBy: { order: 'asc' }
          },
          shippingMethods: {
            where: { isActive: true },
            orderBy: { order: 'asc' }
          },
          paymentMethods: {
            where: { isActive: true },
            orderBy: { order: 'asc' }
          }
        }
      });

      if (!store) return null;

      return this.transformStoreToConfig(store);
    } catch (error) {
      console.error('Error al obtener configuración por dominio:', error);
      return null;
    }
  }

  /**
   * Obtiene la configuración completa de una tienda por ID
   */
  static async getStoreConfigById(storeId: string): Promise<StoreConfig | null> {
    try {
      const store = await prisma.store.findUnique({
        where: { 
          id: storeId,
          isActive: true 
        },
        include: {
          config: true,
          heroSlides: {
            where: { isActive: true },
            orderBy: { order: 'asc' }
          },
          menuItems: {
            where: { isActive: true },
            orderBy: { order: 'asc' },
            include: {
              children: {
                where: { isActive: true },
                orderBy: { order: 'asc' }
              }
            }
          },
          socialMedia: {
            where: { isActive: true },
            orderBy: { order: 'asc' }
          },
          shippingMethods: {
            where: { isActive: true },
            orderBy: { order: 'asc' }
          },
          paymentMethods: {
            where: { isActive: true },
            orderBy: { order: 'asc' }
          }
        }
      });

      if (!store) return null;

      return this.transformStoreToConfig(store);
    } catch (error) {
      console.error('Error al obtener configuración por ID:', error);
      return null;
    }
  }

  /**
   * Transforma los datos de Prisma al formato StoreConfig
   */
  private static transformStoreToConfig(store: any): StoreConfig {
    const config = store.config || {};
    
    // Transformar hero slides
    const heroSlides = store.heroSlides.map((slide: any) => ({
      id: slide.id,
      title: slide.title,
      subtitle: slide.subtitle,
      description: slide.description,
      imageUrl: slide.imageUrl,
      imageUrlMobile: slide.imageUrlMobile,
      cta: slide.ctaText ? {
        text: slide.ctaText,
        link: slide.ctaLink,
        style: slide.ctaStyle
      } : undefined,
      secondaryCta: slide.secondaryCtaText ? {
        text: slide.secondaryCtaText,
        link: slide.secondaryCtaLink,
        style: slide.secondaryCtaStyle
      } : undefined,
      order: slide.order,
      isActive: slide.isActive,
      alignment: slide.alignment,
      overlay: slide.overlay,
      overlayOpacity: slide.overlayOpacity,
      backgroundColor: slide.backgroundColor,
      textColor: slide.textColor
    }));

    // Transformar menú items
    const menuItems = store.menuItems.map((item: any) => ({
      id: item.id,
      label: item.label,
      href: item.href,
      icon: item.icon,
      badge: item.badge,
      children: item.children?.map((child: any) => ({
        id: child.id,
        label: child.label,
        href: child.href,
        icon: child.icon,
        badge: child.badge
      }))
    }));

    // Transformar redes sociales
    const socialMedia: Record<string, string> = {};
    store.socialMedia.forEach((social: any) => {
      socialMedia[social.platform] = social.url;
    });

    // Transformar métodos de envío
    const shippingMethods = store.shippingMethods.map((method: any) => ({
      id: method.id,
      name: method.name,
      description: method.description,
      priceCents: method.priceCents,
      estimatedDays: method.estimatedDays,
      enabled: method.isActive
    }));

    // Transformar métodos de pago
    const paymentMethods = store.paymentMethods.map((method: any) => ({
      id: method.id,
      name: method.name,
      type: method.type,
      icon: method.icon,
      description: method.description,
      enabled: method.isActive
    }));

    return {
      store: {
        name: store.name,
        description: store.description || '',
        slogan: store.slogan,
        logo: store.logo ? {
          url: store.logo,
          alt: `${store.name} Logo`,
          width: 180,
          height: 50
        } : undefined,
        favicon: store.favicon,
        contactEmail: store.email,
        contactPhone: store.phone,
        socialMedia: Object.keys(socialMedia).length > 0 ? socialMedia : undefined
      },
      theme: config.theme || {
        colors: {
          primary: "#3b82f6",
          primaryHover: "#2563eb",
          secondary: "#8b5cf6",
          accent: "#f59e0b",
          background: "#ffffff",
          backgroundAlt: "#f9fafb",
          textPrimary: "#111827",
          textSecondary: "#6b7280",
          textMuted: "#9ca3af",
          success: "#10b981",
          error: "#ef4444",
          warning: "#f59e0b",
          info: "#3b82f6",
          border: "#e5e7eb",
          shadow: "rgba(0, 0, 0, 0.1)",
          overlay: "rgba(0, 0, 0, 0.5)"
        }
      },
      hero: {
        enabled: heroSlides.length > 0,
        slides: heroSlides,
        autoplay: true,
        autoplayInterval: 5000,
        showArrows: true,
        showDots: true
      },
      navigation: {
        showSearch: true,
        showCart: true,
        menuItems: menuItems
      },
      features: config.features || {
        enableWishlist: true,
        enableReviews: true,
        enableRelatedProducts: true,
        enableCompare: false,
        enableQuickView: true,
        maxCartItems: 99,
        showProductStock: true
      },
      seo: config.seo || {
        title: store.name,
        description: store.description || '',
        keywords: [],
        ogImage: store.logo
      },
      checkout: {
        allowGuestCheckout: true,
        requiredFields: ["name", "email", "phone", "address"],
        shippingMethods: shippingMethods,
        paymentMethods: paymentMethods
      }
    };
  }

  /**
   * Crea una nueva tienda con configuración por defecto
   */
  static async createStore(storeData: {
    name: string;
    slug: string;
    domain?: string;
    email?: string;
  }) {
    return await prisma.$transaction(async (tx) => {
      // Crear la tienda
      const store = await tx.store.create({
        data: {
          name: storeData.name,
          slug: storeData.slug,
          domain: storeData.domain,
          email: storeData.email
        }
      });

      // Crear configuración por defecto
      await tx.storeConfig.create({
        data: {
          storeId: store.id,
          theme: {
            colors: {
              primary: "#3b82f6",
              primaryHover: "#2563eb",
              secondary: "#8b5cf6",
              accent: "#f59e0b",
              background: "#ffffff",
              backgroundAlt: "#f9fafb",
              textPrimary: "#111827",
              textSecondary: "#6b7280",
              textMuted: "#9ca3af",
              success: "#10b981",
              error: "#ef4444",
              warning: "#f59e0b",
              info: "#3b82f6",
              border: "#e5e7eb",
              shadow: "rgba(0, 0, 0, 0.1)",
              overlay: "rgba(0, 0, 0, 0.5)"
            }
          },
          features: {
            enableWishlist: true,
            enableReviews: true,
            enableRelatedProducts: true,
            enableCompare: false,
            enableQuickView: true,
            maxCartItems: 99,
            showProductStock: true
          },
          seo: {
            title: storeData.name,
            description: `Tienda ${storeData.name}`,
            keywords: []
          },
          checkout: {
            allowGuestCheckout: true,
            requiredFields: ["name", "email", "phone", "address"]
          }
        }
      });

      return store;
    });
  }
}

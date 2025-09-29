/**
 * Formatea un precio en centavos a formato COP (pesos colombianos)
 * @param priceCents - Precio en centavos
 * @returns String formateado en formato COP (ej: "$129.999")
 */
export function formatPriceCOP(priceCents: number): string {
  const priceInPesos = priceCents / 100;
  
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(priceInPesos);
}

/**
 * Formatea un precio en centavos a formato COP con decimales
 * @param priceCents - Precio en centavos
 * @returns String formateado en formato COP con decimales (ej: "$129.999,00")
 */
export function formatPriceCOPWithDecimals(priceCents: number): string {
  const priceInPesos = priceCents / 100;
  
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(priceInPesos);
}

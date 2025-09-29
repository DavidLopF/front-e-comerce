/**
 * Formatea un precio a formato COP (pesos colombianos)
 * @param price - Precio en pesos
 * @returns String formateado en formato COP (ej: "$129.999")
 */
export function formatPriceCOP(price: number): string {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
}

/**
 * Formatea un precio a formato COP con decimales
 * @param price - Precio en pesos
 * @returns String formateado en formato COP con decimales (ej: "$129.999,00")
 */
export function formatPriceCOPWithDecimals(price: number): string {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(price);
}

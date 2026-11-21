// Convierte 185000 en "$ 185.000" (pesos colombianos)
export function formatPrice(value: number): string {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0,
  }).format(value);
}

// Convierte "2026-11-02T10:30:00" en una fecha legible, como "2 nov 2026, 10:30"
export function formatDate(iso: string): string {
  return new Date(iso).toLocaleString('es-CO', {
    dateStyle: 'medium',
    timeStyle: 'short',
  });
}
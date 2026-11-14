import type { Product } from '../types';

const img = (text: string) =>
  `https://placehold.co/400x300?text=${encodeURIComponent(text)}`;

export const products: Product[] = [
  { id: 1, name: 'Teclado mecánico', description: 'Teclado mecánico con luz LED y cable USB.', price: 185000, stock: 12, imageUrl: img('Teclado'), categoryId: 1 },
  { id: 2, name: 'Mouse inalámbrico', description: 'Mouse ergonómico con receptor USB.', price: 65000, stock: 30, imageUrl: img('Mouse'), categoryId: 1 },
  { id: 3, name: 'Audífonos con micrófono', description: 'Audífonos para clases virtuales y juegos.', price: 120000, stock: 3, imageUrl: img('Audifonos'), categoryId: 1 },
  { id: 4, name: 'Memoria USB 64 GB', description: 'Memoria USB 3.0 de 64 GB.', price: 28000, stock: 0, imageUrl: img('USB 64GB'), categoryId: 1 },
  { id: 5, name: 'Juego de ollas', description: 'Set de 5 ollas de acero inoxidable.', price: 210000, stock: 8, imageUrl: img('Ollas'), categoryId: 2 },
  { id: 6, name: 'Lámpara de escritorio', description: 'Lámpara LED con brazo ajustable.', price: 55000, stock: 15, imageUrl: img('Lampara'), categoryId: 2 },
  { id: 7, name: 'Licuadora', description: 'Licuadora de 600 W con vaso de vidrio.', price: 140000, stock: 5, imageUrl: img('Licuadora'), categoryId: 2 },
  { id: 8, name: 'Balón de fútbol', description: 'Balón número 5 para cancha de pasto.', price: 80000, stock: 20, imageUrl: img('Balon'), categoryId: 3 },
  { id: 9, name: 'Cuerda para saltar', description: 'Cuerda ajustable con mangos antideslizantes.', price: 18000, stock: 40, imageUrl: img('Cuerda'), categoryId: 3 },
  { id: 10, name: 'Termo deportivo', description: 'Termo de 1 litro que mantiene el frío.', price: 45000, stock: 0, imageUrl: img('Termo'), categoryId: 3 },
  { id: 11, name: 'Libro de bases de datos', description: 'Introducción al modelo relacional y SQL.', price: 95000, stock: 7, imageUrl: img('Libro BD'), categoryId: 4 },
  { id: 12, name: 'Libro de programación web', description: 'Guía práctica de HTML, CSS y JavaScript.', price: 78000, stock: 10, imageUrl: img('Libro Web'), categoryId: 4 },
];

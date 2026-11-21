# Tienda virtual - Frontend (Entrega 1)

Proyecto final de **Desarrollo de Aplicaciones Web**.
Autor: [Tu nombre]

## Descripción

Tienda web sencilla para explorar productos, administrar un carrito y registrar
pedidos. No incluye pasarela de pagos. En esta primera entrega solo existe el
Frontend; los datos son simulados y se guardan en el navegador.

## Tecnologías elegidas

| Capa | Tecnología | Estado |
|---|---|---|
| Frontend | React + Vite + TypeScript | Entrega 1 |
| Backend | NestJS | Entrega 2 |
| Base de datos | PostgreSQL | Entrega 2 |

**Justificación:** NestJS y React usan TypeScript, lo que permite usar el mismo
lenguaje en las dos capas y compartir la forma de los datos (producto, pedido,
usuario).

## Requisitos

- Node.js 18 o superior
- npm

## Cómo ejecutar el proyecto

```bash
cd frontend
npm install
npm run dev
```

Luego abrir http://localhost:5173/ en el navegador.

## Perfiles de usuario

| Perfil | Correo de prueba | Qué puede hacer |
|---|---|---|
| Visitante | (sin sesión) | Ver catálogo, detalle y carrito |
| Cliente | cliente1@tienda.test, cliente2@tienda.test | Comprar, ver sus pedidos |
| Administrador | admin@tienda.test | Gestionar productos y pedidos |

El acceso es simulado y solo pide el correo. No hay contraseñas reales.

## Funcionalidades

- Catálogo con imágenes de referencia, categorías, precios y disponibilidad
- Búsqueda por nombre y filtros por categoría, rango de precio y disponibilidad
- Detalle del producto, con validación de la cantidad frente al stock
- Carrito con cambio de cantidades y total (se conserva al recargar)
- Formulario de datos de entrega con validaciones y resumen del pedido
- Historial de pedidos del cliente
- Vista administrativa de pedidos, con cambio de estado
- Administración de productos: crear, editar y eliminar
- Rutas protegidas según el perfil
- Diseño adaptable a escritorio y celular
- Estados de interfaz: cargando, error, sin resultados y confirmaciones

## Datos simulados y supuestos

- Los datos de prueba están en `src/data` (4 categorías, 12 productos,
  3 usuarios y 4 pedidos).
- Algunos productos tienen stock 0 o pocas unidades para mostrar esos estados.
- Las imágenes son de relleno (placehold.co) y requieren internet.
- Los cambios (carrito, sesión, pedidos y productos) se guardan en el
  `localStorage` del navegador.
- Los servicios de `src/services` simulan una API con una pequeña demora. En la
  Entrega 2 solo se reemplazan por llamadas HTTP al Backend.
- El total del pedido se recalcula en el servicio con los precios actuales y no
  con los datos del carrito.
- Un pedido solo cambia de estado así: pendiente → enviado o cancelado;
  enviado → entregado o cancelado. Entregado y cancelado son finales.

## Estructura del código

```
src/
  components/   Piezas reutilizables (barra, tarjeta, etiqueta de estado)
  context/      Estado compartido (carrito y sesión)
  data/         Datos de prueba
  pages/        Pantallas completas
  services/     Acceso a los datos (simulado)
  types/        Tipos de TypeScript del modelo de datos
  utils/        Funciones de ayuda (formatos)
```

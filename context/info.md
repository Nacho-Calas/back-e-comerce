# Contexto del Proyecto

La empresa se dedica a la **importación y venta de insumos para warehousing y logística**, como lectores RFID, scanners, racks metálicos, zorritas, autoelevadores, stretchadoras, etc.

El objetivo es desarrollar una **plataforma web tipo catálogo / vidriera online**, donde los clientes puedan ver los productos disponibles, agregarlos a un carrito y finalizar el proceso de compra **a través de un mensaje de WhatsApp**.

## Objetivo principal

Permitir que los usuarios:

1. Naveguen y consulten los productos disponibles.
2. Agreguen productos al carrito (sin necesidad de crear una cuenta).
3. Generen un mensaje de pedido que se envíe directamente por WhatsApp, con el detalle de los productos seleccionados.

## Flujo esperado

1. El cliente navega por el catálogo y selecciona los productos que le interesan.
2. Los productos se agregan a un carrito con su cantidad.
3. Al finalizar, el sistema genera un mensaje preformateado con la información del carrito y redirige al usuario a un enlace de WhatsApp.

**Ejemplo de mensaje generado:**
Hola, quiero hacer un pedido:

Zorra hidráulica x 2 unidades

Rack metálico x 1 unidad

Lector RFID x 3 unidades
Total estimado: $XXXX

## Módulos principales

- **Products**  
  Para administrar los productos disponibles: nombre, descripción, precio, imágenes, categoría, y stock.

- **Categories**  
  Para agrupar los productos por tipo, marca o rubro.

- **Cart**  
  Para manejar los productos agregados al carrito, con sus cantidades y totales parciales.

- **WhatsApp**  
  Para generar el mensaje final con la información del carrito y construir la URL del pedido en WhatsApp.

- **Users (futuro)**  
  Para gestionar clientes o administradores en una segunda etapa.

## Requerimientos funcionales

- Endpoint para listar productos, crear, actualizar y eliminar.
- Endpoint para obtener productos filtrados por categoría.
- Endpoint para manejar las operaciones del carrito (agregar, eliminar, actualizar cantidad).
- Endpoint para generar el mensaje del pedido y obtener el enlace a WhatsApp.
- Validaciones básicas sobre los datos recibidos (por ejemplo, cantidad mínima, existencia del producto, etc.).

## Objetivo general del desarrollo

- Diseñar la estructura de entidades, DTOs y controladores necesaria para implementar los módulos indicados.
- Implementar la lógica de negocio para gestionar productos, categorías y carritos.
- Generar el mensaje final del pedido con formato claro, incluyendo los productos y cantidades seleccionadas.
- Preparar la base para futuras integraciones con autenticación, administración y pasarela de pagos.

---

💡 La finalidad del backend es soportar un **sitio tipo catálogo con carrito funcional**, sin pagos en línea, que permita enviar pedidos a través de WhatsApp con toda la información relevante.

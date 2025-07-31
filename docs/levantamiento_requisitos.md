# Levantamiento de Requisitos del Proyecto "Petly"

**UNIVERSIDAD TECNOLÓGICA DEL CENTRO DE VERACRUZ (UTCV)**  
**Ingeniería en Desarrollo y Gestión de Software (IDGS) 9B**

---

### Equipo de trabajo

- Andrade Carbajal Jesús Ricardo  
- Alvizar Martínez Alexis  
- Hernández Rodríguez José Aarón  
- Ramírez Vega Iosef Yamil  
- Gaspar Cruz Ismael  

---

**Nombre del proyecto:** Petly  
**Tipo de proyecto:** E-commerce de tienda de mascotas y adopciones  
**Contexto:**  
Este proyecto forma parte de una actividad colaborativa entre los equipos del grupo IDGS 9B, donde se realiza una simulación de cliente-desarrollador. Nuestro equipo está trabajando como desarrollador para el proyecto Petly.

---

## 1. Introducción
El presente documento contiene el levantamiento de requisitos para el sistema "Petly", una plataforma web de comercio electrónico orientada a la venta de productos para mascotas y la promoción de adopciones. El sistema está diseñado exclusivamente para compradores, sin posibilidad de venta directa por parte de usuarios. Se busca ofrecer una experiencia intuitiva, amigable y eficiente tanto para clientes como para administradores y empleados.
## 2. Requisitos Funcionales

### 2.1 Inicio de sesión con autenticación en dos pasos
El usuario debe ingresar su correo y contraseña, y luego verificar con una app de autenticación de su preferencia. Esto con el fin de aumentar el nivel de seguridad de la app.

### 2.2 Interfaz responsiva
La plataforma debe adaptarse correctamente a distintos tamaños de pantalla (celular, tablet, escritorio), reorganizando los elementos para asegurar una navegación óptima en todos los dispositivos.

### 2.3 Carrusel tipo TikTok de productos y mascotas
Se debe mostrar un feed deslizable verticalmente con imágenes grandes de productos destacados y mascotas en adopción. El usuario puede deslizar hacia abajo para ver más elementos (no es vídeo, solo imágenes).

### 2.4 Carrito de compras o “carreola de compras”
El usuario podrá agregar productos al carrito desde cualquier vista, visualizar los productos seleccionados, modificar cantidades o eliminar artículos antes de confirmar la compra.

### 2.5 Sistema de reseñas limitado a compradores
Solo los usuarios que hayan realizado una compra podrán dejar una reseña visible en la página del producto. Las reseñas incluirán estrellas y un comentario.

### 2.6 Comparador de productos similares
En la vista de producto, debe haber una sección donde se comparen automáticamente productos de la misma categoría con base en precio, valoración y características.

### 2.7 Sugerencias de productos
Al realizar búsquedas, el sistema debe mostrar coincidencias inteligentes o productos relacionados usando palabras clave, historial o categoría.

### 2.8 Notificaciones de seguimiento del pedido
El usuario recibirá notificaciones push o visuales cuando el estado de su pedido cambie (procesando, enviado, entregado), con actualizaciones manuales desde el panel del vendedor o administrador.

### 2.9 Seguimiento de productos adquiridos
El usuario podrá ver en su perfil el estado de sus compras actuales, con historial y seguimiento del envío.

### 2.10 Buscador de productos y mascotas
El sistema incluirá un buscador global con autocompletado y resultados en tiempo real para encontrar productos y mascotas por nombre, categoría o palabra clave.

### 2.11 Navegación por categorías
La página principal estará dividida en categorías visibles (alimento, juguetes, cuidado, etc.) para facilitar la exploración del catálogo.

### 2.12 Filtros de búsqueda
Los resultados de búsqueda y categorías tendrán filtros por precio, tipo de mascota, marca, disponibilidad, entre otros.

### 2.13 Registro de empleados y clientes
Habrá formularios específicos para registrar nuevos clientes y empleados, cada uno con sus campos obligatorios y validaciones.

### 2.14 Panel CRUD para administrador
El administrador podrá agregar, editar y eliminar productos, empleados, stock de inventario y gestionar los datos del sistema desde un panel administrativo completo.

### 2.15 Seguimiento y estadísticas de ventas
El administrador podrá ver un resumen estadístico con métricas de ventas, productos más vendidos, ingresos mensuales, y análisis filtrables por fechas o categorías.

### 2.16 Gestión de roles
El sistema distinguirá entre:

#### 2.16.1 Comprador
Acceso al catálogo, carrito, pedidos.

#### 2.16.2 Vendedor
Acceso a panel de ventas físicas, actualiza estados de entrega.

#### 2.16.3 Administrador
Acceso completo a toda la gestión.

### 2.17 Panel del vendedor
Los vendedores tendrán una vista donde verán las ventas físicas que registran en el sistema, podrán actualizar el estado de los pedidos y ver productos a su cargo.

### 2.18 Gráfico de ventas interactivo
El panel de administrador incluirá un gráfico interactivo que permita cambiar entre tipos de visualización (barra, línea, pastel) para observar las ventas según distintos criterios.

---

## 3. Requisitos No Funcionales

### 3.1 Interfaz intuitiva y amigable
El sistema debe tener una navegación clara, con íconos y etiquetas comprensibles, permitiendo que cualquier usuario lo entienda sin necesidad de guía.

### 3.2 Animaciones y sonidos
Al agregar productos, realizar compras o recibir notificaciones, el sistema debe reproducir efectos visuales suaves y sonidos breves que mejoren la experiencia sin distraer.

### 3.3 Diseño family-friendly y paleta verde claro
La estética debe estar orientada a un público familiar, con un diseño suave, iconografía amigable y una paleta de colores basada en tonos azules suaves y 2 tonos de verde: uno más fuerte que el otro, transmitiendo armonía y confianza.

### 3.4 Accesibilidad visual básica
La interfaz debe permitir el uso de tipografías claras, buen contraste entre texto y fondo, y botones de tamaño adecuado para facilitar su uso a personas con dificultades visuales leves.

### 3.5 Seguridad mediante roles y permisos
Cada usuario debe tener acceso limitado según su rol. El sistema no debe permitir a usuarios sin permisos acceder a funciones administrativas o de gestión.

### 3.6 Rendimiento óptimo
El sistema debe cargar en menos de 3 segundos en condiciones normales, con tiempos de respuesta bajos al navegar entre secciones o aplicar filtros.

### 3.7 Logo representativo del propósito
El logotipo debe reflejar claramente que Petly es un espacio para el bienestar animal, combinando elementos gráficos que sugieran tanto una tienda como un centro de adopción.

---

## 4. Conclusión

Este documento representa la recopilación, corrección y ampliación de los requisitos funcionales y no funcionales necesarios para el desarrollo de Petly. Se buscó reflejar fielmente las necesidades del cliente, alineando la propuesta técnica con los objetivos del proyecto.

**Fecha:** Julio 2025  
**Documento elaborado por:** Equipo desarrollador de Petly - IDGS 9B  
**Última actualización:** 30 de Julio del 2025 por Andrade Carbajal Jesús Ricardo.

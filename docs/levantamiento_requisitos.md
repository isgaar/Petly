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
Inicio de sesión con autenticación en dos pasos
El usuario debe ingresar su correo y contraseña, y luego verificar un código enviado a su correo o celular. Esto aumenta la seguridad de acceso al sistema.
Interfaz responsiva
La plataforma debe adaptarse correctamente a distintos tamaños de pantalla (celular, tablet, escritorio), reorganizando los elementos para asegurar una navegación óptima en todos los dispositivos.
Carrusel tipo TikTok de productos y mascotas
Se debe mostrar un feed deslizable verticalmente con imágenes grandes de productos destacados y mascotas en adopción. El usuario puede deslizar hacia abajo para ver más elementos (no es video, solo imágenes).
Carrito de compras
El usuario podrá agregar productos al carrito desde cualquier vista, visualizar los productos seleccionados, modificar cantidades o eliminar artículos antes de confirmar la compra.
Sistema de reseñas limitado a compradores
Solo los usuarios que hayan realizado una compra podrán dejar una reseña, visible en la página del producto. Las reseñas incluirán estrellas y un comentario.
Comparador de productos similares
En la vista de producto, debe haber una sección donde se comparen automáticamente productos de la misma categoría con base en precio, valoración y características.
Sugerencias de productos
Al realizar búsquedas, el sistema debe mostrar coincidencias inteligentes o productos relacionados usando palabras clave, historial o categoría.
Botón de chat para recomendaciones
En la pantalla principal habrá un botón flotante que, al presionarlo, despliega una ventana donde el usuario escribe lo que busca. El sistema le sugiere productos o mascotas automáticamente.
Notificaciones de seguimiento del pedido
El usuario recibirá notificaciones push o visuales cuando el estado de su pedido cambie (procesando, enviado, entregado), con actualizaciones manuales desde el panel del vendedor o administrador.
Seguimiento de productos adquiridos
El usuario podrá ver en su perfil el estado de sus compras actuales, con historial y seguimiento del envío.
Reserva de adopciones
El usuario podrá hacer una solicitud de adopción desde el perfil de una mascota. Esta reserva será procesada por el administrador.
Buscador de productos y mascotas
El sistema incluirá un buscador global con autocompletado y resultados en tiempo real para encontrar productos y mascotas por nombre, categoría o palabra clave.
Navegación por categorías
La página principal estará dividida en categorías visibles (alimento, juguetes, cuidado, etc.) para facilitar la exploración del catálogo.
Filtros de búsqueda
Los resultados de búsqueda y categorías tendrán filtros por precio, tipo de mascota, marca, disponibilidad, entre otros.
Registro de empleados y clientes
Habrá formularios específicos para registrar nuevos clientes y empleados, cada uno con sus campos obligatorios y validaciones.
Panel CRUD para administrador
El administrador podrá agregar, editar y eliminar productos, empleados, stock de inventario y gestionar los datos del sistema desde un panel administrativo completo.
Seguimiento y estadísticas de ventas
El administrador podrá ver un resumen estadístico con métricas de ventas, productos más vendidos, ingresos mensuales, y análisis filtrables por fechas o categorías.
Gestión de roles
El sistema distinguirá entre:
Comprador: acceso al catálogo, carrito, pedidos.
Vendedor: acceso a panel de ventas físicas, actualiza estados de entrega.
Administrador: acceso completo a toda la gestión.
Panel del vendedor
Los vendedores tendrán una vista donde verán las ventas físicas que registran en el sistema, podrán actualizar el estado de los pedidos y ver productos a su cargo.
Gráfico de ventas interactivo
El panel de administrador incluirá un gráfico interactivo que permita cambiar entre tipos de visualización (barra, línea, pastel) para observar las ventas según distintos criterios.


## 3. Requisitos No Funcionales
Interfaz intuitiva y amigable
El sistema debe tener una navegación clara, con íconos y etiquetas comprensibles, permitiendo que cualquier usuario lo entienda sin necesidad de guía.
Animaciones y sonidos
Al agregar productos, realizar compras o recibir notificaciones, el sistema debe reproducir efectos visuales suaves y sonidos breves que mejoren la experiencia sin distraer.
Diseño family-friendly y paleta verde claro
La estética debe estar orientada a un público familiar, con un diseño suave, iconografía amigable y una paleta de colores basada en tonos verdes suaves, transmitiendo armonía y confianza.
Accesibilidad visual básica
La interfaz debe permitir el uso de tipografías claras, buen contraste entre texto y fondo, y botones de tamaño adecuado para facilitar su uso a personas con dificultades visuales leves.
Seguridad mediante roles y permisos
Cada usuario debe tener acceso limitado según su rol. El sistema no debe permitir a usuarios sin permisos acceder a funciones administrativas o de gestión.
Rendimiento óptimo
El sistema debe cargar en menos de 3 segundos en condiciones normales, con tiempos de respuesta bajos al navegar entre secciones o aplicar filtros.
Logo representativo del propósito
El logotipo debe reflejar claramente que Petly es un espacio para el bienestar animal, combinando elementos gráficos que sugieran tanto una tienda como un centro de adopción.

## 4. Conclusión
Este documento representa la recopilación, corrección y ampliación de los requisitos funcionales y no funcionales necesarios para el desarrollo de Petly. Se buscó reflejar fielmente las necesidades del cliente, alineando la propuesta técnica con los objetivos del proyecto.

Fecha: Julio 2025
Documento elaborado por: Equipo desarrollador de Petly - IDGS 9B
# Documentación Técnica – Proyecto **Petly-Web** (Laravel E-commerce de Mascotas)

## 1. Descripción general del proyecto y su propósito

**Petly-Web** es una plataforma web de comercio electrónico orientada a la venta de productos para mascotas y a la promoción de adopciones de animales. El sistema está diseñado principalmente para compradores (clientes finales) y no permite ventas directas entre usuarios, ofreciendo una experiencia intuitiva y eficiente tanto para clientes como para administradores y empleados. En Petly, los usuarios pueden navegar por un catálogo de artículos para mascotas (alimentos, juguetes, accesorios, etc.), agregarlos a un carrito de compras y realizar pedidos en línea. Además, el sitio incluye una sección de **adopción de mascotas**, donde los interesados pueden conocer mascotas disponibles y enviar solicitudes de adopción, facilitando la interacción con refugios o administradores del sitio. El objetivo central del proyecto es **integrar en una sola aplicación** la funcionalidad de tienda en línea para productos de mascotas junto con un sistema de adopción, asegurando a la vez una gestión unificada de usuarios, pedidos, reseñas y procesos administrativos.

En resumen, Petly-Web busca proporcionar un **espacio integral para amantes de las mascotas**, donde puedan adquirir productos y, simultáneamente, encontrar un nuevo miembro peludo de la familia. Esta dualidad de funciones (tienda + adopción) se implementa manteniendo buenas prácticas de desarrollo web (seguridad, rendimiento, usabilidad) y pensando en distintos roles de usuario (clientes, vendedores/empleados y administrador) para cubrir todas las necesidades del sistema.

## 2. Explicación de la arquitectura MVC implementada

El proyecto Petly-Web está construido sobre el framework **Laravel**, siguiendo el patrón de arquitectura **MVC (Modelo – Vista – Controlador)** propio de Laravel. Este patrón separa la aplicación en tres componentes principales, cada uno con responsabilidades definidas:

* **Modelo (Model)**: Representa la lógica de negocio y maneja la interacción con la base de datos. En Laravel, cada modelo es una clase Eloquent que usualmente corresponde a una tabla de la base de datos, permitiendo operar con sus datos (consultas, altas, bajas, modificaciones) de forma orientada a objetos. Por ejemplo, es de esperar que Petly-Web cuente con modelos como `Product` (producto), `Category` (categoría de producto), `Order` (pedido), `Pet` (mascota para adopción), `User` (usuario), entre otros. Cada modelo puede definir relaciones (por ej. *un* Usuario tiene *muchos* Pedidos) y contiene la lógica de negocios relacionada con su entidad (como cálculos de stock, reglas de adopción, etc.).

* **Vista (View)**: Se encarga de la presentación de la información al usuario, es decir, la interfaz de usuario. En Laravel, las vistas típicamente son archivos de plantilla **Blade** (.blade.php) que mezclan HTML con directivas simples de templating. Las vistas reciben datos de los controladores y los muestran en páginas web. En Petly-Web, las vistas incluyen por ejemplo la página de inicio (mostrando un carrusel de productos/mascotas destacados), las páginas de listado de productos o mascotas, la vista de detalle de un producto o mascota, el carrito de compras, formularios de login/registro, paneles de administración, etc. Las vistas Blade permiten reutilizar componentes (por ejemplo, un mismo encabezado o barra de navegación en todas las páginas) y mostrar dinámicamente los datos enviados desde el backend.

* **Controlador (Controller)**: Actúa como intermediario entre los modelos y las vistas. Los controladores manejan las solicitudes HTTP entrantes, procesan la lógica correspondiente (frecuentemente interactuando con los modelos) y devuelven una respuesta adecuada (generalmente renderizando una vista o retornando datos JSON en caso de APIs). En Petly-Web, los controladores orquestan el flujo de cada funcionalidad: por ejemplo, habrá un controlador para autenticación de usuarios que procese el login (verificando credenciales, 2FA, etc.), controladores para el catálogo y carrito (que obtienen productos desde los modelos y retornan la vista correspondiente), controladores para gestionar las solicitudes de adopción, y controladores para la parte administrativa (gestión de productos, categorías, usuarios, etc.). Gracias a Laravel, la implementación del patrón MVC es sencilla y clara: cada **Controlador** puede consultar al **Modelo** y luego pasar los datos a la **Vista** apropiada. Esta separación aporta una mejor organización del código, facilita el mantenimiento y permite escalar la aplicación más fácilmente.

En resumen, Petly-Web aprovecha el patrón MVC de Laravel para mantener la lógica de datos (Modelos), la presentación (Vistas) y el flujo de control (Controladores) bien separados. Esto asegura que, por ejemplo, los cambios en la interfaz (diseño de vistas) no afecten la lógica de negocio, o que la modificación de reglas de negocio en un modelo no rompa directamente las vistas, haciendo el desarrollo más modular y limpio.

## 3. Análisis y explicación del flujo de trabajo del sistema

En esta sección se describe **cómo Petly-Web procesa las solicitudes de los usuarios** desde que interactúan con el navegador hasta obtener una respuesta, incluyendo ejemplos específicos de flujos (inicio de sesión, compra de un producto y adopción de una mascota).

### 3.1 Ciclo de vida de una petición HTTP en Petly-Web

Cuando un usuario realiza una petición en el navegador (por ejemplo, al entrar a la URL de la página de inicio, o al enviar un formulario de compra), el flujo básico dentro de la aplicación Laravel es el siguiente:

* **Ruta y Controlador**: La petición HTTP llega al servidor y Laravel la redirige al archivo de rutas correspondiente (por defecto, `routes/web.php` para peticiones web normales). Ahí se identifica la ruta solicitada y se asigna al controlador y acción (método) adecuado. Por ejemplo, una petición `GET /productos/5` podría corresponder al método `show` de un `ProductController` para mostrar el producto con ID 5. Las rutas pueden estar agrupadas y protegidas por middlewares según sea necesario (ver sección de rutas más adelante).

* **Middleware**: Antes de llegar al controlador, la petición puede atravesar ciertos *middleware* (filtros). Los **Middlewares** son componentes que se ejecutan antes o después de la ejecución del controlador, y pueden modificar o validar la petición. En Petly-Web se utilizan middlewares como `auth` (que verifica que el usuario esté autenticado para acceder a ciertas rutas protegidas), `isAdmin` o similares (para restringir acceso al panel administrativo solo a roles autorizados), y posiblemente middleware para verificar la verificación 2FA en sesiones iniciadas, etc. Si un middleware determina que la petición no cumple ciertos requisitos (por ejemplo, usuario no autenticado intentando acceder a una ruta protegida), típicamente redirige a otra página (como la pantalla de login) en lugar de continuar al controlador.

* **Lógica del Controlador**: Si pasa los middlewares, la petición es recibida por el método del **Controlador** designado. El controlador contiene la lógica de la aplicación para esa acción. Por ejemplo, en una solicitud de **detalle de producto**, el controlador invocará al Modelo `Product` (vía Eloquent) para obtener de la base de datos el producto con ID dado, quizás también las reseñas asociadas, y otras informaciones necesarias. El controlador combina estos datos y finalmente **retorna una respuesta**. En aplicaciones web tradicionales esto suele ser una vista HTML renderizada con los datos obtenidos.

* **Consulta a la Base de Datos (a través del Modelo)**: Dentro del controlador, al invocar métodos del Modelo (por ejemplo `Product::find(5)`), Laravel utiliza Eloquent ORM para construir y ejecutar la consulta SQL necesaria en la base de datos. La base de datos de Petly-Web almacena todas las entidades del sistema (usuarios, productos, mascotas, órdenes, etc.). El resultado de la consulta se devuelve al controlador como objetos (por ejemplo, una instancia de `Product` con sus atributos cargados). Si se realizan cambios (por ejemplo, crear un nuevo pedido), el modelo ejecuta las instrucciones SQL de inserción/actualización correspondientes durante este paso.

* **Respuesta y Vista**: Finalmente, el **Controlador** pasa los datos obtenidos a una **Vista Blade** para generar HTML dinámico. La vista combina su plantilla (HTML + pequeñas directivas) con los datos (por ejemplo, rellena los campos con la información del producto) y produce HTML completo. Laravel envía esa respuesta HTML de vuelta al navegador del usuario. El resultado es que el usuario ve la página solicitada con la información actualizada. En caso de acciones de formulario (p.ej., al completar una compra), el controlador puede en cambio redirigir a otra ruta (por ejemplo, redirigir a la página de confirmación de pedido) con mensajes de estado (flash messages) indicando éxito o error según el caso.

* **Ciclo continuo**: El navegador del usuario recibe la respuesta (la página HTML), la renderiza para mostrarla. A partir de ahí, el usuario puede realizar nuevas interacciones (clics, formularios), que generarán nuevas peticiones al servidor y repetirán el ciclo descrito.

Este flujo básico se complementa con detalles adicionales: por ejemplo, Laravel tiene un **sistema de caché** que podría servir respuestas más rápidamente en algunos casos, manejo de errores (si ocurre una excepción en el controlador, Laravel mostrará una página de error 500 o personalizada), y el proceso de envío de activos estáticos (CSS/JS) que suelen estar en la carpeta `public/`. En Petly-Web, al ser una aplicación e-commerce, también intervienen aspectos como la **sesión del usuario** (por ejemplo, el carrito de compras está asociado a la sesión del usuario hasta que se confirma el pedido, usando el mecanismo de sesión de Laravel) y posiblemente **cookies** o tokens para recordar al usuario. No obstante, a alto nivel, siempre se sigue la secuencia: *Ruta -> Middleware -> Controlador -> Modelo/BD -> Vista -> Respuesta al cliente*.

### 3.2 Ejemplo de flujo para **Inicio de Sesión (Login)**

A continuación describimos el flujo típico cuando un usuario realiza el proceso de inicio de sesión en Petly-Web (incluyendo la autenticación en dos pasos, según lo previsto en requisitos):

1. **Mostrar formulario de login**: El usuario navega a la página de inicio de sesión (por ejemplo, `/login`). El sistema carga la vista Blade con el formulario donde se pide ingresar correo electrónico y contraseña. Si el usuario aún no está autenticado, esta página es pública.

2. **Ingreso de credenciales**: El usuario llena sus datos (email y contraseña) y envía el formulario (método HTTP POST a la ruta `/login` o similar). Esta petición llega al servidor y es recibida por el controlador de autenticación (p.ej., `Auth\LoginController` o un controlador personalizado de Petly).

3. **Verificación de credenciales**: El controlador toma los datos y utiliza el modelo de Usuario (p. ej. `User`) para verificar que el email exista y la contraseña proporcionada coincide con la almacenada (Laravel proporciona funciones para esto, comparando el hash). Si las credenciales no son válidas, el controlador retorna de nuevo a la página de login con un mensaje de error (por ejemplo "Credenciales incorrectas").

4. **Segundo factor (2FA)**: Si las credenciales básicas son correctas, Petly-Web implementa un segundo paso de autenticación (2FA) para mayor seguridad. En este punto, el sistema genera un código de verificación único (por ejemplo, de 6 dígitos). Este código puede enviarse al correo electrónico del usuario o a su teléfono (vía SMS) según lo configurado. El controlador podría guardar temporalmente el código (en base de datos o en la sesión) y luego mostrar una nueva vista solicitando al usuario ingresar el código 2FA.

5. **Verificación 2FA**: El usuario recibe el código (por email/SMS) y lo ingresa en el formulario de verificación de dos pasos. Al enviar este segundo formulario, el sistema valida que el código introducido coincide con el que se generó. Si no coincide o expira el tiempo, se deniega el login (posiblemente dando opción de reenviar código).

6. **Inicio de sesión exitoso**: Si el código 2FA es correcto, la autenticación se considera completa. Laravel crea la sesión de usuario (registrando al usuario como autenticado en el sistema). A partir de ahora, el usuario tiene acceso a las áreas protegidas de la aplicación según su rol.

7. **Redirección post-login**: Finalmente, el sistema redirige al usuario a alguna página apropiada. Generalmente podría ser la página principal o el panel de usuario. Si Petly tiene un **perfil de usuario** con opciones (ver pedidos, seguimiento de adopciones, etc.), podría dirigirse ahí. En caso de que el usuario hubiera sido forzado a login para continuar una acción (por ejemplo, estaba comprando y el sistema lo envió a login), tras autenticarse podría redirigirse a la página donde se quedó (esto se maneja con funcionalidad de "intended" redirection de Laravel).

8. **Roles y permisos al iniciar sesión**: El sistema también en este punto reconoce el rol del usuario (si es un cliente, un vendedor/empleado o un administrador). Según el rol, puede cambiar la interfaz (por ejemplo, mostrar enlaces de admin si corresponde) o definir qué secciones puede ver. La seguridad de roles en el servidor se maneja con middleware en las rutas (por ejemplo, rutas de administrador requieren usuario admin, etc. – ver sección de rutas). Esto garantiza que incluso tras iniciar sesión, cada usuario solo accede a lo permitido por su rol.

En resumen, el flujo de login incluye la validación de credenciales y un segundo factor de autenticación para mayor seguridad, antes de conceder acceso. Si cualquiera de los pasos falla, el usuario no entra al sistema y se notifica el error correspondiente.

### 3.3 Ejemplo de flujo para **Compra de productos (Checkout)**

El proceso de compra en Petly-Web abarca desde que el usuario agrega productos al carrito hasta la finalización del pedido. A continuación se detalla este flujo paso a paso:

1. **Navegación y selección de producto**: El cliente navega por el catálogo de productos (puede usar la página principal con categorías, buscador, filtros, etc.). Al ver la página de detalle de un producto deseado, hace clic en "Agregar al carrito". El sistema entonces registra ese producto en el **carrito de compras** de la sesión. (Si el carrito ya tenía otros ítems, simplemente se agrega uno nuevo o se incrementa la cantidad si el mismo producto ya estaba añadido).

2. **Visualización del carrito**: El usuario en cualquier momento puede acceder a la vista del carrito (por ejemplo, `/cart`), donde se listan los productos agregados, sus cantidades, precios unitarios y totales parciales, además del total general. Desde aquí puede **modificar cantidades o eliminar** productos del carrito. Cada acción (por ej. aumentar cantidad de un producto) típicamente envía una petición al servidor para actualizar el carrito (Petly-Web usaría controladores o incluso AJAX para actualizar cantidades). El sistema también podría aplicar automáticamente promociones o cupones si correspondiera (según las reglas definidas).

3. **Inicio del proceso de pago (checkout)**: Cuando el cliente decide completar la compra, hace clic en "Proceder a la compra" o "Checkout". Si el usuario *no ha iniciado sesión*, en este punto el sistema lo redirige a la pantalla de login/registro, ya que **solo usuarios autenticados pueden finalizar pedidos** (esto asegura poder asociar el pedido a un usuario y gestionar direcciones, etc.). Tras autenticarse (ver flujo de login arriba), el usuario vuelve al checkout.

4. **Formulario de pedido**: En la pantalla de checkout, el sistema muestra un formulario donde el usuario confirma/ingresa los **datos de envío y pago**. Esto incluye: dirección de envío (o selección de una dirección guardada), método de envío deseado (si hay opciones), método de pago elegido (por ejemplo, pago con tarjeta, contra reembolso, PayPal, etc., dependiendo de lo implementado), y revisa el resumen del pedido (productos en el carrito con totales y costos de envío/impuestos si aplican). Petly-Web validará que toda la información requerida esté completa y correcta (mediante validaciones del lado servidor e idealmente también del lado cliente con JavaScript).

5. **Confirmación de pedido**: Al enviar el formulario de checkout, el controlador de pedidos (`OrderController`, por ejemplo) realiza varias acciones atómicas:

   * Verifica nuevamente stock/disponibilidad de los productos en el carrito (para evitar vender algo agotado último minuto).
   * Crea un registro de **Orden/Pedido** en la base de datos, con estado inicial (por ej. "Pendiente de pago" o "Procesando").
   * Registra los ítems del pedido (líneas de pedido) enlazando cada producto con la orden y la cantidad pedida, aplicando precios del momento.
   * Procesa el **pago**: si es pago con tarjeta o electrónico, aquí se integraría con una pasarela de pago externa (no está detallado en los requisitos, pero podría ser una integración futura). En caso de implementaciones simples, podría simularse el pago o marcarlo como pago contra entrega. Si la pasarela confirma el pago, se actualiza el estado del pedido a "Pagado" y se genera confirmación.
   * Actualiza el stock de cada producto en la base de datos restando las cantidades vendidas.
   * Opcionalmente, envía notificaciones: podría enviarse un correo de confirmación de compra al cliente y notificación al administrador o vendedor.

6. **Respuesta de éxito**: Si todo va bien, el sistema devuelve una **página de confirmación** al usuario, indicándole que su pedido ha sido registrado con éxito. En esta vista se muestra un resumen del pedido (ID de pedido, lista de productos, importe total, dirección de envío seleccionada, etc.) y un mensaje de agradecimiento (p. ej. "¡Gracias por tu compra!"). Desde aquí el usuario puede continuar navegando (por ejemplo, volver al catálogo) o ver el detalle de sus pedidos en su perfil.

7. **Actualización del panel administrativo**: Paralelamente, el administrador o el empleado encargado de las ventas físicas podrá ver este nuevo pedido en el **panel de administración**. Dependiendo del rol:

   * Un **vendedor/empleado** puede marcar el pedido como en proceso, empaquetado, enviado, etc. y el sistema enviará **notificaciones de seguimiento** al cliente conforme el estado vaya cambiando (por ejemplo, "Tu pedido ahora está en camino"). Las notificaciones pueden ser correos, o incluso notificaciones *push* si se configuran.
   * El **administrador** también puede ver y gestionar todos los pedidos, y tendrá capacidades adicionales como reembolsar, cancelar, ver estadísticas de ventas acumuladas, etc.

8. **Reseñas (post-compra)**: Después de completarse la compra y recibir el producto, el sistema permite al usuario comprador dejar una **reseña** en la página del producto. Solo los usuarios que efectivamente compraron ese producto pueden evaluar y comentar, lo cual Petly-Web garantiza comprobando el historial de pedidos del usuario. Esto cierra el ciclo de feedback, alimentando al catálogo con valoraciones auténticas.

Este flujo de compra asegura la integridad de la transacción (no se crea el pedido sin pago confirmado, no se venden cantidades inexistentes, etc.) y la trazabilidad para el usuario y los administradores. Además, está **protegido por autenticación** para vincular cada compra a un usuario específico y aplicar las políticas de **solo compradores pueden reseñar** y seguimiento de pedidos en el perfil del cliente.

### 3.4 Ejemplo de flujo para **Adopción de una mascota**

El flujo para la adopción de mascotas en Petly-Web es distinto al de compra, pues no involucra un pago en línea sino la gestión de una **solicitud de adopción** que será revisada por un administrador. Los pasos típicos son:

1. **Explorar mascotas disponibles**: El usuario navega la sección de **Adopciones**, donde se listan mascotas disponibles para adoptar (similar a un catálogo, pero de mascotas en lugar de productos). Puede haber filtros por tipo de animal, edad, etc. Al hacer clic en una mascota, se muestra la página de perfil de esa mascota con su foto, descripción, edad, vacunas, etc.

2. **Iniciar solicitud de adopción**: En el perfil de la mascota habrá un botón como "Adoptar" o "Solicitar Adopción". Si el usuario no ha iniciado sesión, al pulsarlo el sistema primero lo redirige a iniciar sesión/registrarse, ya que solo usuarios registrados pueden continuar (la adopción requiere información de quién solicita, seguimiento, etc.). Tras autenticarse, el usuario vuelve al perfil de la mascota.

3. **Formulario de adopción**: Al confirmar que desea adoptar esa mascota, el sistema presenta un **formulario de solicitud de adopción**. En este formulario el usuario deberá proporcionar cierta información personal adicional y posiblemente responder preguntas relevantes: por ejemplo, domicilio, experiencia con mascotas, motivos para adoptar, referencias, etc., según las políticas del sitio. Estos datos son importantes para que el administrador evalúe si el solicitante es apto. El formulario podría ya tener algunos campos pre-llenados con datos del perfil del usuario (como nombre, email) y pedir los específicos para adopción.

4. **Envío de solicitud**: El usuario envía el formulario. El controlador correspondiente (`AdoptionController`, por ejemplo) recibe los datos, valida que estén completos y los guarda en la base de datos. Generalmente se creará un registro en una tabla de **Solicitudes de Adopción** que vincula el ID del usuario solicitante, el ID de la mascota en cuestión, la fecha y los detalles proporcionados. Este registro puede tener un estado inicial "Pendiente" o "En revisión".

5. **Confirmación al usuario**: Tras guardar la solicitud, el sistema muestra al usuario una página o mensaje de confirmación indicando que su solicitud fue enviada exitosamente y que el equipo de Petly se pondrá en contacto después de revisarla. Es posible que en el perfil del usuario haya una sección de "Mis solicitudes de adopción" donde pueda ver el estado (Pendiente/Aprobada/Rechazada) de las adopciones que ha pedido.

6. **Revisión por el administrador**: En el lado del administrador, existe una interfaz (en el panel admin) para gestionar adopciones. El administrador podrá ver la lista de solicitudes pendientes, con toda la información proporcionada por el usuario:

   * El administrador (o un empleado encargado) **evalúa la solicitud**. Esto puede incluir contactarse con el solicitante fuera del sistema (por teléfono o email) para una entrevista, verificar si cumple requisitos (por ejemplo, mayores de edad, hogar adecuado, etc.). Petly-Web no automatiza esto completamente, pero ofrece el registro y seguimiento.
   * Tras la evaluación, el administrador actualiza el estado de la solicitud en el sistema a **Aprobada** (si considera que la adopción procede) o **Rechazada**. Esto se puede hacer en una pantalla detallada de la solicitud con un botón o selector de estado.

7. **Notificación del resultado**: Cuando el administrador cambia el estado a Aprobado/Rechazado, Petly-Web podría notificar automáticamente al solicitante. Por ejemplo, enviar un correo indicando "¡Tu solicitud para adoptar a \[Mascota] ha sido aprobada! Por favor, contáctanos para coordinar la entrega" en caso positivo, o un correo amable de rechazo en caso negativo. También en el perfil del usuario aparecerá actualizado el estado de la solicitud. A partir de una aprobación, posiblemente el sistema ya no muestra esa mascota como disponible (la podría marcar como "En proceso de adopción" o quitar del listado de adopciones para evitar múltiples promesas sobre la misma mascota).

8. **Finalización**: Una vez aprobada, el proceso de adopción se completa fuera de la plataforma (entrega física de la mascota, firmas de papeles si aplica). El sistema Petly-Web podría tener la opción de que el administrador marque la mascota como **adoptada** definitivamente, retirándola del catálogo. Este histórico queda en la base de datos (mascota adoptada por usuario X en fecha Y).

En este flujo de adopción, a diferencia de la compra, no hay transacciones monetarias ni carrito, pero sí un **proceso de aprobación manual**. El sistema facilita la conexión entre adoptante y administrador, registrando todos los datos necesarios y proporcionando estatus claros. Esto garantiza transparencia y seguimiento: el usuario sabe en qué estado está su solicitud, y el administrador tiene centralizada la información para tomar decisiones. Además, Petly-Web se asegura que solo usuarios registrados puedan solicitar adopciones (para obtener información fiable de contacto) y que cada mascota sea adoptada solo una vez (al bloquear nuevas solicitudes una vez aprobada una, por ejemplo).

## 4. Estructura de carpetas clave del proyecto

El proyecto Laravel Petly-Web sigue la estructura típica de una aplicación Laravel, con algunas adiciones propias de integrar un e-commerce (Bagisto). A continuación se listan los directorios principales y su propósito:

* **`app/`** – Contiene la lógica de la aplicación, incluyendo subdirectorios como `Http/` (donde están los **Controladores**, **Middlewares** y **Form Requests** para validación), `Models/` (los **Modelos Eloquent** que representan las tablas de la base de datos) y otros componentes de negocio. En Petly-Web aquí residirán, por ejemplo, controladores como `ProductController`, `CartController`, `AdoptionController`, etc., y modelos como `User`, `Product`, `Pet`, `Order`, etc. También pueden estar clases de servicio o helpers si se definieron.

* **`routes/`** – Define las **rutas (endpoints HTTP)** de la aplicación. Laravel separa por default en archivos como `web.php` (rutas web normales, con estado, vistas HTML), `api.php` (rutas para APIs REST, stateless, usualmente retornando JSON) y otros como `console.php` o `channels.php` (no relevantes aquí). En Petly-Web, `routes/web.php` registrará rutas para el frontend de la tienda y posiblemente algunas para el backend admin. Dado que Petly integra Bagisto, es posible que Bagisto gestione muchas rutas de tienda y admin por su cuenta a través de sus paquetes. Aun así, puede haber rutas personalizadas añadidas para funcionalidades propias (por ejemplo, rutas para el chat de recomendaciones, para las comparaciones de producto, etc.). Estas rutas apuntan a los métodos de controladores del app.

* **`resources/views/`** – Contiene las **vistas Blade** (\*.blade.php) de la aplicación. Aquí se encuentran los archivos de plantilla que definen la interfaz. Petly-Web podría tener subcarpetas como `shop/` para las vistas del sitio público (ej. `shop/home.blade.php`, `shop/product-details.blade.php`, `shop/cart.blade.php`, `shop/adoptions.blade.php` para lista de mascotas, etc.) y quizás `admin/` para las vistas del panel administrativo si se personalizaron. Bagisto en particular maneja sus vistas de tienda y admin en paquetes, pero si el equipo Petly ha creado vistas propias o sobreescrito algunas, estarían en esta carpeta (por ejemplo, para modificar la apariencia del tema, o añadir la página de chat de recomendación).

* **`database/`** – Incluye todo lo referente a la **base de datos**. Aquí encontramos las **Migraciones** (en `database/migrations`) que son archivos PHP para crear/modificar tablas y columnas de forma estructurada; los **Seeders** (en `database/seeders`) que insertan datos iniciales o de prueba; y las **Factories** (en `database/factories`) que sirven para generar datos falsos aleatorios para pruebas. En Petly-Web, las migraciones definen las tablas como `users`, `products`, `orders`, `pets` (para adopciones), `adoption_requests`, etc., junto con sus relaciones (claves foráneas). Los seeders pueden poblar datos básicos: por ejemplo, crear categorías de producto por defecto, un usuario administrador inicial, algunas mascotas de ejemplo, etc. Esto ayuda a arrancar el proyecto rápidamente en desarrollo. Las factories podrían haber sido usadas para generar usuarios o productos ficticios durante el desarrollo para pruebas.

* **`public/`** – Carpeta accesible públicamente por el servidor web. Contiene el **punto de entrada** `index.php` (por donde pasan todas las peticiones a Laravel) y los **assets estáticos** de la aplicación: archivos CSS, JavaScript y **imágenes**. En Petly-Web aquí residirán, por ejemplo, las hojas de estilo del frontend (quizá construidas con Laravel Mix), archivos JavaScript para funcionalidades dinámicas (por ejemplo, el código del carrusel tipo TikTok de productos/mascotas, validaciones en frontend, etc.), imágenes del logo y posiblemente fotos por defecto. Además, Bagisto podría tener en `public/` recursos propios (como archivos compilados de su panel admin que usa Vue). Esta carpeta es la que se expone directamente en producción para servir contenido estático.

* **`config/`** – Archivos de configuración de la aplicación. Aquí se ajustan componentes como la conexión a base de datos (`config/database.php`), configuraciones de mail, cache, sesión, etc., así como configuraciones específicas de paquetes. Por ejemplo, al integrar Bagisto, puede haber archivos de config adicionales como `bagisto_graphics.php` o similares. En Petly-Web, es probable que veamos configuración para roles/permisos, para servicios externos (si hubiera, como claves API de algún servicio de pago o de mapas, etc.), y valores ajustables (ej: cantidad de productos destacados a mostrar, etc.).

* **`packages/`** – (Solo si existe en el proyecto). Dado que Petly-Web usa Bagisto, muchas de las funcionalidades de e-commerce residen en **paquetes** de Bagisto (desarrollados por Webkul). Es posible que en el código fuente haya un directorio `packages/` con subdirectorios tipo `Webkul/Product`, `Webkul/Shop`, `Webkul/Admin`, etc., que contienen código fuente de Bagisto. Alternativamente, si Bagisto fue instalado vía Composer, estas partes podrían estar en `vendor/`. En cualquier caso, es útil mencionarlo: Bagisto organiza su código modularmente en paquetes para cada módulo (Producto, Carrito, Pago, etc.), lo que hace más fácil extender o personalizar partes específicas. El equipo de Petly pudo apoyarse en estos paquetes para no tener que escribir desde cero todo el comportamiento de tienda.

* **`vendor/`** – Contiene las dependencias PHP instaladas vía Composer. Aquí se incluye el propio Laravel framework y otras librerías de terceros. En el contexto de Petly-Web, `vendor/` muy probablemente incluye los paquetes de Bagisto (si no están en `packages/` directamente), por ejemplo bajo `vendor/bagisto/...` o `vendor/webkul/...` con todos los módulos de e-commerce. También podría contener librerías adicionales que se hayan requerido, como por ejemplo **Spatie** (si usaron su paquete de roles/permissions), librerías para 2FA, etc. Este directorio usualmente no se toca manualmente, solo mediante Composer.

* **`storage/`** – Aquí Laravel guarda archivos generados durante la ejecución, como logs (en `storage/logs/laravel.log` se registra cualquier error o mensaje de depuración), archivos de caché, sesiones (si se configura file-based session), y también archivos subidos por usuarios si se usan rutas de almacenamiento locales. Petly-Web podría usar `storage/app/public` para guardar imágenes de productos o fotos de mascotas subidas, que luego se hacen accesibles vía un enlace simbólico en `public/storage`. La gestión de imágenes de productos/mascotas es importante en este tipo de proyecto; lo usual es que al cargar una imagen de producto, se almacene en `storage` y se sirva al frontend a través de `public/storage`.

En general, la estructura sigue el estándar Laravel, por lo que nuevos desarrolladores pueden ubicarse fácilmente. El uso de Bagisto añade modularidad por paquetes, pero conceptualmente las piezas siguen estando en controladores, modelos, vistas, etc., solo que organizadas de forma encapsulada.

## 5. Componentes del backend de Petly-Web

En el backend de Petly-Web podemos identificar varios componentes clave que conforman la lógica de negocio y la estructura de la aplicación. A continuación, se describen estos componentes y cómo se usan en el proyecto:

### 5.1 Controladores principales

Los **Controladores** gestionan las distintas funcionalidades, procesando las peticiones y preparando las respuestas. Algunos de los controladores principales en Petly-Web (según las funcionalidades requeridas) serían:

* **Controladores de Tienda (Shop Controllers)**: Manejan todo lo que ve el cliente en la tienda en línea. Por ejemplo, el `HomeController` para cargar la página de inicio (posiblemente mostrando el carrusel de productos y mascotas destacados), un `ProductController` para listar productos y mostrar detalles de un producto, el `CategoryController` para mostrar productos por categoría, y un `CartController` para operaciones sobre el carrito de compras (agregar/quitar items, ver carrito). También puede haber un `CheckoutController` que orquesta los pasos de pago del pedido.

* **Controlador de Adopciones**: Dado que la adopción es una parte importante, podría existir un `AdoptionController` que maneje la lista de mascotas disponibles, la vista de detalle de mascota, y reciba las solicitudes de adopción (método que guarda la solicitud). Este controlador trabajaría junto con modelos como `Pet` (mascota) y `AdoptionRequest`.

* **Controladores de Autenticación y Usuario**: Laravel normalmente provee controladores para login, registro, restablecer contraseña, etc., a través del paquete de UI o Fortify. En Petly-Web, además de esos, podría haber controladores personalizados para perfil de usuario (por ejemplo, `UserController` para ver o editar perfil, listar pedidos del usuario, progreso de adopciones). También, si implementaron la autenticación en dos pasos manualmente, habría lógica adicional en el controlador de login para manejar la generación y verificación del código 2FA.

* **Controladores Administrativos**: El panel de administración, gracias a Bagisto, ya viene con muchos controladores: por ejemplo, controladores para gestionar productos (crear/editar/eliminar productos del catálogo), categorías, administrar pedidos (ver lista de pedidos, cambiar estado), gestionar clientes (ver lista de clientes registrados) y empleados. Bagisto los organiza en su paquete Admin, pero a ojos del desarrollador de Petly, se pueden considerar componentes listos. Adicionalmente, puede haberse añadido un `EmployeeController` si hay gestión separada de empleados, o algún controlador para panel del vendedor (si los vendedores tienen un dashboard distinto). Estos controladores suelen estar protegidos por middleware de admin y renderizan vistas dentro del área administrativa.

* **Otros controladores**: Posiblemente Petly-Web incluye pequeñas funcionalidades adicionales, por ejemplo un `SearchController` para manejar búsquedas globales de productos/mascotas (incluyendo las sugerencias en tiempo real), o un controlador para las reseñas (`ReviewController`) que recibe la creación de nuevas reseñas de producto por parte de compradores. También si se implementó el chat de recomendaciones con IA (como parecía sugerir el requisito), podría haber un controlador que procese esas consultas del chat y devuelva sugerencias (quizás utilizando algún servicio interno o externo de búsqueda).

En resumen, los controladores actúan como **coordinadores**, cada uno enfocado en un conjunto de acciones relacionadas. Laravel hace uso extensivo de controladores Resource (CRUD) y rutas nombradas, lo cual seguramente fue aprovechado en Petly-Web para estructurar las operaciones de catálogo y administración de forma consistente.

### 5.2 Modelos (Eloquent)

Los **Modelos** son representaciones de las entidades de la base de datos y encapsulan la lógica de negocio asociada a ellas. En Petly-Web, los modelos principales incluyen:

* **User** – Representa a los usuarios del sistema. Laravel ya provee un modelo User base (con traits para autenticación). Este modelo puede haberse extendido para incluir campos adicionales (por ejemplo, rol del usuario o perfil del cliente). Es utilizado tanto para clientes como para empleados/administradores, aunque a veces para admin Bagisto usa otro modelo o tabla (`admin` users). No obstante, podría tener relaciones como `orders` (un usuario tiene muchos pedidos) y métodos para verificar su rol (esAdmin, esVendedor, etc.).

* **Product** – Representa un producto de la tienda. Incluye campos como nombre, descripción, precio, stock, categoría\_id, etc. Tiene relaciones, por ejemplo, `category` (muchos productos pertenecen a una categoría), `reviews` (un producto tiene muchas reseñas), quizá `orderItems` (relación con las líneas de pedido que lo incluyeron). Es central para todas las operaciones de catálogo.

* **Category** – Representa una categoría de productos (Alimentos, Juguetes, Cuidado, etc.). Usualmente tiene una relación de jerarquía (una categoría puede tener subcategorías). En Petly-Web puede usarse para organizar tanto productos como posiblemente tipos de mascotas (aunque es más probable que las mascotas para adopción tengan su propio tipo/categoría separado). Un Category tiene muchos Product.

* **Order** – Representa un pedido/orden de compra. Contiene campos como usuario\_id (quién compró), fecha, estado (pendiente, pagado, enviado, entregado, etc.), total, dirección de envío, método de pago, etc. Relacionado uno-a-muchos con OrderItems (cada ítem del pedido), y pertenece a un User (cliente). Podría tener relación con algún modelo Shipment o Payment info si se detalló.

* **OrderItem** – Modelo que usualmente representa cada línea de producto dentro de un pedido. Campos: order\_id, product\_id, cantidad, precio\_unitario, subtotal, etc. Pertenece a Order y a Product. Esto permite recuperar qué productos se vendieron en cada orden.

* **Pet** – Modelo para las mascotas disponibles para adopción. Contiene información de la mascota: nombre, especie, raza, edad, sexo, descripción, estado de salud/vacunas, quizá una foto (ruta a imagen). Puede tener un campo booleano "adoptada" o "disponible" para marcar si sigue en adopción. Este modelo estaría relacionado con las solicitudes de adopción recibidas.

* **AdoptionRequest** – Modelo que representa una **solicitud de adopción** enviada por un usuario para una determinada mascota. Campos: pet\_id, user\_id, fecha, estado (pendiente, aprobado, rechazado), y posiblemente campos de información provista (como respuestas del formulario de adopción). Se relaciona con User (solicitante) y con Pet. Este modelo facilita listar solicitudes por usuario o por mascota.

* **Review** – Si se implementó reseñas, podría haber un modelo Review para las evaluaciones de productos. Campos: user\_id, product\_id, calificación (estrellas), comentario, fecha, etc. Un Review pertenece a un Product y a un User. Esto ayuda a filtrar que un usuario solo tenga una reseña por producto y que sea comprador.

* **Employee** – Si los empleados/vendedores se manejaron en una tabla separada de usuarios admins, podría haber un modelo Employee. Sin embargo, es probable que no: usualmente se aprovecha el modelo User con un campo rol. Bagisto por ejemplo maneja los admins (incluyendo vendedors) en otra tabla. En cualquier caso, si existe, tendría campos similares a User pero roles distintos.

Otros modelos podrían incluir cosas como **Cart** o **CartItem** si la sesión de carrito se persistiera en BD (aunque Laravel normalmente maneja carrito en sesión o usando el modelo Order temporal), **Payment** si se registran pagos, etc. Además, Bagisto trae modelos para atributos de productos, reglas de promoción, etc., pero a nivel de Petly, los mencionados arriba son los esenciales para la funcionalidad solicitada.

Todos estos modelos utilizan **Eloquent ORM** de Laravel, por lo que heredan métodos para operaciones CRUD simples (e.g. `Product::create([...])`, `Order::with('items')->find($id)` para traer un pedido con sus items, etc.). También definen las **relaciones** usando métodos `hasMany`, `belongsTo`, `belongsToMany` según corresponda, lo que simplifica obtener datos relacionados. La relación entre estos modelos y la base de datos se detalla en el siguiente punto.

### 5.3 Middlewares

Los **Middlewares** son clases intermedias que filtran las peticiones HTTP antes o después de los controladores. Petly-Web aprovecha varios middlewares para aspectos de seguridad y flujo:

* **`auth`** – Middleware nativo de Laravel que verifica que el usuario esté autenticado. Se aplica a rutas que requieren login, por ejemplo: ver el carrito (podría permitirse sin login, pero **finalizar compra** requiere login), ver el perfil de usuario, enviar solicitud de adopción, etc. Si el usuario no está autenticado, este middleware lo redirige al login automáticamente.

* **Middlewares de **roles**** – Dado que existen roles (Cliente, Vendedor, Administrador), es común definir middlewares específicos. Por ejemplo, un middleware `isAdmin` que comprueba que el usuario autenticado tenga rol de administrador; si no, le niega acceso (generalmente con un código 403 o redirección). Similarmente podría haber `isEmployee` (vendedor) para secciones del panel de vendedor. Estos middlewares garantizan *seguridad por roles*, cumpliendo el requisito de que un usuario sin permiso no pueda acceder a funciones de gestión.

* **`verified`** – Laravel trae un middleware para verificar emails (si se utiliza verificación de correo electrónico tras registro). Si Petly-Web exige que el correo esté verificado antes de ciertas acciones, este middleware estaría en uso.

* **Middleware de 2FA** – Si la autenticación de dos pasos se implementó de forma genérica, podría existir un middleware que, una vez logueado el usuario, compruebe si tiene pendiente validar el segundo factor. Por ejemplo, después de ingresar contraseña, hasta que no complete 2FA, podría limitar acceso a rutas internas. Otra forma es manejarlo dentro del flujo de login mismo. En cualquier caso, es posible que no haya un middleware separado para esto, sino lógica en el controlador de login.

* **Middleware de localización/idioma** – Si se contempló multi idioma (no mencionado directamente), pudiera haber uno para establecer el locale a partir de preferencias del usuario.

* **Middleware de registro de actividad** – No es explícito, pero a veces se implementa middleware para loguear peticiones o medir tiempos de ejecución (para rendimiento). Dado el requisito de rendimiento óptimo (<3 segundos), quizá se usaron herramientas de logging o debug (Laravel Debugbar, incluido con Bagisto, es un paquete que agrega un middleware para propósitos de depuración).

Laravel registra los middlewares globales en `app/Http/Kernel.php` y también permite asignarlos a rutas individualmente o por grupos (por ejemplo, grupo `admin` que incluye `auth` y verificación de admin). En Petly-Web, es de esperar que las rutas de **/admin** estén agrupadas con su middleware de autenticación de administrador, las rutas del panel de vendedor con el suyo, y las rutas públicas sin esos filtros.

En síntesis, los middleware actúan como **guardianes** y configuradores de contexto para las peticiones: protegen rutas, establecen condiciones previas y, en general, ayudan a cumplir con requisitos de seguridad (autenticación y autorización) antes de llegar a la lógica principal en los controladores.

### 5.4 Migraciones de base de datos

Las **Migraciones** son scripts controlados que permiten crear y modificar la estructura de la base de datos de forma incremental y reproducible. Para Petly-Web, las migraciones definen todas las tablas necesarias para el funcionamiento. Algunas migraciones importantes habrán sido:

* Creación de tabla **users** (usuarios) con campos como nombre, email, contraseña, email\_verificado\_at, etc., más posiblemente un campo `role` o una relación a una tabla roles si se usó. Laravel crea esta migración por defecto (users y password\_resets).

* Creación de tabla **password\_resets** y quizás **personal\_access\_tokens** (si usaron Laravel Sanctum o algo para tokens, pero probablemente no para este proyecto).

* Migraciones de **products**: Tabla `products` con campos como nombre, descripción, precio, stock, categoría\_id (llave foránea a categories), etc. También una tabla `categories` para categorías de productos (con self-referencia si hay jerarquía, por ejemplo parent\_id). Además, tablas relacionadas que Bagisto suele tener: `product_images` (imágenes de productos), `product_attributes` (si se maneja variantes), etc., aunque quizás el proyecto no llegó a ese nivel de detalle, o se apoyó en Bagisto que ya tiene migraciones para un modelo de datos robusto de catálogo.

* Migraciones de **orders** y **order\_items**: Tabla `orders` con campos: id, user\_id, estado, total, dirección\_envío, etc., y tabla `order_items` con order\_id, product\_id, qty, price, subtotal. Estas reflejan el modelo de pedido y sus líneas. Posiblemente también una tabla `payments` o incluir en orders datos de pago, dependiendo de la implementación.

* Migración de **pets** (mascotas en adopción): Tabla `pets` con campos: id, nombre, especie, edad, sexo, vacunado (boolean), descripción, foto (ruta), y tal vez un campo estado (disponible/adoptado). Esto extiende el esquema para la parte de adopciones.

* Migración de **adoption\_requests**: Tabla que registra solicitudes de adopción, con campos: id, pet\_id (foránea a pets), user\_id (foránea a users), pregunta1, pregunta2,... (campos para info de formulario, o quizá un campo JSON), estado (pendiente/aprobado/rechazado), timestamps. Así se almacena cada solicitud.

* Migraciones de **reviews**: Tabla `reviews` con campos: id, product\_id, user\_id, calificacion (int), comentario (text), created\_at... Solo se llena cuando un usuario hace una reseña, y se puede consultar para mostrar en cada producto.

* Migraciones de **empleados**: Si decidieron manejarlos en tabla aparte, podría haber `employees` con user\_id referenciando users, o incluso una tabla `roles` y `role_user` (si implementaron un sistema robusto de roles muchos a muchos). Sin embargo, dado el alcance, quizá optaron por algo sencillo como un campo en users.

* Migraciones de **otros**: Bagisto en su instalación crea muchas tablas auxiliares (por ejemplo, para configuración, configuración de impuestos, reglas de carrito, etc.). Si Petly-Web incluyó Bagisto completo, las migraciones de Bagisto ya habrán creado tablas como `customers` (distinta de users para Bagisto, ya que Bagisto separa conceptualmente admin users de customers), tablas `cart`, `cart_items`, `invoices`, `shipments`, etc. Esto dependerá de cuánto del core de Bagisto se usó. Dado que se menciona ejecutar `php artisan bagisto:install`, es muy probable que todas esas tablas existan y se usen en la base de datos de Petly.

En cualquier caso, las migraciones aseguran que todos los colaboradores del proyecto y los despliegues en distintos entornos puedan replicar exactamente el mismo esquema de base de datos. Además, permiten evolucionar el diseño (por ejemplo, si se decide agregar un campo "microchip\_id" a la tabla pets, se crea una nueva migración para modificarla en lugar de cambiarla manualmente en producción).

### 5.5 Seeders y Factories

* **Seeders**: Son clases usadas para insertar datos iniciales o de ejemplo. En Petly-Web, se pudo haber creado, por ejemplo, un seeder para **Roles** (si existía una tabla de roles, insertar roles "admin", "vendedor", "cliente"), un seeder para un **Usuario Administrador** por defecto (de modo que al instalar la aplicación haya con quién iniciar sesión en el panel admin). También seeders para categorías de producto comunes (Alimentos, Juguetes, etc.) y quizá unos productos de ejemplo para facilitar pruebas durante desarrollo. Bagisto en su instalación gráfica usualmente pide crear un usuario admin y algunos datos básicos; si se usó ese instalador, los seeders propios quizá no fueron tan necesarios para admin, pero podrían haber seeders personalizados para data adicional.

* **Factories**: Las factories permiten generar datos falsos con la librería Faker. Durante desarrollo, el equipo pudo usarlas para crear muchos **usuarios de prueba**, **productos de prueba**, etc., y así probar carga de la tienda. Por ejemplo, una factory de Product podría generar nombres e imágenes aleatorias para poblar un catálogo simulado. Esto ayuda en la etapa de desarrollo y testing. En producción no se usan, pero quedan en el código para futuros desarrolladores o pruebas unitarias.

* **Seeder de Bagisto**: Cabe mencionar que Bagisto trae sus propios seeders para ciertos catálogos (por ejemplo, zonas geográficas, configuración de países/estados para direcciones, configuración por defecto de tienda). Al correr `bagisto:install` se llenan varias tablas con información base (moneda por defecto, canal por defecto, etc.). Así, Petly-Web tras instalación ya tendría, por ejemplo, una categoría raíz de productos, un canal "default", una moneda "USD" o "MXN" configurada, etc., sin intervención manual.

En suma, Seeders y Factories no afectan al funcionamiento en producción pero son muy útiles para **preparar el entorno**. Para el desarrollo de Petly-Web, seguramente facilitaron cumplir con requisitos como tener un administrador disponible, probar el panel de vendedor con algunos pedidos ficticios, o ver el funcionamiento del carrusel con varias mascotas y productos cargados.

## 6. Relación entre base de datos y modelos (estructuras y relaciones)

El diseño de la base de datos de Petly-Web está alineado con los modelos Eloquent descritos y con las necesidades de la aplicación. A continuación, se resumen las principales tablas y sus **relaciones** (cardinalidades) dentro del sistema, mostrando cómo se conectan los datos:

* **Usuarios y Roles**: Todos los usuarios (clientes, vendedores, admins) pueden estar en una tabla común `users` diferenciados por un campo de tipo de rol. Alternativamente, Bagisto maneja clientes en `customers` y admins (incluyendo otros empleados) en `admins`. Sea cual sea la implementación, la relación típico es *uno a muchos* entre Rol y Usuario (un rol puede ser asignado a muchos usuarios, cada usuario tiene un rol). Si usaron una tabla `roles` aparte, habría una relación *muchos a muchos* (un usuario puede tener varios roles, pero probablemente aquí es uno cada uno). Por ejemplo: 1 Administrador principal, 5 Vendedores, N Clientes.

* **Productos, Categorías y Reseñas**:

  * Una **Categoría** puede tener muchos **Productos** (*uno a muchos*). Un producto pertenece a una categoría (por ejemplo, "Alimentos" tiene varios productos comida para perro).
  * Un **Producto** puede tener muchas **Reseñas** (*uno a muchos*), escritas por distintos usuarios. Una **Reseña** pertenece a un producto y también pertenece a un usuario. Solo usuarios que compraron el producto pueden crear esa reseña, lo que implica una relación lógica: la existencia de un registro de OrderItem con ese producto y ese user\_id habilita la reseña.
  * Productos podrían tener relación con **OrderItems** (ver Pedidos) y quizá con **carrito** (depende de implementación, Bagisto por ejemplo tiene tabla `cart_items` relacionando productos con carritos temporales).

* **Pedidos (Orders) y sus Items**:

  * Un **Usuario (cliente)** puede tener muchos **Pedidos** realizados (*uno a muchos*: un cliente ha hecho varias compras a lo largo del tiempo). Un Pedido siempre pertenece a un único Usuario (quién lo realizó).
  * Un **Pedido** puede tener muchos **OrderItems** (*uno a muchos*), cada OrderItem representando un producto específico en cierta cantidad. El OrderItem a su vez apunta a un **Producto** (relación *muchos a uno*: muchos order\_items pueden ser del mismo producto en distintos pedidos).
  * Entre **Producto** y **Pedido** existe una relación *muchos a muchos* implícita realizada a través de OrderItems (ya que un producto puede aparecer en muchos pedidos, y un pedido tiene varios productos). OrderItem es la tabla pivote de esa relación.
  * Los **Pedidos** pueden tener relaciones con otras tablas: por ejemplo, **pagos** (si se registran pagos, 1 pedido -> 1 pago), **envíos** (1 pedido -> 1 envío con tracking), etc., aunque no se detalla en los requisitos, podría integrarse.

* **Carrito**: Si se persistió, un carrito podría tener su tabla (Cart, CartItems). Por simplicidad, puede que no se guarde en BD sino solo en sesión hasta que se convierte en Order. Bagisto tiene `cart` y `cart_items` por si se usa. En todo caso, un carrito pertenecería a un usuario (o sesión) y tendría items similares a order\_items.

* **Mascotas (Pets) y Adopciones**:

  * Una **Mascota** puede tener muchas **Solicitudes de Adopción** (*uno a muchos*: decenas de personas podrían solicitar la misma mascota, aunque solo una será aprobada). Cada **AdoptionRequest** pertenece a una mascota específica.
  * Un **Usuario (cliente)** puede enviar varias **Solicitudes de Adopción** a lo largo del tiempo, incluso para distintas mascotas (*uno a muchos*: el usuario X solicitó adoptar al Pet A y al Pet B). Cada solicitud pertenece a un usuario.
  * Existe también una relación lógica entre **Mascota** y **Usuario adoptante final**: una vez aprobada una solicitud, la mascota se asocia a un usuario que la adoptó. Esto podría reflejarse en la base de datos marcando en la tabla `pets` un campo `adopted_by_user_id` una vez completada la adopción, o manteniéndolo solo en la solicitud con estado aprobado. En cualquier caso, tras aprobar, la mascota ya no genera nuevas solicitudes (se podría considerarla "fuera de catálogo").

* **Vendedores/Empleados**: Si comparten la tabla de admins, se distinguen por rol. Un vendedor podría estar relacionado a ciertas **ventas físicas** u **órdenes** en las que participa (por ejemplo, si registran ventas de tienda física en el sistema, tal vez un pedido tenga asignado un `seller_id` que indica qué empleado lo gestionó). Esto no se detalla en requisitos pero dice "panel de ventas físicas para vendedor", lo que sugiere que los vendedores podrían cargar pedidos físicos. Es posible entonces que haya una relación de *uno a muchos* entre Usuario-vendedor y Pedidos (pedidos marcados como creados por tal vendedor). De ese modo, un vendedor ve solo sus pedidos (los que él registró). Mientras que el admin ve todos.

* **Roles y Permisos**: En caso de una implementación más elaborada (por ejemplo con Spatie Permissions o Bagisto ACL), existirían tablas pivote entre usuarios y roles, y roles y permisos. Pero para propósitos generales: 3 roles básicos probablemente se manejaron con lógica simple.

En cuanto a la **integridad referencial**, las migraciones seguramente establecieron **foreign keys** para estas relaciones:
por ejemplo, `orders.user_id` referencia `users.id` (asociando pedido a usuario), `order_items.product_id` referencia `products.id`, `order_items.order_id` a `orders.id`, `adoption_requests.pet_id` a `pets.id`, etc. Esto asegura que no haya registros huérfanos (no puedes tener un order\_item apuntando a un producto que no existe, etc.). También se pueden definir *acciones ON DELETE*: probablemente, si se borra un producto, las cascadas podrían impedir borrar si tiene pedidos (lo cual es bueno, usualmente no se elimina productos que tienen historial). Laravel/Eloquent maneja relaciones de forma que es raro borrar cosas en cascada automáticamente, usualmente se restringe para mantener historial.

Otro aspecto importante son los **índices** en base de datos para rendimiento. Por ejemplo, campos como `user_id` en orders, `product_id` en order\_items, etc., estarían indexados al ser foreign keys y para consultas rápidas filtrando por usuario o por producto. Igualmente, buscar productos por categoría requiere índice en `category_id`, etc. Dado el énfasis en rendimiento en requisitos no funcionales, se habrá prestado atención a esto.

En resumen, el modelo de datos de Petly-Web conecta todas las entidades clave con relaciones claras:
**Usuarios** vinculados a **Pedidos** y **Reseñas**; **Productos** asociados a **Categorías**, **Pedidos (items)** y **Reseñas**; **Mascotas** asociadas a **Solicitudes de adopción**; y estructuras de soporte (roles, empleados) que aseguran la segregación de responsabilidades. Estas relaciones garantizan, por ejemplo, que solo usuarios con pedidos puedan reseñar, o que al listar un producto se puedan traer sus reseñas, o que un administrador pueda ver todas las solicitudes de adopción en espera. La base de datos, por tanto, refleja fielmente las reglas de negocio del dominio mascotas + e-commerce.

## 7. Integración frontend-backend (vistas y comunicación)

La integración entre el **frontend** (la interfaz de usuario) y el **backend** (la lógica en Laravel) en Petly-Web se logra principalmente a través de las **vistas Blade**, formularios HTML y algunas características dinámicas proporcionadas por Laravel y librerías de JavaScript.

Algunos puntos clave de esta integración son:

* **Motor de plantillas Blade**: Laravel utiliza Blade para generar vistas de forma eficiente. En Petly-Web, las vistas Blade permiten incrustar variables y estructuras de control directamente en el HTML. Por ejemplo, en la página de listado de productos podría haber algo como:
  `@foreach($products as $product) ... @endforeach`
  para iterar y mostrar cada producto con su nombre, imagen y precio. Blade facilita la reutilización mediante **layouts** y **secciones**. Seguramente existe un layout base (por ejemplo, `layouts/app.blade.php`) que incluye el encabezado con el logo de Petly, el menú de navegación (categorías, botón de carrito, botón de chat de recomendación, etc.) y el pie de página. Las vistas específicas extienden ese layout. Así, el frontend mantiene una apariencia consistente y es fácil de cambiar en un solo lugar elementos comunes (como agregar un nuevo enlace al menú).

* **Componentes dinámicos**: Si bien Blade es estático en el sentido de que renderiza en el servidor, Petly-Web pudo incorporar **componentes interactivos** en el frontend usando JavaScript. Se menciona, por ejemplo, un carrusel tipo TikTok de productos/mascotas. Esto seguramente se logró con un componente JS/CSS (quizás usando alguna librería de carrusel/slider) que toma una lista de elementos en la vista y permite desplazarse verticalmente. Otro elemento dinámico es el **chat de recomendaciones** – un botón flotante que al hacer clic muestra una ventanita de chat para que el usuario escriba lo que busca, y el sistema le sugiere productos/mascotas. Implementar esto pudo implicar usar AJAX: el texto ingresado se envía a un endpoint (por ejemplo, un controlador de búsqueda) que devuelve sugerencias en JSON, las cuales un script JS muestra en el chat. Es posible incluso que se haya usado alguna integración con IA para respuestas (no obligatorio, podría ser solo coincidencias de búsqueda).

* **Formularios y validaciones**: La comunicación frontend-backend en Laravel a menudo ocurre vía formularios HTML (POST/PUT/DELETE) para crear o actualizar datos. Petly-Web tiene varios formularios: login, registro de usuarios, formulario de checkout (compra), formulario de adopción, formulario de reseña, formularios en panel admin para CRUD de productos, etc. Laravel provee protección CSRF automáticamente: en cada formulario Blade incluirán `@csrf` para evitar ataques cross-site request forgery. En el controlador, se utilizan **Form Requests** o `request->validate()` para validar la información. Por ejemplo, al registrar un usuario se verificará que el email tenga formato correcto y no esté ya en uso, que la contraseña tenga X caracteres, etc.; al enviar la solicitud de adopción, que todos los campos requeridos estén llenos. Si la validación falla, Laravel redirige de vuelta al formulario y Blade puede mostrar mensajes de error cerca de cada campo (usando directivas como `@error('campo')`). Estas validaciones aseguran consistencia y una buena experiencia de usuario (mostrando mensajes útiles cuando falta algo).

* **Comunicación de vistas con backend**: Principalmente ocurre cuando una vista Blade se renderiza a través de un controlador que le pasó datos. El controlador invoca `return view('ruta.vista', $datos)` y Blade inserta esos datos donde corresponda. Un ejemplo: el controlador de detalle de producto hace `return view('product.show', ['product' => $product])`. En la vista, se accede con `{{ $product->name }}` para el nombre, `{{ $product->price }}` para precio, etc. Además, Blade facilita condicionales para mostrar ciertos elementos si el usuario tiene permiso o no. Por ejemplo:
  `@auth ... @else ... @endauth`
  para mostrar un botón de "Añadir al carrito" solo a usuarios logueados, o un enlace de "Login para comprar" a invitados. Otro ejemplo: `@if(Auth::user()->isAdmin()) ... @endif` para incluir enlaces de admin en el menú solo si el usuario es administrador.

* **Recursos estáticos y front-end build**: Es probable que Petly-Web haya personalizado estilos CSS (con una paleta verde claro según requerimientos). Pudo usarse Sass o CSS plano en `resources/css`, compilado con Laravel Mix/Vite a `public/css/app.css`. Igualmente, scripts en `resources/js/app.js` con funcionalidades como: manejar eventos del carrito (usar fetch/AJAX para actualizar cantidad sin recargar toda la página), realizar la búsqueda con sugerencias en vivo (escuchando evento `input` en la barra de búsqueda y consultando al backend vía API), controlar el formulario del chat de recomendación, etc. Estas partes front-end se comunican con el backend ya sea recargando páginas (formas tradicionales) o mediante llamadas AJAX a rutas definidas (por ejemplo, una ruta JSON para obtener sugerencias de búsqueda sin refrescar toda la página).

* **Blade Components o Livewire**: No se menciona explícitamente, pero Laravel ofrece *components* reutilizables. Tal vez crearon componentes Blade para cosas como la tarjeta de producto (un mini template para mostrar un producto en una cuadrícula, reutilizado en varias vistas), o para el carrusel. También existe Livewire (framework full-stack para componentes interactivos en Laravel) que podría haber simplificado la creación del chat en tiempo real o el carrito dinámico. Si el equipo lo conocía, podría haberse usado para, por ejemplo, validar el código 2FA en vivo o actualizar la lista de mascotas adoptables en tiempo real. En caso de Bagisto, la admin usa bastante Vue.js para un comportamiento de SPA en ciertas partes, pero eso es más interno a Bagisto.

En resumen, **las vistas Blade son el puente entre el usuario y los datos del sistema**. Con ellas, Petly-Web muestra de forma atractiva toda la información (productos, mascotas, carrito, etc.), asegurándose de que la presentación siga las directrices de diseño (por ejemplo, estilo family-friendly, animaciones sutiles al agregar al carrito). Mientras tanto, el backend Laravel detrás de esas vistas maneja las peticiones y la lógica, enviando sólo los datos necesarios. Este enfoque hace que la aplicación sea más **segura** (pues los usuarios no interactúan directamente con la base de datos, solo mediante formularios controlados) y **mantenible** (se puede cambiar una vista sin tocar la lógica de controlador, o viceversa). La integración se completa con el uso ocasional de JavaScript para mejorar la **experiencia de usuario** (ej: sugerencias instantáneas, actualización de carrito sin refrescar la página, etc.), manteniendo siempre sincronizados el estado en frontend con el backend mediante peticiones HTTP bien definidas.

## 8. Gestión de usuarios y roles (clientes, administradores, vendedores)

La gestión de usuarios en Petly-Web distingue claramente entre **diferentes roles o tipos de usuario** para asegurar que cada uno tenga acceso solo a las funcionalidades que le corresponden. Según los requisitos levantados, el sistema define principalmente **tres roles**:

* **Cliente (Comprador)**: Es el usuario final que navega la tienda, agrega productos al carrito y realiza compras. Sus privilegios se limitan a las partes públicas: ver catálogo de productos y mascotas, gestionar su propio carrito y pedidos, escribir reseñas de productos comprados, y enviar solicitudes de adopción. Un cliente no puede acceder a las secciones de administración ni a datos de otros usuarios. En la interfaz, este rol ve opciones como *mi perfil*, *mis pedidos*, *carrito*, etc., pero no ve opciones de gestionar productos o administrar el sitio.

* **Vendedor (Empleado)**: Corresponde al personal de la tienda (por ejemplo, empleados de una tienda física que también usan el sistema para registrar ventas o actualizar estados de entrega). Este rol tiene acceso a un **panel de vendedor** especial. En dicho panel, un vendedor puede **registrar ventas físicas** (quizá creando pedidos en nombre de clientes que compran en tienda física), **actualizar el estado de pedidos** asignados (por ejemplo, marcar un pedido en línea como "enviado" cuando él prepara el envío), y ver los productos que tiene a su cargo (posiblemente control de inventario de su sucursal, si aplica). Sin embargo, el vendedor **no** tiene permisos completos de administrador: no debería, por ejemplo, agregar nuevos productos al catálogo ni gestionar finanzas globales. Su vista es limitada a sus funciones. Esto se logra asignando permisos específicos a este rol y usando middleware para que solo pueda entrar en ciertas rutas (por ejemplo, `/seller/dashboard` pero no `/admin/dashboard` completo).

* **Administrador**: Es el rol con **control total** del sistema. El administrador puede acceder al **panel administrativo completo**, donde tiene herramientas CRUD para **productos** (agregar nuevos productos o categorías, editar información, gestionar inventario), **usuarios** (tal vez promover a alguien a vendedor, o ver la lista de clientes), **pedidos** (ver todos los pedidos, generar reportes de ventas, manejar reembolsos), **solicitudes de adopción** (aprobar o rechazar), y en general configurar el sistema (por ejemplo, cambiar la imagen del carrusel, gestionar cupones de descuento, ver estadísticas). Puede crear otros usuarios administradores o empleados. Básicamente, este rol cumple todas las funciones de gestión y suele pertenecer a los dueños o desarrolladores de la plataforma.

La implementación de esta gestión de roles pudo haberse hecho de distintas maneras:

* **Mediante campos o flags en el modelo User**: Por simplicidad, a cada usuario en la tabla `users` se le pudo agregar una columna `role` con valores como "admin", "seller" o "customer". Luego, en código, se verifica ese campo. Por ejemplo: en middleware `isAdmin`, comprobar `Auth::user()->role == 'admin'`. Este enfoque es simple pero efectivo para pocos roles.

* **Mediante tablas separadas**: Bagisto, por ejemplo, tiene una tabla `admins` para usuarios de backend (admin y vendedores podrían estar ahí diferenciados por un campo), y `customers` para clientes de la tienda. Si siguieron la estructura de Bagisto, un **cliente** se registra y aparece en `customers` (y *no* en users, porque Bagisto separa contextos), mientras que un **admin o empleado** se crea en la sección de administración y queda en `admins`. Ambos tienen credenciales separadas y rutas de login separadas (/login para customers, /admin/login para admins). En este caso, la distinción de vendedor vs administrador podría ser mediante **roles de administrador**. Bagisto tiene un sistema de ACL donde puedes crear roles de admin y asignarles permisos. Así, podrían haber un rol "Administrador" con todos los permisos marcados, y un rol "Vendedor" con permisos limitados (quizá solo acceso a gestión de pedidos y nada más). Al crear un empleado vendedor, se le asigna ese rol. Esto suena complejo pero Bagisto lo facilita vía interfaz.

* **Mediante un paquete de permisos (e.g. Spatie)**: No se menciona explícitamente, pero es otra opción. Dado el alcance académico, probablemente se usaron las opciones anteriores más integradas.

La **asignación de roles** ocurre normalmente al crear usuarios:

* Un cliente que se registra desde la web obtiene por defecto el rol de "Cliente".
* Un empleado se registra a través de un formulario distinto (según requisitos, hay formulario específico de registrar empleados). Ese formulario podría estar disponible solo para admins (es decir, el admin crea empleados) o abierto pero con algún tipo de código/invitación. En cualquier caso, un empleado nuevo se marca con rol "seller".
* Un administrador inicial fue definido por el desarrollador (por ejemplo, a través del seeder o instalador de Bagisto se creó el admin principal). Nuevos administradores solo podrían ser añadidos por un admin existente.

**Control de acceso**: ya se explicó en Middlewares que rutas administrativas están protegidas. Adicionalmente, dentro de las vistas, puede haber verificaciones por rol para mostrar u ocultar secciones. Por ejemplo, en la vista de perfil de usuario, si `Auth::user()->role == 'admin'`, se le podría mostrar un enlace "Ir al panel admin", mientras que un cliente normal no lo vería. También en el panel admin, si un empleado (rol vendedor) inicia sesión allí, Bagisto seguramente oculta automáticamente las secciones a las que no tiene permiso, mostrando solo las de pedidos que le competen.

**Gestión de clientes vs empleados**: En la base de datos, se mantienen separados. Un cliente tiene campos como dirección, posiblemente puntos de fidelidad, etc., mientras un empleado podría tener campos diferentes (por ejemplo, número de empleado, sucursal asignada). Los formularios específicos mencionados en requisitos implican que la validación y campos requeridos difieren: para un cliente quizás se pide nombre, email, contraseña, dirección; para un empleado tal vez nombre, email, contraseña, código de empleado o puesto. Esto se resolvió con controladores diferentes o con lógica condicional en un mismo controlador de registro.

**Seguridad mediante roles**: Gracias a esta división, se cumple que *“Cada usuario debe tener acceso limitado según su rol; el sistema no debe permitir a usuarios sin permisos acceder a funciones administrativas”*. Por ejemplo, aunque un usuario malicioso intente acceder a `/admin/products`, el middleware `isAdmin` lo bloqueará si no es admin. O si un empleado intenta acceder a gestionar productos (que suponemos no tiene permiso), el sistema lo rechazaría. Esto protege información sensible (como datos de ventas, listas de clientes, etc.) de accesos no autorizados.

**Otras funciones de gestión de usuarios**: Incluye la posibilidad de **recuperación de contraseña** (Laravel lo tiene integrado con tokens), posiblemente **verificación de email** tras registro para clientes, y quizás edición de perfil. Un cliente puede actualizar su dirección de envío en su perfil, o un admin puede cambiar la información de un empleado.

En resumen, Petly-Web implementa un esquema de usuarios multi-rol relativamente estándar: **Clientes** con capacidades limitadas al comercio y adopción, **Vendedores** con un sub-conjunto de capacidades administrativas enfocados en ventas/envíos, y **Administradores** con control total. Esto asegura una operación segura y organizada de la plataforma, asignando las tareas a quienes corresponden y evitando confusiones. La interfaz y la lógica backend trabajan juntas para reforzar esta separación (mostrando solo las opciones pertinentes y validando en servidor cada acción contra el rol del usuario autenticado).

## 9. Descripción del sistema de rutas (públicas, protegidas, administrativas)

Laravel organiza las rutas web de Petly-Web en el archivo `routes/web.php` (y posiblemente archivos adicionales para separar secciones). En el sistema de Petly-Web podemos imaginar distintos **grupos de rutas** según quién debe acceder a ellas y qué middleware las protege:

* **Rutas públicas (acceso sin autenticación)**: Son las que cualquiera puede visitar. Incluyen la **página de inicio** (`/`), las páginas de **listado de productos** y **detalle de producto** (e.g. `/productos`, `/producto/{slug}`), listado de **mascotas en adopción** (`/adopciones`) y detalle de mascota, la página de **login** (`/login`), **registro de cliente** (`/register`), página de **contacto** si existiera, etc. Estas rutas suelen estar definidas sin middleware especial (aparte de quizás verificación de CSRF en formularios). Permiten la navegación básica y que un nuevo usuario se registre. Por ejemplo, un fragmento de definición podría ser:

  ```php
  Route::get('/', [HomeController::class, 'index']);
  Route::get('/productos', [ProductController::class, 'index']);
  Route::get('/producto/{slug}', [ProductController::class, 'show']);
  Route::get('/login', [AuthController::class, 'showLoginForm']);
  Route::post('/login', [AuthController::class, 'login']);
  // ... etc.
  ```

  Estas rutas no requieren autenticación. Sin embargo, internamente, en las vistas o controladores, ciertas acciones pueden verificar si el usuario está logueado (por ejemplo, el controlador de reseña podría al intentar dejar una reseña comprobar `Auth::check()` y redirigir a login si no).

* **Rutas protegidas por middleware de autenticación (usuario logueado)**: Son rutas que solo usuarios registrados pueden usar. Aquí entrarían:

  * Las rutas de **checkout** de compra: antes de confirmar pedido o ver el carrito final. Por ejemplo, `/checkout` podría usar middleware `auth` para forzar login.
  * Las rutas de **perfil de usuario**: `/perfil`, `/mis-pedidos`, `/mis-adopciones`, etc., donde un cliente ve sus datos y actividad. Estas van con `auth` (cualquier usuario logueado; dentro del controlador se puede filtrar si es cliente o admin y mostrar lo correspondiente).
  * La ruta para **enviar solicitud de adopción**: probablemente un `POST /adopcion/{pet}` que guarda la solicitud – esta definitivamente requiere login (middleware `auth`), ya que adjuntará `Auth::id()` a la solicitud.
  * Rutas para **logout** (cierre de sesión) también requieren que haya sesión iniciada (aunque suele implementarse simplemente).
  * Si implementaron funciones como **favoritos** o **comparar productos**, esas también serían privadas para cada usuario.

  En Laravel, estas pueden agruparse así:

  ```php
  Route::middleware('auth')->group(function(){
      Route::get('/perfil', [UserController::class, 'profile']);
      Route::get('/mis-pedidos', [OrderController::class, 'userOrders']);
      Route::post('/adoptar/{pet}', [AdoptionController::class, 'submitRequest']);
      // ... etc.
  });
  ```

  De esta forma, el sistema automáticamente redirige a login si no hay usuario autenticado.

* **Rutas de Administrador**: Son todas las rutas que corresponden al **panel administrativo** completo. En Bagisto, por defecto, estas rutas están agrupadas bajo el prefijo `/admin`. Ejemplos:

  * `/admin/login` (ya mencionada para acceso admin),
  * `/admin/dashboard` (vista principal con métricas como el gráfico interactivo de ventas),
  * `/admin/products` (listar productos, con subrutas `/create`, `/edit/{id}` para formulario de producto),
  * `/admin/categories`, `/admin/orders`, `/admin/adoptions` (si hay sección para adopciones), `/admin/employees` (si permiten CRUD de empleados),
  * `/admin/settings` (configuraciones varias).

  Todas estas deben estar protegidas por middleware que verifique que el usuario es **admin autenticado**. Posiblemente Bagisto maneja esto con su propio middleware (como `admin` guard). De no usar Bagisto, podrían crear middleware `isAdmin` que combine `auth` + chequeo de rol. La definición sería algo así:

  ```php
  Route::prefix('admin')->middleware('auth','is_admin')->group(function(){
      Route::get('/dashboard', [AdminController::class, 'index']);
      Route::resource('/products', ProductAdminController::class);
      // ... más rutas admin
  });
  ```

  Con esto, solo si `Auth::user()->role == admin` (por ejemplo) se podrá pasar. En caso contrario, se podría redirigir a `/` con un mensaje de "Acceso denegado".

* **Rutas de Vendedor/Empleado**: Podrían estar bajo algo como `/seller` o inclusive integradas en las de admin pero diferenciadas por permisos. Por simplicidad, supongamos que hay un prefix `/vendedor`:

  * `/vendedor/pedidos` (lista de pedidos que ese vendedor registró o debe gestionar),
  * `/vendedor/pedidos/{id}/actualizar` (acción para cambiar estado, p.ej. marcar como entregado),
  * quizá `/vendedor/ventas/nueva` (para registrar una venta física).

  Estas rutas llevarían middleware `auth` y algo como `is_seller` (verificando rol vendedor). Un vendedor autenticado podría acceder; un admin también podría quizás acceder (los admins usualmente tienen todos los permisos, aunque no es necesario que usen la interfaz de vendedor). Si se implementó en el mismo panel admin con roles, entonces no habría prefix separate, sino que el vendedor entra a `/admin` pero su rol limita qué ve.

* **Rutas API (si existieran)**: Tal vez para funcionalidades de sugerencias o chat se expusieron rutas tipo API que devuelven JSON. Ejemplo: `/api/suggestions?q=perro` que devuelve una lista de productos/mascotas que concuerdan. Estas rutas irían en `routes/api.php` y estarían por default bajo prefix `/api`. Suelen usar middleware `api` (que incluye throttle para limitar peticiones). Si son públicas o requieren auth depende: sugerencias de búsqueda pueden ser públicas. Algo como

  ```php
  Route::get('/suggestions', [SearchController::class, 'suggest']);
  ```

  Y se usa desde AJAX en front. Otra API posible: `/api/orders/{id}` para obtener detalles de un pedido, pero eso debería estar autenticado (y probablemente no necesario si no hay app móvil o así).

**Protección CSRF**: Las rutas web (no API) tienen por defecto protección CSRF para métodos POST, PUT, DELETE. Laravel verifica un token en cada formulario. Petly-Web debe haberse asegurado de incluir `@csrf` en sus formularios. Las rutas definidas en web.php se benefician de esto automáticamente.

**Nombres de rutas y navegación**: Es buena práctica asignar nombres (name) a las rutas para usarlas en los Blade (con `route('nombre')`). Por ejemplo, `Route::get('/producto/{slug}', ...)->name('product.show');`. Así los links en la vista se generan con `route('product.show', $product->slug)`. Esto probablemente se siguió, facilitando mantener URLs.

**Redirecciones y fallback**: Podría haber una ruta fallback para manejar 404 (página no encontrada) de forma amigable – por ejemplo, si el usuario pone una URL inválida, mostrar una vista personalizada en vez del error genérico.

**Resumen**: El sistema de rutas de Petly-Web está estructurado para reflejar las **tres capas de acceso**:

* Rutas abiertas para navegación general y acciones de visitantes.
* Rutas tras login para operaciones de usuario registrado (compras, adopciones).
* Rutas administrativas tras login de admin/empleado para gestión interna.

Esta organización mantiene la seguridad y orden: cada URL activa exactamente el controlador y verificación apropiada, garantizando que las funcionalidades se usen en el contexto correcto. Por último, la documentación/guía del proyecto seguramente lista las principales rutas, lo cual ayuda a nuevos desarrolladores a entender rápidamente por dónde entrar a cada parte de la aplicación.

## 10. Integración con servicios externos o paquetes utilizados

El proyecto Petly-Web hace uso de al menos un paquete externo destacado: **Bagisto**, que es una plataforma de e-commerce de código abierto basada en Laravel. De hecho, en la guía de instalación del proyecto se menciona explícitamente que Petly es un proyecto construido sobre Bagisto. La integración con Bagisto aporta una gran cantidad de funcionalidades de comercio electrónico ya implementadas, permitiendo al equipo enfocarse en personalizar la aplicación para el contexto de mascotas y adopciones.

**¿Qué es Bagisto y cómo se integra?**
Bagisto proporciona un conjunto completo de módulos de tienda en línea (catálogo de productos, carrito de compras, checkout, pago, gestión de pedidos, administración de inventario, etc.) bajo la arquitectura de Laravel. Al usar Bagisto, Petly-Web esencialmente parte de una base sólida sobre la cual se agregan las características particulares (como adopciones de mascotas, reseñas limitadas a compradores, chat de recomendaciones, etc.). Bagisto se integra ya sea instalándolo vía Composer en el proyecto Laravel o clonando directamente su repositorio. En cualquier caso, tras la instalación, hay que correr las migraciones y un instalador específico (`php artisan bagisto:install`) para configurar cosas como el usuario administrador inicial, la moneda, idioma, etc., lo cual coincide con lo hecho en Petly. Bagisto organiza su código en **paquetes** (ver sección de estructura), por lo que Petly-Web esencialmente tiene dentro muchos paquetes de **Webkul** (la empresa detrás de Bagisto) que proveen las funcionalidades.

Integrar Bagisto implica que Petly-Web:

* Utiliza las **tablas de base de datos** de Bagisto para productos, categorías, pedidos, clientes, etc., ampliándolas quizás con campos adicionales si necesitaban (por ejemplo, Bagisto quizás no tiene "reseñas limitadas a compradores" de forma nativa, pero se puede configurar).
* Emplea el **panel de administración** prediseñado de Bagisto para gestionar la tienda. Este panel, disponible en `/admin`, ya contiene secciones para catálogo, pedidos, configuración, etc., que cumplen muchos de los requisitos de Petly (por ejemplo, **CRUD completo para administrador** ya viene incluido). El administrador de Petly puede usar esa interfaz para agregar productos, categorías, empleados (Bagisto permite crear cuentas de admin con roles).
* Saca provecho de **componentes de frontend** ya listos: Bagisto provee un frontend de tienda base (que se puede estilizar) y maneja la sesión de carrito, checkout con múltiples métodos de pago (e.g. integraciones con PayPal, stripe mediante paquetes), autenticación de clientes, etc. El equipo de Petly pudo personalizar las vistas de Bagisto para adaptarlas a la estética verde y amigable solicitada, agregando el carrusel y secciones específicas de adopciones.

**Otros paquetes/librerías externos potenciales**:

* *Bootstrap u otro framework CSS*: Para agilizar el diseño responsive y componentes visuales, es común que Laravel + Bagisto utilicen Bootstrap. La "interfaz responsiva" estaba en requisitos, y Bagisto ya es responsive de base. Puede que se hayan apoyado en clases de Bootstrap o Tailwind (según versión) para lograrlo sin armar CSS desde cero.
* *Librería de Carrusel*: Para el carrusel vertical tipo TikTok, quizá se integró alguna librería de JS/CSS de carrusel (como SwiperJS, OwlCarousel, etc.). Esto habría sido añadido en el frontend (no necesariamente via Composer sino por npm o CDN). No es un "servicio externo" sino un recurso de frontend.
* *Servicio de autenticación 2FA*: Si implementaron el segundo factor de autenticación via SMS o aplicaciones tipo Google Authenticator, es posible que usaran un paquete como **Laravel Fortify** (que soporta 2FA TOTP codes) o **Google2FA**. Alternativamente, pudieron crear un código y enviarlo por email usando las **Notificaciones de Laravel** (que es funcionalidad interna, no un servicio externo en sí). Por simplicidad, probablemente optaron por enviar el código al correo del usuario (lo cual usa la librería de SwiftMailer o Mail de Laravel, configurada para SMTP). Esto no requiere un servicio de terceros más que un servidor SMTP, pero se integra con la infraestructura (por ejemplo Gmail SMTP o Mailtrap para pruebas).
* *Pasarela de pago*: No se especificó en requisitos, pero si implementaron pagos en línea, pudieron usar alguna pasarela. Bagisto viene con integración para PayPal estándar por defecto (y fácilmente se pueden habilitar pagos Cash on Delivery, transferencia, etc.). Si habilitaron PayPal, estarían usando la API de PayPal (servicio externo) a través de las clases ya integradas en Bagisto. Quizás en esta fase académica dejaron el pago en "pago contra entrega" o confirmación manual, para no complicar con integraciones reales de tarjeta.
* *Notificaciones push*: Mencionan notificaciones push o visuales en seguimiento de pedido. Es posible que no se implementara un servicio de push real (como Firebase Cloud Messaging o Pusher), y simplemente se hayan usado notificaciones por email o alertas en la propia web (como un icono de campana con notificaciones). Si se pretendía push real, habrían necesitado integrar algo como **Pusher** (servicio de websockets) o OneSignal. Dado el alcance, probablemente optaron por notificación vía correo electrónico o actualización en el panel de usuario.
* *Gráficas interactivas*: El requisito de gráfico de ventas interactivo sugiere el uso de alguna librería de charts en el panel admin. Bagisto no sé si incluye una gráfica por defecto, pero agregar una librería como **Chart.js** o **Google Charts** vía CDN era factible. Esto no es un servicio externo con backend, sino una librería frontend. Posiblemente el panel admin muestra un gráfico (barras/líneas) que toma datos de ventas (quizás usando una ruta API interna para obtener los totales por mes) y permite al usuario elegir diferentes vistas. Implementar esto involucraría integrar el script de Chart.js y alimentar los datos; es muy plausible que lo hicieran para cumplir con esa parte visual.
* *Búsqueda y sugerencias inteligentes*: Si se quisiera una búsqueda avanzada con sugerencias inteligentes, se podría integrar algo como **Laravel Scout** con un servicio tipo Algolia o TNTSearch. No obstante, eso puede ser complejo; quizá implementaron una búsqueda básica con consultas SQL por nombre de producto/mascota y usaron JavaScript para mostrar sugerencias a medida que se tipea (AJAX to controller). Esto no necesariamente requirió un paquete externo adicional, se puede hacer con lo existente.

En términos generales, la decisión de basarse en Bagisto fue crucial: **“Bagisto es una plataforma eCommerce de código abierto construida sobre Laravel”**. Esto alineó perfectamente con el stack Laravel y ahorró el tener que codificar de cero muchas funciones. Más allá de Bagisto, la integración de otros servicios parece haber sido mínima; se procuró aprovechar lo ofrecido out-of-the-box e implementar las demás características manualmente o con librerías frontend.

Un punto a mencionar es que, aunque Bagisto provee mucha funcionalidad, el equipo tuvo que integrarla con la parte de **Adopciones de mascotas**, que es única de Petly. Esa parte probablemente la implementaron sin paquetes externos específicos, más que las herramientas del propio Laravel.

Finalmente, en cuanto a **despliegue**, no se comenta el uso de servicios en la guía. Es posible que para el envío de correos usaran un servicio SMTP convencional. Y para hosting, seguramente bastaba con un servidor LAMP/XAMPP local para demostrarlo (dado el entorno académico). Si se pensara en producción, podría integrarse con servicios de alojamiento Laravel o AWS, pero eso entra en recomendaciones futuras.

## 11. Diagramas de flujo de usuario (procesos de compra y adopción)

A continuación se presentan diagramas de flujo que ilustran visualmente dos de los procesos principales de Petly-Web: el flujo de **compra de un producto** y el flujo de **adopción de una mascota**. Estos diagramas ayudan a entender los pasos secuenciales y las decisiones involucradas en cada caso de uso.

**Flujo de Compra (E-commerce)** – desde que el usuario navega productos hasta la confirmación del pedido:

&#x20;*Diagrama de flujo del proceso de compra en Petly-Web (agregar al carrito, checkout y confirmación).*

En este flujo, el **cliente** explora el catálogo y selecciona productos que luego añade al carrito. Puede continuar navegando y agregando más items. Cuando decide comprar, revisa el carrito (si no ha iniciado sesión, se le pedirá autenticarse antes de proceder). Luego ingresa los datos de envío y escoge el método de pago en la página de checkout. Tras confirmar, el sistema procesa el pedido (verificando stock y registrando la orden) y finalmente muestra una página de confirmación. El diagrama muestra también decisiones clave, como *“¿Usuario autenticado?”* antes de continuar al checkout (lo cual determina si se dirige al login) y *“¿Agregar más productos?”* al añadir el primer producto (permitiendo seguir comprando).

**Flujo de Adopción de Mascota** – desde la selección de una mascota hasta el envío de la solicitud de adopción y su aprobación:

&#x20;*Diagrama de flujo del proceso de adopción de una mascota en Petly-Web.*
![Diagrama de flujo](docs/imgs/diagramadeflujo.svg)


En este diagrama, el usuario inicia navegando la lista de mascotas disponibles. Al interesarse en una, visualiza su perfil y decide **“Solicitar Adopción”**. Si no ha iniciado sesión, el sistema lo redirige a autenticarse; si ya está logueado, pasa directamente a mostrar el **formulario de adopción**. El usuario completa el formulario con la información requerida y lo envía, generándose así la solicitud en estado pendiente. En el flujo administrativo (parte derecha del diagrama), un **Administrador** revisa la solicitud y toma una decisión: aprobarla o rechazarla. Tras la decisión, el sistema notifica al usuario el resultado (por ejemplo, vía correo o en el portal web). Si es aprobada, la adopción procede (coordinada fuera del sistema), y la mascota queda marcada como no disponible. Si es rechazada, la mascota podría permanecer en lista de adoptables para otros solicitantes.

Ambos diagramas de flujo destacan la interacción entre el **usuario** y el **sistema**, así como los puntos donde interviene la lógica de negocio (por ejemplo, verificación de autenticación, validación de formulario, procesamiento interno de pedido o de solicitud). También muestran la participación del **administrador** en los procesos que lo requieren (seguimiento de pedidos y aprobación de adopciones, respectivamente).

Estos diagramas ayudan a visualizar de manera clara las rutas felices (ideal) y las bifurcaciones condicionales que existen en Petly-Web, garantizando que para cada acción del usuario el sistema tenga una respuesta definida (ya sea permitir avanzar, solicitar login, mostrar mensajes de error o confirmar éxito).

## 12. Recomendaciones para desarrollo o despliegue futuro

Finalmente, se enumeran algunas recomendaciones y buenas prácticas de cara a la evolución y puesta en producción de Petly-Web. Estas sugerencias abarcan posibles mejoras funcionales, consideraciones de arquitectura y seguridad, y pasos para facilitar mantenimiento a largo plazo:

* **Mejoras en la búsqueda y recomendaciones**: Implementar una búsqueda más inteligente utilizando herramientas especializadas. Por ejemplo, integrar *Laravel Scout* con un motor de búsqueda (Algolia, ElasticSearch o MeiliSearch) para obtener sugerencias instantáneas más relevantes y tolerantes a errores tipográficos. Del mismo modo, potenciar el chat de recomendaciones con una pequeña IA o al menos reglas basadas en historial de navegación del usuario (productos vistos o comprados) para ofrecer resultados más personalizados.

* **Autenticación de dos pasos robusta**: La actual verificación 2FA por código podría mejorarse usando un paquete estándar como **Laravel Fortify** o **Google Authenticator** para ofrecer códigos temporales o aprobación desde una app. Además, añadir opciones de 2FA vía SMS utilizando un servicio externo (Twilio, Amazon SNS) si se desea una experiencia más completa, considerando los costos asociados. Cualquiera de estas implementaciones debe almacenarse de forma segura (por ejemplo, guardar hashes de códigos TOTP en lugar del código plano).

* **Seguridad y mejores prácticas**: Revisar todas las entradas de usuario y asegurarse de proteger contra inyecciones y XSS. Laravel por defecto escapa las variables en Blade (evitando XSS) y utiliza consultas preparadas en Eloquent (evitando SQL injection), pero si en algún punto se usa HTML proporcionado por usuarios (por ejemplo, descripción de mascota o reseñas), considerar usar *Purifier* para limpiar HTML. Asimismo, asegurar que las **subidas de archivos** (imágenes de productos o mascotas) validen el tipo de archivo y tamaño para evitar riesgos. En producción, configurar `APP_DEBUG=false` para no exponer stack traces, y usar **HTTPS** en todo el sitio para proteger las credenciales y datos sensibles en tránsito.

* **Optimización de rendimiento**: Para cumplir con la carga <3s incluso bajo tráfico, se recomienda habilitar **caché** de páginas y consultas. Por ejemplo, usar la cache de vistas de Laravel (comando `artisan view:cache`) y cache de configuraciones (`artisan config:cache`) en producción. Implementar cache de queries frecuentes (como el listado de categorías, que cambia poco) usando la facades Cache de Laravel. También, considerar usar un sistema de **cache de objetos** (Redis o Memcached) para sesiones, carrito y datos reutilizables en varias páginas. La paginación en listados de productos/mascotas es esencial para no cargar cientos de elementos a la vez. Optimizar las imágenes (usar versiones comprimidas y de tamaño adecuado) o incluso emplear un CDN para servir recursos estáticos si el público es amplio geográficamente.

* **Mejoras en la experiencia de usuario**: Incluir más indicadores y animaciones sutiles para feedback. Por ejemplo, cuando el usuario añade algo al carrito, mostrar una pequeña animación o mensaje “Producto agregado” (ya se mencionó en requisitos añadir animaciones de confirmación). Incorporar validaciones en frontend con JavaScript para errores inmediatos (sin esperar la respuesta del servidor), complementando las validaciones backend. Asegurarse de la **accesibilidad**: texto alternativo en imágenes, buen contraste de colores, posibilidad de navegación vía teclado, etc., tal como se planificó en requisitos.

* **Ampliar funcionalidades e-commerce**: Si se desea escalar Petly-Web comercialmente, se podrían integrar más opciones de pasarelas de pago (Stripe, MercadoPago, etc., según la región objetivo) y métodos de envío (integrar APIs de envíos para cálculo de costos en tiempo real). Además, habilitar sistema de **cupones de descuento** y **reglas de promociones** (Bagisto ya provee base para esto con CartRule, CatalogRule). Implementar notificaciones más robustas, por ejemplo, usando *eventos de Laravel* para que al cambiar estado de pedido se dispare un email automático al cliente.

* **Administración de adopciones más completa**: Crear en el panel admin una sección dedicada a *Adopciones*, donde no solo se apruebe/rechace, sino que se puedan ver estadísticas (cuántas adopciones completadas, tiempo promedio de adopción), exportar datos, etc. También, tras una adopción exitosa, quizá enviar automáticamente un pequeño *survey* o seguimiento al adoptante (esto mejora el compromiso de la comunidad Petly).

* **Pruebas y calidad**: Añadir **pruebas automatizadas** (tests) tanto unitarios como de interfaz (por ejemplo usando Laravel Dusk para test de browser) para asegurar que las principales rutas (login, checkout, adopción) siguen funcionando tras futuros cambios. Esto es vital antes de desplegar nuevas versiones. Integrar estas pruebas en un pipeline de CI/CD (por ej., GitHub Actions) podría ser beneficioso si el proyecto crece.

* **Despliegue en producción**: Preparar un entorno de producción apropiado. Se recomienda usar un servidor con suficiente recurso (CPU/RAM) para PHP y base de datos, o un servicio gestionado como Laravel Forge, Vapor o Ploi para facilitar despliegues. Configurar la base de datos MySQL en producción con backups automáticos. Utilizar almacenamiento de sesión en Redis y almacenamiento de archivos (imágenes subidas) en un servicio tipo Amazon S3 para escalabilidad (en lugar de sistema de archivos local del servidor, que complica escalamiento horizontal). Habilitar un servicio de monitoreo (como Laravel Telescope en modo producción limitado, o otros APM) para detectar errores o cuellos de botella.

* **Escalabilidad futura**: Si Petly-Web se volviera muy popular, considerar opciones de escalabilidad como separar la aplicación en servicios (por ejemplo, un servicio independiente para manejar el chat inteligente con IA si se hiciera muy complejo), o implementar colas (Laravel Queues) para tareas pesadas fuera del flujo web – por ejemplo, enviar correos de confirmación y notificaciones via Queue en segundo plano, de modo que el usuario no espere el envío de email durante el checkout. Laravel Octane (usando Swoole or RoadRunner) podría explorarse para mejorar throughput manteniendo el proceso residente, aunque eso añade complejidad.

* **Actualizaciones de paquetes**: Mantener Bagisto y Laravel actualizados a sus últimas versiones (haciendo pruebas en un entorno de ensayo antes). Las actualizaciones traen mejoras de seguridad y rendimiento. Sin embargo, dado que Bagisto es un core grande, se debe tener precaución de no sobrescribir personalizaciones hechas. Usar control de versiones (Git) es indispensable para llevar registro de cambios e integraciones de parches de forma organizada.



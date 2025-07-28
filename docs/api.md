# Documentación de la API – Proyecto **Petly-Web**

## 1. Introducción a la API

La plataforma Petly-Web expone una **API RESTful** que permite interactuar con sus funcionalidades de forma programática, ya sea para integrar un cliente móvil, automatizar procesos o proporcionar funcionalidades dinámicas en la misma aplicación web. La API trabaja sobre HTTP con intercambio de datos en formato **JSON**, siguiendo convenciones REST para las rutas y verbos (GET, POST, PUT, DELETE). Todas las URLs de la API están predefinidas bajo el prefijo base **`/api`** (por ejemplo, `/api/productos` para acceder al listado de productos).

Esta API facilita acceder al catálogo de productos para mascotas, gestionar carritos y pedidos, así como registrar y consultar solicitudes de adopción de mascotas, entre otras acciones, mediante solicitudes HTTP. En general, las respuestas incluyen objetos JSON con los datos solicitados o confirmaciones de éxito, utilizando códigos HTTP estándar para indicar el resultado (por ejemplo, **200** en caso de éxito, **201** para creación de recursos, **400** para errores de validación, **401** para falta de autenticación, **403** para falta de permisos, etc.).

> **Nota:** La API de Petly está diseñada para uso por clientes autenticados en la mayoría de sus endpoints. Aunque algunas operaciones de **lectura** (como listar productos o mascotas disponibles) pueden estar accesibles públicamente, cualquier acción que implique datos sensibles o cambios (crear pedidos, enviar solicitudes, etc.) requerirá autenticación. Asimismo, existen endpoints especiales restringidos para administradores o empleados (vendedores), los cuales no están pensados para el público general sino para uso interno seguro (ver sección de autenticación y roles).

## 2. Autenticación y seguridad

La seguridad de la API se basa en **Laravel Sanctum**, permitiendo autenticación mediante tokens de acceso personales o cookies de sesión protegidas. Esto significa que un usuario debe iniciar sesión a través de la API para obtener un **token de autenticación** y adjuntarlo a futuras peticiones (por header *Authorization Bearer* o cookie, según el caso). La API soporta tanto el flujo tradicional de inicio de sesión (con correo y contraseña) como registros de nuevos usuarios, retornando un token válido tras la autenticación exitosa. Opcionalmente, si se habilitó la verificación en dos pasos (2FA) para las cuentas, el flujo de login vía API podría requerir un segundo paso de validación de código; sin embargo, típicamente en la API se simplifica este proceso por la naturaleza automatizada del cliente.

Cada petición autenticada estará asociada a un usuario cuyo **rol** determinará el acceso a ciertos recursos. Petly-Web define principalmente tres roles: **Cliente**, **Vendedor** (empleado) y **Administrador**. La API refleja estas restricciones de la siguiente manera:

* **Clientes (Compradores):** Pueden acceder a endpoints de catálogo (ver productos, buscar mascotas), gestionar su propio carrito y pedidos, enviar reseñas de productos y crear solicitudes de adopción. No pueden realizar acciones administrativas ni acceder a datos de otros usuarios.
* **Vendedores (Empleados):** Además de las capacidades de cliente, tienen permisos para ver y actualizar pedidos asignados a su gestión (por ejemplo, marcar pedidos como enviados) y posiblemente acceder a ciertos listados internos. No pueden crear ni borrar productos o categorías; esas acciones están reservadas al administrador.
* **Administradores:** Tienen acceso completo. La API (o el panel que la usa) les permite gestionar todo el catálogo (CRUD de productos, categorías), usuarios (aprobar adopciones, registrar empleados), ver todas las órdenes y modificar su estado, entre otras acciones de mantenimiento del sistema. Estos endpoints administrativos están protegidos adicionalmente por verificación de rol, de modo que **un token de cliente o vendedor no podrá usarlos** (el servidor responderá con 403 Prohibido si se intenta).

Para obtener autenticación, los puntos de entrada principales son el **login** y **registro** de usuarios, descritos abajo. Una vez obtenido el token, debe incluirse en cada petición subsecuente. Los tokens tienen una validez prolongada hasta que el usuario cierre sesión (logout) o el token sea revocado. Es importante mantener el token secreto, ya que cualquier solicitud con un token válido se considerará autorizada como ese usuario. La API implementa también políticas de **limitación de velocidad (throttling)** por defecto de Laravel en las rutas `/api` (por ejemplo, \~60 solicitudes por minuto como límite estándar), para evitar abusos o sobrecarga del sistema.

## 3. Endpoints de la API

A continuación se detallan los principales endpoints disponibles en la API de Petly-Web, organizados por funcionalidad. Para cada endpoint se indica el método HTTP, la ruta, una descripción de su propósito, requisitos de autenticación y una idea de la estructura de petición/respuesta. Los nombres de recursos aparecen en **español** en las rutas para mantener consistencia con el dominio de la aplicación (por ejemplo, `/api/productos` en lugar de `/api/products`).

### 3.1 Autenticación y gestión de usuarios

Estos endpoints permiten registrar nuevos usuarios, iniciar/cerrar sesión y obtener información de la cuenta autenticada.

* **POST** `/api/register`: Permite crear una **nueva cuenta de usuario**. El cliente debe proporcionar los datos requeridos (por ejemplo: nombre, correo electrónico, contraseña, y cualquier otro campo de perfil necesario). *No requiere autenticación previa.* Si los datos son válidos, el sistema crea el usuario como rol cliente por defecto y devuelve un **token de acceso** junto con los datos básicos de la cuenta creada (ID de usuario, nombre, email). En caso de datos inválidos (correo ya existente, formato incorrecto, etc.), responde con error 400 y detalles de validación. Tras registrarse, es recomendable que el usuario verifique su correo (si la plataforma lo exige) antes de usar plenamente otras funciones.

* **POST** `/api/login`: Inicia sesión de un usuario existente. Se deben enviar las credenciales (`email` y `password`) y, opcionalmente, un código de segundo factor si la cuenta tiene 2FA habilitado. Si las credenciales son correctas (y el 2FA validado en su caso), la respuesta incluye un **token de autenticación** (por lo general, en formato JWT o token Sanctum) que el cliente usará en adelante para autenticar sus peticiones. Este token representa la sesión del usuario en la API. Si las credenciales son erróneas o falta la verificación de segundo paso, se retorna un error 401 (Unauthorized). Por seguridad, la contraseña viaja cifrada (HTTPS) y nunca se expone el texto plano.

* **POST** `/api/logout`: Invalida el token de sesión actual. *Requiere autenticación.* Este endpoint permite a un usuario autenticado **cerrar su sesión** en el cliente que esté usando, haciendo que el token ya no sea aceptado en futuras peticiones. La respuesta suele ser un código 204 (No Content) o 200 con un mensaje simple de confirmación. (Nota: en el caso de usar cookies de sesión para la API, este endpoint podría limpiar la cookie; con tokens personales, revoca/elimina el token del servidor).

* **GET** `/api/user`: Obtiene la **información del perfil** del usuario actualmente autenticado. *Requiere autenticación.* Devuelve un objeto JSON con los datos del usuario (ID, nombre, email, rol, y eventualmente otros campos de perfil como dirección predeterminada, etc., excepto datos sensibles como contraseña). Esto permite al cliente mostrar o utilizar información de la cuenta en la aplicación. Si el token es válido pero ha expirado una verificación de dos pasos pendiente, podría retornar un 401 indicando que se requiere reautenticación.

*(Cabe mencionar que existen interfaces separadas para que un administrador cree nuevos empleados/vendedores o incluso nuevos administradores, pero dichas operaciones normalmente se realizan desde el **panel de administración web** más que por la API pública. De ser necesario, podrían exponerse endpoints adicionales como **POST** `/api/empleados` o **POST** `/api/admins` protegidos solo para superadministradores, pero por simplicidad no se detallan aquí.)*

### 3.2 Endpoints de Catálogo de Productos

Estos endpoints permiten **consultar la oferta de productos** de la tienda y sus categorías, así como buscar y filtrar productos. Son en general de solo lectura (GET) y accesibles sin autenticación estricta, aunque algunas rutas de búsqueda avanzada podrían beneficiarse de conocimiento del usuario (por ejemplo, historial para sugerir resultados).

* **GET** `/api/categorias`: Retorna la lista de categorías de productos disponibles en la tienda. *Sin autenticación requerida.* La respuesta es un array de objetos categoría con campos como `id`, `nombre` de la categoría, posiblemente `descripcion` y quizás jerarquía (`categoria_padre_id` si hay subcategorías). Esto sirve para que un cliente muestre las secciones o filtros por categoría. Si no hay categorías definidas, devuelve una lista vacía.

* **GET** `/api/productos`: Obtiene el **listado de productos** del catálogo. *Sin autenticación requerida.* Soporta parámetros de consulta (query params) para paginación y filtrado:

  * Por ejemplo, `?categoria_id=X` para filtrar productos de cierta categoría, `?busqueda=texto` para buscar por nombre o descripción, o filtros como rango de precio, disponibilidad, etc.
  * La respuesta incluye un arreglo paginado de productos. Cada producto incluye campos principales como `id`, `nombre`, `precio`, `stock_disponible`, `categoria_id`, `url_imagen` (si tiene imagen principal), y posiblemente la valoración promedio (estrellas) calculada de sus reseñas.
  * Paginación: si se implementa, la respuesta JSON incluirá información de página actual, total de páginas, etc., para facilitar la navegación por un catálogo grande.

* **GET** `/api/productos/{id}`: Devuelve los **detalles de un producto específico** identificado por su ID (o podría admitirse búsqueda por slug/nombre único). *Sin autenticación requerida.* En la respuesta se proveen todos los datos del producto: nombre, descripción completa, precio, inventario disponible, imágenes (galería), especificaciones o atributos (ej. marca, peso, dimensiones si aplica), categoría a la que pertenece, y **reseñas** asociadas. Si el producto tiene reseñas de clientes, podrían incluirse o pedirse por separado. Este endpoint permite al cliente mostrar la ficha del producto seleccionado al usuario final.

* **GET** `/api/productos/{id}/reseñas`: (Opcional, si no se incluyeron en el anterior) Obtiene las reseñas del producto dado. *Sin autenticación obligatoria.* Devuelve la lista de comentarios y calificaciones que han dejado los usuarios compradores de ese producto, incluyendo campos como autor (nombre o alias del usuario), rating en estrellas, comentario y fecha. **Solo existen reseñas de usuarios que compraron el producto**, garantizando la fiabilidad de estas valoraciones. Si nadie ha reseñado aún, la lista estará vacía. *(Nota: la creación de reseñas se describe en la sección de pedidos, ya que requiere haber comprado previamente.)*

* **GET** `/api/busqueda`: Proporciona resultados de búsqueda global en la plataforma (tanto productos como mascotas). *Sin autenticación requerida.* Este endpoint toma un parámetro `query` (texto buscado) y opcionalmente filtros adicionales, y retorna coincidencias tanto de productos como de mascotas en adopción:

  * La respuesta puede estructurarse con dos listas separadas, por ejemplo `{ "productos": [ ... ], "mascotas": [ ... ] }`, cada una con elementos relevantes.
  * Las **coincidencias son inteligentes**; es decir, no solo búsqueda textual estricta sino también sugerencias por palabra clave, categoría o historial, cumpliendo el requisito de sugerencias de productos. Por ejemplo, si el query es "perro cachorro", podría devolver alimentos y juguetes para perro, así como mascotas caninas jóvenes disponibles en adopción, ordenados por relevancia.
  * Este endpoint habilita la barra de búsqueda global con *autocompletado* y resultados en tiempo real conforme el usuario va escribiendo. En un cliente web, podría usarse mediante solicitudes AJAX al escribir cada pocos caracteres.

* **GET** `/api/sugerencias`: (*Endpoint de ejemplo para recomendaciones*) Retorna sugerencias rápidas de productos o mascotas destacadas. *Sin autenticación.* Este endpoint puede ser utilizado para poblar secciones como "Te podría interesar" o alimentar el **chat de recomendaciones**. Podría no requerir un parámetro si simplemente devuelve ítems populares o recientes, o aceptar un parámetro como `tipo` (ej. `?tipo=mascotas` o `?tipo=productos`) para filtrar. Internamente, este puede aprovechar los mismos mecanismos de búsqueda o incluso la integración de IA para sugerir resultados acorde al contexto. Es parte del objetivo de brindar **coincidencias inteligentes** al usuario sin que tenga que buscarlas manualmente.

### 3.3 Endpoints de Carrito de Compras y Pedidos

Estos endpoints cubren el proceso de **realizar compras** por parte de un cliente: desde gestionar el carrito hasta concretar el pedido y luego seguir su estado. Todos requieren autenticación de cliente (ya que un invitado no mantiene carrito en el servidor ni puede hacer checkout).

* **POST** `/api/carrito`: Agrega un producto al **carrito de compras** del usuario. *Requiere autenticación (rol cliente).* En el cuerpo de la petición se envía el `producto_id` y la `cantidad` deseada. La API registrará ese producto en el carrito activo del usuario (que puede almacenarse en servidor asociado a la sesión/token). La respuesta confirma la operación entregando el estado actualizado del carrito (lista de items con sus cantidades y subtotales, y el total acumulado). Si el producto ya estaba en el carrito, este endpoint puede opcionalmente sumar la cantidad en lugar de duplicar la línea. En caso de error (por ejemplo, stock insuficiente para la cantidad solicitada), se devuelve un mensaje de error 400 con la razón.

* **GET** `/api/carrito`: Recupera los items actuales en el carrito del usuario autenticado. *Requiere autenticación (cliente).* Devuelve un listado de productos (id, nombre) con las cantidades seleccionadas y sus precios, calculando subtotales y total. Sirve para que el cliente pueda revisar su carrito en cualquier momento desde el cliente frontend. Si el carrito está vacío, devuelve una lista vacía o un indicador de carrito vacío. Este endpoint se utiliza típicamente antes de proceder al checkout para mostrar un resumen de la compra.

* **PUT** `/api/carrito/{producto_id}`: Actualiza la cantidad de un producto en el carrito. *Requiere autenticación.* El cliente puede enviar en el cuerpo la nueva `cantidad` deseada para ese producto en su carrito (o 0 para eliminarlo, aunque podría haber un **DELETE /api/carrito/{producto\_id}** explícito para remover). La respuesta es similar al GET del carrito con el estado actualizado. Si la cantidad solicitada excede la disponible, se retorna un error con mensaje apropiado.

* **POST** `/api/pedidos`: Crea un **nuevo pedido** a partir del carrito actual. *Requiere autenticación (cliente).* Este es el endpoint de **checkout** donde el usuario confirma la compra. En el cuerpo de la petición se envían los datos necesarios para procesar el pedido:

  * Información de envío: dirección (calle, ciudad, etc.), quizás selección de método de envío si hay opciones.
  * Información de pago: en esta versión, podría ser simplemente una indicación de método (p.ej. "pago contra entrega" o un token de pago si se integró PayPal u otra pasarela).
  * Opcionalmente, confirmación de los items comprados (aunque el servidor ya los conoce por el carrito asociado al usuario).

  Al procesar esta petición, el servidor verifica stock de cada producto, calcula totales, crea el registro de **Orden/Pedido** en la base de datos y lo marca con estado inicial ("Procesando" o "Pendiente"). La respuesta exitosa incluye los detalles del pedido creado: un ID de pedido, fecha, monto total, lista de productos con cantidades y precios unitarios, dirección de envío registrada, método de pago y **estado inicial** ("Procesando/Pendiente"). También podría incluir un mensaje de confirmación tipo "¡Gracias por tu compra!" y servir para mostrar la pantalla de confirmación de orden al cliente. En caso de que algo falle (por ejemplo, producto sin stock durante el checkout, o datos de envío incompletos), se devuelve un error 400 con los detalles para corregir.

* **GET** `/api/pedidos`: Lista los **pedidos (órdenes)** realizados por el usuario autenticado. *Requiere autenticación (cliente).* Permite a un comprador ver su **historial de compras** y el estado de cada pedido. La respuesta es un array de pedidos, cada uno con sus campos clave: ID, fecha, total, estado actual (e.g., Procesando, Enviado, Entregado), y posiblemente un subtListado de los productos comprados (o un endpoint separado para detalle, ver siguiente). Este historial puede filtrarse con parámetros (por ejemplo `?estado=entregado` para ver solo entregados, o paginar si hay muchos pedidos).

* **GET** `/api/pedidos/{id}`: Obtiene el **detalle completo de un pedido** específico del usuario autenticado. *Requiere autenticación (cliente).* Devuelve todos los datos del pedido identificado: los datos de envío (dirección, receptor), datos de pago (ocultando info sensible, quizás solo tipo de pago), y el listado detallado de productos comprados con cantidades, precios unitarios, subtotales, impuestos aplicados si los hay, etc. También muestra el estado actual y puede incluir un historial de cambios de estado (e.g., fecha en que pasó a Enviado, fecha de Entregado). Este endpoint asegura que un usuario solo pueda acceder a sus propios pedidos – si intenta ver un ID de pedido de otro usuario, el servidor responderá 403 (Prohibido).

* **PUT** `/api/pedidos/{id}/estado`: Permite **actualizar el estado** de un pedido. *Requiere autenticación*; en particular, este endpoint está restringido a roles de **vendedor** o **administrador** (un cliente no puede cambiar el estado de su pedido, solo consultar). Sirve para que, internamente, un empleado marque los cambios como "Enviando", "Enviado", "Entregado", etc. La petición incluirá en el cuerpo el nuevo estado (o una acción predefinida). Si quien hace la petición no tiene permisos (por ejemplo, un cliente intentando actualizar un pedido ajeno), se devolverá 403. En caso exitoso, responde con el pedido actualizado o un mensaje de confirmación. Cada cambio de estado podría detonar notificaciones hacia el cliente final (vía correo o push) informándole del progreso de su pedido.

* **POST** `/api/productos/{id}/reseña`: Crea una **reseña (review)** para el producto especificado. *Requiere autenticación (cliente).* En el cuerpo se envía la calificación (por ejemplo, `estrellas` de 1 a 5) y un `comentario` textual. El servidor valida que el usuario efectivamente **ha comprado previamente ese producto** antes de permitir la reseña (esto se comprueba consultando los pedidos completados del usuario). Si todo es correcto, se guarda la reseña asociada al producto y al usuario, y la respuesta confirma la creación (por ejemplo, con los datos de la reseña almacenada o un simple 201 Created). Si el usuario no cumple la condición de compra previa, la respuesta será un error 403 indicando que no está autorizado a reseñar ese producto. Este endpoint garantiza que las reseñas en Petly sean auténticas y de compradores reales, como se especificó en requisitos. Tras una reseña exitosa, el promedio de calificación del producto podría recalcularse y estar disponible en los endpoints de detalle de producto.

*(Aunque el **carrito** y su persistencia en base de datos son manejados internamente por Laravel/Bagisto, la API expone estos endpoints para que un cliente externo pueda interactuar casi igual que un usuario en la web: agregando cosas al carrito y luego confirmando la compra. En algunos casos, una aplicación móvil podría optar por gestionar el carrito localmente y solo usar `/api/pedidos` directamente, pero Petly ofrece ambos mecanismos.)*

### 3.4 Endpoints de Adopción de Mascotas

Además de la tienda, Petly-Web provee un módulo de **adopciones** de mascotas. Los siguientes endpoints permiten listar mascotas disponibles y gestionar solicitudes de adopción a través de la API. En su mayoría requieren autenticación, ya que la adopción debe vincularse a un usuario registrado.

* **GET** `/api/mascotas`: Lista todas las **mascotas disponibles para adopción**. *Sin necesidad de autenticación* (aunque un usuario logueado también puede usarlos). La respuesta es una lista de mascotas con campos como `id`, `nombre` de la mascota, especie/animal (ej. perro, gato), raza, edad, sexo, tamaño, una breve descripción, y posiblemente la URL de una foto. Para optimizar, podría incluir solo información resumida aquí. Mascotas que ya han sido adoptadas no deberían aparecer en este listado (o pueden venir marcadas como no disponibles). Este endpoint permite mostrar el catálogo de animales en adopción, similar a como se listan productos.

* **GET** `/api/mascotas/{id}`: Muestra la información **detallada de una mascota** específica. *Sin autenticación requerida.* Incluye todos los datos de la mascota: nombre, descripción completa (historia o notas sobre su personalidad), detalles médicos (vacunaciones, esterilización), fecha de rescate o tiempo en refugio si se maneja, y contacto del refugio/administrador si se quisiera mostrar. También indica si está disponible o si su adopción está *en proceso*. Este endpoint permite a los usuarios conocer más de la mascota seleccionada antes de decidir adoptar.

* **POST** `/api/adopciones`: Registra una **solicitud de adopción** para una mascota. *Requiere autenticación (rol cliente).* En el cuerpo de la petición se debe indicar la `mascota_id` que se desea adoptar, y posiblemente incluir respuestas a un formulario o información adicional del solicitante (por ejemplo: experiencia con mascotas, espacio en casa, motivación para adoptar, etc., según lo definido en el formulario de adopción web). Al recibir esta solicitud, el servidor:

  * Crea un registro de solicitud en estado "Pendiente" asociada a esa mascota y al usuario solicitante.
  * Devuelve una respuesta con estado 201 Created si se guardó correctamente, incluyendo los datos de la solicitud (ID de solicitud, fecha, estado = pendiente). También puede incluir un mensaje de agradecimiento del estilo "Solicitud registrada, en breve el administrador la revisará".

  Solo se permite una solicitud por mascota por usuario a la vez; si el mismo usuario intenta solicitar la misma mascota dos veces, podría retornar un error 400. Asimismo, si la mascota ya no está disponible (otra solicitud aprobada antes), devolverá un error indicando que la mascota ya no admite nuevas solicitudes.

* **GET** `/api/adopciones`: Lista las **solicitudes de adopción** realizadas por el usuario autenticado. *Requiere autenticación (cliente).* Esto permite al solicitante ver el estado de sus solicitudes previas: cada entrada incluye el `id` de la solicitud, la `mascota` involucrada (nombre, foto pequeña), la fecha en que se hizo la solicitud y el `estado` actual (Pendiente, Aprobada, Rechazada). Un usuario puede, por ejemplo, checar en su perfil si su solicitud para "Firulais" fue aprobada o sigue en revisión. Si una solicitud está aprobada, el siguiente paso normalmente ocurre fuera de la API (contacto para entrega); la API aquí solo informa del estado.

* **PUT** `/api/adopciones/{id}`: *Endpoint reservado a administradores.* Permite **actualizar el estado** de una solicitud de adopción. Un **administrador** autenticado puede usarlo para marcar una solicitud como **Aprobada** (lo que generalmente desencadena el proceso de contacto con el adoptante) o **Rechazada** (si el solicitante no cumplió los requisitos). La petición incluirá en el cuerpo el nuevo estado deseado. La respuesta confirmará el cambio. Tras aprobar, la mascota podría pasar a no disponible en la base de datos. Este endpoint asegura que solo administradores puedan realizar esta acción crítica (un cliente no puede auto-aprobarse ni un vendedor tampoco, a menos que se les concedieran permisos especiales). En muchos casos, esta operación se realiza desde la interfaz administrativa; la API existe principalmente para completitud o integraciones.

Cabe destacar que el proceso de adopción en Petly-Web combina la interacción online con procesos humanos offline: la API llega hasta registrar la intención y aprobación, pero la entrega física de la mascota y firma de documentos se realiza fuera del sistema. Sin embargo, mantener estas solicitudes registradas es importante para trazabilidad y evitar duplicidades (una vez aprobada una adopción, no se aceptan más para esa mascota). La API facilita el seguimiento por parte del usuario y la gestión por parte del admin desde cualquier cliente.

### 3.5 Endpoint de Chat de Recomendaciones (IA)

Como valor agregado, Petly-Web incluye un **chatbot de recomendaciones** accesible desde la página principal, que ayuda al usuario a encontrar productos o mascotas adecuadas según lo que escribe. Este chatbot funciona mediante integración con un servicio de inteligencia artificial (OpenAI) en el backend, y expone el siguiente endpoint para su funcionamiento:

* **POST** `/api/chat-recomendaciones`: Procesa una consulta de lenguaje natural del usuario y retorna sugerencias de productos/mascotas. *Requiere autenticación* (se podría permitir a invitados usarlo, pero idealmente autenticado para un contexto más personalizado). El cuerpo de la petición debe incluir el mensaje o pregunta del usuario, por ejemplo: `"mensaje": "Busco alimento para un gato adulto de raza grande"`. El servidor toma este mensaje y, mediante la librería OpenAI integrada, genera una respuesta con recomendaciones relevantes. La respuesta de la API contendrá un mensaje de IA formateado y posiblemente una lista de items sugeridos extraídos del catálogo. Por ejemplo, podría devolver:

  ```json
  {
    "respuesta": "Para un gato adulto de raza grande, te recomendamos el alimento X marca Y...",
    "productos_sugeridos": [
        { "id": 15, "nombre": "Alimento Premium Gatos Adultos 5kg", "precio": 500, "url_imagen": "..." },
        { "id": 27, "nombre": "Snacks Vitamínicos para Gato", "precio": 120, "url_imagen": "..." }
    ],
    "mascota_sugerida": null
  }
  ```

  De este modo, el cliente puede mostrar la respuesta conversacional junto a tarjetas de producto. Este endpoint implementa lógica avanzada, pero para el cliente que lo consume funciona como cualquier consulta: envía texto y recibe recomendaciones. Si por alguna razón la AI no puede procesar (tiempo de espera excedido, etc.), se retornará un error 503 o un mensaje indicando que no se pudo obtener recomendación en ese momento. En suma, cumple con proporcionar **sugerencias automáticas** usando palabras clave y contexto, de forma similar a la búsqueda inteligente pero en lenguaje natural.

*(La integración de OpenAI requiere una API Key segura y configura ciertos parámetros en `config/openai.php`. La presencia de este endpoint demuestra la combinación de la funcionalidad de búsqueda/sugerencia con IA para mejorar la experiencia del usuario.)*

## 4. Formato de respuestas y convenciones

Todas las respuestas de la API Petly-Web se envían en formato JSON, generalmente envueltas en un objeto. Por ejemplo, una respuesta estándar para el listado de recursos utiliza una clave representativa (o en algunos casos, sigue el formato JSON\:API). No se incluyen HTML ni vistas en estos endpoints, solo datos crudos para que el cliente (aplicación móvil, front-end JS, etc.) los procese y presente adecuadamente.

**Ejemplo:** Una respuesta exitosa a `GET /api/productos/5` podría verse así:

```json
{
  "id": 5,
  "nombre": "Collar ajustable para perro",
  "descripcion": "Collar de nylon resistente, tamaño mediano...",
  "precio": 299.99,
  "stock_disponible": 12,
  "categoria": { "id": 2, "nombre": "Accesorios" },
  "valoracion_promedio": 4.5,
  "imagenes": [
    "https://petly.com/storage/productos/collar1.jpg",
    "https://petly.com/storage/productos/collar1_lateral.jpg"
  ],
  "reseñas": [
    {
      "usuario": "Juan Perez",
      "estrellas": 5,
      "comentario": "Excelente calidad, mi perro está feliz con su nuevo collar.",
      "fecha": "2025-06-10"
    },
    ...
  ]
}
```

En caso de error (por ejemplo, producto no encontrado), se podría devolver:

```json
{
  "error": "Producto no encontrado"
}
```

junto con un código HTTP 404.

La API utiliza nombres de campos en **español sin espacios** y en minúsculas\_con\_guiones\_bajos para mantener consistencia con la base de datos y el lenguaje de la aplicación. Las fechas se proporcionan típicamente en formato ISO 8601 (`YYYY-MM-DDTHH:MM:SSZ` o simplificado `YYYY-MM-DD` si solo se requiere fecha).

**Paginación:** En listados (como `/api/productos` o `/api/pedidos`), si la cantidad de elementos es grande, se implementa paginación. La respuesta incluirá campos como `pagina_actual`, `total_paginas`, `total_elementos` y enlaces o tokens para la página siguiente/anterior en caso de APIs más avanzadas.

**Seguridad adicional:** La API implementa CORS (Cross-Origin Resource Sharing) adecuado para permitir que, por ejemplo, una aplicación front-end en dominio distinto pueda consumirla, restringiendo orígenes de confianza según configuración. Además, como se mencionó, las reglas de **rate limiting** protegen de abuso: si un cliente supera el límite de peticiones en un periodo, recibirá respuestas 429 (Too Many Requests).

## 5. Notas finales

La API de Petly-Web cubre prácticamente todas las operaciones que un usuario puede realizar mediante la interfaz web, ofreciendo así una puerta de integración para otras plataformas o aplicaciones móviles. Cabe destacar:

* Antes de usar la API, se debe crear al menos un usuario administrador a través del panel o la instalación inicial, el cual podrá generar tokens o credenciales para pruebas si se desea.
* Los **endpoints administrativos** (como alta/baja de productos, categorías, usuarios) no se detallaron exhaustivamente en este documento, pues usualmente se manejan desde el panel de administración web. No obstante, existen en la estructura del proyecto y están restringidos por rol (por ejemplo, *crear producto*: **POST** `/api/productos` con autenticación de administrador, *eliminar producto*: **DELETE** `/api/productos/{id}`, etc., siguiendo el patrón CRUD). Estos endpoints admin utilizan las mismas validaciones que el sistema web (por ejemplo, no borrar una categoría si tiene productos activos, etc.) y no son accesibles para tokens de clientes comunes.
* La API está diseñada pensando en mantener la **consistencia** y reglas de negocio: por ejemplo, no permite que un pedido se cree sin productos, ni que una reseña se publique sin compra, ni duplicar solicitudes de adopción para la misma mascota por la misma persona. Todos esos checks se realizan en el backend del API al recibir cada petición.

En resumen, la **documentación de la API** de Petly-Web presentada aquí ofrece una visión detallada de cómo interactuar con el sistema de forma programática, complementando la documentación técnica general del proyecto. Siguiendo estos endpoints y normas, un desarrollador externo podría crear, por ejemplo, una aplicación móvil de Petly, un chatbot de soporte, o integrar el catálogo en otro sitio web, con la tranquilidad de que las mismas restricciones y lógicas de Petly-Web se aplicarán en cada llamada a la API, garantizando seguridad y coherencia con la plataforma principal.

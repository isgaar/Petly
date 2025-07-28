## 🧑‍💼 Roles del equipo SCRUM

| Usuario                             | Rol                              |
|-------------------------------------|----------------------------------|
| **Gaspar Cruz Ismael**             | Product Owner                    |
| **Andrade Carbajal Jesús Ricardo** | SCRUM Master                     |
| **José Aaron Hernández**           | Frontend (Diseño y Desarrollo)   |
| **Alvízar Martínez Alexis**        | Backend (Programador)            |
| **Ramírez Vega Iosef Yamil**       | Base de datos (Programador)      |

---


## 🗓️ Planeación por Sprint

| Etapa                        | Sprint 1                                              | Sprint 2                                                 | Sprint 3                                                | Sprint 4                                                  | Sprint 5                                            | Sprint 6                         | Sprint 7                                                  | Sprint 8                                                    |
|-----------------------------|--------------------------------------------------------|-----------------------------------------------------------|----------------------------------------------------------|-------------------------------------------------------------|----------------------------------------------------|----------------------------------|------------------------------------------------------------|----------------------------------------------------------------|
| Análisis                    | Propuesta de Proyecto. Análisis de requerimientos     | Estado del Arte. Análisis de Tecnologías                 | Análisis de riesgos                                      | Análisis de algoritmos a implementar                        |                                                    | Análisis del proyecto           |                                                            |                                                                |
| Diseño                      | Mockups con diseño responsivo. Especificación visual  | Diagrama de Arquitectura. Mockups v2. Especificación UX  | Diagrama de base de datos                                | Modelado de datos. Scripts SQL                              |                                                    |                                  |                                                            |                                                                |
| Desarrollo                  |                                                        |                                                           | Autenticación 2FA. Login. Módulos de registro/compra     | Panel administrativo. Módulo de configuraciones             | Módulos de forma de pago. Métodos de envío         | Módulo de adopción de mascotas | Implementación de Chatbot de ayuda                          | Funcionalidad                                                     |
| Pruebas e Implementación    |                                                        |                                                           |                                                          |                                                             | Pruebas de unidad e integración |                                  | Optimización de apartados. Evaluación de resultados parciales | Evaluación final de resultados y aprobación del proyecto       |

## 📋 Planeación de tareas por integrante

### 🟢 Tareas de Aarón (Frontend/UI)

- Rediseñar frontend de tienda con paleta verde, tipografía e íconos amigables (`Webkul/Shop`)
- Personalizar estructura de vistas principales: home, producto, carrito (`Shop::layouts`)
- Implementar carrusel tipo TikTok con Swiper.js (`resources/views/home.blade.php`)
- Crear nueva ficha visual para mascotas con edad, raza, vacunas (`resources/views/product`)
- Ajustar estilos globales y responsive (`public/css`)

---

### 🟣 Tareas de Alexis (Backend)

- Crear campos personalizados para productos tipo "mascota" (`Webkul/Product`)
- Adaptar el panel admin para creación de mascotas como productos (`Webkul/Admin`)
- Asegurar carrito para productos únicos como mascotas (`Webkul/Cart`)
- Adaptar checkout para compras de mascotas, restringiendo stock a 1 (`Webkul/Checkout`)
- Implementar seguimiento visual de pedidos de mascotas (`Webkul/Sales`)

---

### 🔵 Tareas de Iosef (Base de Datos / QA)

- Documentar flujos funcionales de compra y adopción (`General`)
- Verificar rutas conectadas en todos los módulos (`routes/web.php`)
- Adaptar textos al español en todas las vistas (`resources/lang`)
- Probar formularios de login, compra, seguimiento (`Customer`, `Cart`, `Sales`)
- Redactar instructivo básico para nuevos usuarios (`General`)

---

### 🔁 Integración y gestión

- **Ricardo (SCRUM Master)**: integra todos los cambios y se los envía a Gaspar.
- **Gaspar (Product Owner)**: valida requisitos, revisa entregables, y documenta partes no funcionales para retroalimentar a Ricardo.

---

## 📌 Notas adicionales

- Esta planeación SCRUM está sujeta a revisión semanal.
- Se recomienda actualizar esta documentación conforme se completen tareas clave.
# **Plan de Pruebas – Proyecto Petly (Angular + Node/Express)**

## 1. Objetivo
Validar que las funcionalidades principales de **Petly** (tienda online + sistema de adopción) operen correctamente, cumpliendo los requisitos descritos en la documentación técnica.

---

## 2. Alcance
Se cubrirán pruebas funcionales sobre:
- **Autenticación** (login, registro, 2FA)
- **Gestión de usuarios y roles** (cliente, vendedor, admin)
- **Carrito y compra** (checkout)
- **Adopción de mascotas**
- **Gestión administrativa** (productos, pedidos, solicitudes)
- **Flujos críticos MVC**

---

## 3. Casos de Prueba

### **3.1 Autenticación**
| ID | Caso | Precondiciones | Pasos | Resultado Esperado |
|----|------|---------------|-------|----------------------|
| AUTH-01 | Registro exitoso | Ninguna | 1. Abrir `/register`  2. Completar datos válidos  3. Enviar formulario | Usuario registrado, redirige al home con sesión iniciada |
| AUTH-02 | Login correcto + 2FA | Usuario registrado | 1. Abrir `/login` 2. Ingresar credenciales correctas 3. Ingresar código 2FA | Acceso concedido, redirección a perfil |
| AUTH-03 | Login fallido | Usuario registrado | 1. Abrir `/login` 2. Ingresar credenciales incorrectas | Mensaje “Credenciales incorrectas” |
| AUTH-04 | 2FA incorrecto | Usuario en paso 2FA | 1. Ingresar código erróneo | Mensaje “Código inválido” |

---

### **3.2 Gestión de Roles**
| ID | Caso | Precondiciones | Pasos | Resultado Esperado |
|----|------|---------------|-------|----------------------|
| ROLE-01 | Cliente accede a `/admin` | Usuario logueado como cliente | 1. Abrir `/admin` | Acceso denegado (403) |
| ROLE-02 | Admin accede a panel | Usuario admin | 1. Abrir `/admin` | Acceso permitido, panel visible |
| ROLE-03 | Vendedor registra venta física | Usuario vendedor | 1. Iniciar sesión como vendedor 2. Acceder a panel vendedor 3. Registrar venta | Venta registrada correctamente |

---

### **3.3 Carrito y Checkout**
| ID | Caso | Precondiciones | Pasos | Resultado Esperado |
|----|------|---------------|-------|----------------------|
| CART-01 | Agregar producto al carrito | Producto disponible | 1. Abrir detalle de producto 2. Click “Agregar al carrito” | Carrito actualizado con producto |
| CART-02 | Checkout sin login | Usuario no autenticado | 1. Ir a `/checkout` | Redirección a login |
| CART-03 | Compra completa | Usuario autenticado | 1. Ir a `/checkout` 2. Completar dirección y pago 3. Confirmar | Pedido registrado con estado “Procesando” |

---

### **3.4 Adopción de Mascotas**
| ID | Caso | Precondiciones | Pasos | Resultado Esperado |
|----|------|---------------|-------|----------------------|
| ADOPT-01 | Solicitar adopción logueado | Usuario autenticado | 1. Abrir perfil de mascota 2. Click “Adoptar” 3. Completar formulario 4. Enviar | Solicitud registrada con estado “Pendiente” |
| ADOPT-02 | Solicitud sin login | Ninguna | 1. Abrir perfil de mascota 2. Click “Adoptar” | Redirección a login |

---

### **3.5 Panel Administrativo**
| ID | Caso | Precondiciones | Pasos | Resultado Esperado |
|----|------|---------------|-------|----------------------|
| ADMIN-01 | Crear producto | Usuario admin | 1. Acceder `/admin/products` 2. Click “Nuevo producto” 3. Completar datos 4. Guardar | Producto creado y visible en catálogo |
| ADMIN-02 | Aprobar adopción | Solicitud existente | 1. Acceder `/admin/adoptions` 2. Seleccionar solicitud 3. Cambiar estado a “Aprobado” | Estado actualizado, mascota marcada como adoptada |

---

## 4. Criterios de Aceptación
- Todas las pruebas **deben ejecutarse sin errores**.
- La validación de roles debe impedir accesos indebidos.
- El tiempo de respuesta promedio no debe superar **3 segundos** en escenarios normales.

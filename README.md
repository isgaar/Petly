# Petly

Este repositorio contiene los mockups, prototipos de interfaz y retroalimentación visual del proyecto **Petly**, una plataforma e-commerce centrada en el bienestar animal, venta de productos y adopción de mascotas. Forma parte del trabajo realizado por el equipo de la carrera IDGS 9B de la Universidad Tecnológica del Centro de Veracruz (UTCV).

## 🌐 Proyecto

**Petly** es una tienda de mascotas en línea con enfoque "family-friendly", que permite a los usuarios:
- Comprar productos para mascotas
- Consultar reseñas de productos
- Reservar adopciones de animales
- Seguir sus pedidos con un sistema de etapas visuales

Este repositorio contiene los mockups actualizados, junto con observaciones de mejora en la experiencia de usuario.

## 👨‍💻 Equipo desarrollador

- Andrade Carbajal Jesús Ricardo  
- Alvizar Martínez Alexis  
- Hernández Rodríguez José Aarón  
- Ramírez Vega Iosef Yamil  
- Gaspar Cruz Ismael  

## 📁 Estructura del repositorio

```
/
├── docs/              # Documentación del proyecto
├── Petly-Web/         # Código fuente del proyecto Laravel
├── .gitignore         # Archivos ignorados por Git
├── README.md          # Descripción del proyecto
└── LICENSE            # (Opcional)
```

## 🧠 Sugerencias de diseño aplicadas

- Paleta de colores más amigable (#cee4ff y #008a0e)
- Visualización estilo TikTok para mascotas
- Interfaz responsive para distintos dispositivos
- Formulario de empleados/usuarios dinámico (no siempre visible)
- Seguimiento de envíos estilo Mercado Libre
- Iconografía familiar e intuitiva


# Convenciones de Ramas

Este proyecto trabajará principalmente con las siguientes ramas:

## 🌿 Ramas principales

- `main` — Código estable y listo para producción.
- `test` — Rama destinada a pruebas y validación antes de pasar a `main`.


### Roles

| Usuario                             | Rol                                
|-----------------------------------|-----------------------------------|
| **José Aaron Hernández**           | Frontend (Diseño y Desarrollo)    |
|                                   |                                   |
| **Ramírez Vega Iosef Yamil**       | Base de datos (Programador)       |
|                                   |                                   |
| **Gaspar Cruz Ismael**             | Product Owner                     
| **Alvízar Martínez Alexis**        | Backend (Programador)             |
|                                   |                                   |
| **Andrade Carbajal Jesús Ricardo** | SCRUM Master                     |

---

## 🧪 Ejemplo de flujo de trabajo

### Caso: José Aaron necesita cambiar la vista de login

1. Se posiciona en la rama `test`:
   ```bash
   git checkout test
   ```

2. Crea una nueva rama desde `test` con el nombre adecuado:
   ```bash
   git checkout -b feat/frontend/vista-login
   ```

3. Realiza los cambios necesarios en su entorno local.

4. Sube su rama al repositorio:
   ```bash
   git push origin feat/frontend/vista-login
   ```

5. Abre un **Pull Request hacia `test`** para revisión y pruebas.

6. Una vez aprobado por el equipo y verificado su funcionamiento, el SCRUM Master puede **fusionar `test` a `main`**.

---


## 📌 Nota de responsabilidad

A partir del **6 de agosto del año 2026**, el equipo de desarrollo descrito en este documento se deslinda de toda responsabilidad en cuanto al mantenimiento, soporte, continuidad y actualización del proyecto.

Todo uso posterior, modificación o distribución del código fuente será enteramente responsabilidad de los usuarios, instituciones o terceros que lo adopten.

---

## 🔒 Políticas de privacidad (vigentes hasta el 6 de agosto de 2026)

Durante el desarrollo activo del proyecto, se han seguido las siguientes políticas de privacidad:

1. **Uso de datos**: Todos los datos de usuario recolectados fueron utilizados exclusivamente para el funcionamiento interno de la aplicación, sin fines comerciales ni de terceros.

2. **Almacenamiento seguro**: Los datos fueron almacenados en bases de datos cifradas y protegidas por autenticación segura, con copias de respaldo periódicas.

3. **Acceso restringido**: Sólo el equipo autorizado tenía acceso a la información sensible. Cada miembro fue responsable de cumplir con estándares éticos y legales.

4. **No rastreo**: La aplicación no incluye mecanismos de rastreo ni almacenamiento de datos no explícitamente proporcionados por el usuario.

5. **Eliminación voluntaria**: Cualquier usuario podía solicitar la eliminación total de sus datos en cualquier momento dentro del periodo de soporte.

6. **No cesión de datos**: En ningún momento se cedieron, vendieron ni compartieron datos personales a empresas externas ni terceros.

---

A partir del 6 de agosto de 2026, estas políticas dejan de tener validez activa por parte del equipo original. Se recomienda a cualquier entidad que continúe con el desarrollo o despliegue del proyecto que establezca sus propias políticas conforme a la legislación vigente en su jurisdicción.
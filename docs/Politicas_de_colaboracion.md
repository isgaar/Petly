# Políticas de colaboración y flujo de trabajo en Petly

- `main` — Código estable y listo para producción.
- `angular` — Rama destinada al desarrollo del backend con Angular (anteriormente `test`).
- `node` — Rama destinada al desarrollo del frontend con Node.js y PostgreSQL.
- `docs-gen` — Rama destinada a la documentación técnica y funcional del proyecto.


## 📌 Políticas de Merge

I. Introducción
Este documento establece las directrices formales para realizar merge de código dentro del flujo de trabajo colaborativo del proyecto Petly. El objetivo es evitar errores críticos en la rama principal (main), garantizar la calidad del código, y mantener la estabilidad del sistema, alineado con las buenas prácticas de GitHub y la metodología Git Flow.

II. Requisitos Previos al Merge
Antes de realizar cualquier acción de merge, se deben cumplir los siguientes puntos:
✅ El Pull Request (PR) fue revisado y aprobado por al menos un miembro del equipo.
✅ La rama se encuentra actualizada con main y sin conflictos.
✅ Todas las pruebas locales y visuales (UI/UX) han sido validadas por el desarrollador responsable.
✅ Se ha documentado correctamente el cambio realizado en la descripción del PR.
✅ El código subido no afecta otras funciones sin justificación técnica.
✅ En caso de funcionalidad nueva o crítica, se notificó previamente en la daily o por mensaje.

III. Tipos de Merge Permitidos
Con base en el enfoque Git Flow, todos los desarrolladores trabajan directamente sobre la rama main a través de Pull Requests, por lo que el proceso de merge debe ser controlado:

IV. Reglas y Responsabilidades
Solo pueden ejecutar merge los desarrolladores autores del PR, una vez aprobado.
No se permite el uso de push --force en ninguna rama compartida.
Todo merge debe hacerse en horario de trabajo definido o con consentimiento del equipo.
El SCRUM Master será el responsable de resolver cualquier disputa o error relacionado con merges.

V. Roles asignados en el proceso

VI. Faltas y sanciones aplicables
La inobservancia de estas políticas pone en riesgo el estado del repositorio principal. Por ello, se aplicarán las siguientes sanciones, tomando como base la Ley Federal del Trabajo de México:

VII. Observaciones Finales
Las presentes políticas aplican durante todo el ciclo de desarrollo de Petly. Cualquier excepción deberá ser aprobada por el SCRUM Master y comunicada a todo el equipo.
Revisiones o actualizaciones a este documento deberán registrarse con fecha y motivo.
VIII. Nomenclatura de Ramas
La nomenclatura de ramas debe seguir un esquema estándar para asegurar consistencia y facilitar la navegación y colaboración dentro del repositorio. A continuación, se define el formato que se debe utilizar para la creación de ramas.
A. Formato de las ramas
Cada rama debe estar nombrada siguiendo el siguiente esquema:
php-template
Copiar

### 🧩 ¿Qué significa cada parte?

- **`tipo`**: Indica el propósito de la rama. Estos son los más comunes:
  - `feat` → Nueva funcionalidad
  - `fix` → Corrección de errores
  - `refactor` → Reorganización o mejora del código existente
  - `docs` → Cambios en la documentación
  - `test` → Pruebas unitarias o de integración
  - `chore` → Tareas generales, como limpieza de código o actualización de dependencias

- **`área`**: Indica la parte del proyecto donde se aplica el cambio:
  - `frontend` → Cambios en la interfaz de usuario
  - `backend` → Lógica del servidor o controladores
  - `database` → Cambios en modelos, migraciones o relaciones
  - `devops` → Infraestructura, despliegue o configuración

- **`descripción-corta`**: Un resumen breve, todo en minúsculas y con guiones (`-`) si es necesario. Debe ser claro, directo y sin palabras innecesarias.

---

### ✅ Ejemplos prácticos

| Tipo         | Rama ejemplo                                   | ¿Qué hace?                                           |
|--------------|------------------------------------------------|------------------------------------------------------|
| `feat`       | `feat/frontend/agregar-boton-login`            | Agrega un nuevo botón de inicio de sesión            |
|              | `feat/backend/integrar-api-mascotas`           | Integra una API para gestionar mascotas              |
| `fix`        | `fix/frontend/corregir-bug-login`              | Corrige un error visual en el formulario de login    |
|              | `fix/backend/solucionar-error-consulta-db`     | Corrige una mala consulta en base de datos           |
| `refactor`   | `refactor/frontend/optimizar-renderizado`      | Mejora el rendimiento del renderizado de componentes |
|              | `refactor/backend/reorganizar-codigo-login`    | Limpia y reestructura el código del login            |
| `docs`       | `docs/actualizar-readme`                       | Actualiza el archivo README                          |
|              | `docs/agregar-instrucciones-despliegue`        | Agrega instrucciones sobre cómo desplegar el sistema |
| `test`       | `test/frontend/pruebas-login`                  | Crea pruebas para el módulo de login                 |
|              | `test/backend/pruebas-api-mascotas`            | Pruebas sobre la API de mascotas                     |
| `chore`      | `chore/devops/actualizar-dependencias`         | Actualiza paquetes o librerías                       |
|              | `chore/frontend/eliminar-codigo-obsoleto`      | Elimina componentes que ya no se usan                |

---

### 💡 Recomendación

Antes de crear una nueva rama, asegúrate de estar actualizado con la rama `test` o `main`, según el flujo de trabajo, y de que tu nombre de rama **describa claramente lo que harás**.

Esto facilitará mucho las revisiones, los merges y evitará errores.


C. Reglas adicionales
Las ramas deben ser creadas desde la rama dev y deben tener un nombre claro que refleje el cambio que se está haciendo.
No se deben usar nombres genéricos como dev o master para ramas de características, correcciones o tareas.
Las ramas deben ser cerradas (borradas) después de realizar el merge exitoso con main.


D. Sanciones por incumplimiento
El incumplimiento de estas reglas de nomenclatura puede causar confusión en el equipo, generando retrasos en las entregas y errores de integración. Las consecuencias por no seguir esta nomenclatura son las siguientes:

## 📌 Políticas de Pull Requests

I. Introducción
El presente documento tiene como finalidad establecer las normas y lineamientos que deben seguir los integrantes del equipo de desarrollo del proyecto Petly al momento de crear y gestionar Pull Requests (PR) dentro del flujo de trabajo definido por la metodología Git Flow. Estas políticas buscan mantener la calidad del código, la organización del repositorio, la trazabilidad del desarrollo y una cultura de colaboración profesional.

II. Estructura y Proceso para Pull Requests
A. Flujo base
Todo el desarrollo se debe realizar en ramas individuales creadas desde la rama principal de desarrollo (main) siguiendo la estrategia Git Flow.
Al finalizar una tarea o funcionalidad, se deberá crear un Pull Request desde la rama individual hacia main.
B. Nombres y convenciones
El nombre del PR debe seguir el formato:
tipo: descripción breve
Ejemplos:
feat: agregar vista de detalles de mascota
fix: corregir validación en formulario de registro
docs: actualizar README
Los tipos válidos son:
feat – nueva funcionalidad
fix – corrección de errores
refactor – reestructuración de código sin cambiar funcionalidad
docs – cambios en documentación
style – ajustes de formato o estilo
test – pruebas
C. Descripción obligatoria del PR
Todo PR debe incluir:
Descripción clara de los cambios realizados.
Tarea correspondiente (si aplica).
Screenshots o evidencia visual cuando se trate de frontend.
Indicación de posibles efectos colaterales (bugs, componentes afectados).
D. Revisión y aprobación
Cada PR debe ser revisado y aprobado por al menos otro miembro del equipo.
No se puede hacer merge sin aprobación previa.
Se deben usar los comentarios para sugerir cambios, identificar errores y resolver dudas técnicas.
E. Buenas prácticas
Subir código funcional y probado localmente.
Mantener cambios organizados y con commits claros.
Evitar mezclar tareas diferentes en un mismo PR.
No subir archivos innecesarios (.env, .DS_Store, node_modules, etc.).

III. Roles y responsabilidades
José Aaron Hernández Rodríguez – Asegura que el diseño frontend cumpla estándares visuales antes de aprobar PR relacionados con interfaz.
Ramírez Vega Iosef Yamil – Revisa integridad de datos y seguridad en PRs relacionados con backend y base de datos.
Gaspar Cruz Ismael – Supervisa coherencia general del proyecto y da aprobación final como Product Owner.
Alvízar Martínez Alexis – Participa activamente en revisión cruzada de funciones.
Andrade Carbajal Jesús Ricardo – Como SCRUM Master, se asegura del cumplimiento de los procedimientos definidos y resuelve conflictos.

IV. Sanciones por incumplimiento
En caso de omitir estas políticas o afectar negativamente el flujo de trabajo del equipo, se aplicarán sanciones internas proporcionales, respaldadas por el marco de la Ley Federal del Trabajo de México, especialmente en contextos laborales o institucionales formales.
Faltas y sus consecuencias:

V. Observaciones finales
Estas políticas están sujetas a revisión continua por el SCRUM Master y el Product Owner. Cualquier cambio deberá notificarse por escrito y discutirse en sesión de equipo.
VI. Nomenclatura de Ramas
La nomenclatura de ramas debe seguir un esquema estándar para asegurar consistencia y facilitar la navegación y colaboración dentro del repositorio. A continuación, se define el formato que se debe utilizar para la creación de ramas.
A. Formato de las ramas
Cada rama debe estar nombrada siguiendo el siguiente esquema:
php-template
Copiar
<tipo>/<proyecto>/<descripción-corta>
tipo: Se refiere al tipo de tarea que se está realizando. Los tipos más comunes son:
feat: Nueva funcionalidad.
fix: Corrección de errores.
refactor: Cambios de refactorización o mejoras de código.
docs: Cambios relacionados con la documentación.
test: Nuevas pruebas o modificaciones de pruebas existentes.
chore: Tareas generales, como actualizaciones de dependencias o cambios de configuración.
proyecto: Representa el área del proyecto en el que se está trabajando. Puede ser:
frontend: Si es un cambio en el frontend.
backend: Si es un cambio en el backend.
database: Si es un cambio relacionado con la base de datos.
devops: Si es un cambio relacionado con la infraestructura.
descripción-corta: Una breve descripción del cambio realizado, escrita en minúsculas y separada por guiones si es necesario.
B. Ejemplos de nomenclatura de ramas
Para nuevas funcionalidades (features):
feat/frontend/agregar-boton-login
feat/backend/integrar-api-mascotas
Para correcciones de erro	res (fixes):
fix/frontend/corregir-bug-login
fix/backend/solucionar-error-consulta-database
Para cambios de refactorización (refactor):
refactor/frontend/optimizar-renderizado
refactor/backend/reorganizar-codigo-login
Para cambios en la documentación (docs):
docs/actualizar-readme
docs/agregar-instrucciones-despliegue
Para nuevas pruebas (test):
test/frontend/pruebas-login
test/backend/pruebas-api-mascotas
Para tareas generales (chore):
chore/devops/actualizar-dependencias
chore/frontend/eliminar-codigo-obsoleto
C. Reglas adicionales
Las ramas deben ser creadas desde la rama dev y deben tener un nombre claro que refleje el cambio que se está haciendo.
No se deben usar nombres genéricos como dev o master para ramas de características, correcciones o tareas.
Las ramas deben ser cerradas (borradas) después de realizar el merge exitoso con main.


D. Sanciones por incumplimiento
El incumplimiento de estas reglas de nomenclatura puede causar confusión en el equipo, generando retrasos en las entregas y errores de integración. Las consecuencias por no seguir esta nomenclatura son las siguientes:

# PetlyAngular (Versión Extendida en Español)

Este proyecto es el frontend del sistema **Petly**, desarrollado con Angular y ubicado en el subdirectorio:

```
Petly-proyect/petly-angular/
```

Forma parte de una arquitectura desacoplada donde el backend se encuentra desarrollado en Node.js/PostgreSQL. Este README te guía paso a paso desde la instalación del entorno hasta pruebas y compilación.

---

## 🖥️ Instalación del Entorno

### 🔧 Requisitos Previos

Antes de ejecutar el proyecto, asegúrate de tener instalado:

- Node.js (v18 o superior)
- Angular CLI
- Git
- Navegador web (Chrome recomendado)

### 📥 Instalación de Node.js

#### En Windows

1. Ve a [https://nodejs.org/](https://nodejs.org/) y descarga la versión LTS.
2. Ejecuta el instalador y sigue las instrucciones.
3. Verifica la instalación:
    ```bash
    node -v
    npm -v
    ```

#### En Ubuntu/Debian

```bash
sudo apt update
sudo apt install -y curl
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs
node -v
npm -v
```

### 🧰 Instalación de Angular CLI

```bash
npm install -g @angular/cli
```

Verifica con:

```bash
ng version
```

---

## 🚀 Servidor de Desarrollo

1. Clona el repositorio si no lo tienes aún:

```bash
git clone https://github.com/tu-usuario/petly.git
cd petly/Petly-proyect/petly-angular/
```

2. Instala las dependencias:

```bash
npm install
```

3. Inicia el servidor local:

```bash
ng serve
```

4. Abre tu navegador en:

```
http://localhost:4200/
```

---

## ⚙️ Generación de Código (Scaffolding)

```bash
ng generate component nombre-del-componente
```

Consulta otras opciones con:

```bash
ng generate --help
```

---

## 🛠️ Compilación para Producción

```bash
ng build
```

Los archivos quedarán listos en `dist/` para su despliegue.

---

## 🧪 Pruebas Unitarias

```bash
ng test
```

---

## 🧪 Pruebas E2E

```bash
ng e2e
```

⚠️ Angular CLI no trae E2E por defecto. Puedes integrar herramientas como **Cypress** o **Playwright**.

---

## 📚 Recursos Adicionales

- [Guía de Angular CLI](https://angular.dev/tools/cli)
- [Documentación de Node.js](https://nodejs.org/en/docs/)

---

🛠️ Documento actualizado tras reorganización del proyecto en la rama `angular`, fusionado en `master`. Estructura optimizada para mantener separado frontend y backend.
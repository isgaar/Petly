# Guía Detallada de Instalación del Proyecto Petly (Bagisto)

Este documento describe paso a paso cómo instalar y poner en funcionamiento el proyecto **Petly**, basado en la plataforma **Bagisto**.

---

## 📋 Requisitos Previos

Antes de comenzar, asegúrate de tener los siguientes componentes instalados en tu sistema:

- **XAMPP** con soporte para **PHP 8.2** en adelante
- **Composer** (administrador de dependencias de PHP)
- **Git** (control de versiones)

---

## 1️⃣ Clonar el Repositorio

Abre una terminal (CMD, PowerShell o Git Bash) y ejecuta los siguientes comandos:

```bash
git clone https://github.com/isgaar/Petly.git
cd Petly/Petly-Web
```


---

## 2️⃣ Instalar Dependencias del Proyecto

Ejecuta el siguiente comando para instalar las dependencias PHP:

```bash
composer install
```

> Si aparecen errores relacionados con extensiones como `intl`, `gd` o `zip`, realiza lo siguiente:
>
> 1. Abre el panel de **XAMPP**
> 2. Ve a `Config` → `php.ini`
> 3. Asegúrate de que las siguientes líneas **no estén comentadas** (elimina el `;` al inicio si es necesario):
>
> ```ini
> extension=gd
> extension=intl
> extension=zip
> ```
>
> 4. Guarda los cambios y reinicia **Apache**.

---

## 3️⃣ Configurar el Archivo `.env`

Copia el archivo de entorno de ejemplo:

```bash
copy .env.example .env
```

Edita el archivo `.env` y configura los siguientes valores para la base de datos (configuración por defecto de XAMPP):

```dotenv
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=petly
DB_USERNAME=root
DB_PASSWORD=
```

---

## 4️⃣ Crear la Base de Datos

1. Abre el panel de control de **XAMPP**
2. Inicia el servicio de **MySQL**
3. Da clic en el botón **Admin**
4. En **phpMyAdmin**, crea una nueva base de datos llamada:

```sql
petly
```

---

## 5️⃣ Generar la Clave de Aplicación

Ejecuta el siguiente comando para generar la clave de Laravel:

```bash
php artisan key:generate
```

---

## 6️⃣ Migrar Tablas y Completar Instalación

Primero, ejecuta las migraciones:

```bash
php artisan migrate
```

Luego, si deseas completar la instalación por consola, ejecuta:

```bash
php artisan bagisto:install
```

Sigue las instrucciones y proporciona los datos requeridos como:

- Nombre de la tienda
- Correo del administrador
- Idioma
- Zona horaria

---

## 7️⃣ Iniciar el Servidor de Desarrollo

Ejecuta:

```bash
php artisan serve
```

Abre tu navegador y accede a:

```
http://localhost:8000
```

¡Listo! La aplicación Petly estará en funcionamiento.

---

## 🔐 Acceso al Panel de Administración

Para acceder al panel de administración dirígete a:

```
http://localhost:8000/admin/login
```

Inicia sesión usando el correo electrónico y contraseña que configuraste durante la instalación.

---

## ✅ Instalación Finalizada

Ahora puedes comenzar a personalizar y utilizar el sistema Petly según tus necesidades. Si encuentras algún error, revisa cada paso o consulta la documentación oficial de Laravel y Bagisto.
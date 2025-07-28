# Guía de Instalación

## Requisitos

- PHP >= 8.1
- Composer
- Node.js y NPM
- MySQL o PostgreSQL

## Pasos

```bash
git clone https://github.com/tuusuario/tu-repo.git
cd laravel-app
cp .env.example .env
composer install
php artisan key:generate
npm install && npm run dev
php artisan migrate
php artisan serve
```

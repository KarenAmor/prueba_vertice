# Backend Node.js con Nest.js

Este es el backend desarrollado con Node.js y Nest.js para la aplicación de administrador de proyectos.

## Características

- **Autenticación JWT**: Registro e inicio de sesión de usuarios
- **CRUD de Proyectos**: Crear, listar, editar y eliminar proyectos
- **CRUD de Tareas**: Crear, listar, editar y eliminar tareas asociadas a proyectos
- **Base de datos**: Supabase (PostgreSQL)
- **Validación**: Validación de datos con class-validator
- **CORS**: Habilitado para permitir conexiones desde el frontend

## Instalación

1. Instalar dependencias:
```bash
npm install
```

2. Configurar variables de entorno en `.env`:
```
SUPABASE_URL=https://uvehlkseoklgxhwoceac.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV2ZWhsa3Nlb2tsZ3hod29jZWFjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQwODA4MjYsImV4cCI6MjA2OTY1NjgyNn0.fSoWuj-tBPFiHoaOd4pTkPRQSFLd_U0YGmQRAJ4wIMg
JWT_SECRET=your-super-secret-jwt-key-here-change-in-production
PORT=3000
```

## Ejecución

### Desarrollo
```bash
npm run start:dev
```

### Producción
```bash
npm run build
npm run start:prod
```

## Endpoints de la API

### Autenticación
- `POST /auth/register` - Registrar nuevo usuario
- `POST /auth/login` - Iniciar sesión

### Proyectos (requiere autenticación)
- `GET /projects` - Listar proyectos del usuario
- `POST /projects` - Crear nuevo proyecto
- `GET /projects/:id` - Obtener proyecto específico
- `PATCH /projects/:id` - Actualizar proyecto
- `DELETE /projects/:id` - Eliminar proyecto

### Tareas (requiere autenticación)
- `GET /tasks?project_id=:id` - Listar tareas de un proyecto
- `POST /tasks` - Crear nueva tarea
- `GET /tasks/:id` - Obtener tarea específica
- `PATCH /tasks/:id` - Actualizar tarea
- `DELETE /tasks/:id` - Eliminar tarea

## Estructura del Proyecto

```
src/
├── auth/           # Módulo de autenticación
├── projects/       # Módulo de proyectos
├── tasks/          # Módulo de tareas
├── config/         # Configuraciones
├── app.module.ts   # Módulo principal
└── main.ts         # Punto de entrada
```

## Tecnologías Utilizadas

- **Node.js** - Runtime de JavaScript
- **Nest.js** - Framework de Node.js
- **TypeScript** - Lenguaje de programación
- **Supabase** - Base de datos PostgreSQL
- **JWT** - Autenticación
- **bcryptjs** - Hashing de contraseñas
- **class-validator** - Validación de datos
- **Passport** - Middleware de autenticación


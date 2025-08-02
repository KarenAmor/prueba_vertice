# Prueba Técnica Fullstack - Administrador de Proyectos

Proyecto completo desarrollado según los requisitos de la prueba técnica de Vértice.

## 📋 Resumen del Proyecto

Sistema de administración de proyectos y tareas con autenticación de usuarios, desarrollado con múltiples tecnologías para demostrar versatilidad técnica.

## 🏗️ Arquitectura del Sistema

```
Proyecto Completo/
├── backend-node/          # Backend principal con Node.js/Nest.js
├── frontend/              # Frontend con React
├── backend-go/            # Backend alternativo con Go
└── documentación/         # Documentación y archivos de configuración
```

## 🛠️ Tecnologías Utilizadas

### Backend Node.js (Principal)
- **Node.js** + **Nest.js** - Framework backend robusto
- **TypeScript** - Tipado estático
- **PostgreSQL** - Base de datos relacional
- **Supabase** - BaaS para base de datos
- **JWT** - Autenticación con tokens
- **Passport** - Middleware de autenticación
- **Bcrypt** - Hashing de contraseñas

### Frontend React
- **React 18** - Biblioteca de UI
- **Vite** - Build tool moderno
- **React Router** - Navegación SPA
- **Axios** - Cliente HTTP
- **Tailwind CSS** - Framework de estilos
- **Context API** - Manejo de estado global

### Backend Go (Alternativo)
- **Go 1.21** - Lenguaje de programación
- **Gin** - Framework web minimalista
- **Supabase REST API** - Conexión a base de datos
- **JWT** - Autenticación
- **CORS** - Habilitado para frontend

### Base de Datos
- **Supabase** - PostgreSQL en la nube
- **Tablas**: users, projects, tasks
- **Relaciones**: users → projects → tasks
- **Autenticación**: Supabase Auth

## 📊 Modelo de Datos

### Tabla: users
```sql
id          UUID PRIMARY KEY
email       TEXT UNIQUE NOT NULL
password    TEXT NOT NULL
created_at  TIMESTAMP WITH TIME ZONE
```

### Tabla: projects
```sql
id          UUID PRIMARY KEY
user_id     UUID REFERENCES users(id)
name        TEXT NOT NULL
description TEXT
created_at  TIMESTAMP WITH TIME ZONE
```

### Tabla: tasks
```sql
id          UUID PRIMARY KEY
project_id  UUID REFERENCES projects(id)
title       TEXT NOT NULL
description TEXT
status      TEXT CHECK (status IN ('pending', 'in progress', 'completed'))
created_at  TIMESTAMP WITH TIME ZONE
```

## 🚀 Funcionalidades Implementadas

### ✅ Autenticación y Autorización
- Registro de usuarios con validación
- Inicio de sesión con JWT
- Protección de rutas
- Middleware de autenticación
- Logout y manejo de sesiones

### ✅ Gestión de Proyectos
- Crear proyectos con nombre y descripción
- Listar proyectos del usuario autenticado
- Editar información de proyectos
- Eliminar proyectos (con tareas asociadas)
- Validación de pertenencia al usuario

### ✅ Gestión de Tareas
- Crear tareas dentro de proyectos
- Estados: Pendiente, En Progreso, Completada
- Editar título, descripción y estado
- Eliminar tareas
- Filtrado por proyecto

### ✅ Interfaz de Usuario
- Dashboard responsivo
- Formularios de registro e inicio de sesión
- Lista de proyectos con acciones
- Vista detallada de tareas por proyecto
- Navegación intuitiva
- Diseño moderno con Tailwind CSS

## 🔧 Instalación y Configuración

### 1. Base de Datos (Supabase)
```sql
-- Ejecutar en Supabase SQL Editor
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

CREATE TABLE projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id),
    name TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

CREATE TABLE tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES projects(id),
    title TEXT NOT NULL,
    description TEXT,
    status TEXT DEFAULT 'pending' NOT NULL CHECK (status IN ('pending', 'in progress', 'completed')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);
```

### 2. Backend Node.js
```bash
# Extraer y configurar
cd backend-node

# Instalar dependencias
npm install

# Configurar .env
SUPABASE_URL=https://tu-proyecto.supabase.co
SUPABASE_ANON_KEY=tu-clave-anon
JWT_SECRET=tu-secreto-jwt
PORT=3000

# Ejecutar
npm run start:dev
```

### 3. Frontend React
```bash
# Extraer y configurar
cd frontend

# Instalar dependencias
npm install --legacy-peer-deps

# Ejecutar
npm run dev
```

### 4. Backend Go (Opcional)
```bash
# Extraer y configurar
cd backend-go

# Instalar dependencias
go mod tidy

# Configurar .env
SUPABASE_URL=https://tu-proyecto.supabase.co
SUPABASE_ANON_KEY=tu-clave-anon
JWT_SECRET=tu-secreto-jwt
PORT=3002

# Ejecutar
go run main.go
```

## 🌐 URLs de Acceso

- **Frontend**: http://localhost:5173
- **Backend Node.js**: http://localhost:3000
- **Backend Go**: http://localhost:3002
- **Supabase Dashboard**: https://supabase.com/dashboard

## 📡 API Endpoints

### Autenticación
- `POST /auth/register` - Registro de usuario
- `POST /auth/login` - Inicio de sesión

### Proyectos (Autenticado)
- `GET /projects` - Listar proyectos
- `POST /projects` - Crear proyecto
- `GET /projects/:id` - Obtener proyecto
- `PATCH /projects/:id` - Actualizar proyecto
- `DELETE /projects/:id` - Eliminar proyecto

### Tareas (Autenticado)
- `GET /tasks?project_id=:id` - Listar tareas de proyecto
- `POST /tasks` - Crear tarea
- `GET /tasks/:id` - Obtener tarea
- `PATCH /tasks/:id` - Actualizar tarea
- `DELETE /tasks/:id` - Eliminar tarea

## 🧪 Testing

### Flujo de Pruebas
1. **Registro**: Crear cuenta nueva
2. **Login**: Iniciar sesión
3. **Proyectos**: Crear, editar, eliminar
4. **Tareas**: Crear, cambiar estado, eliminar
5. **Navegación**: Probar todas las rutas

### Datos de Prueba
```json
{
  "usuario": {
    "email": "test@example.com",
    "password": "123456"
  },
  "proyecto": {
    "name": "Proyecto de Prueba",
    "description": "Descripción del proyecto"
  },
  "tarea": {
    "title": "Tarea de Prueba",
    "description": "Descripción de la tarea",
    "status": "pending"
  }
}
```

## 🔒 Seguridad

### Implementada
- ✅ Hashing de contraseñas con bcrypt
- ✅ Autenticación JWT
- ✅ Validación de entrada
- ✅ Protección de rutas
- ✅ CORS configurado
- ✅ Verificación de pertenencia de recursos

### Recomendaciones para Producción
- Usar HTTPS
- Configurar variables de entorno seguras
- Implementar rate limiting
- Logs de seguridad
- Validación adicional del lado del servidor

## 📈 Escalabilidad

### Arquitectura Actual
- Separación frontend/backend
- Base de datos en la nube
- APIs RESTful
- Autenticación stateless (JWT)

### Mejoras Futuras
- Implementar caché (Redis)
- Microservicios
- Load balancing
- CDN para assets estáticos
- Monitoreo y métricas

## 🎯 Cumplimiento de Requisitos

### ✅ Requisitos Técnicos
- [x] Backend con Node.js/Nest.js
- [x] Frontend con React
- [x] Base de datos PostgreSQL (Supabase)
- [x] Autenticación JWT
- [x] CRUD completo
- [x] Diseño responsivo
- [x] Backend alternativo en Go

### ✅ Funcionalidades
- [x] Registro e inicio de sesión
- [x] Gestión de proyectos
- [x] Gestión de tareas
- [x] Estados de tareas
- [x] Interfaz intuitiva
- [x] Validaciones

### ✅ Calidad de Código
- [x] Estructura modular
- [x] Separación de responsabilidades
- [x] Documentación completa
- [x] Manejo de errores
- [x] Buenas prácticas

## 📝 Documentación Adicional

- `backend-node/README.md` - Documentación del backend Node.js
- `frontend/README.md` - Documentación del frontend React
- `backend-go/README.md` - Documentación del backend Go
- `INSTRUCCIONES_*.md` - Guías de instalación específicas

## 👨‍💻 Desarrollado por Karen Edith Moreno

Proyecto desarrollado como prueba técnica para Vértice, demostrando competencias en:
- Desarrollo fullstack
- Múltiples tecnologías
- Arquitectura de software
- Mejores prácticas de desarrollo
- Documentación técnica

---

**Nota**: Este proyecto está listo para producción con las configuraciones de seguridad adecuadas.
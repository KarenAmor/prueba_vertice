# Backend Go - Administrador de Proyectos

Backend alternativo desarrollado en Go usando Gin framework y Supabase como base de datos.

## Tecnologías Utilizadas

- **Go 1.21+** - Lenguaje de programación
- **Gin** - Framework web para Go
- **Supabase** - Base de datos y autenticación
- **JWT** - Autenticación con tokens
- **CORS** - Habilitado para frontend
- **Swagger** - Documentación

## Estructura del Proyecto

```
backend-go/
├── config/
│   ├── database.go      # Configuración de conexión
│   └── supabase.go      # Cliente de Supabase
├── controllers/
│   ├── auth.go          # Controlador de autenticación
│   ├── projects.go      # Controlador de proyectos
│   └── tasks.go         # Controlador de tareas
├── middleware/
│   └── auth.go          # Middleware de autenticación JWT
├── models/
│   ├── user.go          # Modelo de usuario
│   ├── project.go       # Modelo de proyecto
│   └── task.go          # Modelo de tarea
├── routes/
│   └── routes.go        # Configuración de rutas
├── .env                 # Variables de entorno
├── go.mod              # Dependencias de Go
├── main.go             # Archivo principal
└── README.md           # Documentación
```

## Instalación

### 1. Prerrequisitos
- Go 1.21 o superior
- Acceso a Supabase

### 2. Clonar y configurar
```bash
# Navegar al directorio
cd backend-go

# Instalar dependencias
go mod tidy

# Configurar variables de entorno
cp .env.example .env
# Editar .env con tus credenciales de Supabase
```

### 3. Variables de entorno (.env)
```env
SUPABASE_URL=https://tu-proyecto.supabase.co
SUPABASE_ANON_KEY=tu-clave-anon
JWT_SECRET=tu-secreto-jwt
PORT=3002
```

### 4. Ejecutar el servidor
```bash
# Modo desarrollo
go run main.go

# Compilar y ejecutar
go build -o backend-go
./backend-go
```

El servidor estará disponible en: `http://localhost:3002`

## API Endpoints

### Autenticación

#### Registro de usuario
```http
POST /auth/register
Content-Type: application/json

{
  "email": "usuario@example.com",
  "password": "123456"
}
```

#### Inicio de sesión
```http
POST /auth/login
Content-Type: application/json

{
  "email": "usuario@example.com",
  "password": "123456"
}
```

**Respuesta:**
```json
{
  "access_token": "jwt-token",
  "user": {
    "id": "uuid",
    "email": "usuario@example.com",
    "created_at": "2025-01-01T00:00:00Z"
  }
}
```

### Proyectos (Requieren autenticación)

#### Obtener todos los proyectos
```http
GET /projects
Authorization: Bearer {token}
```

#### Obtener un proyecto específico
```http
GET /projects/{id}
Authorization: Bearer {token}
```

#### Crear un proyecto
```http
POST /projects
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "Mi Proyecto",
  "description": "Descripción del proyecto"
}
```

#### Actualizar un proyecto
```http
PATCH /projects/{id}
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "Nuevo nombre",
  "description": "Nueva descripción"
}
```

#### Eliminar un proyecto
```http
DELETE /projects/{id}
Authorization: Bearer {token}
```

### Tareas (Requieren autenticación)

#### Obtener tareas de un proyecto
```http
GET /tasks?project_id={project_id}
Authorization: Bearer {token}
```

#### Obtener una tarea específica
```http
GET /tasks/{id}
Authorization: Bearer {token}
```

#### Crear una tarea
```http
POST /tasks
Authorization: Bearer {token}
Content-Type: application/json

{
  "project_id": "uuid-del-proyecto",
  "title": "Mi Tarea",
  "description": "Descripción de la tarea",
  "status": "pending"
}
```

#### Actualizar una tarea
```http
PATCH /tasks/{id}
Authorization: Bearer {token}
Content-Type: application/json

{
  "title": "Nuevo título",
  "description": "Nueva descripción",
  "status": "completed"
}
```

#### Eliminar una tarea
```http
DELETE /tasks/{id}
Authorization: Bearer {token}
```

## Estados de Tareas

- `pending` - Pendiente
- `in progress` - En progreso
- `completed` - Completada

## Características

✅ **Autenticación JWT** - Tokens seguros para autenticación
✅ **CRUD Completo** - Operaciones completas para proyectos y tareas
✅ **Validación de datos** - Validación de entrada con Gin
✅ **CORS habilitado** - Permite conexiones desde el frontend
✅ **Middleware de seguridad** - Protección de rutas
✅ **Conexión a Supabase** - Base de datos en la nube
✅ **Estructura modular** - Código organizado y mantenible

## Desarrollo

### Agregar nuevas rutas
1. Crear el controlador en `controllers/`
2. Definir el modelo en `models/`
3. Agregar la ruta en `routes/routes.go`

### Middleware personalizado
Agregar middleware en `middleware/` y aplicar en `routes/routes.go`

### Testing
```bash
# Ejecutar tests
go test ./...

# Con cobertura
go test -cover ./...
```

## Despliegue

### Docker (Opcional)
```dockerfile
FROM golang:1.21-alpine AS builder
WORKDIR /app
COPY . .
RUN go build -o backend-go

FROM alpine:latest
RUN apk --no-cache add ca-certificates
WORKDIR /root/
COPY --from=builder /app/backend-go .
CMD ["./backend-go"]
```

### Variables de producción
- Cambiar `JWT_SECRET` por uno seguro
- Configurar `GIN_MODE=release`
- Usar HTTPS en producción

## Compatibilidad

Este backend es **100% compatible** con el frontend React desarrollado. Solo necesitas cambiar la URL base en el frontend de `http://localhost:3000` a `http://localhost:3002`.

## Diferencias con el Backend Node.js

- **Lenguaje**: Go vs Node.js/TypeScript
- **Framework**: Gin vs Nest.js
- **Conexión DB**: Supabase REST API vs PostgreSQL directo
- **Puerto**: 3002 vs 3000
- **Funcionalidad**: Idéntica

## Soporte

Para problemas o preguntas, revisar:
1. Los logs del servidor
2. La configuración de Supabase
3. Las variables de entorno
4. La documentación de Gin
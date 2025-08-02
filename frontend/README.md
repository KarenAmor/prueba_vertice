# Instrucciones de Instalación - Frontend React

## Contenido del Archivo

El archivo `vertice_prueba` contiene:
- `frontend/` - Proyecto completo del frontend con React
- Todas las páginas y componentes desarrollados
- Configuración de Tailwind CSS
- Servicios de API para conectar con el backend

## Instalación en tu Computadora

### 1. Navegar al directorio del proyecto
```bash
cd frontend
```

### 2. Instalar Node.js (si no lo tienes)
- Descargar desde: https://nodejs.org/
- Versión recomendada: 18.x o superior

### 3. Instalar dependencias
```bash
npm install --legacy-peer-deps
```

### 4. Configurar la conexión al backend
El frontend está configurado para conectarse a `http://localhost:3000` (backend Node.js).

Si tu backend está en una URL diferente, edita el archivo:
`src/services/api.js` y cambia la línea:
```javascript
const API_BASE_URL = 'http://localhost:3000';
```

### 5. Ejecutar el proyecto

#### Modo desarrollo:
```bash
npm run dev
```
El frontend estará disponible en: http://localhost:5173

#### Modo producción:
```bash
npm run build
npm run preview
```

## Funcionalidades Incluidas

### ✅ Autenticación
- Registro de usuarios
- Inicio de sesión
- Protección de rutas
- Manejo de tokens JWT

### ✅ Dashboard de Proyectos
- Lista de proyectos del usuario
- Crear nuevos proyectos
- Eliminar proyectos
- Navegación a vista de tareas

### ✅ Gestión de Tareas
- Ver tareas por proyecto
- Crear nuevas tareas
- Cambiar estado de tareas (Pendiente, En Progreso, Completada)
- Eliminar tareas

### ✅ Diseño y UX
- Interfaz responsive con Tailwind CSS
- Navegación intuitiva
- Formularios validados
- Mensajes de error y éxito

## Estructura del Proyecto

```
frontend/
├── src/
│   ├── components/          # Componentes reutilizables
│   │   ├── Navbar.jsx      # Barra de navegación
│   │   └── ProtectedRoute.jsx # Protección de rutas
│   ├── context/            # Contextos de React
│   │   └── AuthContext.jsx # Manejo de autenticación
│   ├── pages/              # Páginas principales
│   │   ├── Login.jsx       # Página de inicio de sesión
│   │   ├── Register.jsx    # Página de registro
│   │   ├── Dashboard.jsx   # Dashboard principal
│   │   └── ProjectDetail.jsx # Vista de proyecto y tareas
│   ├── services/           # Servicios de API
│   │   └── api.js          # Configuración de axios y endpoints
│   └── App.jsx             # Componente principal
├── package.json            # Dependencias y scripts
└── README.md              # Documentación
```

## Próximos Pasos

1. ✅ Backend Node.js completado
2. ✅ Frontend React completado
3. 🔄 Desarrollar backend Go
4. ⏳ Desplegar en Netlify

## Notas Importantes

- Asegúrate de que el backend Node.js esté ejecutándose en puerto 3000
- El frontend usa Vite como bundler para desarrollo rápido
- Todas las rutas están protegidas excepto login y register
- Los tokens JWT se guardan en localStorage
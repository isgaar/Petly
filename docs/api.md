# Documentación de la API

## Endpoints

### Obtener lista de tareas

```
GET /api/tareas
```

### Crear tarea

```
POST /api/tareas
{
  "titulo": "Nueva tarea"
}
```

### Eliminar tarea

```
DELETE /api/tareas/{id}
```

## Autenticación

Utiliza tokens Bearer para autenticación si aplica.

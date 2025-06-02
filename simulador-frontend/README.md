# CoreManager Frontend

Interfaz de usuario desarrollada con **React + JavaScript** para la plataforma CoreManager. Este frontend consume la API de préstamos y usuarios proporcionada por `CoreManagerSP.API`, permitiendo tanto a usuarios como administradores realizar simulaciones, ver análisis detallados y gestionar entidades del sistema.

---

## Propósito del Proyecto

Este frontend fue diseñado como parte de un sistema completo de simulación de préstamos, con funcionalidades que reflejan un análisis financiero automatizado. Su objetivo principal es permitir que los usuarios finales puedan simular y comparar opciones crediticias, recibir sugerencias de mejora y que los administradores puedan gestionar la plataforma.

---

## Funcionalidades Principales

* **Autenticación con JWT** para usuarios y administradores.
* **Simulación de préstamos completa**, con:

  * Registro de datos financieros
  * Análisis automático por entidad financiera
  * Criterios de evaluación y recomendaciones visuales
* **Comparación entre entidades financieras**
* **Historial de simulaciones por usuario**
* **Gestión de entidades financieras y tipos de préstamo** (panel de administrador)
* **Aplicación de mejoras y reanálisis**
* **Rutas protegidas por rol**
* **Consumo directo de `CoreManagerSP.API` con Axios**

---

## Roles y Acceso

* **Usuario:** puede registrarse, iniciar sesión, simular préstamos, aplicar mejoras y comparar entidades.
* **Administrador:** acceso exclusivo a CRUD de usuarios, entidades financieras y tipos de préstamo.

---

## Tecnologías Utilizadas

| Herramienta           | Uso                               |
| --------------------- | --------------------------------- |
| React                 | Librería principal de UI          |
| TypeScript            | Tipado estático                   |
| React Router DOM v6   | Ruteo de la aplicación            |
| Axios                 | Cliente HTTP para consumir la API |
| JWT Decode            | Decodificación de tokens          |
| SASS / MUI (opcional) | Estilización moderna y responsiva |

---

## Estructura General del Proyecto

```
src/
├── api/                  # Configuración de Axios
├── auth/                 # Helpers de autenticación
├── components/           # Componentes reutilizables
├── context/              # AuthContext (manejo global de sesión)
├── pages/                # Vistas principales (Login, Simulación, Historial, etc.)
├── routes/               # Rutas privadas y públicas
├── styles/               # Archivos SASS globales o módulos
└── App.tsx
```

---

## Pantallas Incluidas

1. Login de usuario y registro
2. Simulación completa (ingreso de datos financieros)
3. Vista de análisis y ranking de entidades
4. Vista de análisis detallado por entidad
5. Comparación entre entidades financieras
6. Aplicación de mejoras y reanálisis
7. Historial de simulaciones
8. Panel de administración:

   * CRUD de administradores
   * CRUD de usuarios
   * CRUD de entidades financieras
   * CRUD de tipos de préstamo

---

## Instalación

```bash
git clone https://github.com/DanielaMoraDevJourney/CoreManagerSP.Frontend.git
cd coremanager-frontend
npm install
```

---

##  Configuración

Ajusta la URL de la API en `src/api/axios.ts`:

```ts
const api = axios.create({
  baseURL: 'https://localhost:7086/api'
});
```

---

## Ejecución del Proyecto

```bash
npm run start
```

Accede a: `http://localhost:3000`

---

## Link de despliegue

https://coremanagersp-frontend.onrender.com

---

## Autores y Créditos

Proyecto desarrollado por **Daniela Mora**
*7mo semestre de Ingeniería Web - 2025*

Repositorio del backend: [CoreManagerSP.API](https://github.com/DanielaMoraDevJourney/CoreManagerSP.API)

---

## Licencia

Este proyecto es de uso académico y puede adaptarse libremente para fines educativos.
Se agradece dar créditos si se reutiliza con fines públicos o de aprendizaje compartido.



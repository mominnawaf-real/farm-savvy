# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Farm Savvy is a full-stack farm management application with separate frontend and backend repositories:
- **Frontend** (`farm-savvy-connect/`): React-based SPA built with Vite and TypeScript
- **Backend** (`farm-savvy-backend/`): Node.js REST API with Express and MongoDB

The frontend is integrated with Lovable.dev for AI-assisted development.

## Development Commands

### Backend Development
```bash
cd farm-savvy-backend
npm run dev          # Start dev server with hot-reload (port 5000)
npm run build        # Build TypeScript to JavaScript
npm run start:prod   # Start production server
npm run lint         # Type checking
```

### Frontend Development
```bash
cd farm-savvy-connect
npm run dev      # Start Vite dev server (port 8080)
npm run build    # Production build
npm run lint     # Run ESLint
npm run preview  # Preview production build
```

## Architecture Overview

### Backend Architecture

The backend follows a traditional MVC pattern with JWT authentication:

```
farm-savvy-backend/src/
├── config/database.ts    # MongoDB connection with Mongoose
├── models/              # Mongoose schemas
│   ├── User.ts         # User model with auth methods
│   ├── Farm.ts         # Farm with geospatial indexing
│   ├── Animal.ts       # Livestock tracking
│   └── Task.ts         # Task management
├── controllers/         # Route handlers
├── middleware/          # Auth, validation, error handling
├── routes/             # API endpoint definitions
├── app.ts             # Express configuration
└── server.ts          # Entry point
```

**Key Backend Patterns:**
- JWT authentication with role-based access (admin, manager, worker)
- Mongoose models with methods (e.g., `user.comparePassword()`, `user.generateAuthToken()`)
- Global error handling middleware
- Request validation using express-validator
- Rate limiting per IP address

### Frontend Architecture

The frontend uses React with shadcn/ui component library:

```
farm-savvy-connect/src/
├── components/
│   ├── ui/            # 50+ shadcn/ui components
│   └── dashboard/     # Dashboard widgets
├── pages/             # Route components
├── hooks/             # Custom React hooks
└── lib/utils.ts       # Utility functions
```

**Key Frontend Patterns:**
- Atomic design with modular components
- Path alias `@/` maps to `src/`
- React Query for server state management
- React Hook Form + Zod for form validation

## API Structure

All API routes require authentication except auth endpoints:

- **Auth**: `/api/auth/*` - Registration, login, user management
- **Resources** (Protected):
  - `/api/farms` - Farm CRUD operations
  - `/api/animals` - Animal tracking
  - `/api/tasks` - Task management
  - `/api/weather` - Weather data
  - `/api/users` - User administration (admin only)

## MongoDB Schema Relationships

- **User** → has many **Farms** (via `farms[]` array)
- **Farm** → has one **Owner** (User ref), many **Managers/Workers** (User refs)
- **Animal** → belongs to one **Farm**
- **Task** → belongs to one **Farm**, assigned to many **Users**

## Environment Configuration

Backend requires `.env` file (see `.env.example`):
- `MONGODB_URI` - MongoDB connection string
- `JWT_SECRET` - Secret for JWT signing
- `CORS_ORIGIN` - Frontend URL (default: http://localhost:8080)
- `PORT` - Server port (default: 5000)

## TypeScript Configuration

- **Backend**: Strict mode enabled, ES2022 target
- **Frontend**: Relaxed mode (no strict null checks, implicit any allowed)

## Current Implementation Status

**Implemented:**
- Complete authentication system with JWT
- User, Farm, Animal, Task models
- Auth routes with validation
- Security middleware (Helmet, CORS, rate limiting)
- Frontend dashboard UI components

**Not Implemented:**
- Full CRUD operations for farms, animals, tasks
- Weather API integration
- Test suites (no testing framework configured)
- API documentation (Swagger/OpenAPI)
- WebSocket for real-time updates

## Important Integration Points

1. **CORS**: Backend configured to accept requests from frontend (port 8080)
2. **Authentication**: Frontend must send JWT token as `Bearer <token>` in Authorization header
3. **Validation**: Backend validates all inputs; frontend should match validation rules
4. **Error Handling**: Backend returns consistent error format: `{ success: false, error: "message" }`
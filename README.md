# Farm Savvy

A comprehensive farm management application built with React, Node.js, Express, and MongoDB. Farm Savvy helps farmers and agricultural businesses track livestock, manage tasks, monitor farm operations, and optimize productivity.

## Project Structure

```
farm-savvy/
├── farm-savvy-backend/    # Node.js REST API
└── farm-savvy-connect/    # React frontend
```

## Features

- **User Authentication**: Secure JWT-based authentication with role-based access control
- **Farm Management**: Create and manage multiple farms with geospatial data
- **Livestock Tracking**: Monitor animal health, breeding cycles, and inventory
- **Task Management**: Assign and track farm tasks across teams
- **Weather Integration**: Real-time weather data for informed decision making
- **Multi-tenant Support**: Support for multiple farms with role-based permissions (Admin, Manager, Worker)

## Tech Stack

### Backend
- Node.js & Express.js
- TypeScript
- MongoDB with Mongoose ODM
- JWT Authentication
- Express Validator
- Helmet.js for security

### Frontend
- React 18 with TypeScript
- Vite for fast development
- Tailwind CSS & shadcn/ui components
- React Query for data fetching
- React Hook Form with Zod validation

## Getting Started

### Prerequisites
- Node.js 16+ and npm
- MongoDB database (local or cloud)
- Git

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/farm-savvy.git
cd farm-savvy
```

2. Install backend dependencies:
```bash
cd farm-savvy-backend
npm install
```

3. Install frontend dependencies:
```bash
cd ../farm-savvy-connect
npm install
```

### Configuration

1. Backend configuration:
   - Copy `.env.example` to `.env` in the backend directory
   - Update the following variables:
     ```
     MONGODB_URI=mongodb://localhost:27017/farm-savvy
     JWT_SECRET=your-secret-key-here
     PORT=5000
     CORS_ORIGIN=http://localhost:8080
     ```

2. Frontend configuration:
   - The frontend is pre-configured to connect to `http://localhost:5000`
   - Update API URL in environment variables if needed

### Running the Application

1. Start the backend server:
```bash
cd farm-savvy-backend
npm run dev
```

2. In a new terminal, start the frontend:
```bash
cd farm-savvy-connect
npm run dev
```

3. Access the application at `http://localhost:8080`

## Development

### Backend Development
```bash
cd farm-savvy-backend
npm run dev          # Start with hot-reload
npm run build        # Build TypeScript
npm run start:prod   # Production mode
npm run lint         # Type checking
```

### Frontend Development
```bash
cd farm-savvy-connect
npm run dev          # Start dev server
npm run build        # Production build
npm run lint         # Run ESLint
npm run preview      # Preview production build
```

## API Documentation

### Authentication Endpoints
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile (protected)
- `PUT /api/auth/profile` - Update user profile (protected)

### Protected Endpoints (require authentication)
- `/api/farms` - Farm CRUD operations
- `/api/animals` - Animal management
- `/api/tasks` - Task management
- `/api/weather` - Weather data
- `/api/users` - User management (admin only)

## Project Architecture

### Backend Architecture
- **MVC Pattern**: Controllers handle requests, models define data structure
- **Middleware**: Authentication, validation, error handling
- **Security**: Helmet.js, CORS, rate limiting, bcrypt password hashing
- **Database**: MongoDB with Mongoose for ODM

### Frontend Architecture
- **Component-Based**: Reusable UI components with shadcn/ui
- **State Management**: React Query for server state
- **Routing**: React Router for navigation
- **Forms**: React Hook Form with Zod validation

## Security Features

- JWT token-based authentication
- Password hashing with bcrypt
- Rate limiting to prevent abuse
- CORS configuration
- Input validation and sanitization
- Role-based access control (RBAC)

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support, email support@farmsavvy.com or open an issue in the GitHub repository.

## Roadmap

- [ ] Real-time notifications with WebSockets
- [ ] Mobile application (React Native)
- [ ] Advanced analytics and reporting
- [ ] IoT sensor integration
- [ ] Automated inventory management
- [ ] Financial tracking and budgeting
- [ ] Equipment maintenance scheduling
- [ ] Crop management module
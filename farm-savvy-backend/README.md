# Farm Savvy Backend

REST API backend for the Farm Savvy farm management application built with Node.js, Express, TypeScript, and MongoDB.

## Quick Start

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your configuration

# Run in development mode
npm run dev

# Build and run in production
npm run build
npm run start:prod
```

## Environment Variables

Create a `.env` file in the root directory:

```env
# MongoDB Connection
MONGODB_URI=mongodb://localhost:27017/farm-savvy

# JWT Configuration
JWT_SECRET=your-secret-key-here
JWT_EXPIRES_IN=30d

# Server Configuration
PORT=5000
NODE_ENV=development

# CORS Configuration
CORS_ORIGIN=http://localhost:8080

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX=100
```

## Available Scripts

- `npm run dev` - Start development server with hot-reload
- `npm run build` - Build TypeScript to JavaScript
- `npm run start:prod` - Start production server
- `npm run lint` - Run TypeScript type checking
- `npm start` - Start server (requires build)


## API Endpoints

### Authentication
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/auth/register` | Register new user | No |
| POST | `/api/auth/login` | User login | No |
| GET | `/api/auth/profile` | Get current user profile | Yes |
| PUT | `/api/auth/profile` | Update user profile | Yes |
| DELETE | `/api/auth/users/:id` | Delete user (admin only) | Yes |

### Farms
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/farms` | Get all user's farms | Yes |
| GET | `/api/farms/:id` | Get specific farm | Yes |
| POST | `/api/farms` | Create new farm | Yes |
| PUT | `/api/farms/:id` | Update farm | Yes |
| DELETE | `/api/farms/:id` | Delete farm | Yes |

### Animals
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/animals` | Get all animals | Yes |
| GET | `/api/animals/:id` | Get specific animal | Yes |
| POST | `/api/animals` | Add new animal | Yes |
| PUT | `/api/animals/:id` | Update animal | Yes |
| DELETE | `/api/animals/:id` | Remove animal | Yes |

### Tasks
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/tasks` | Get all tasks | Yes |
| GET | `/api/tasks/:id` | Get specific task | Yes |
| POST | `/api/tasks` | Create new task | Yes |
| PUT | `/api/tasks/:id` | Update task | Yes |
| DELETE | `/api/tasks/:id` | Delete task | Yes |

## Project Structure

```
src/
├── config/
│   └── database.ts      # MongoDB connection setup
├── models/
│   ├── User.ts          # User schema with auth methods
│   ├── Farm.ts          # Farm schema with geospatial indexing
│   ├── Animal.ts        # Animal tracking schema
│   └── Task.ts          # Task management schema
├── controllers/
│   ├── authController.ts # Authentication logic
│   └── ...              # Other controllers
├── middleware/
│   ├── auth.ts          # JWT authentication middleware
│   ├── validate.ts      # Request validation middleware
│   └── errorHandler.ts  # Global error handling
├── routes/
│   ├── authRoutes.ts    # Authentication routes
│   └── ...              # Other route definitions
├── types/
│   └── index.ts         # TypeScript type definitions
├── app.ts               # Express app configuration
└── server.ts            # Server entry point
```

## Authentication

The API uses JWT (JSON Web Tokens) for authentication. Include the token in the Authorization header:

```
Authorization: Bearer <token>
```

### User Roles
- **Admin**: Full system access, can manage all farms and users
- **Manager**: Can manage assigned farms, animals, and tasks
- **Worker**: Can view assigned farms and complete tasks

## Data Models

### User
```typescript
{
  name: string
  email: string (unique)
  password: string (hashed)
  role: 'admin' | 'manager' | 'worker'
  farms: Farm[] (references)
  createdAt: Date
}
```

### Farm
```typescript
{
  name: string
  address: string
  size: number (in acres)
  type: 'crop' | 'livestock' | 'mixed'
  location: {
    type: 'Point'
    coordinates: [longitude, latitude]
  }
  owner: User (reference)
  managers: User[] (references)
  workers: User[] (references)
  createdAt: Date
}
```

### Animal
```typescript
{
  tagNumber: string (unique)
  name: string
  species: 'cattle' | 'sheep' | 'goats' | 'pigs' | 'chickens'
  breed: string
  dateOfBirth: Date
  gender: 'male' | 'female'
  farm: Farm (reference)
  healthRecords: [{
    date: Date
    type: string
    description: string
    veterinarian: string
  }]
  status: 'active' | 'sold' | 'deceased'
}
```

### Task
```typescript
{
  title: string
  description: string
  farm: Farm (reference)
  assignedTo: User[] (references)
  priority: 'low' | 'medium' | 'high'
  status: 'pending' | 'in-progress' | 'completed'
  dueDate: Date
  completedAt: Date
  createdBy: User (reference)
}
```

## Security Features

- **Password Hashing**: bcrypt with salt rounds
- **JWT Authentication**: Secure token-based auth
- **Rate Limiting**: Prevents brute force attacks
- **Helmet.js**: Sets security headers
- **CORS**: Configured for frontend origin
- **Input Validation**: express-validator for all inputs
- **MongoDB Injection Prevention**: Mongoose sanitization

## Error Handling

All errors follow a consistent format:

```json
{
  "success": false,
  "error": "Error message here"
}
```

HTTP Status Codes:
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `422` - Validation Error
- `500` - Server Error

## Development Tips

1. **Database Seeding**: Use MongoDB Compass or scripts to seed test data
2. **API Testing**: Use Postman or Thunder Client for testing endpoints
3. **Debugging**: Set `DEBUG=farm-savvy:*` environment variable
4. **TypeScript**: Run `npm run lint` frequently to catch type errors

## Testing

Currently, no test suite is configured. Recommended setup:
- Jest for unit testing
- Supertest for API integration testing
- MongoDB Memory Server for database testing

## Deployment

1. Build the project: `npm run build`
2. Set production environment variables
3. Use PM2 or similar for process management
4. Configure reverse proxy (Nginx/Apache)
5. Set up SSL certificate
6. Enable MongoDB authentication

## Contributing

1. Create feature branch from `main`
2. Follow TypeScript strict mode guidelines
3. Ensure all endpoints have validation
4. Update API documentation
5. Test thoroughly before PR

## License

MIT License - see LICENSE file for details
# Farm Savvy Connect

Modern React frontend for the Farm Savvy farm management application built with Vite, TypeScript, and Tailwind CSS.

## Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Available Scripts

- `npm run dev` - Start Vite development server (port 8080)
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build locally
- `npm run type-check` - Run TypeScript type checking

## Tech Stack

- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - Reusable component library
- **React Router** - Client-side routing
- **React Query** - Server state management
- **React Hook Form** - Form handling
- **Zod** - Schema validation

## Project Structure

```
src/
├── components/
│   ├── ui/              # shadcn/ui components (50+ components)
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── dialog.tsx
│   │   └── ...
│   └── dashboard/       # Dashboard-specific components
│       ├── Overview.tsx
│       ├── Stats.tsx
│       └── ...
├── pages/               # Route components
│   ├── Dashboard.tsx
│   ├── Login.tsx
│   ├── Register.tsx
│   └── ...
├── hooks/               # Custom React hooks
│   ├── useAuth.ts
│   ├── useFarms.ts
│   └── ...
├── lib/
│   ├── api.ts          # API client setup
│   ├── utils.ts        # Utility functions
│   └── cn.ts           # Class name helper
├── types/              # TypeScript type definitions
├── App.tsx             # Root component
└── main.tsx            # Entry point
```

## Features

### UI Components (shadcn/ui)
- **Layout**: Sidebar, Header, Navigation
- **Forms**: Input, Select, Checkbox, Radio, DatePicker
- **Feedback**: Alert, Toast, Dialog, Popover
- **Data Display**: Table, Card, Badge, Avatar
- **Navigation**: Tabs, Breadcrumb, Pagination
- **Actions**: Button, Dropdown, Context Menu

### Application Features
- **Authentication**: Login/Register with JWT
- **Dashboard**: Overview statistics and charts
- **Farm Management**: CRUD operations for farms
- **Animal Tracking**: Livestock management interface
- **Task Management**: Create and assign tasks
- **Responsive Design**: Mobile-first approach

## Development

### Environment Setup
The frontend is configured to connect to the backend API at `http://localhost:5000`. To change this:

1. Create a `.env` file:
```env
VITE_API_URL=http://localhost:5000
```

2. Update the API configuration in `src/lib/api.ts`

### Styling
- Uses Tailwind CSS for utility classes
- Custom theme configuration in `tailwind.config.js`
- CSS variables for theming in `src/styles/globals.css`
- Component styling follows shadcn/ui patterns

### State Management
- **Server State**: React Query for API data caching
- **Client State**: React Context for auth and UI state
- **Form State**: React Hook Form with Zod validation

### Routing
React Router v6 with protected routes:
```typescript
- /             # Landing page
- /login        # Login page
- /register     # Registration page
- /dashboard    # Protected dashboard
- /farms        # Farm management
- /animals      # Animal tracking
- /tasks        # Task management
```

## API Integration

### Authentication
Include JWT token in request headers:
```typescript
headers: {
  'Authorization': `Bearer ${token}`,
  'Content-Type': 'application/json'
}
```

### Error Handling
All API errors are handled consistently:
```typescript
try {
  const response = await api.get('/farms');
  // Handle success
} catch (error) {
  // Display error toast/notification
}
```

## Building for Production

1. Build the application:
```bash
npm run build
```

2. The build output will be in the `dist/` directory

3. Serve with any static file server:
```bash
npm run preview  # Local preview
# or deploy to Vercel, Netlify, etc.
```

## Code Quality

### ESLint Configuration
- Based on React and TypeScript recommended rules
- Custom rules for consistency
- Run `npm run lint` to check for issues

### TypeScript
- Relaxed mode (no strict null checks)
- Path alias: `@/` maps to `src/`
- Type definitions in `src/types/`

## Component Development

### Creating New Components
1. Use existing shadcn/ui components as base
2. Follow the established pattern:
```typescript
import { cn } from "@/lib/utils"

interface ComponentProps {
  className?: string
  // other props
}

export function Component({ className, ...props }: ComponentProps) {
  return (
    <div className={cn("base-classes", className)} {...props}>
      {/* content */}
    </div>
  )
}
```

### Form Components
Use React Hook Form with Zod:
```typescript
const schema = z.object({
  name: z.string().min(1, "Required"),
  email: z.string().email()
})

const form = useForm({
  resolver: zodResolver(schema)
})
```

## Deployment

### Vercel
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Netlify
1. Connect GitHub repository
2. Build command: `npm run build`
3. Publish directory: `dist`

### Docker
```dockerfile
FROM node:18-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
```

## Lovable Integration

This project is integrated with [Lovable](https://lovable.dev/projects/575f2b8e-87b7-44c1-9928-e3a46c9f380a) for AI-assisted development.

- Changes made via Lovable are automatically committed to the repository
- You can edit code locally and push changes, which will be reflected in Lovable
- Use Lovable's Share -> Publish feature for quick deployments

## Troubleshooting

### Common Issues
1. **API Connection Failed**: Check backend is running on port 5000
2. **CORS Errors**: Ensure backend CORS allows frontend origin
3. **Build Errors**: Clear node_modules and reinstall
4. **TypeScript Errors**: Run `npm run type-check` to identify issues

### Debug Mode
Enable React Query devtools in development:
```typescript
import { ReactQueryDevtools } from 'react-query/devtools'
```

## Contributing

1. Follow existing code patterns
2. Use shadcn/ui components when possible
3. Ensure responsive design
4. Test on multiple browsers
5. Run linter before committing

## License

MIT License - see LICENSE file for details
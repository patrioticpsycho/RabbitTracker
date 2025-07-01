# Rabbit Management System

## Overview

This is a comprehensive rabbit management application built with React (frontend) and Express.js (backend), designed for tracking rabbit breeding, health records, expenses, and genealogy. The system provides a mobile-first interface optimized for rabbit breeders to manage their operations efficiently.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: TanStack Query (React Query) for server state management
- **UI Framework**: Radix UI components with Tailwind CSS styling
- **Form Handling**: React Hook Form with Zod validation
- **Build Tool**: Vite for fast development and optimized builds

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **Database Provider**: Neon Database (serverless PostgreSQL)
- **API Design**: RESTful API with JSON responses
- **Development Server**: TSX for TypeScript execution
- **Production Build**: ESBuild for server bundling

### Mobile-First Design
- Responsive layout optimized for mobile devices
- Bottom navigation for easy thumb navigation
- Floating action buttons for quick access to common actions
- Touch-friendly UI components

## Key Components

### Data Models
1. **Rabbits**: Core entity tracking individual rabbits with breeding status, health info, and genealogy
2. **Breeding Records**: Mating tracking, kindle dates, and litter management
3. **Offspring**: Individual kit tracking from birth to weaning/sale
4. **Expenses**: Categorized expense tracking (feed, veterinary, equipment, supplies)
5. **Butcher Records**: Processing records for meat production

### Core Features
- **Dashboard**: Overview of key metrics and recent activity
- **Rabbit Management**: Add, edit, and track individual rabbits
- **Breeding Tracking**: Manage breeding cycles, kindle dates, and litter outcomes
- **Expense Management**: Track and categorize all operation expenses
- **Records System**: Comprehensive offspring and butcher record keeping
- **Genealogy Tracking**: Parent-child relationships for breeding decisions

### UI Components
- **Cards**: Consistent card-based layout for data display
- **Forms**: Validated forms for data entry with error handling
- **Navigation**: Bottom navigation with sheet-based "More" menu
- **Responsive Layout**: Mobile-optimized with maximum 400px container width

## Data Flow

### Client-Server Communication
1. **API Requests**: Frontend uses TanStack Query for data fetching and caching
2. **Real-time Updates**: Optimistic updates with automatic cache invalidation
3. **Error Handling**: Comprehensive error handling with user-friendly messages
4. **Data Validation**: Zod schemas shared between frontend and backend

### State Management
- Server state managed by TanStack Query with automatic caching
- Form state handled by React Hook Form
- UI state managed with React hooks
- Global toast notifications for user feedback

## External Dependencies

### Database
- **Neon Database**: Serverless PostgreSQL for production
- **Drizzle ORM**: Type-safe database operations with migration support
- **Connection Pooling**: Built-in connection management

### UI Libraries
- **Radix UI**: Accessible, unstyled UI components
- **Tailwind CSS**: Utility-first CSS framework
- **Lucide Icons**: Modern icon library
- **React Icons**: Additional icon sets (Font Awesome)

### Development Tools
- **TypeScript**: Type safety across the entire stack
- **ESLint/Prettier**: Code quality and formatting
- **Vite**: Fast development server and build tool
- **TSX**: TypeScript execution for server development

## Deployment Strategy

### Development
- **Frontend**: Vite dev server with HMR
- **Backend**: TSX with automatic restarts
- **Database**: Environment-based connection string

### Production Build
- **Frontend**: Static assets built with Vite
- **Backend**: Single bundled file with ESBuild
- **Database**: Connection via DATABASE_URL environment variable
- **Serving**: Express serves both API and static frontend files

### Environment Configuration
- Development and production configurations
- Environment variables for database connections
- Replit-specific optimizations and error handling

## Changelog
- July 01, 2025. Initial setup
- July 01, 2025. Fixed SelectItem component errors across all forms by replacing empty string values with "none" values and updating handlers accordingly. All CRUD operations now working properly.
- July 01, 2025. Added photo upload functionality for individual rabbits including schema updates, multer integration, and UI components for photo preview and upload.
- July 01, 2025. Enhanced breeding workflow with pre-fill functionality - breed button now navigates to breeding page with selected rabbit automatically filled in mother/father field based on gender.
- July 01, 2025. Implemented PWA (Progressive Web App) functionality including manifest.json, service worker, app icons, and mobile optimizations to enable installation as a mobile app.
- July 01, 2025. Fixed TypeScript compilation errors preventing app startup and successfully implemented Settings page with appearance controls, notification settings, data management options, and app information display.

## User Preferences

Preferred communication style: Simple, everyday language.
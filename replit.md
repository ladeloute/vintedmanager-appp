# VintedManager - AI-Powered Vinted Sales Management Application

## Overview

VintedManager is a comprehensive web application designed to help users manage their Vinted sales with AI assistance. The application provides automated description generation, customer response suggestions, article management, and sales analytics. Built with a modern tech stack, it features a React frontend with TypeScript, Express.js backend, PostgreSQL database with Drizzle ORM, and Google Gemini AI integration.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
The client-side is built using **React 18** with **TypeScript** and follows a component-based architecture:
- **UI Framework**: shadcn/ui components with Radix UI primitives for accessibility
- **Styling**: Tailwind CSS with custom design system variables
- **State Management**: React Query (TanStack Query) for server state management
- **Routing**: Single-page application with tab-based navigation
- **Build Tool**: Vite for fast development and optimized production builds

### Backend Architecture
The server uses **Express.js** with TypeScript in ESM format:
- **API Design**: RESTful API with organized route handlers
- **File Upload**: Multer middleware for image handling
- **Error Handling**: Centralized error handling middleware
- **Development**: Hot reloading with tsx and Vite integration

### Database Architecture
**PostgreSQL** database managed through **Drizzle ORM**:
- **Schema**: Type-safe database schema definitions
- **Connection**: Neon serverless PostgreSQL with connection pooling
- **Migrations**: Drizzle Kit for database schema management
- **Tables**: Articles, sales, and conversations with proper relationships

## Key Components

### 1. AI Description Generator
- **Purpose**: Generate compelling Vinted listings using product images and details
- **Input**: Image upload, price, size, brand, optional comments
- **AI Integration**: Google Gemini 2.5 Pro for image analysis and text generation
- **Output**: Styled title and detailed description with hashtags

### 2. Customer Response Assistant
- **Purpose**: Generate professional responses to customer inquiries
- **AI Integration**: Google Gemini for contextual response generation
- **Output**: Three response options with copy functionality
- **Features**: Regeneration capability and emoji integration

### 3. Article Management System
- **CRUD Operations**: Create, read, update, delete articles
- **Status Tracking**: "vendu" (sold), "non-vendu" (not sold), "en-attente" (pending)
- **Image Storage**: Local file system with organized uploads directory
- **Search & Filter**: By brand, status, and text search
- **Pagination**: Efficient data loading for large inventories

### 4. Dashboard Analytics
- **Sales Metrics**: Monthly and total sales tracking
- **Revenue Analysis**: Monthly revenue and coefficient calculations
- **Data Visualization**: Charts using Recharts library
- **Statistics**: Real-time dashboard with key performance indicators

## Data Flow

### Article Creation Flow
1. User uploads image and enters article details
2. Form validation using Zod schemas
3. Multer processes image upload to local storage
4. Data stored in PostgreSQL via Drizzle ORM
5. Real-time UI updates through React Query cache invalidation

### AI Generation Flow
1. Image converted to base64 encoding
2. Prompt constructed with user-provided details
3. Google Gemini API processes image and text
4. Structured JSON response parsed and displayed
5. Copy-to-clipboard functionality for easy Vinted posting

### Data Persistence
- **Articles**: Core product information with generated content
- **Sales**: Transaction records linked to articles
- **Conversations**: Customer message history with AI responses
- **File Storage**: Images stored locally with URL references

## External Dependencies

### AI Services
- **Google Gemini**: Primary AI service for content generation
- **API Configuration**: Environment-based API key management
- **Rate Limiting**: Built-in request management

### Database & Storage
- **Neon PostgreSQL**: Serverless PostgreSQL hosting
- **Connection Pooling**: Efficient database connection management
- **File System**: Local image storage with organized directory structure

### UI Libraries
- **Radix UI**: Accessible component primitives
- **Tailwind CSS**: Utility-first styling framework
- **Lucide React**: Consistent icon system
- **Recharts**: Data visualization components

### Development Tools
- **TypeScript**: Type safety across frontend and backend
- **Vite**: Fast build tool with HMR
- **ESBuild**: Production bundling for backend
- **Drizzle Kit**: Database schema management

## Deployment Strategy

### Development Environment
- **Frontend**: Vite dev server with hot module replacement
- **Backend**: tsx with watch mode for automatic restarts
- **Database**: Drizzle push for schema synchronization
- **Assets**: Static file serving for uploaded images

### Production Build
- **Frontend**: Vite build with optimized bundling
- **Backend**: ESBuild compilation to ESM format
- **Static Assets**: Express static middleware for file serving
- **Environment**: NODE_ENV-based configuration

### Configuration Management
- **Environment Variables**: DATABASE_URL, GEMINI_API_KEY
- **Path Aliases**: TypeScript path mapping for clean imports
- **Build Optimization**: Separate client and server builds

The application is designed to be scalable and maintainable, with clear separation of concerns, type safety throughout, and modern development practices. The architecture supports both development and production environments with appropriate tooling for each stage.

## Recent Changes (January 2025)

### Dashboard Statistics Integration
- **Real-time Statistics**: Dashboard now displays live data from the articles database
- **Comprehensive Metrics**: Shows total articles, monthly/total sold items, monthly/total revenue, and average price
- **Auto-refresh**: Dashboard stats refresh every 30 seconds and update automatically on article changes
- **Status Management**: Added "Mark as Sold" functionality directly from article management
- **Cache Synchronization**: All article operations (create, update, delete, sell) automatically refresh dashboard stats

### Enhanced Article Management
- **Quick Status Updates**: One-click button to mark articles as sold
- **Visual Status Indicators**: Color-coded badges for sold/unsold/pending status
- **Improved Data Flow**: FormData handling fixed for reliable article creation with images
- **Real-time Updates**: Article changes immediately reflect in dashboard statistics

### Data Architecture Improvements
- **Unified Statistics**: All dashboard metrics calculated from articles table using SQL aggregations
- **Monthly Tracking**: Smart monthly calculations based on article update timestamps
- **Revenue Calculations**: Automatic price aggregation for sold items
- **Type Safety**: Enhanced TypeScript interfaces for dashboard statistics
# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a JTBD (Jobs-to-be-Done) Builder application using TanStack Start - a full-stack React framework with file-based routing and server functions.

### Product Purpose
The JTBD Builder is a tool for storing and visualizing Jobs-to-be-Done scenarios with subsequent application for:
- Strategic analysis
- Customer feedback analysis
- Task documentation and prioritization

### Target Users
- **Primary Users**: Product managers working on IT product development
- **Work Style**: Primarily individual work with occasional team material sharing
- **Use Cases**: Personal JTBD analysis with selective team collaboration

### JTBD Methodology
- **Initial Approach**: Classic Job Story format ("When I [situation], I want to [motivation], so I can [expected outcome]")
- **Data Model**: To be defined during development based on user needs and feedback

### UI/UX Design
- **Design Style**: Minimalistic/clean design approach
- **Component Library**: shadcn/ui components
- **Target Experience**: Clean, focused interface for product managers

### Technical Requirements
- **Project Type**: Open-source solution
- **Deployment**: Single Docker container with one process
- **Data Storage**: SQLite database on server
- **ORM**: Drizzle ORM for database access
- **Architecture**: Self-contained application for easy deployment

### Development Standards
- **Code Quality**: High standards with self-documenting code
- **Naming**: Clear, descriptive variable and method names that explain purpose
- **Testing**: Comprehensive tests that serve as system documentation
- **Documentation**: Tests should demonstrate how system components work

## Commands

- **Development**: `pnpm start` - Starts the development server on port 3000
- **Build**: `pnpm build` - Builds the application for production
- **Format**: `pnpm fmt` - Formats code using Prettier
- **Package Manager**: Uses `pnpm` (version 10.12.4)

## Architecture

### Framework Stack
- **TanStack Start**: Full-stack React framework with SSR/SSG capabilities
- **TanStack Router**: File-based routing with type-safe navigation
- **Vite**: Build tool and development server
- **TypeScript**: Type-safe JavaScript with React JSX support

### Project Structure
- `src/routes/`: File-based routing directory
  - `__root.tsx`: Root layout component with HTML document structure
  - `index.tsx`: Home page route with server functions
- `src/routeTree.gen.ts`: Auto-generated route tree (do not modify)
- `src/router.tsx`: Router configuration and type declarations

### Key Patterns
- **Server Functions**: Use `createServerFn()` for server-side operations (see `src/routes/index.tsx`)
- **Route Components**: Export `Route` using `createFileRoute()` or `createRootRoute()`
- **Type Safety**: Router types are auto-generated and globally registered
- **SSR-Ready**: Components render on both server and client

### Development Notes
- Route tree is auto-generated - don't edit `routeTree.gen.ts`
- Server functions handle both GET and POST methods with validation
- Router invalidation is used to refresh data after mutations
- Uses React 19 with modern patterns
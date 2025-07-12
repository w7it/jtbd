# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a JTBD (Jobs-to-be-Done) Builder application using TanStack Start - a full-stack React framework with file-based routing and server functions.

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
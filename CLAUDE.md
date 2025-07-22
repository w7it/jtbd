# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a JTBD (Jobs-to-be-Done) Builder application using TanStack Start - a full-stack React framework with file-based routing and server functions.

### Product Purpose

The JTBD Builder is a platform for working with JTBD graphs during customer development interviews. Product managers create job graphs of respondents during interviews to understand their workflow and motivations.

### Target Users

- **Primary Users**: Product managers conducting customer development interviews
- **Work Style**: Real-time job mapping during interviews
- **Use Cases**: Creating and visualizing respondent job graphs to understand customer workflows

### JTBD Methodology

The platform uses a structured approach to map jobs with the following aspects:

#### Job Structure

Each job consists of:

1. **When** - Context/emotions/experience/trigger
2. **Want** - Job name (clear expected outcome)
3. **So that** - Higher-level job name
4. **Solution** - Current solution used to perform this job
5. **Additional aspects** - Satisfaction level, importance, problems with current solution

#### Job Connection Algorithm

Jobs are connected using this methodology:

- **Higher-level jobs**: Discovered by asking "So that what?" about the current job
- **Sub-jobs**: Found by asking "What did you do to achieve [job's expected outcome]?" which returns a list of actions
- For each action, ask "What result did you want to achieve?" to identify the underlying job

### Interview and Job Graph Creation Process

- Product managers create job graphs tailored to specific respondents during interviews
- Interview time constraints mean graphs are often partial and focus on specific areas of interest
- After multiple interviews, an aggregated job graph can be compiled, representing collective insights from individual respondent interviews
- **Aggregated Graph Versioning**:
  - The aggregated graph supports versioning to track its evolution over time
  - Aggregation is manual, with a manager adding graphs from new interviews
  - Managers can edit job names and link jobs by name to existing jobs in the aggregated graph
  - The aggregated graph always allows viewing the original respondent's job graph with its specific details

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
- **React Components**: Separate logic from markup using smart (container) and dumb (presentational) components pattern

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

### Product Design Details

- **Graph Versioning**:
  - A new version of the aggregated graph is explicitly added by pressing the Save button
  - Auto-saving of draft is implemented in the local state (enabling offline work)
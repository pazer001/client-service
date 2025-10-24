# Cursor Rules for Client-Service

This directory contains Cursor AI rules that guide code generation and maintain consistency across the project.

## 📋 Available Rules

### Always Applied Rules

These rules apply to every request:

1. **[01-project-architecture.mdc](mdc:01-project-architecture.mdc)** - Project structure, tech stack, and key configuration
2. **[07-code-quality.mdc](mdc:07-code-quality.mdc)** - Code quality standards, DRY/KISS principles, error handling
3. **[08-file-organization.mdc](mdc:08-file-organization.mdc)** - File and folder organization patterns

### File-Type Specific Rules

These rules apply based on file extensions:

4. **[02-typescript-conventions.mdc](mdc:02-typescript-conventions.mdc)** - TypeScript naming, strict typing, import patterns  
   _Applies to: `_.ts`, `_.tsx`_

5. **[03-react-components.mdc](mdc:03-react-components.mdc)** - React patterns, hooks, component structure  
   _Applies to: `_.tsx`\*

6. **[05-mui-styling.mdc](mdc:05-mui-styling.mdc)** - Material-UI styling with styled components and sx prop  
   _Applies to: `_.tsx`, `_.ts`_

### Feature-Specific Rules

These rules apply to specific directories or patterns:

7. **[04-zustand-state-management.mdc](mdc:04-zustand-state-management.mdc)** - Zustand store patterns and middleware  
   _Applies to: `\*\*/stores/_.ts`\*

8. **[06-api-patterns.mdc](mdc:06-api-patterns.mdc)** - Axios configuration, API calls, error handling  
   _Applies to: `\*\*/axios/_.ts`, `\*_/stores/_.ts`\*

## 🎯 Quick Reference

### Tech Stack

- React 19 + TypeScript 5.9
- Vite 7
- Material-UI v7
- Zustand v5
- Axios + ECharts

### Key Patterns

**TypeScript:**

- Interfaces prefixed with `I`: `ISymbolItem`
- Enums prefixed with `E`: `EAction`
- Types prefixed with `T`: `TWatchlistSource`
- Always include `.ts`/`.tsx` in imports
- Strict mode enabled, no `any` types

**React:**

- Functional components only
- PascalCase for components
- Zustand hooks for global state
- MUI styled components for styling

**State Management:**

- Actions nested under `actions` key
- Export individual selector hooks
- Persist middleware only in development
- Separate `.types.ts` files for complex types

**Code Quality:**

- Self-documenting code with descriptive names
- Comments explain "why", not "what"
- Never silently swallow errors
- Extract magic numbers to constants
- Production-ready code only

## 🔧 Usage

Cursor AI automatically applies these rules based on:

1. **alwaysApply: true** - Applied to every request
2. **globs** - Applied when working with matching file patterns
3. **description** - Can be manually invoked or discovered by AI

## 📝 Modifying Rules

To modify a rule:

1. Edit the `.mdc` file directly
2. Cursor AI will automatically use the updated rules
3. Changes take effect immediately

To add a new rule:

1. Create a new `.mdc` file in this directory
2. Add frontmatter with appropriate metadata
3. Follow the existing format and structure

## 🔗 Key Files Referenced

- [package.json](mdc:../package.json)
- [vite.config.ts](mdc:../vite.config.ts)
- [tsconfig.app.json](mdc:../tsconfig.app.json)
- [eslint.config.js](mdc:../eslint.config.js)
- [src/stores/symbataStore.ts](mdc:../src/stores/symbataStore.ts)
- [src/App.tsx](mdc:../src/App.tsx)

---

_Last Updated: October 24, 2025_

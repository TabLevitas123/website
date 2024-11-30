# SnipeAI.io Project Cleanup Guide

## Files to Keep (Most Recent Versions)
1. Component Files:
- navigation-component.tsx
- welcome-component.tsx
- token-info-components.tsx
- snipenomics-component.tsx
- platform-container.tsx
- platform-feature.tsx
- roadmap-component.tsx
- team-container.tsx (latest version with error boundary)
- team-member.tsx
- team-bio.tsx
- team-stats.tsx
- mission-container.tsx
- partnerships-container.tsx
- partnership-details.tsx

2. Utility Files:
- color-scheme.js (consolidated version)
- animation-system.js (unified system)
- performance-monitor.tsx

3. Documentation:
- technical-readme.md
- project-checklist.md (latest version)
- requirements.md
- branding-kit.pdf

## Files to Remove (Redundant)
1. Older Versions:
- team-container (older versions)
- duplicate style definitions
- redundant error boundaries
- multiple animation systems

2. Consolidated Files:
- background-controller.tsx (merged into utils)
- cache-strategies.tsx (merged into utils)
- resource-optimizer.tsx (merged into utils)

3. Deprecated Files:
- old checklists
- duplicate documentation
- test components

## Naming Conventions
- Components: PascalCase (e.g., TeamContainer)
- Utilities: camelCase (e.g., colorScheme)
- Constants: UPPER_SNAKE_CASE
- Types/Interfaces: PascalCase with 'I' prefix for interfaces

## Import Structure
Standard order:
1. React imports
2. External libraries
3. Local components
4. Utilities/Helpers
5. Types/Interfaces
6. Assets/Styles

## Project Structure
```
src/
├── components/
│   ├── core/
│   │   └── [core components]
│   ├── shared/
│   │   └── [shared components]
│   └── sections/
│       └── [page sections]
├── utils/
│   └── [consolidated utilities]
├── styles/
│   └── [unified styles]
└── types/
    └── [type definitions]
```

## Next Steps
1. Archive redundant files
2. Update import statements
3. Verify component dependencies
4. Test after cleanup
5. Update documentation
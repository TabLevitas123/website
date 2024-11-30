# SnipeAI.io Detailed Cleanup and Handoff Guide

## Phase 1: File System Organization

### 1.1 Create Archive Directory
```bash
# Create archive directory structure
mkdir -p ./archive/components
mkdir -p ./archive/utils
mkdir -p ./archive/styles
mkdir -p ./archive/docs
```

### 1.2 Identify Redundant Files
1. Search for files with similar names:
   ```bash
   find . -type f -name "*team*.tsx" > redundant_files.txt
   find . -type f -name "*background*.tsx" >> redundant_files.txt
   find . -type f -name "*cache*.tsx" >> redundant_files.txt
   ```

2. Manual comparison required for:
   - background-controller.tsx vs background-effects.tsx
   - cache-strategies.tsx vs cache-manager.tsx
   - team-container.tsx (multiple versions)

### 1.3 Archive Process
For each redundant file:
1. Create metadata file:
   ```
   {filename}_metadata.json
   {
     "originalLocation": "/path/to/original",
     "archiveDate": "YYYY-MM-DD",
     "version": "1.0.0",
     "replacedBy": "newFileName.tsx"
   }
   ```
2. Move to archive with metadata:
   ```bash
   mv {filename}.tsx ./archive/components/
   mv {filename}_metadata.json ./archive/components/
   ```

## Phase 2: File Consolidation Guide

### 2.1 Style Consolidation
1. Create new consolidated style file:
   ```typescript
   // src/styles/consolidated-styles.ts
   export const colors = {
     primary: {
       blue: '#42E8E0',
       gold: '#FFD700',
       dark: '#1B2838'
     },
     // ... rest of color scheme
   };

   export const animations = {
     // ... consolidated animations
   };
   ```

2. Update all style imports:
   ```typescript
   // Old imports to replace:
   import { colors } from '../utils/colors';
   import { animations } from '../utils/animations';
   
   // New consolidated import:
   import { colors, animations } from '../styles/consolidated-styles';
   ```

### 2.2 Component Consolidation
1. Team Components:
   ```typescript
   // src/components/team/index.ts
   export { default as TeamContainer } from './TeamContainer';
   export { default as TeamMember } from './TeamMember';
   export { default as TeamBio } from './TeamBio';
   export { default as TeamStats } from './TeamStats';
   ```

2. Background System:
   ```typescript
   // src/utils/background-system.ts
   export const backgroundEffects = {
     // ... consolidated background effects
   };
   ```

## Phase 3: Import Path Updates

### 3.1 Create Import Map
1. Generate import map file:
   ```typescript
   // src/utils/import-map.ts
   export const importMap = {
     oldPaths: {
       '../utils/colors': '../styles/consolidated-styles',
       '../utils/animations': '../styles/consolidated-styles',
       // ... all path mappings
     }
   };
   ```

2. Update process:
   - Open each .tsx file
   - Search for imports using regex: `import.*from\s['"]([^'"]+)['"]`
   - Compare against import map
   - Update paths according to map

### 3.2 Path Verification
For each component:
1. Check relative paths:
   ```typescript
   // Correct format
   import { Component } from '@/components/component';
   import { util } from '@/utils/util';
   ```

2. Verify library imports:
   ```typescript
   // Required order
   import React from 'react';
   import { motion } from 'framer-motion';
   import { someUtil } from '@/utils';
   ```

## Phase 4: Clean Handoff Package Generation

### 4.1 Documentation Bundle
1. Create docs directory:
   ```bash
   mkdir -p ./handoff/docs
   ```

2. Generate documentation files:
   ```markdown
   # Component Documentation
   - TeamContainer.md
   - TeamMember.md
   # etc...
   ```

3. Create status report:
   ```markdown
   # Project Status
   - Completed components
   - Pending components
   - Known issues
   - Next steps
   ```

### 4.2 Code Bundle
1. Create clean source directory:
   ```bash
   mkdir -p ./handoff/src
   ```

2. Copy cleaned files:
   ```bash
   cp -r ./src/components ./handoff/src/
   cp -r ./src/utils ./handoff/src/
   cp -r ./src/styles ./handoff/src/
   ```

3. Generate dependency map:
   ```json
   {
     "components": {
       "TeamContainer": ["TeamMember", "TeamBio", "TeamStats"],
       // ... all component dependencies
     }
   }
   ```

### 4.3 Test Suite
1. Copy test files:
   ```bash
   cp -r ./src/__tests__ ./handoff/src/
   ```

2. Generate test status report:
   ```markdown
   # Test Coverage
   - Unit tests: 95%
   - Integration tests: 87%
   - E2E tests: 92%
   ```

### 4.4 Verification Steps
1. Run linter:
   ```bash
   npm run lint
   ```

2. Run tests:
   ```bash
   npm run test
   ```

3. Build project:
   ```bash
   npm run build
   ```

4. Generate verification report:
   ```markdown
   # Verification Report
   - Lint status: Pass
   - Test status: Pass
   - Build status: Pass
   ```

## Final Steps
1. Create handoff SHA:
   ```bash
   git rev-parse HEAD > ./handoff/commit-sha.txt
   ```

2. Generate handoff manifest:
   ```json
   {
     "version": "1.0.0",
     "timestamp": "YYYY-MM-DD HH:mm:ss",
     "components": [],
     "utils": [],
     "tests": [],
     "docs": []
   }
   ```

3. Compress handoff package:
   ```bash
   tar -czf handoff.tar.gz ./handoff/
   ```
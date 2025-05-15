# Path Alias Migration Guide

## Current Structure

Your project has been configured with the following path aliases in `tsconfig.json`:

```json
"paths": {
  "@/*": ["./*"],
  "@app/*": ["./app/*"],
  "@lib/*": ["./lib/*"],
  "@store/*": ["./store/*"],
  "@rules/*": ["./rules/*"],
  "@ai/*": ["./ai/*"],
  "@tests/*": ["./__tests__/*"],
  "@components/*": ["./components/*"]
}
```

## Migration Strategy

### 1. Update imports using search and replace

For each type of import pattern, you'll need to perform a search and replace operation:

#### Old Style to New Style

1. Replace `from '@/lib/` with `from '@lib/`
2. Replace `from '@/components/` with `from '@components/`
3. Replace `from '@/store/` with `from '@store/`
4. Replace `from '@/rules/` with `from '@rules/`
5. Replace `from '@/app/` with `from '@app/`
6. Replace `from '@/hooks/` with `from '@hooks/`
7. Replace `from '@/__tests__/` with `from '@tests/`
8. Replace `from '@/ai/` with `from '@ai/`

### 2. Update relative imports

For each directory, find relative imports and replace them with path aliases:

#### Rules Directory
- Replace `from '../types'` with `from '@rules/types'`
- Replace `from './spells'` with `from '@rules/spells'`
- Replace `from './combat/attackRoll'` with `from '@rules/combat/attackRoll'`

#### Components Directory
- Replace `from '../components/` with `from '@components/`
- Replace `from '../lib/` with `from '@lib/`

### 3. Command for global search

You can use this grep command to find all import patterns that need to be updated:

```bash
grep -r "from '\.\./\|from '\./\|from '@/" --include="*.ts" --include="*.tsx" .
```

## Implementation Steps

1. **Update path aliases in vitest.config.ts** ✅
2. **Update import patterns** - Use IDE global search and replace
3. **Test and verify** - Ensure the application runs correctly after changes

## Benefits

- Cleaner imports
- Easier refactoring
- Better readability
- Reduced errors from path traversal
- Consistency across the codebase 
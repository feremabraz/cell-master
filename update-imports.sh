#!/bin/bash
# Script to update imports in the codebase to use path aliases

# Convert @/ pattern to the new subpath aliases
find . -type f \( -name "*.ts" -o -name "*.tsx" \) -not -path "./node_modules/*" -not -path "./.git/*" -exec sed -i 's/from '\''@\/lib\//from '\''@lib\//g' {} \;
find . -type f \( -name "*.ts" -o -name "*.tsx" \) -not -path "./node_modules/*" -not -path "./.git/*" -exec sed -i 's/from '\''@\/components\//from '\''@components\//g' {} \;
find . -type f \( -name "*.ts" -o -name "*.tsx" \) -not -path "./node_modules/*" -not -path "./.git/*" -exec sed -i 's/from '\''@\/store\//from '\''@store\//g' {} \;
find . -type f \( -name "*.ts" -o -name "*.tsx" \) -not -path "./node_modules/*" -not -path "./.git/*" -exec sed -i 's/from '\''@\/rules\//from '\''@rules\//g' {} \;
find . -type f \( -name "*.ts" -o -name "*.tsx" \) -not -path "./node_modules/*" -not -path "./.git/*" -exec sed -i 's/from '\''@\/app\//from '\''@app\//g' {} \;
find . -type f \( -name "*.ts" -o -name "*.tsx" \) -not -path "./node_modules/*" -not -path "./.git/*" -exec sed -i 's/from '\''@\/hooks\//from '\''@hooks\//g' {} \;
find . -type f \( -name "*.ts" -o -name "*.tsx" \) -not -path "./node_modules/*" -not -path "./.git/*" -exec sed -i 's/from '\''@\/__tests__\//from '\''@tests\//g' {} \;
find . -type f \( -name "*.ts" -o -name "*.tsx" \) -not -path "./node_modules/*" -not -path "./.git/*" -exec sed -i 's/from '\''@\/ai\//from '\''@ai\//g' {} \;

# Update rules directory imports
find ./rules -type f \( -name "*.ts" -o -name "*.tsx" \) -exec sed -i 's/from '\''\.\.\/types'\''/from '\''@rules\/types'\''/g' {} \;
find ./rules -type f \( -name "*.ts" -o -name "*.tsx" \) -exec sed -i 's/from '\''\.\/spells'\''/from '\''@rules\/spells'\''/g' {} \;
find ./rules -type f \( -name "*.ts" -o -name "*.tsx" \) -exec sed -i 's/from '\''\.\/dice'\''/from '\''@rules\/dice'\''/g' {} \;
find ./rules -type f \( -name "*.ts" -o -name "*.tsx" \) -exec sed -i 's/from '\''\.\/types'\''/from '\''@rules\/types'\''/g' {} \;

# Update combat directory imports
find ./rules/combat -type f \( -name "*.ts" -o -name "*.tsx" \) -exec sed -i 's/from '\''\.\/attackRoll'\''/from '\''@rules\/combat\/attackRoll'\''/g' {} \;
find ./rules/combat -type f \( -name "*.ts" -o -name "*.tsx" \) -exec sed -i 's/from '\''\.\/damage'\''/from '\''@rules\/combat\/damage'\''/g' {} \;
find ./rules/combat -type f \( -name "*.ts" -o -name "*.tsx" \) -exec sed -i 's/from '\''\.\/weaponVsArmor'\''/from '\''@rules\/combat\/weaponVsArmor'\''/g' {} \;
find ./rules/combat -type f \( -name "*.ts" -o -name "*.tsx" \) -exec sed -i 's/from '\''\.\/proficiency'\''/from '\''@rules\/combat\/proficiency'\''/g' {} \;
find ./rules/combat -type f \( -name "*.ts" -o -name "*.tsx" \) -exec sed -i 's/from '\''\.\/initiative'\''/from '\''@rules\/combat\/initiative'\''/g' {} \;
find ./rules/combat -type f \( -name "*.ts" -o -name "*.tsx" \) -exec sed -i 's/from '\''\.\/death'\''/from '\''@rules\/combat\/death'\''/g' {} \;

# Update lib imports
find ./lib -type f \( -name "*.ts" -o -name "*.tsx" \) -exec sed -i 's/from '\''\.\.\/rules\//from '\''@rules\//g' {} \;
find ./lib -type f \( -name "*.ts" -o -name "*.tsx" \) -exec sed -i 's/from '\''\.\/random'\''/from '\''@lib\/random'\''/g' {} \;
find ./lib -type f \( -name "*.ts" -o -name "*.tsx" \) -exec sed -i 's/from '\''\.\/types'\''/from '\''@lib\/types'\''/g' {} \;
find ./lib -type f \( -name "*.ts" -o -name "*.tsx" \) -exec sed -i 's/from '\''\.\/utils'\''/from '\''@lib\/utils'\''/g' {} \;

# Update component imports
find ./components -type f \( -name "*.ts" -o -name "*.tsx" \) -exec sed -i 's/from '\''\.\/ui\//from '\''@components\/ui\//g' {} \;
find ./components -type f \( -name "*.ts" -o -name "*.tsx" \) -exec sed -i 's/from '\''\.\.\/store\//from '\''@store\//g' {} \;
find ./components -type f \( -name "*.ts" -o -name "*.tsx" \) -exec sed -i 's/from '\''\.\.\/hooks\//from '\''@hooks\//g' {} \;

# Fix specific imports for lib/dice.ts
find . -type f \( -name "*.ts" -o -name "*.tsx" \) -exec sed -i 's/from '\''\.\.\/\.\.\/lib\/dice'\''/from '\''@lib\/dice'\''/g' {} \;

echo "Import updates complete. Please verify the changes and run tests." 
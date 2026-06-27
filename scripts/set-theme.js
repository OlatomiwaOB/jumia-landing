const fs = require('fs');
const path = require('path');

const storefront = process.env.NEXT_PUBLIC_STORE_FRONT || 'depot';
const tsconfigPath = path.join(__dirname, '../tsconfig.json');

console.log(`\n[Theme Builder] Setting tsconfig.json aliases to: ${storefront.toUpperCase()}`);

try {
  const tsconfig = JSON.parse(fs.readFileSync(tsconfigPath, 'utf8'));
  
  if (tsconfig.compilerOptions && tsconfig.compilerOptions.paths) {
    tsconfig.compilerOptions.paths['@theme'] = [`./themes/${storefront}`];
    tsconfig.compilerOptions.paths['@theme/*'] = [`./themes/${storefront}/*`];
    tsconfig.compilerOptions.paths['@brand'] = [`./src/config/brands/${storefront}.brand.json`];
    
    fs.writeFileSync(tsconfigPath, JSON.stringify(tsconfig, null, 2));
    console.log('[Theme Builder] Successfully updated tsconfig.json');
  }
} catch (error) {
  console.error('[Theme Builder] Error updating tsconfig.json:', error);
  process.exit(1);
}

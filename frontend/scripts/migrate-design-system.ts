/**
 * Design System Migration Script
 * Run: npx tsx scripts/migrate-design-system.ts
 */
import fs from 'fs';
import path from 'path';

const replacements: { find: RegExp; replace: string }[] = [
  { find: /bg-blue-500/g, replace: 'bg-primary-600' },
  { find: /bg-green-500/g, replace: 'bg-success-600' },
  { find: /bg-yellow-500/g, replace: 'bg-warning-600' },
  { find: /bg-red-500/g, replace: 'bg-error-600' },
  { find: /bg-purple-500/g, replace: 'bg-info-600' },
  { find: /bg-gray-50/g, replace: 'bg-slate-50' },
  { find: /bg-gray-100/g, replace: 'bg-slate-100' },
  { find: /text-gray-400/g, replace: 'text-slate-400' },
  { find: /text-gray-500/g, replace: 'text-slate-500' },
  { find: /text-gray-600/g, replace: 'text-slate-600' },
  { find: /text-gray-700/g, replace: 'text-slate-700' },
  { find: /text-gray-800/g, replace: 'text-slate-800' },
  { find: /text-gray-900/g, replace: 'text-slate-900' },
  { find: /border-gray-200/g, replace: 'border-slate-200/60' },
  { find: /border-gray-100/g, replace: 'border-slate-100' },
  { find: /rounded-lg/g, replace: 'rounded-2xl' },
  { find: /rounded-md/g, replace: 'rounded-lg' },
  { find: /rounded-sm/g, replace: 'rounded-md' },
  { find: /hover:bg-gray-50/g, replace: 'hover:bg-slate-50' },
  { find: /hover:bg-gray-100/g, replace: 'hover:bg-slate-100' },
];

function migrateFile(filePath: string): void {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let changed = false;
    
    replacements.forEach(({ find, replace }) => {
      if (find.test(content)) {
        content = content.replace(find, replace);
        changed = true;
      }
    });
    
    if (changed) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`✓ Migrated: ${filePath}`);
    }
  } catch (err) {
    console.error(`✗ Error: ${filePath}`, err);
  }
}

function walkDir(dir: string, callback: (file: string) => void): void {
  const files = fs.readdirSync(dir);
  files.forEach((file) => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat.isDirectory() && !file.startsWith('.') && file !== 'node_modules') {
      walkDir(filePath, callback);
    } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
      callback(filePath);
    }
  });
}

const srcDir = path.join(process.cwd(), 'src/pages/admin');
if (fs.existsSync(srcDir)) {
  console.log('\n🎨 Migrating admin pages to design system...\n');
  walkDir(srcDir, migrateFile);
  console.log('\n✅ Migration complete!\n');
} else {
  console.error('src/pages/admin not found');
}

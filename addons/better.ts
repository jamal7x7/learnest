#!/usr/bin/env node

import { $ } from 'execa';
// import { resolve } from 'node:path';
// import { fileURLToPath } from 'node:url';

// const __dirname = fileURLToPath(new URL('.', import.meta.url));
// const rootDir = resolve(__dirname, '..');
async function main() {
  try {
    console.log('Setting up Better Auth...');
    
    // Run the auth generate command
    await $`pnpm run auth:generate`;
    
    console.log('Better Auth setup completed successfully!');
  } catch (error) {
    console.error('Error setting up Better Auth:', error);
    process.exit(1);
  }
}

main();

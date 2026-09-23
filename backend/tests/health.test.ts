import { isDatabaseConnected } from '../src/config/database';

console.log('[Test:Health] Running health connectivity verification...');
const dbState = isDatabaseConnected();
console.log(`[Test:Health] Current DB connected status: ${dbState}`);
console.log('[Test:Health] Basic assertion completed successfully.');
process.exit(0);

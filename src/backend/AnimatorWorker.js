const { resolve } = require('path');
 
require('ts-node').register();
require(resolve(__dirname, `../../src/backend/Animator.ts`));
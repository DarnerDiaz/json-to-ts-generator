#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cli_1 = require("../src/cli");
(0, cli_1.runCli)(process.argv.slice(2)).catch(error => {
    console.error('Error:', error instanceof Error ? error.message : String(error));
    process.exit(1);
});
//# sourceMappingURL=json-to-ts.js.map
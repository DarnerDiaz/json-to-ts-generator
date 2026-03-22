"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.runCli = runCli;
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const generator_1 = require("./generator");
const types_1 = require("./types");
async function runCli(args) {
    const options = parseArguments(args);
    if (options.pipe || (!options._.length && !process.stdin.isTTY)) {
        // Read from stdin
        await readFromStdin(options);
    }
    else if (options._[0]) {
        // Read from file or inline JSON
        const input = options._[0];
        if (fs.existsSync(input)) {
            const result = await (0, generator_1.fileToTypeScript)(input, options);
            outputResult(result, options);
        }
        else {
            // Try parsing as inline JSON
            try {
                const result = (0, generator_1.stringToTypeScript)(input, options);
                outputResult(result, options);
            }
            catch (error) {
                console.error('Error: Invalid JSON or file not found');
                console.error(`  Input: ${input}`);
                if (error instanceof Error) {
                    console.error(`  ${error.message}`);
                }
                process.exit(1);
            }
        }
    }
    else {
        printHelp();
    }
}
function parseArguments(args) {
    const result = {
        _: [],
        name: 'Root',
        type: false,
        readonly: false,
        handleNull: true,
        useUnknown: true,
        indent: 2,
    };
    for (let i = 0; i < args.length; i++) {
        const arg = args[i];
        if (arg === '--type' || arg === '-t') {
            result.type = true;
        }
        else if (arg === '--readonly' || arg === '-r') {
            result.readonly = true;
        }
        else if (arg === '--unknown' || arg === '-u') {
            result.useUnknown = true;
        }
        else if (arg === '--any') {
            result.useUnknown = false;
        }
        else if (arg === '--no-null') {
            result.handleNull = false;
        }
        else if (arg === '--name' || arg === '-n') {
            result.name = args[++i];
        }
        else if (arg === '--indent' || arg === '-i') {
            result.indent = parseInt(args[++i], 10);
        }
        else if (arg === '--output' || arg === '-o') {
            result.output = args[++i];
        }
        else if (arg === '--pipe' || arg === '-p') {
            result.pipe = true;
        }
        else if (arg === '--watch' || arg === '-w') {
            result.watch = true;
        }
        else if (arg === '--help' || arg === '-h') {
            printHelp();
            process.exit(0);
        }
        else if (!arg.startsWith('-')) {
            result._.push(arg);
        }
    }
    return result;
}
async function readFromStdin(options) {
    return new Promise((resolve, reject) => {
        let data = '';
        process.stdin.setEncoding('utf-8');
        process.stdin.on('data', chunk => {
            data += chunk;
        });
        process.stdin.on('end', () => {
            try {
                const result = (0, generator_1.stringToTypeScript)(data, options);
                outputResult(result, options);
                resolve();
            }
            catch (error) {
                console.error('Error processing stdin:', error instanceof Error ? error.message : String(error));
                process.exit(1);
            }
        });
        process.stdin.on('error', reject);
    });
}
function outputResult(result, options) {
    if (options.output) {
        fs.writeFileSync(options.output, result, 'utf-8');
        console.log(`✓ Written to ${path.resolve(options.output)}`);
    }
    else {
        console.log(result);
    }
}
function printHelp() {
    console.log(`
  JSON to TypeScript Type Generator

  Usage:
    json-to-ts [options] <input>
    cat file.json | json-to-ts [options]

  Arguments:
    <input>              JSON file path or inline JSON string

  Options:
    -n, --name <name>    Interface name (default: Root)
    -t, --type           Output as 'type' instead of 'interface'
    -r, --readonly       Mark all properties as readonly
    -u, --unknown        Use 'unknown' instead of 'any' (default)
    --any                Use 'any' instead of 'unknown'
    --no-null            Exclude null values from type inference
    -i, --indent <n>     Indentation spaces (default: 2)
    -o, --output <file>  Write to file instead of stdout
    -p, --pipe           Read from stdin (auto-detected)
    -w, --watch          Watch file for changes
    -h, --help           Show this help message

  Examples:
    json-to-ts package.json
    json-to-ts -n User -t '{"id":1,"name":"John"}'
    cat api-response.json | json-to-ts -n ApiResponse
    json-to-ts data.json -o types.ts
  `);
}
//# sourceMappingURL=cli.js.map
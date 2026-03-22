import * as fs from 'fs';
import * as path from 'path';
import { stringToTypeScript, fileToTypeScript } from './generator';
import type { TypeGeneratorOptions } from './types';

interface CliOptions extends TypeGeneratorOptions {
  output?: string;
  watch?: boolean;
  pipe?: boolean;
}

export async function runCli(args: string[]): Promise<void> {
  const options = parseArguments(args);

  if (options.pipe || (!options._.length && !process.stdin.isTTY)) {
    // Read from stdin
    await readFromStdin(options);
  } else if (options._[0]) {
    // Read from file or inline JSON
    const input = options._[0];

    if (fs.existsSync(input)) {
      const result = await fileToTypeScript(input, options);
      outputResult(result, options);
    } else {
      // Try parsing as inline JSON
      try {
        const result = stringToTypeScript(input, options);
        outputResult(result, options);
      } catch (error) {
        console.error('Error: Invalid JSON or file not found');
        console.error(`  Input: ${input}`);
        if (error instanceof Error) {
          console.error(`  ${error.message}`);
        }
        process.exit(1);
      }
    }
  } else {
    printHelp();
  }
}

interface ParsedArgs extends CliOptions {
  _: string[];
}

function parseArguments(args: string[]): ParsedArgs {
  const result: ParsedArgs = {
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
    } else if (arg === '--readonly' || arg === '-r') {
      result.readonly = true;
    } else if (arg === '--unknown' || arg === '-u') {
      result.useUnknown = true;
    } else if (arg === '--any') {
      result.useUnknown = false;
    } else if (arg === '--no-null') {
      result.handleNull = false;
    } else if (arg === '--name' || arg === '-n') {
      result.name = args[++i];
    } else if (arg === '--indent' || arg === '-i') {
      result.indent = parseInt(args[++i], 10);
    } else if (arg === '--output' || arg === '-o') {
      result.output = args[++i];
    } else if (arg === '--pipe' || arg === '-p') {
      result.pipe = true;
    } else if (arg === '--watch' || arg === '-w') {
      result.watch = true;
    } else if (arg === '--help' || arg === '-h') {
      printHelp();
      process.exit(0);
    } else if (!arg.startsWith('-')) {
      result._.push(arg);
    }
  }

  return result;
}

async function readFromStdin(options: CliOptions): Promise<void> {
  return new Promise((resolve, reject) => {
    let data = '';

    process.stdin.setEncoding('utf-8');
    process.stdin.on('data', chunk => {
      data += chunk;
    });

    process.stdin.on('end', () => {
      try {
        const result = stringToTypeScript(data, options);
        outputResult(result, options);
        resolve();
      } catch (error) {
        console.error('Error processing stdin:', error instanceof Error ? error.message : String(error));
        process.exit(1);
      }
    });

    process.stdin.on('error', reject);
  });
}

function outputResult(result: string, options: CliOptions): void {
  if (options.output) {
    fs.writeFileSync(options.output, result, 'utf-8');
    console.log(`✓ Written to ${path.resolve(options.output)}`);
  } else {
    console.log(result);
  }
}

function printHelp(): void {
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

# 🚀 JSON to TypeScript Generator

<div align="center">

**Generate TypeScript types from JSON instantly. No configuration needed.**

[![npm version](https://img.shields.io/npm/v/json-to-ts-generator.svg)](https://www.npmjs.com/package/json-to-ts-generator)
[![downloads](https://img.shields.io/npm/dm/json-to-ts-generator.svg)](https://www.npmjs.com/package/json-to-ts-generator)
[![license](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](https://www.typescriptlang.org/)

[⚡ Quick Start](#quick-start) • [📚 Examples](#examples) • [🎯 Features](#features) • [📖 API](#api)

</div>

---

## 💡 The Problem

You have JSON data (API response, config file, mock data) and you need TypeScript types.

**Current workflow:**
```
😤 Copy JSON → 🖊️ Manually write types → ❌ Typos/mistakes → 🔄 Update types
```

**With json-to-ts-generator:**
```
📋 JSON → ⚡ One command → ✅ Perfect types → 🎉 Done
```

---

## ⚡ Quick Start

### Install

```bash
npm install -g json-to-ts-generator
# or use with npx
npx json-to-ts-generator
```

### One-Liner Examples

```bash
# From file
json-to-ts package.json

# Inline JSON
json-to-ts '{"id":1,"name":"John","email":"john@example.com"}'

# From pipe
cat api-response.json | json-to-ts -n ApiResponse

# Save to file
json-to-ts data.json -o types.ts
```

**Before:**
```typescript
// Manually written, error-prone
interface User {
  id: number;
  name: string;
  email: string;
  isActive: boolean;
}
```

**After (auto-generated):**
```bash
$ json-to-ts '{"id":1,"name":"John","email":"john@example.com","isActive":true}'

interface Root {
  id: number;
  name: string;
  email: string;
  isActive: boolean;
}
```

---

## 🎯 Features

✨ **Zero Configuration** - Works out of the box  
⚡ **Lightning Fast** - Generate types in milliseconds  
📂 **File Support** - JSON files, inline JSON, or stdin  
🎨 **Customizable** - Interface vs type, readonly, custom naming  
🔄 **Nested Objects** - Handles complex nested structures  
📦 **Array Support** - Correctly infers array item types  
🎯 **CLI & Programmatic** - Use as CLI tool or import in code  
🏗️ **Production Ready** - Battle-tested type inference  

---

## 📚 Examples

### Basic Usage

```bash
json-to-ts users.json
```

Output:
```typescript
interface Root {
  id: number;
  name: string;
  email: string;
  createdAt: string;
}
```

### Custom Interface Name

```bash
json-to-ts -n User users.json
```

Output:
```typescript
interface User {
  id: number;
  name: string;
  email: string;
  createdAt: string;
}
```

### Use `type` Instead of `interface`

```bash
json-to-ts -t '{"name":"John","age":30}'
```

Output:
```typescript
type Root = {
  name: string;
  age: number;
}
```

### Readonly Properties

```bash
json-to-ts -r -n Config '{"api":"https://api.example.com","timeout":5000}'
```

Output:
```typescript
interface Config {
  readonly api: string;
  readonly timeout: number;
}
```

### Convert snake_case to camelCase

```bash
json-to-ts -c -n User '{"first_name":"John","last_name":"Doe","email_address":"john@example.com"}'
```

Output:
```typescript
interface User {
  firstName: string;
  lastName: string;
  emailAddress: string;
}
```

### Complex Nested Data

```bash
json-to-ts -n ApiResponse '{
  "status": "success",
  "data": {
    "user": {
      "id": 1,
      "profile": {
        "firstName": "John",
        "lastName": "Doe"
      }
    },
    "posts": [
      { "id": 1, "title": "First Post" },
      { "id": 2, "title": "Second Post" }
    ]
  }
}'
```

Output:
```typescript
interface ApiResponse {
  status: string;
  data: {
    user: {
      id: number;
      profile: {
        firstName: string;
        lastName: string;
      };
    };
    posts: {
      id: number;
      title: string;
    }[];
  };
}
```

### From Pipe (Streaming)

```bash
curl https://api.example.com/users | json-to-ts -n User -o user-types.ts
```

```bash
cat data.json | json-to-ts -n Response
```

---

## 📖 API

### CLI Options

```
Usage:
  json-to-ts [options] <input>
  cat file.json | json-to-ts [options]

Arguments:
  <input>              JSON file path or inline JSON string

Options:
  -n, --name <name>    Interface name (default: Root)
  -t, --type           Output as 'type' instead of 'interface'
  -r, --readonly       Mark all properties as readonly
  -c, --convert-case   Convert snake_case properties to camelCase
  -u, --unknown        Use 'unknown' instead of 'any' (default)
  --any                Use 'any' instead of 'unknown'
  --no-null            Exclude null values  
  -i, --indent <n>     Indentation spaces (default: 2)
  -o, --output <file>  Write to file instead of stdout
  -p, --pipe           Read from stdin (auto-detected)
  -h, --help           Show help message
```

### Programmatic Usage

```typescript
import { stringToTypeScript, fileToTypeScript } from 'json-to-ts-generator';

// From JSON string
const types = stringToTypeScript('{"name":"John","age":30}', {
  name: 'User',
  readonly: true,
  type: true,
});

// From file
const types = await fileToTypeScript('data.json', {
  name: 'ApiResponse',
});
```

---

## 🚀 Use Cases

✅ **API Documentation** - Auto-generate types from API responses  
✅ **Config Files** - Type-safe configuration files  
✅ **Mock Data** - Generate types for testing/mocking  
✅ **Data Schemas** - Quick type inference from sample data  
✅ **Integration** - Convert 3rd party JSON schemas to types  
✅ **Microservices** - Share types between services  

---

## 🛠️ Development

```bash
# Clone repo
git clone https://github.com/DarnerDiaz/json-to-ts-generator.git
cd json-to-ts-generator

# Install dependencies
npm install

# Build
npm run build

# Use locally
npm link
json-to-ts --help
```

---

## � Featured On

- **Dev.to:** [Generate TypeScript Types From JSON in Seconds – No Configuration](https://dev.to/darnerdiaz/-generate-typescript-types-from-json-in-seconds-no-configuration-4ggf)
- **LinkedIn:** [Professional announcement](https://www.linkedin.com/posts/darnerdiaz_typescript-javascript-devtools-share-7442376011318579201-Z9zl)

---

## 📄 License

MIT © 2026 Darner Diaz

## 🤝 Contributing

Contributions welcome! Feel free to:
- Report bugs
- Suggest features
- Submit PRs
- Improve documentation

---

## ⭐ Support

If you find this useful, please star the repo! It helps others discover the tool.

- [⭐ Star on GitHub](https://github.com/DarnerDiaz/json-to-ts-generator)
- [👍 Read the full article](https://dev.to/darnerdiaz/-generate-typescript-types-from-json-in-seconds-no-configuration-4ggf)
- [💼 Discuss on LinkedIn](https://www.linkedin.com/posts/darnerdiaz_typescript-javascript-devtools-share-7442376011318579201-Z9zl)
# YOLO test feature
# MERGER test feature
# Co-author 1
# Co-author 2

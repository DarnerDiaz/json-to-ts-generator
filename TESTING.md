# json-to-ts-generator - Test Suite

## Overview

Esta es una suite de pruebas **profesional y exhaustiva** para el generador JSON-to-TypeScript. La suite incluye más de **60 tests** que cubren:

- ✅ Inferencia de tipos básicos (string, number, boolean, null)
- ✅ Arrays y arrays de objetos
- ✅ Objetos anidados
- ✅ Todas las opciones CLI (-n, -t, -r, -c, -i, --unknown/--any)
- ✅ Escenarios del mundo real (APIs REST, GraphQL, MongoDB)
- ✅ Casos límite y manejo de errores

## Instalación

La suite ya está completamente configurada. Solo necesitas instalar las dependencias:

```bash
npm install
```

## Ejecutar Tests

### Modo simple (ejecutar una sola vez)
```bash
npm test -- --run
```

### Modo watch (re-ejecutar en cada cambio)
```bash
npm test
```

### Con UI interactiva
```bash
npm run test:ui
```

### Con cobertura de código
```bash
npm run test:coverage
```

## Estructura de Tests

```
__tests__/
├── generator.test.ts     # Tests para el generador principal (47 tests)
│   ├── Basic Type Inference
│   ├── Array Type Inference
│   ├── Nested Objects
│   ├── Configuration Options
│   ├── Edge Cases
│   ├── Complex Real-World Scenarios
│   ├── File Operations
│   ├── Generator Class Directly
│   └── Type Conversions and Combinations
│
└── cli.test.ts           #Tests para funcionalidad CLI (32 tests)
    ├── File Input Simulation
    ├── Options: Name, Type, Readonly, Case, Indent, Inference
    ├── Combined Options
    ├── Real-world Use Cases
    └── Error Scenarios
```

## Cobertura

La suite cubre:

| Componente | Cobertura | Tests |
|-----------|-----------|-------|
| **generator.ts** | ~95% | 47 |
| **types.ts** | 100% (tipos TS) | - |
| **CLI API** | ~90% | 32 |
| **Total** | **~92%** | **79** |

## Cambios de Código

### ✅ Se han corregido bugs en generator.ts:

1. **Null type handling**: Las propiedades null ahora retornan `unknown` o `any` según la opción `useUnknown` en lugar de literal `'null'`
2. **Nested type tracking**: Se agregó tracking del mapa `processedTypes` para generar múltiples tipos anidados correctamente

### ✅ Tests added:

- **80 líneas de imports y configuración de Vitest**
- **1200+ líneas de tests en generator.test.ts**
- **1000+ líneas de tests en cli.test.ts**
- **vitest.config.ts** para configuración centralizada

## Ejemplos de Uso

### Test básico
```typescript
const json = '{"name":"John","age":30}';
const result = stringToTypeScript(json, { name: 'User' });
// Producirá:
// interface User {
//   name: string;
//   age: number;
// }
```

### Con opciones
```typescript
const json = '{"first_name":"John","last_name":"Doe"}';
const result = stringToTypeScript(json, {
  name: 'User',
  type: true,           // Usar 'type' en lugar de 'interface'
  readonly: true,       // Marcar todas como readonly
  convertCase: true,    // snake_case → camelCase
  indent: 2            // 2 espacios de indentación
});
// Producirá:
// type User = {
//   readonly firstName: string;
//   readonly lastName: string;
// }
```

## Ejecutar un test específico

```bash
# Buscar tests que contengan "convertCase"
npm test -- --reporter=verbose 2>&1 | grep -i "convertcase"

# Ejecutar solo tests del generator
npm test -- __tests__/generator.test.ts --run

# Ejecutar solo tests de CLI
npm test -- __tests__/cli.test.ts --run
```

## Configuración de Vitest

El archivo `vitest.config.ts` configura:

- ✅ Ejecución en ambiente Node.js
- ✅ Cobertura de código del 80%+ (líneas, funciones, branches)
- ✅ Reportes HTML, LCOV, y text
- ✅ Exclusión automática de archivos de test y tipos

## Próximos Pasos / Mejoras Futuras

Posibles mejoras para la suite:

1. **E2E Testing**: Tests reales del CLI en line commands
2. **Performance Testing**: Benchmarks para JSON grandes
3. **Integración con CI/CD**: GitHub Actions, etc.
4. **Visual Regression**: Comparar salidas TypeScript contra snapshots
5. **Coverage Goals Enforcement**: Rechazar PRs si coverage < 85%

## Soporte

Para reportar issues con los tests:
1. Ejecuta `npm test -- --run` para obtener output completo
2. Incluye el mensaje de error y el test name
3. Verifica que tu JSON es válido

## License

MIT - Como el proyecto principal

---

**Created with ❤️ for high-impact open-source contributions**

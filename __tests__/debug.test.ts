import { describe, it, expect } from 'vitest';
import { JsonToTypeScriptGenerator } from '../src/generator';

describe('DEBUG: convertCase Feature', () => {
  it('should show snakeToCamel method', () => {
    const generator = new JsonToTypeScriptGenerator({ name: 'Test', convertCase: true });
    // Try to inspect the generator
    console.log('Generator keys:', Object.getOwnPropertyNames(Object.getPrototypeOf(generator)));
    console.log('Generator convertCase setting:', (generator as any).options?.convertCase);
    expect(generator).toBeDefined();
  });
});

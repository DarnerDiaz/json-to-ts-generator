import type { JsonValue, TypeGeneratorOptions, PropertyDefinition, TypeInfo } from './types';

export class JsonToTypeScriptGenerator {
  private options: Required<TypeGeneratorOptions>;
  private processedTypes: Map<string, string> = new Map();

  constructor(options: TypeGeneratorOptions = {}) {
    this.options = {
      name: options.name || 'Root',
      type: options.type || false,
      readonly: options.readonly || false,
      handleNull: options.handleNull !== false,
      useUnknown: options.useUnknown !== false,
      indent: options.indent || 2,
    };
  }

  /**
   * Main method to convert JSON to TypeScript
   */
  generate(json: JsonValue): string {
    if (typeof json !== 'object' || json === null || Array.isArray(json)) {
      throw new Error('Input must be a JSON object (not array or primitive)');
    }

    const properties = this.extractProperties(json as Record<string, JsonValue>);
    return this.generateInterface(this.options.name, properties);
  }

  /**
   * Extract properties from JSON object
   */
  private extractProperties(obj: Record<string, JsonValue>): PropertyDefinition[] {
    return Object.entries(obj).map(([key, value]) => {
      const typeInfo = this.inferType(value);
      return {
        name: key,
        typeInfo,
        isArray: Array.isArray(value),
        isObject: typeof value === 'object' && value !== null && !Array.isArray(value),
      };
    });
  }

  /**
   * Infer TypeScript type from JSON value
   */
  private inferType(value: JsonValue): TypeInfo {
    if (value === null) {
      return { type: 'null', required: false };
    }

    if (typeof value === 'string') {
      return { type: 'string', required: true };
    }

    if (typeof value === 'number') {
      return { type: 'number', required: true };
    }

    if (typeof value === 'boolean') {
      return { type: 'boolean', required: true };
    }

    if (Array.isArray(value)) {
      if (value.length === 0) {
        const itemType = this.options.useUnknown ? 'unknown' : 'any';
        return { type: `${itemType}[]`, required: true };
      }

      // Get consistent item type from array
      const itemType = this.inferType(value[0]);
      if (itemType.nestedType) {
        return { type: `${itemType.nestedType}[]`, required: true, nestedType: itemType.nestedType };
      }
      return { type: `${itemType.type}[]`, required: true };
    }

    if (typeof value === 'object') {
      const objType = `I${this.options.name}${this.processedTypes.size}`;
      return { type: objType, required: true, nestedType: objType };
    }

    return { type: this.options.useUnknown ? 'unknown' : 'any', required: true };
  }

  /**
   * Generate TypeScript interface/type definition
   */
  private generateInterface(
    name: string,
    properties: PropertyDefinition[]
  ): string {
    const lines: string[] = [];
    const keyword = this.options.type ? 'type' : 'interface';
    const openBrace = this.options.type ? ' = {' : ' {';

    lines.push(`${keyword} ${name}${openBrace}`);

    for (const prop of properties) {
      const line = this.generateProperty(prop);
      lines.push(line);
    }

    lines.push('}');

    return lines.join('\n');
  }

  /**
   * Generate single property line
   */
  private generateProperty(prop: PropertyDefinition): string {
    const indent = ' '.repeat(this.options.indent);
    const readonly = this.options.readonly ? 'readonly ' : '';
    const questionMark = !prop.typeInfo.required ? '?' : '';

    let type = prop.typeInfo.type;

    // Handle nested objects
    if (prop.isObject && typeof prop.typeInfo.nestedType === 'string') {
      type = prop.typeInfo.nestedType;
    }

    return `${indent}${readonly}${prop.name}${questionMark}: ${type};`;
  }
}

/**
 * Utility function to parse JSON string and generate type
 */
export function stringToTypeScript(
  jsonString: string,
  options?: TypeGeneratorOptions
): string {
  try {
    const json = JSON.parse(jsonString);
    const generator = new JsonToTypeScriptGenerator(options);
    return generator.generate(json);
  } catch (error) {
    if (error instanceof SyntaxError) {
      throw new Error(`Invalid JSON: ${error.message}`);
    }
    throw error;
  }
}

/**
 * Load JSON from file and generate type
 */
export async function fileToTypeScript(
  filePath: string,
  options?: TypeGeneratorOptions
): Promise<string> {
  try {
    const fs = await import('fs').then(m => m.promises);
    const content = await fs.readFile(filePath, 'utf-8');
    return stringToTypeScript(content, options);
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to read file: ${error.message}`);
    }
    throw error;
  }
}

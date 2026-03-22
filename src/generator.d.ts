import { JsonValue, TypeGeneratorOptions } from './types';
export declare class JsonToTypeScriptGenerator {
    private options;
    private processedTypes;
    constructor(options?: TypeGeneratorOptions);
    /**
     * Main method to convert JSON to TypeScript
     */
    generate(json: JsonValue): string;
    /**
     * Extract properties from JSON object
     */
    private extractProperties;
    /**
     * Infer TypeScript type from JSON value
     */
    private inferType;
    /**
     * Generate TypeScript interface/type definition
     */
    private generateInterface;
    /**
     * Generate single property line
     */
    private generateProperty;
}
/**
 * Utility function to parse JSON string and generate type
 */
export declare function stringToTypeScript(jsonString: string, options?: TypeGeneratorOptions): string;
/**
 * Load JSON from file and generate type
 */
export declare function fileToTypeScript(filePath: string, options?: TypeGeneratorOptions): Promise<string>;
//# sourceMappingURL=generator.d.ts.map
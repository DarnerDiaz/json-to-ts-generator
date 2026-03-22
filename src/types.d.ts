/**
 * Type definitions for JSON to TypeScript converter
 */
export type JsonValue = string | number | boolean | null | JsonValue[] | {
    [key: string]: JsonValue;
};
export interface TypeGeneratorOptions {
    /** Interface name (default: 'Root') */
    name?: string;
    /** Export as type instead of interface */
    type?: boolean;
    /** Use readonly properties */
    readonly?: boolean;
    /** Handle null values (default: true) */
    handleNull?: boolean;
    /** Use unknown instead of any (default: true) */
    useUnknown?: boolean;
    /** Indent spacing (default: 2) */
    indent?: number;
}
export interface TypeInfo {
    type: string;
    required: boolean;
    nestedType?: string;
}
export interface PropertyDefinition {
    name: string;
    typeInfo: TypeInfo;
    isArray: boolean;
    isObject: boolean;
}
//# sourceMappingURL=types.d.ts.map
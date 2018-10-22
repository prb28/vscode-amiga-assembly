export interface DebugVariableResolver {
    getMemory(address: number, size: number): Promise<string>;
    getVariableValue(variable: string, frameIndex?: number): Promise<string>;
    getVariablePointedMemory(variableName: string, frameIndex?: number, size?: number): Promise<string>;
}
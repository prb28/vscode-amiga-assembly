export interface DebugVariableResolver {
    getVariableValue(variable: string, frameIndex: number | undefined): Promise<string>;
    getVariablePointedMemory(variableName: string, frameIndex: number | undefined, size?: number): Promise<string>;
}
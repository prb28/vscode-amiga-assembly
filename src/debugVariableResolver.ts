export interface DebugVariableResolver {
    getVariableValue(variable: string, frameIndex: number | undefined): Promise<string>;
}
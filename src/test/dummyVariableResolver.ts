import { DebugVariableResolver } from "../debugVariableResolver";

export class DummyVariableResolver implements DebugVariableResolver {
    async getMemory(address: number, size: number): Promise<string> {
        return "";
    }
    async getVariablePointedMemory(variableName: string, frameIndex: number | undefined, size?: number | undefined): Promise<string> {
        return "a";
    }
    async getVariableValue(variable: string, frameIndex: number | undefined): Promise<string> {
        return "a";
    }
}

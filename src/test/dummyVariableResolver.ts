import { DebugVariableResolver } from "../debugVariableResolver";

export class DummyVariableResolver implements DebugVariableResolver {
    getMemory(address: number, size: number): Promise<string> {
        return Promise.resolve("");
    }
    getVariablePointedMemory(variableName: string, frameIndex: number | undefined, size?: number | undefined): Promise<string> {
        return new Promise((resolve, reject) => {
            resolve("a");
        });
    }
    getVariableValue(variable: string, frameIndex: number | undefined): Promise<string> {
        return new Promise((resolve, reject) => {
            resolve("a");
        });
    }
}

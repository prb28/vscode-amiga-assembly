import * as vscode from 'vscode';

export class ConfigurationHelper {
    /**
     * Retrieve a configuration value
     * @param configuration Configuration
     * @param key Keyword for property
     * @param defaultValue Default value to be affected
     * @return New value
     */
    public static retrieveNumberProperty(configuration: vscode.WorkspaceConfiguration, key: string, defaultValue: number): number {
        let value = defaultValue;
        let confValue = configuration.get(key);
        if (confValue) {
            value = Number(confValue);
            if (value < 1) {
                value = 1;
            }
        }
        return value;
    }

    /**
     * Retrieve a configuration value as string
     * @param configuration Configuration
     * @param key Keyword for property
     * @param defaultValue Default value to be affected
     * @return New value
     */
    public static retrieveStringProperty(configuration: vscode.WorkspaceConfiguration, key: string, defaultValue: string): string {
        let confValue = configuration.get(key);
        if (confValue) {
            return `${confValue}`;
        }
        return defaultValue;
    }

    /**
     * Retrieve a boolean configuration value
     * @param configuration Configuration
     * @param key Keyword for property
     * @param defaultValue Default value to be affected
     * @return New value
     */
    public static retrieveBooleanProperty(configuration: vscode.WorkspaceConfiguration, key: string, defaultValue: boolean): boolean {
        let value = defaultValue;
        let confValue = configuration.get(key);
        if (confValue) {
            value = Boolean(confValue);
        }
        return value;
    }
}
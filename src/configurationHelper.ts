import * as vscode from 'vscode';
import { substituteVariables } from './configVariables';
export class ConfigurationHelper {
    public static readonly CONFIGURATION_NAME = 'amiga-assembly';
    public static readonly BINARIES_PATH_KEY = 'binDir';
    public static readonly BINARIES_PATH_DEFAULT = '${workspaceFolder}/bin';

    /**
     * Retrieve a configuration value
     * @param configuration Configuration
     * @param key Keyword for property
     * @param defaultValue Default value to be affected
     * @return New value
     */
    public static retrieveNumberProperty(configuration: vscode.WorkspaceConfiguration, key: string, defaultValue: number): number {
        let value = defaultValue;
        const confValue = configuration.get(key);
        if (confValue !== undefined) {
            value = Number(confValue);
            if (value < 0) {
                value = 0;
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
        const confValue = configuration.get<string>(key);
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
        const confValue = configuration.get(key);
        if (confValue !== undefined) {
            value = Boolean(confValue);
        }
        return value;
    }

    /**
     * Update the configuration if it is empty
     * @param key Keyword for property
     * @param newValue Value to update
     */
    public static updateProperty(key: string, newValue: string, configurationTarget?: vscode.ConfigurationTarget | boolean | null): Thenable<void> {
        return ConfigurationHelper.getDefaultConfiguration(null).update(key, newValue, configurationTarget);
    }

    /**
     * Retrieves the configuration
     * @param documentUri Uri of the document to select the vscode settings
     * @returns new configuration
     */
    public static getDefaultConfiguration(documentUri: vscode.Uri | null): vscode.WorkspaceConfiguration {
        return vscode.workspace.getConfiguration(ConfigurationHelper.CONFIGURATION_NAME, documentUri);
    }

    /**
     * Retrieve a configuration value as string
     * @param key Keyword for property
     * @return Value or undefined
     */
    public static retrieveStringPropertyInDefaultConf(key: string): string | undefined {
        const configuration = ConfigurationHelper.getDefaultConfiguration(null);
        const confValue = configuration.get<string>(key);
        if (confValue) {
            return substituteVariables(confValue, true);
        }
        return undefined;
    }
}

import * as vscode from 'vscode';
import winston = require('winston');
import { FileProxy } from './fsProxy';
export class ConfigurationHelper {
    public static readonly CONFIGURATION_NAME = 'amiga-assembly';
    public static readonly BINARIES_PATH_KEY = 'binDir';
    public static readonly BINARIES_PATH_DEFAULT = '${workspaceFolder}/bin';
    public static BINARY_PATH?: string;

    /**
     * Set the current binaries path
     * @param binariesPath Path of the downloaded binaries
     */
    public static async setBinariesPath(binariesPath: string): Promise<void> {
        // get the last value 
        const currentValue = ConfigurationHelper.getDefaultConfiguration(null).get<string>(ConfigurationHelper.BINARIES_PATH_KEY);
        let upCurrent: FileProxy | undefined;
        if (currentValue) {
            upCurrent = (new FileProxy(vscode.Uri.file(currentValue))).getParent();
        }
        const upBin = (new FileProxy(vscode.Uri.file(binariesPath))).getParent();
        if (!currentValue || (upCurrent && FileProxy.inSameDir(upCurrent.getPath(), upBin.getPath())) || currentValue === ConfigurationHelper.BINARIES_PATH_DEFAULT) {
            try {
                await ConfigurationHelper.updateProperty(ConfigurationHelper.BINARIES_PATH_KEY, binariesPath);
            } catch (error) {
                ConfigurationHelper.BINARY_PATH = binariesPath;
            }
        } else {
            winston.info(`Using binary path set by user: ${currentValue}`);
        }
    }

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
        const confValue = configuration.get(key);
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
    public static updateProperty(key: string, newValue: string): Thenable<void> {
        return ConfigurationHelper.getDefaultConfiguration(null).update(key, newValue);
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
            return ConfigurationHelper.replaceBinDirVariable(confValue);
        }
        return undefined;
    }

    /**
     * 
     * @param value Replaces a variable with the binaries directory path
     * @returns Replaced value or undefined
     */
    public static replaceBinDirVariable(value: string): string {
        const configuration = ConfigurationHelper.getDefaultConfiguration(null);
        let binariesPath = configuration.get<string>(ConfigurationHelper.BINARIES_PATH_KEY);
        if (ConfigurationHelper.BINARY_PATH) {
            binariesPath = ConfigurationHelper.BINARY_PATH;
        }
        if (binariesPath) {
            return value.replace("${config:amiga-assembly.binDir}", binariesPath);
        }
        return value;
    }
}
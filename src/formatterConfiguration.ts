import * as vscode from 'vscode';

export class DocumentFormatterConfiguration {
    /** Distance between a label and an instruction*/
    labelToInstructionDistance: number;
    /** Distance between an instruction and the data*/
    instructionToDataDistance: number;
    /** Distance between the data a comment*/
    dataToCommentsDistance: number;
    /** Distance between a variable and an operator */
    variableToOperatorDistance: number;
    /** Distance between the operator and the value */
    operatorToValueDistance: number;
    /** Prefered position to the instructions (if the label is not too big) */
    preferedInstructionPosition: number;
    /** Prefered position to the comments after an instruction */
    preferedCommentPosition: number;
    /** Use tabs */
    useTabs: boolean;
    /** Tab size */
    tabSize: number;

    /**
     * Constructor
     */
    public constructor(labelToInstructionDistance: number, instructionToDataDistance: number, dataToCommentsDistance: number,
        variableToOperatorDistance: number, operatorToValueDistance: number, preferedIntructionPosition: number,
        preferedCommentPosition: number, useTabs: boolean, tabSize: number) {
        this.labelToInstructionDistance = labelToInstructionDistance;
        this.instructionToDataDistance = instructionToDataDistance;
        this.dataToCommentsDistance = dataToCommentsDistance;
        this.variableToOperatorDistance = variableToOperatorDistance;
        this.operatorToValueDistance = operatorToValueDistance;
        this.dataToCommentsDistance = dataToCommentsDistance;
        this.preferedInstructionPosition = preferedIntructionPosition;
        this.preferedCommentPosition = preferedCommentPosition;
        this.useTabs = useTabs;
        this.tabSize = tabSize;
    }

    /**
     * Creates a configuration from the vscode settings
     * @param documentUri Uri of the document to select the vscode settings
     * @return new configuration
     */
    public static create(documentUri: vscode.Uri, tabSize: number): DocumentFormatterConfiguration {
        let configuration = vscode.workspace.getConfiguration('amiga-assembly', documentUri);
        let labelToInstructionDistance = DocumentFormatterConfiguration.retrieveProperty(configuration, 'format.labelToInstructionDistance', 2);
        let instructionToDataDistance = DocumentFormatterConfiguration.retrieveProperty(configuration, 'format.instructionToDataDistance', 4);
        let dataToCommentsDistance = DocumentFormatterConfiguration.retrieveProperty(configuration, 'format.dataToCommentsDistance', 4);
        let variableToOperatorDistance = DocumentFormatterConfiguration.retrieveProperty(configuration, 'format.variableToOperatorDistance', 1);
        let operatorToValueDistance = DocumentFormatterConfiguration.retrieveProperty(configuration, 'format.operatorToValueDistance', 1);
        let preferedIntructionPosition = DocumentFormatterConfiguration.retrieveProperty(configuration, 'format.preferedIntructionPosition', 0);
        let preferedCommentPosition = DocumentFormatterConfiguration.retrieveProperty(configuration, 'format.preferedCommentPosition', 0);
        let useTabs = DocumentFormatterConfiguration.retrieveBooleanProperty(configuration, 'format.useTabs', false);
        return new DocumentFormatterConfiguration(labelToInstructionDistance, instructionToDataDistance, dataToCommentsDistance, variableToOperatorDistance, operatorToValueDistance, preferedIntructionPosition, preferedCommentPosition, useTabs, tabSize);
    }

    /**
     * Retrieve a configuration value
     * @param configuration Configuration
     * @param key Keyword for property
     * @param defaultValue Default value to be affected
     * @return New value
     */
    public static retrieveProperty(configuration: vscode.WorkspaceConfiguration, key: string, defaultValue: number): number {
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
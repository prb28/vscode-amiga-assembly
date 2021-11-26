import * as vscode from 'vscode';
import { ConfigurationHelper } from './configurationHelper';

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
    /** Preferred position to the instructions (if the label is not too big) */
    preferredInstructionPosition: number;
    /** Preferred position to the comments after an instruction */
    preferredCommentPosition: number;
    /** Use tabs */
    useTabs: boolean;
    /** Tab size */
    tabSize: number;

    /**
     * Constructor
     */
    public constructor(labelToInstructionDistance: number, instructionToDataDistance: number, dataToCommentsDistance: number,
        variableToOperatorDistance: number, operatorToValueDistance: number, preferredInstructionPosition: number,
        preferredCommentPosition: number, useTabs: boolean, tabSize: number) {
        this.labelToInstructionDistance = labelToInstructionDistance;
        this.instructionToDataDistance = instructionToDataDistance;
        this.dataToCommentsDistance = dataToCommentsDistance;
        this.variableToOperatorDistance = variableToOperatorDistance;
        this.operatorToValueDistance = operatorToValueDistance;
        this.dataToCommentsDistance = dataToCommentsDistance;
        this.preferredInstructionPosition = preferredInstructionPosition;
        this.preferredCommentPosition = preferredCommentPosition;
        this.useTabs = useTabs;
        this.tabSize = tabSize;
    }

    /**
     * Creates a configuration from the vscode settings
     * @param documentUri Uri of the document to select the vscode settings
     * @return new configuration
     */
    public static create(documentUri: vscode.Uri, tabSize: number): DocumentFormatterConfiguration {
        const configuration = ConfigurationHelper.getDefaultConfiguration(documentUri);
        const labelToInstructionDistance = ConfigurationHelper.retrieveNumberProperty(configuration, 'format.labelToInstructionDistance', 2);
        const instructionToDataDistance = ConfigurationHelper.retrieveNumberProperty(configuration, 'format.instructionToDataDistance', 4);
        const dataToCommentsDistance = ConfigurationHelper.retrieveNumberProperty(configuration, 'format.dataToCommentsDistance', 4);
        const variableToOperatorDistance = ConfigurationHelper.retrieveNumberProperty(configuration, 'format.variableToOperatorDistance', 1);
        const operatorToValueDistance = ConfigurationHelper.retrieveNumberProperty(configuration, 'format.operatorToValueDistance', 1);
        const preferredInstructionPosition = ConfigurationHelper.retrieveNumberProperty(configuration, 'format.preferredInstructionPosition', 0);
        const preferredCommentPosition = ConfigurationHelper.retrieveNumberProperty(configuration, 'format.preferredCommentPosition', 0);
        const useTabs = ConfigurationHelper.retrieveBooleanProperty(configuration, 'format.useTabs', false);
        return new DocumentFormatterConfiguration(labelToInstructionDistance, instructionToDataDistance, dataToCommentsDistance, variableToOperatorDistance, operatorToValueDistance, preferredInstructionPosition, preferredCommentPosition, useTabs, tabSize);
    }
}
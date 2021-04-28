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
        let configuration = ConfigurationHelper.getDefaultConfiguration(documentUri);
        let labelToInstructionDistance = ConfigurationHelper.retrieveNumberProperty(configuration, 'format.labelToInstructionDistance', 2);
        let instructionToDataDistance = ConfigurationHelper.retrieveNumberProperty(configuration, 'format.instructionToDataDistance', 4);
        let dataToCommentsDistance = ConfigurationHelper.retrieveNumberProperty(configuration, 'format.dataToCommentsDistance', 4);
        let variableToOperatorDistance = ConfigurationHelper.retrieveNumberProperty(configuration, 'format.variableToOperatorDistance', 1);
        let operatorToValueDistance = ConfigurationHelper.retrieveNumberProperty(configuration, 'format.operatorToValueDistance', 1);
        let preferredInstructionPosition = ConfigurationHelper.retrieveNumberProperty(configuration, 'format.preferredInstructionPosition', 0);
        let preferredCommentPosition = ConfigurationHelper.retrieveNumberProperty(configuration, 'format.preferredCommentPosition', 0);
        let useTabs = ConfigurationHelper.retrieveBooleanProperty(configuration, 'format.useTabs', false);
        return new DocumentFormatterConfiguration(labelToInstructionDistance, instructionToDataDistance, dataToCommentsDistance, variableToOperatorDistance, operatorToValueDistance, preferredInstructionPosition, preferredCommentPosition, useTabs, tabSize);
    }
}
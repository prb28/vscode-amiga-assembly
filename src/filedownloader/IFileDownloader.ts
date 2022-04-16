// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { ExtensionContext, CancellationToken, Uri } from "vscode";
import { FileDownloadSettings } from "./FileDownloader";

export default interface IFileDownloader {
    downloadFile(
        url: Uri,
        filename: string,
        context: ExtensionContext,
        cancellationToken?: CancellationToken,
        onDownloadProgressChange?: (downloadedBytes: number, totalBytes: number | undefined) => void,
        settings?: FileDownloadSettings
    ): Promise<Uri>;

    listDownloadedItems(context: ExtensionContext): Promise<Uri[]>;

    getItem(filename: string, context: ExtensionContext): Promise<Uri>;

    tryGetItem(filename: string, context: ExtensionContext): Promise<Uri | undefined>;

    deleteItem(filename: string, context: ExtensionContext): Promise<void>;

    deleteAllItems(context: ExtensionContext): Promise<void>;
}
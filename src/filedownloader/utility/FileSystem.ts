// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { promisify } from "util";
import * as rimraf from "rimraf";

export const rimrafAsync = promisify(rimraf);
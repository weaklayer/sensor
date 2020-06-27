// SPDX-License-Identifier: AGPL-3.0-or-later

// Copyright (C) 2020 Mitchell Wasson

// This file is part of Weaklayer Sensor.

// Weaklayer Sensor is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU Affero General Public License for more details.

// You should have received a copy of the GNU Affero General Public License
// along with this program.  If not, see <https://www.gnu.org/licenses/>.

import { assert } from "../../common/utils/Assert"

import { setStorageValue, getStorageValue } from './Storage'
import { InstallResponse, isInstallResponse, normalizeInstallResponse } from "../install/InstallResponse"

export class LocalStorage {

    private constructor() { }

    private static readonly installInfoKey = 'installInfo'

    static async getInstallInfo(): Promise<InstallResponse> {
        const storageValue = await getStorageValue(LocalStorage.installInfoKey, k => browser.storage.local.get(k))
        assert(isInstallResponse(storageValue), `Value set for ${LocalStorage.installInfoKey} in local storage does not conform to the expected schema.`)
        return normalizeInstallResponse(storageValue)
    }

    static async setInstallInfo(installInfo: InstallResponse): Promise<void> {
        return setStorageValue(LocalStorage.installInfoKey, installInfo, (i) => browser.storage.local.set(i))
    }
}

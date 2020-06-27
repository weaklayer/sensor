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

import { InstallKey, isInstallKey, normalizeInstallKey, isChecksumValid } from "../install/InstallKey"
import { assert } from "../../common/utils/Assert"
import { getStorageValue, getStorageString } from './Storage'
import { SensorAPI, isSensorAPI, normalizeSensorAPI } from "./SensorAPI"

export class ManagedStorage {

    private constructor() { }

    // always just get these values from here to keep getting the fresh values
    // some way to invalidate things if these change?

    private static readonly installKeyKey = 'installKey'
    private static readonly labelKey = 'label'
    private static readonly apiKey = 'api'

    static async getInstalKey(): Promise<InstallKey> {
        const storageValue = await getStorageValue(ManagedStorage.installKeyKey, (k) => browser.storage.managed.get(k))

        assert(isInstallKey(storageValue), `Value set for ${ManagedStorage.installKeyKey} in managed storage does not conform to the expected schema.`)
        const installKey = normalizeInstallKey(storageValue)

        assert(await isChecksumValid(installKey), `Value set for ${ManagedStorage.installKeyKey} has a checksum that does not match.`)
        return installKey
    }

    static async getSensorLabel(): Promise<string> {
        return getStorageString(ManagedStorage.labelKey, /^.*$/, (k) => browser.storage.managed.get(k))
    }

    static async getSensorApiEndpoint(): Promise<string> {
        const api = await ManagedStorage.getSensorApi()
        return `${api.protocol}://${api.hostname}:${api.port}`
    }

    private static async getSensorApi(): Promise<SensorAPI> {
        const storageValue = await getStorageValue(ManagedStorage.apiKey, (k) => browser.storage.managed.get(k))
        assert(isSensorAPI(storageValue), `Value set for ${ManagedStorage.apiKey} in managed storage does not conform to the expected schema.`)
        return normalizeSensorAPI(storageValue)
    }
}

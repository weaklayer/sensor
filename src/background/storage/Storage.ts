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

type StorageGetter = (key?: string) => Promise<{ [key: string]: any }>
type StorageSetter = (items: { [key: string]: any }) => Promise<void>
type StorageRemover = (keys: string) => Promise<void>

export async function getStorageString(key: string, regex: RegExp, storageGetter: StorageGetter): Promise<string> {
    const storageValue = await getStorageValue(key, storageGetter)

    assert(typeof storageValue === 'string', `Value set for ${key} in storage is not the expected type of string.`)
    const stringValue: string = storageValue

    assert(regex.test(stringValue), `String value set for ${key} did not match the validation regex ${regex.toString()}.`)
    return stringValue
}

export async function getStorageValue(key: string, storageGetter: StorageGetter): Promise<any> {
    const storageDoc = await storageGetter(key)
    assert(key in storageDoc, `A value for ${key} was not found in storage.`)
    return storageDoc[key]
}

export async function setStorageValue(key: string, value: any, storageSetter: StorageSetter): Promise<void> {
    return storageSetter({ [key]: value })
}


export async function clearStorageValue(key: string, storageRemover: StorageRemover): Promise<void> {
    return storageRemover(key)
}

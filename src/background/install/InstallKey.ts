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

import { areArraysEqual } from '../../common/utils/ByteUtils'
import { toByteArray } from 'base64-js'
import { UUID } from '../../common/data/UUID'

const uuidRegex: RegExp = /^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/
const secretRegex: RegExp = /^[A-Za-z0-9+/]{86}==$/
const checksumRegex: RegExp = /^[A-Za-z0-9+/]{43}=$/

export interface InstallKey {
    group: string // normal uuid string
    secret: string // base64 encoded binary secret
    checksum: string // base64 encoded checksum of groupid and secret
}

export function normalizeInstallKey(installKey: InstallKey): InstallKey {
    return {
        group: installKey.group,
        secret: installKey.secret,
        checksum: installKey.checksum
    }
}

export function isInstallKey(data: any): data is InstallKey {
    const validGroup: boolean = 'group' in data && typeof data.group === 'string' && uuidRegex.test(data.group)
    if (!validGroup) {
        return false
    }

    const validSecret: boolean = 'secret' in data && typeof data.secret === 'string' && secretRegex.test(data.secret)
    if (!validSecret) {
        return false
    }

    const validCheckSum: boolean = 'checksum' in data && typeof data.checksum === 'string' && checksumRegex.test(data.checksum)
    if (!validCheckSum) {
        return false
    }

    return true
}

export async function isChecksumValid(installKey: InstallKey): Promise<boolean> {
    const calculatedChecksum = await calculateChecksum(UUID.fromString(installKey.group), toByteArray(installKey.secret))
    return areArraysEqual(calculatedChecksum, toByteArray(installKey.checksum))
}

export async function calculateChecksum(groupId: UUID, installSecret: Uint8Array): Promise<Uint8Array> {
    const arrayView: Uint8Array = new Uint8Array(80)
    arrayView.set(groupId.asBytes(), 0)
    arrayView.set(installSecret, 16)

    const calculatedHash = await crypto.subtle.digest('SHA-256', arrayView)

    return new Uint8Array(calculatedHash)
}

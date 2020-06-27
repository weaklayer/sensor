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

import { v4 as uuidv4 } from 'uuid'
import { hexStringToBytes, areArraysEqual } from '../utils/ByteUtils'
import { assert } from '../utils/Assert'

export class UUID {

    private readonly data: Uint8Array

    constructor(data: Uint8Array) {
        assert(data.length === 16, 'UUID is made of 16 bytes.')
        this.data = data
    }

    asBytes(): Uint8Array {
        return this.data
    }

    asString(): string {
        return uuidv4({ random: this.data })
    }

    static fromString(uuid: string): UUID {
        assert(uuid.length === 36, 'UUID strings must be 36 characters.')

        const stringSections = uuid.split('-')
        assert(stringSections.length === 5, 'UUID strings must have 4 hyphens.')

        const data = new Uint8Array(16)

        const sectionLengths = [8, 4, 4, 4, 12]
        const byteOffsets = [0, 4, 6, 8, 10]
        for (let i = 0; i < 5; i++) {
            const section = stringSections[i]
            assert(section.length === sectionLengths[i], 'UUID string not properly formatted.')
            hexStringToBytes(section, data, byteOffsets[i])
        }

        return new UUID(data)
    }

    static newRandomUuid(): UUID {
        const data = new Uint8Array(16)
        uuidv4({}, data)
        return new UUID(data)
    }

    static equals(uuid1: UUID, uuid2: UUID): boolean {
        return areArraysEqual(uuid1.asBytes(), uuid2.asBytes())
    }
}

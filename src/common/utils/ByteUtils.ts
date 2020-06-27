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

import { assert } from './Assert'

export function hexStringToBytes(hexString: string, dest: Uint8Array, offset: number) {
    const lowercaseHexString = hexString.toLowerCase()

    assert(lowercaseHexString.length % 2 === 0, 'Hex string must have an even number of characters to convert to bytes')

    for (let i = 0; i < lowercaseHexString.length; i = i + 2) {
        const char1 = lowercaseHexString.charCodeAt(i)
        const char2 = lowercaseHexString.charCodeAt(i + 1)

        assert(isLowerCaseHexChar(char1) && isLowerCaseHexChar(char2), 'Hex strings must only contain hexadecimal characters.')

        dest[offset + i / 2] = parseInt(String.fromCharCode(char1, char2), 16)
    }
}

function isLowerCaseHexChar(char: number): boolean {
    return ((48 <= char) && (char <= 57)) || ((97 <= char) && (char <= 102))
}

export function areArraysEqual(array1: Uint8Array, array2: Uint8Array): boolean {
    if (array1.length !== array2.length) {
        return false
    }

    for (let i = 0; i < array1.length; i++) {
        if (array1[i] !== array2[i]) {
            return false
        }
    }

    return true
}

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

import { hexStringToBytes, areArraysEqual } from './ByteUtils'
import { assert } from 'chai'
import { test, suite } from 'mocha';

suite('Byte Utils', () => {

    test('Hex string to byte conversion', () => {
        const hexString = '300aaacd'
        const expectedBytes = new Uint8Array([48, 10, 170, 205])

        const destinationArray = new Uint8Array(4)
        hexStringToBytes(hexString, destinationArray, 0)

        assert.deepStrictEqual(expectedBytes, destinationArray)
    })

    test('Byte array equality', () => {
        const array: Uint8Array = new Uint8Array([1, 2, 3, 4, 5, 6])
        const equalArray: Uint8Array = new Uint8Array([1, 2, 3, 4, 5, 6])
        const moreNumbersArray: Uint8Array = new Uint8Array([1, 2, 3, 4, 5, 6, 7])
        const differentNumbersArray: Uint8Array = new Uint8Array([1, 2, 3, 77, 5, 6])

        assert.isTrue(areArraysEqual(array, equalArray), "Equal arrays indentified as not equal")
        assert.isFalse(areArraysEqual(array, moreNumbersArray), "Not equal arrays identified as equal")
        assert.isFalse(areArraysEqual(array, differentNumbersArray), "Not equal arrays identified as equal")
    })

})

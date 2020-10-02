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

import { assert } from 'chai'
import { test, suite } from 'mocha';
import { HashKeyManager } from './HashKeyManager';

suite('HashKeyManager', () => {

    test('Generates and stores new hash key', async () => {
        const key: Uint8Array = new Uint8Array([1, 2, 3, 4, 5, 6, 7, 8, 1, 2, 3, 4, 5, 6, 7, 8, 1, 2, 3, 4, 5, 6, 7, 8, 1, 2, 3, 4, 5, 6, 7, 8, 1, 2, 3, 4, 5, 6, 7, 8, 1, 2, 3, 4, 5, 6, 7, 8, 1, 2, 3, 4, 5, 6, 7, 8, 1, 2, 3, 4, 5, 6, 7, 8])

        let keyStorage: Uint8Array | undefined = undefined

        const hashKeyManager = new HashKeyManager(
            () => { throw new Error('no hash key') },
            async (key) => { keyStorage = key },
            async () => { keyStorage = undefined },
            () => key
        )

        const newKey = await hashKeyManager.getHashKey()

        assert(keyStorage === key, "Stored key doesn't match expected")
        assert(newKey === key, "Newly generated key doesn't match expected")

        const cachedKey = await hashKeyManager.getHashKey()

        assert(cachedKey === key, "Cached key doesn't match expected")

        await hashKeyManager.clearHashKey()

        assert(keyStorage === undefined, "Stored key was not successfully cleared")
    })

    test('Returns stored hash key', async () => {
        const key: Uint8Array = new Uint8Array([1, 2, 3, 4, 5, 6, 7, 8, 1, 2, 3, 4, 5, 6, 7, 8, 1, 2, 3, 4, 5, 6, 7, 8, 1, 2, 3, 4, 5, 6, 7, 8, 1, 2, 3, 4, 5, 6, 7, 8, 1, 2, 3, 4, 5, 6, 7, 8, 1, 2, 3, 4, 5, 6, 7, 8, 1, 2, 3, 4, 5, 6, 7, 8])

        const hashKeyManager = new HashKeyManager(
            async () => { return key },
            async (key) => { throw new Error("This shouldn't be called") },
            async () => { throw new Error("This shouldn't be called") },
            () => key
        )

        const storedKey = await hashKeyManager.getHashKey()

        assert(storedKey === key, "Key retrieved from storage doesn't match expected")

        const cachedKey = await hashKeyManager.getHashKey()

        assert(cachedKey === key, "Cached key doesn't match expected")
    })
})

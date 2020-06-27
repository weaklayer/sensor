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

import { UUID } from './UUID'
import { assert } from 'chai'
import { test, suite } from 'mocha';

suite('UUID', () => {

    test('UUID string operations', () => {
        const uuidString = '04a9104b-4b2e-4399-9cdd-b1f44886dc3c'
        const uuid = UUID.fromString(uuidString)
        const uuidString2 = uuid.asString()
        assert.strictEqual(uuidString2, uuidString, 'Parsed UUID did not match original string')
    })

    test('UUID byte operations', () => {
        const uuid1 = UUID.newRandomUuid()
        const bytes = uuid1.asBytes()

        const uuid2 = new UUID(bytes)

        assert.isTrue(UUID.equals(uuid1, uuid2))
    })

})

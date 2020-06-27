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

import { Lock } from './Lock'
import { assert } from 'chai'
import { test, suite } from 'mocha';


suite('Lock', () => {

    test('Synchronously execute with lock', async () => {
        const lock = new Lock()
        const executeOrder = new Array<string>()

        async function action(name: string) {
            executeOrder.push(name)
        }

        const actionOneDone = lock.syncExecute((s) => action(s), "one")
        const actionTwoDone = lock.syncExecute((s) => action(s), "two")

        await actionOneDone
        await actionTwoDone

        assert.deepStrictEqual(executeOrder, ["one", "two"])
    })

})

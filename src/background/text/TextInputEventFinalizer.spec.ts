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
import { TextInputEvent, createTextInputEvent } from '../../common/events/TextInputEvent'
import { TextInputEventFinalizer } from './TextInputEventFinalizer'
import { fromByteArray } from 'base64-js'

suite('TextInputEventFinalizer', () => {
    test('Calculates hash and removes text', async () => {
        const hash = new Uint8Array([1, 2, 3, 4, 5, 6, 7, 8, 1, 2, 3, 4, 5, 6, 7, 8, 1, 2, 3, 4, 5, 6, 7, 8, 1, 2, 3, 4, 5, 6, 7, 8])
        const finalizer = new TextInputEventFinalizer(async (text) => hash)

        const event: TextInputEvent = createTextInputEvent('hello', 'text', 1, 2)

        const finalizedEvents = await finalizer.processTextInputEvents([event])

        assert(finalizedEvents[0].textHash === fromByteArray(hash), 'Finalized text input event hash incorrect')
        assert(finalizedEvents[0].text === undefined, 'Finalized text input event contains text field')
    })
})

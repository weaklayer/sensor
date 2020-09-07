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

import { TextInputEvent, createTextInputEvent, isTextInputEvent, normalizeTextInputEvent, textInputEventType } from './TextInputEvent'
import { assert } from 'chai'
import { test, suite } from 'mocha'

suite('TextInputEvent', () => {

    test('TextInputEvent verification', () => {
        const event1: TextInputEvent = createTextInputEvent('hello', 'password', 2, 5)
        assert.isTrue(isTextInputEvent(event1), "Valid event identified as invalid")

        const event2: TextInputEvent = {
            type: textInputEventType,
            time: 3,
            text: undefined,
            hash: 'jvqWXRmh9JAnbwDS19W59lOJXD2dZuRglhFtsJzDedU=',
            inputElementType: 'password',
            windowLocationReference: 6
        }
        assert.isTrue(isTextInputEvent(event2), "Valid event identified as invalid")
    })

    test('TextInputEvent normalization', () => {
        const event: any = {
            type: textInputEventType,
            time: 3,
            text: undefined,
            hash: 'jvqWXRmh9JAnbwDS19W59lOJXD2dZuRglhFtsJzDedU=',
            inputElementType: 'password',
            windowLocationReference: 6,
            extra: "gsdfgfdshgsdfhsgfhdf"
        }

        assert.isTrue(isTextInputEvent(event))
        assert.isTrue('extra' in event, "Test base event missing extra field")

        const normalizedEvent = normalizeTextInputEvent(event)

        assert.isTrue(isTextInputEvent(normalizedEvent), "Valid event identified as invalid")
        assert.isFalse('extra' in normalizedEvent, "Extra field present in normalized event")

    })

})

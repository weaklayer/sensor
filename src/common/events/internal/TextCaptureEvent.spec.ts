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

import { TextCaptureEvent, createTextCaptureEvent, isTextCaptureEvent, normalizeTextCaptureEvent, textCaptureEventType } from './TextCaptureEvent'
import { assert } from 'chai'
import { test, suite } from 'mocha'

suite('TextCaptureEvent', () => {

    test('TextCaptureEvent verification', () => {
        const event1: TextCaptureEvent = createTextCaptureEvent('hello', 'password', 22, 2, 5)
        assert.isTrue(isTextCaptureEvent(event1), "Valid event identified as invalid")

        const event2: TextCaptureEvent = {
            type: textCaptureEventType,
            time: 3,
            text: 'hello',
            textType: 'password',
            windowReference: 100,
            elementReference: 3,
            windowLocationReference: 6
        }
        assert.isTrue(isTextCaptureEvent(event2), "Valid event identified as invalid")
    })

    test('TextCaptureEvent normalization', () => {
        const event: any = {
            type: textCaptureEventType,
            time: 3,
            text: '',
            textType: 'password',
            windowReference: 100,
            elementReference: 3,
            windowLocationReference: 6,
            extra: "gsdfgfdshgsdfhsgfhdf"
        }

        assert.isTrue(isTextCaptureEvent(event))
        assert.isTrue('extra' in event, "Test base event missing extra field")

        const normalizedEvent = normalizeTextCaptureEvent(event)

        assert.isTrue(isTextCaptureEvent(normalizedEvent), "Valid event identified as invalid")
        assert.isFalse('extra' in normalizedEvent, "Extra field present in normalized event")

    })

})

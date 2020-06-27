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

import { WindowEvent, isWindowEvent, createWindowEvent, normalizeWindowEvent } from './WindowEvent'
import { assert } from 'chai'
import { test, suite } from 'mocha';

suite('WindowEvent', () => {

    test('WindowEvent verification', () => {
        const event1: WindowEvent = createWindowEvent()

        const event2 = {
            type: "Window",
            time: 1324125,
            extra: "heeyyyyyyyyyy"
        }

        const badEvent1 = {
            type: ""
        }

        const badEvent2 = {
            type: "",
            time: 1324125.435
        }

        const badEvent3 = {
            type: 4234
        }

        const badEvent4 = {
            extra: "heeyyyyyyyyyy"
        }


        assert.isTrue(isWindowEvent(event1), "Valid event identified as invalid")
        assert.isTrue(isWindowEvent(event2), "Valid event identified as invalid")
        assert.isFalse(isWindowEvent(badEvent1), "Invalid event identified as valid")
        assert.isFalse(isWindowEvent(badEvent2), "Invalid event identified as valid")
        assert.isFalse(isWindowEvent(badEvent3), "Invalid event identified as valid")
        assert.isFalse(isWindowEvent(badEvent4), "Invalid event identified as valid")
    })

    test('WindowEvent normalization', () => {
        const event = {
            type: "Window",
            time: 1324125,
            extra: "heeyyyyyyyyyy"
        }

        assert.isTrue(isWindowEvent(event), "Valid event identified as invalid")
        assert.isTrue('extra' in event, "Test base event missing extra field")

        const normalizedEvent = normalizeWindowEvent(event)

        assert.isTrue(isWindowEvent(normalizedEvent), "Valid event identified as invalid")
        assert.isFalse('extra' in normalizedEvent, "Extra field present in normalized event")
    })

})

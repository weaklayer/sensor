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

import { WindowLocationEvent, createWindowLocationEvent, isWindowLocationEvent, normalizeWindowLocationEvent } from './WindowLocationEvent'
import { assert } from 'chai'
import { test, suite } from 'mocha'
import { JSDOM } from 'jsdom'

suite('WindowLocationEvent', () => {

    test('WindowLocationEvent verification', () => {
        const w = new JSDOM('', {
            url: "https://weaklayer.com:8443/stuff?hello=true#SectionTitle"
        }).window

        const windowRef = 1
        const event1: WindowLocationEvent = createWindowLocationEvent(windowRef, () => w.location)

        const event2 = {
            type: "Window",
            time: 1324125,
        }

        assert.isTrue(isWindowLocationEvent(event1), "Valid event identified as invalid")
        assert.isFalse(isWindowLocationEvent(event2), "Other event type identified as WindowLocation")
    })


    test('WindowLocationEvent normalization', () => {
        const w = new JSDOM('', {
            url: "https://weaklayer.com:8443/stuff?hello=true#SectionTitle"
        }).window

        const windowRef = 1
        const event: any = createWindowLocationEvent(windowRef, () => w.location)
        event.extra = "gsdfgfdshgsdfhsgfhdf"

        assert.isTrue(isWindowLocationEvent(event))
        assert.isTrue('extra' in event, "Test base event missing extra field")

        const normalizedEvent = normalizeWindowLocationEvent(event)

        assert.isTrue(isWindowLocationEvent(normalizedEvent), "Valid event identified as invalid")
        assert.isFalse('extra' in normalizedEvent, "Extra field present in normalized event")
    })

    test('Window with no explicit port set', () => {
        const w = new JSDOM('', {
            url: "https://weaklayer.com/stuff?hello=true#SectionTitle"
        }).window

        const windowRef = 1
        const event: WindowLocationEvent = createWindowLocationEvent(windowRef, () => w.location)

        assert.strictEqual(event.port, 0, "Port set to non-zero value by default")
    })
})

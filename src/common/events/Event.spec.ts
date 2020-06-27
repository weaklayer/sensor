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

import { Event, getEventTime, isEventTime, isEvent } from './Event'
import { assert } from 'chai'
import { test, suite } from 'mocha';

suite('Event', () => {

    test('Event time generation produces sane values', () => {
        const nowMillis = Date.now() * 1000
        const eventTime = getEventTime()

        assert.isTrue(eventTime >= nowMillis, "Generated event time is in the past")
    })

    test('Event time verification works in both directions', () => {
        const eventTime = getEventTime()
        const fraction = 134123412342.13241234
        const negative = -23523452
        const zero = 0

        assert.isTrue(isEventTime(eventTime), "Generated event time identified as invalid")
        assert.isTrue(isEventTime(zero), "Zero value event time identified as invalid")
        assert.isFalse(isEventTime(fraction), "Fractional event time identified as valid")
        assert.isFalse(isEventTime(negative), "Negative event time identified as valid")
    })

    test('Event verification', () => {
        const event1: Event = {
            type: "Window",
            time: 264362
        }

        const event2 = {
            type: "",
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


        assert.isTrue(isEvent(event1), "Valid event identified as invalid")
        assert.isTrue(isEvent(event2), "Valid event identified as invalid")
        assert.isFalse(isEvent(badEvent1), "Invalid event identified as valid")
        assert.isFalse(isEvent(badEvent2), "Invalid event identified as valid")
        assert.isFalse(isEvent(badEvent3), "Invalid event identified as valid")
        assert.isFalse(isEvent(badEvent4), "Invalid event identified as valid")
    })

})

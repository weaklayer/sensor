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

import { EventCollector } from './EventCollector'
import { assert } from 'chai'
import { test, suite } from 'mocha';

import { Semaphore } from '../common/concurrent/Semaphore'
import { Event } from '../common/events/Event';
import { JSDOM } from 'jsdom'


suite('EventCollector', () => {

    test('Process on immediate timeout', async () => {
        const fakeDom = new JSDOM()
        const semaphore = new Semaphore()

        var capturedEvent: Event | undefined = undefined

        const eventCollector = new EventCollector(async (events) => {
            capturedEvent = events[0]
            semaphore.setSignal()
        }, Number.MAX_SAFE_INTEGER, 1)

        const event: Event = { type: "Window", time: 1234 }
        eventCollector.consumeEvents([event], fakeDom.window)

        await semaphore.getSignal()

        assert.strictEqual(capturedEvent, event, "Captured event not equal")
    })


    test('Process on overall timeout', async () => {
        const fakeDom = new JSDOM()
        const semaphore = new Semaphore()

        var capturedEvent: Event | undefined = undefined

        const eventCollector = new EventCollector(async (events) => {
            capturedEvent = events[0]
            semaphore.setSignal()
        }, 1, Number.MAX_SAFE_INTEGER)

        const event: Event = { type: "Window", time: 1234 }
        eventCollector.consumeEvents([event], fakeDom.window)

        await semaphore.getSignal()

        assert.strictEqual(capturedEvent, event, "Captured event not equal")
    })
})

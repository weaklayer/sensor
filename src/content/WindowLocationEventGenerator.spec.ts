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

import { WindowLocationEventGenerator } from './WindowLocationEventGenerator'
import { WindowLocationEvent } from '../common/events/WindowLocationEvent'
import { assert } from 'chai'
import { test, suite } from 'mocha';
import { JSDOM } from 'jsdom'

import { Semaphore } from '../common/concurrent/Semaphore'


suite('WindowLocationEventGeneration', () => {

    test('Event generation on url change', async () => {
        const fakeDom = new JSDOM('', {
            url: "https://weaklayer.com:8443/stuff?hello=true#SectionTitle"
        })

        const semaphore1 = new Semaphore()
        let semaphore1set = false
        const semaphore2 = new Semaphore()

        let event1: WindowLocationEvent | undefined = undefined
        let event2: WindowLocationEvent | undefined = undefined

        const generator = new WindowLocationEventGenerator(1, () => fakeDom.window.location, (e) => {
            if (!semaphore1set) {
                event1 = e
                semaphore1set = true
                semaphore1.setSignal()
            } else {
                event2 = e
                semaphore2.setSignal()
            }
        }, 1)

        await semaphore1.getSignal()
        assert.isDefined(event1, "First event not set properly")
        const windowEvent1: WindowLocationEvent = event1 as unknown as WindowLocationEvent
        assert.strictEqual(windowEvent1.port, 8443, "First event port incorrect")

        fakeDom.reconfigure({
            url: "https://weaklayer.com:9443/stuff?hello=true#SectionTitle"
        })

        await semaphore2.getSignal()
        assert.isDefined(event2, "Second event not set properly")
        const windowEvent2: WindowLocationEvent = event2 as unknown as WindowLocationEvent
        assert.strictEqual(windowEvent2.port, 9443, "Second event port incorrect")

        // This is needed or the test won't stop because of the chained timers
        generator.stop()
    })

})

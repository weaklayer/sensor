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
import { createTextCaptureEvent } from '../../common/events/internal/TextCaptureEvent'
import { TextCaptureSession } from './TextCaptureSession'

suite('TextCaptureSession', () => {
    test('Prunes uninteresting events', async () => {
        const textCaptureSession = new TextCaptureSession()

        const event1 = createTextCaptureEvent('h', 'text', 22, 1, 2)
        const event2 = createTextCaptureEvent('he', 'text', 22, 1, 2)
        const event3 = createTextCaptureEvent('hel', 'text', 22, 1, 2)
        const event4 = createTextCaptureEvent('hell', 'text', 22, 1, 2)
        const event5 = createTextCaptureEvent('hello', 'text', 22, 1, 2)
        const event6 = createTextCaptureEvent('hell', 'text', 22, 1, 2)
        const event7 = createTextCaptureEvent('hel', 'text', 22, 1, 2)
        const event8 = createTextCaptureEvent('he', 'text', 22, 1, 2)


        // track out of order. should get sorted inside
        textCaptureSession.trackTextCapture(event5)
        textCaptureSession.trackTextCapture(event2)
        textCaptureSession.trackTextCapture(event4)
        textCaptureSession.trackTextCapture(event3)
        textCaptureSession.trackTextCapture(event1)
        textCaptureSession.trackTextCapture(event6)
        textCaptureSession.trackTextCapture(event7)
        textCaptureSession.trackTextCapture(event8)

        const events = textCaptureSession.getInterestingTextCaptures()

        assert(events.length === 3, 'Wrong number of interesting text Capture events')
        assert(events[0].text === 'h', 'Incorrect first event')
        assert(events[1].text === 'hello', 'Incorrect second event')
        assert(events[2].text === 'he', 'Incorrect third event')
    })

    test('Prunes with repeated strings at apex', async () => {
        const textCaptureSession = new TextCaptureSession()

        const event1 = createTextCaptureEvent('h', 'text', 22, 1, 2)
        const event2 = createTextCaptureEvent('he', 'text', 22, 1, 2)
        const event3 = createTextCaptureEvent('hel', 'text', 22, 1, 2)
        const event4 = createTextCaptureEvent('hell', 'text', 22, 1, 2)
        const event5 = createTextCaptureEvent('hello', 'text', 22, 1, 2)
        const event6 = createTextCaptureEvent('hello', 'text', 22, 1, 2)
        const event7 = createTextCaptureEvent('hello', 'text', 22, 1, 2)
        const event8 = createTextCaptureEvent('hell', 'text', 22, 1, 2)
        const event9 = createTextCaptureEvent('hel', 'text', 22, 1, 2)
        const event10 = createTextCaptureEvent('he', 'text', 22, 1, 2)


        // track out of order. should get sorted inside
        textCaptureSession.trackTextCapture(event5)
        textCaptureSession.trackTextCapture(event2)
        textCaptureSession.trackTextCapture(event4)
        textCaptureSession.trackTextCapture(event3)
        textCaptureSession.trackTextCapture(event1)
        textCaptureSession.trackTextCapture(event9)
        textCaptureSession.trackTextCapture(event6)
        textCaptureSession.trackTextCapture(event10)
        textCaptureSession.trackTextCapture(event7)
        textCaptureSession.trackTextCapture(event8)

        const events = textCaptureSession.getInterestingTextCaptures()

        assert(events.length === 3, 'Wrong number of interesting text Capture events')
        assert(events[0].text === 'h', 'Incorrect first event')
        assert(events[1].text === 'hello', 'Incorrect second event')
        assert(events[2].text === 'he', 'Incorrect third event')
    })
})

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
import { TextInputSession } from './TextInputSession'

suite('TextInputSession', () => {
    test('Prunes uninteresting events', async () => {
        const textInputSession = new TextInputSession()

        const event1: TextInputEvent = createTextInputEvent('h', 'text', 1, 2)
        const event2: TextInputEvent = createTextInputEvent('he', 'text', 1, 2)
        const event3: TextInputEvent = createTextInputEvent('hel', 'text', 1, 2)
        const event4: TextInputEvent = createTextInputEvent('hell', 'text', 1, 2)
        const event5: TextInputEvent = createTextInputEvent('hello', 'text', 1, 2)
        const event6: TextInputEvent = createTextInputEvent('hell', 'text', 1, 2)
        const event7: TextInputEvent = createTextInputEvent('hel', 'text', 1, 2)
        const event8: TextInputEvent = createTextInputEvent('he', 'text', 1, 2)


        // track out of order. should get sorted inside
        textInputSession.trackTextInput(event5)
        textInputSession.trackTextInput(event2)
        textInputSession.trackTextInput(event4)
        textInputSession.trackTextInput(event3)
        textInputSession.trackTextInput(event1)
        textInputSession.trackTextInput(event6)
        textInputSession.trackTextInput(event7)
        textInputSession.trackTextInput(event8)

        const events = textInputSession.getInterestingTextInputs()

        assert(events.length === 3, 'Wrong number of interesting text input events')
        assert(events[0].text === 'h', 'Incorrect first event')
        assert(events[1].text === 'hello', 'Incorrect second event')
        assert(events[2].text === 'he', 'Incorrect third event')
    })
})

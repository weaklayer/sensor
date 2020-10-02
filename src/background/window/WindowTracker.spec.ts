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
import { createWindowEvent, WindowEvent } from '../../common/events/WindowEvent';
import { WindowMetadata } from './WindowMetadata';
import { WindowTracker } from './WindowTracker'

suite('WindowTracker', () => {
    test('Correctly classifies windows', async () => {
        const windowTracker = new WindowTracker()

        const topLevelWindowMeta: WindowMetadata = new WindowMetadata(1, 0)
        const topLevelWindowEvent: WindowEvent = createWindowEvent()
        windowTracker.mutateWindow(topLevelWindowEvent, topLevelWindowMeta)
        assert(topLevelWindowEvent.isTopLevelWindow, "Top level window not marked as such")
        assert(topLevelWindowEvent.topLevelWindowReference === topLevelWindowEvent.time, "Top level window didn't reference itself")

        const childWindowMeta: WindowMetadata = new WindowMetadata(1, 233)
        const childWindowEvent: WindowEvent = createWindowEvent()
        windowTracker.mutateWindow(childWindowEvent, childWindowMeta)
        assert(!childWindowEvent.isTopLevelWindow, "Child window marked as top level window")
        assert(childWindowEvent.topLevelWindowReference === topLevelWindowEvent.time, "Child window does not reference top-level window")
    })
})

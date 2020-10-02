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

import { getEventTime, Event, isEvent, isEventTime } from './Event'

export const windowEventType = 'Window'

export interface WindowEvent extends Event {
    isTopLevelWindow: boolean
    topLevelWindowReference: number
}

export function createWindowEvent(): WindowEvent {
    return {
        type: windowEventType,
        time: getEventTime(),
        isTopLevelWindow: false,
        topLevelWindowReference: 0
    }
}

export function isWindowEvent(data: any): data is WindowEvent {
    const validEvent: boolean = isEvent(data) && data.type === windowEventType

    const validIsTopLevelWindow: boolean = 'isTopLevelWindow' in data && typeof data.isTopLevelWindow === 'boolean'
    const validTopLevelWindowReference: boolean = 'topLevelWindowReference' in data && typeof data.topLevelWindowReference === 'number' && isEventTime(data.topLevelWindowReference)

    return validEvent && validIsTopLevelWindow && validTopLevelWindowReference
}

export function normalizeWindowEvent(event: WindowEvent): WindowEvent {
    return {
        type: windowEventType,
        time: event.time,
        isTopLevelWindow: event.isTopLevelWindow,
        topLevelWindowReference: event.topLevelWindowReference,
    }
}

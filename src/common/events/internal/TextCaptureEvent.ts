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

import { isEvent, isEventTime, Event, getEventTime } from '../Event'

export const textCaptureEventType = 'TextCapture'

export interface TextCaptureEvent extends Event {
    text: string
    textType: string
    windowReference: number
    windowLocationReference: number
    elementReference: number
}

export function isTextCaptureEvent(data: any): data is TextCaptureEvent {
    const validEvent: boolean = isEvent(data) && data.type === textCaptureEventType

    const validText: boolean = 'text' in data && typeof data.text === 'string'
    const validTextType: boolean = 'textType' in data && typeof data.textType === 'string'

    const validWindowReference: boolean = 'windowReference' in data && typeof data.windowReference === 'number' && isEventTime(data.windowReference)
    const validWindowLocationReference: boolean = 'windowLocationReference' in data && typeof data.windowLocationReference === 'number' && isEventTime(data.windowLocationReference)
    const validElementReference = 'elementReference' in data && typeof data.elementReference === 'number' && isEventTime(data.elementReference)


    return validEvent && validText && validTextType && validWindowReference && validWindowLocationReference && validElementReference
}

export function normalizeTextCaptureEvent(event: TextCaptureEvent): TextCaptureEvent {
    return {
        type: textCaptureEventType,
        time: event.time,
        text: event.text,
        textType: event.textType,
        windowReference: event.windowReference,
        windowLocationReference: event.windowLocationReference,
        elementReference: event.elementReference
    }
}

export function createTextCaptureEvent(text: string | undefined, textType: string, windowReference: number, windowLocationReference: number, elementReference: number): TextCaptureEvent {
    const t = text || ''  // Events with missing text somehow seem to happen on occasion

    return {
        type: textCaptureEventType,
        time: getEventTime(),
        text: t,
        textType: textType,
        windowReference: windowReference,
        windowLocationReference: windowLocationReference,
        elementReference: elementReference
    }
}

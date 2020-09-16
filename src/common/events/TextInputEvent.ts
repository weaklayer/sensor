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

import { isEvent, isEventTime, Event, getEventTime } from './Event'

export const textInputEventType = 'TextInput'
const hashRegex: RegExp = /^[A-Za-z0-9+/]{43}=$/

export interface TextInputEvent extends Event {
    text?: string // this can be undefined because we want to remove it from the event after a hash is calculated
    textHash?: string // this can be undefined because it will start as undefined and is later calculated by the background script
    textLength: number
    textType: string
    elementReference: number
    windowLocationReference: number
}

export function isTextInputEvent(data: any): data is TextInputEvent {
    const validEvent: boolean = isEvent(data) && data.type === textInputEventType

    const textPresent: boolean = 'text' in data && typeof data.text !== 'undefined'
    const validText: boolean = !textPresent || (textPresent && typeof data.text === 'string')

    const hashPresent: boolean = 'textHash' in data && typeof data.textHash !== 'undefined'
    const validHash: boolean = !hashPresent || (hashPresent && typeof data.textHash === 'string' && hashRegex.test(data.textHash))

    const validTextLength: boolean = 'textLength' in data && typeof data.textLength === 'number' && data.textLength >= 0

    const validTextType: boolean = 'textType' in data && typeof data.textType === 'string'
    const validWindowLocationReference: boolean = 'windowLocationReference' in data && typeof data.windowLocationReference === 'number' && isEventTime(data.windowLocationReference)

    const validElementReference = 'elementReference' in data && typeof data.elementReference === 'number' && isEventTime(data.elementReference)

    const textXorHashPresent: boolean = ((textPresent || !hashPresent) || (!textPresent || hashPresent))

    return validEvent && validText && validHash && textXorHashPresent && validTextLength && validTextType && validWindowLocationReference && validElementReference
}

export function normalizeTextInputEvent(event: TextInputEvent): TextInputEvent {
    return {
        type: textInputEventType,
        time: event.time,
        text: event.text,
        textHash: event.textHash,
        textLength: event.textLength,
        textType: event.textType,
        windowLocationReference: event.windowLocationReference,
        elementReference: event.elementReference
    }
}

export function createTextInputEvent(text: string, textType: string, windowLocationReference: number, elementReference: number): TextInputEvent {

    return {
        type: textInputEventType,
        time: getEventTime(),
        text: text,
        textLength: text?.length || 0, // Events with missing text still seem to make it to the background script event though they are created with this
        textType: textType,
        windowLocationReference: windowLocationReference,
        elementReference: elementReference
    }
}

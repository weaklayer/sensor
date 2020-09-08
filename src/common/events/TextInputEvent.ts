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
    hash?: string // this can be undefined because it will start as undefined and be calculated later
    inputElementType: string
    inputElementReference: number
    windowLocationReference: number
}

export function isTextInputEvent(data: any): data is TextInputEvent {
    const validEvent: boolean = isEvent(data) && data.type === textInputEventType

    const textPresent: boolean = 'text' in data && typeof data.text !== 'undefined'
    const validText: boolean = !textPresent || (textPresent && typeof data.text === 'string')

    const hashPresent: boolean = 'hash' in data && typeof data.hash !== 'undefined'
    var validHash: boolean = !hashPresent || (hashPresent && typeof data.hash === 'string' && hashRegex.test(data.hash))

    const validInputElementType: boolean = 'inputElementType' in data && typeof data.inputElementType === 'string'
    const validWindowLocationReference: boolean = 'windowLocationReference' in data && typeof data.windowLocationReference === 'number' && isEventTime(data.windowLocationReference)

    const validInputElementReference = 'inputElementReference' in data && typeof data.inputElementReference === 'number' && isEventTime(data.inputElementReference)

    const textXorHashPresent: boolean = ((textPresent || !hashPresent) || (!textPresent || hashPresent))

    return validEvent && validText && validHash && textXorHashPresent && validInputElementType && validWindowLocationReference && validInputElementReference
}

export function normalizeTextInputEvent(event: TextInputEvent): TextInputEvent {
    return {
        type: textInputEventType,
        time: event.time,
        text: event.text,
        hash: event.hash,
        inputElementType: event.inputElementType,
        windowLocationReference: event.windowLocationReference,
        inputElementReference: event.inputElementReference
    }
}

export function createTextInputEvent(text: string, inputElementType: string, windowLocationReference: number, inputElementReference: number): TextInputEvent {

    return {
        type: textInputEventType,
        time: getEventTime(),
        text: text,
        inputElementType: inputElementType,
        windowLocationReference: windowLocationReference,
        inputElementReference: inputElementReference
    }
}

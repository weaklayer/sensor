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

import { TextInputEvent, createTextInputEvent } from '../../common/events/TextInputEvent'
import { fromByteArray } from 'base64-js'
import { TextCaptureEvent } from '../../common/events/internal/TextCaptureEvent'

export class TextInputEventFinalizer {

    private readonly textHasher: (text: string) => Promise<Uint8Array>

    constructor(textHasher: (text: string) => Promise<Uint8Array>) {
        this.textHasher = textHasher
    }

    async processTextCaptureEvents(events: Array<TextCaptureEvent>): Promise<Array<TextInputEvent>> {

        return Promise.all(events.map(async (e) => {
            // normalize the text before hashing.
            // this will avoid equivalent strings not matching because of different unicode representations
            // see https://flaviocopes.com/javascript-unicode/ for examples
            const hash = await this.textHasher(e.text.normalize())

            const textInputEvent = createTextInputEvent(e.time, fromByteArray(hash), e.text.length, e.inputType, e.windowLocationReference)

            return textInputEvent
        }))
    }
}
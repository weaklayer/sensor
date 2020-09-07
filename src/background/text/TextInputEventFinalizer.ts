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

import { TextInputEvent } from '../../common/events/TextInputEvent'
import { KeyedHasher } from "./KeyedHasher"
import { fromByteArray } from 'base64-js'

export class TextInputEventFinalizer {

    private readonly textHasher: KeyedHasher

    constructor(textHasher: KeyedHasher) {
        this.textHasher = textHasher
    }

    async processTextInputEvents(events: Array<TextInputEvent>): Promise<Array<TextInputEvent>> {

        return Promise.all(events.map(async (e) => {
            if (e.text) {
                const hash = await this.textHasher.computeStringHash(e.text)
                e.hash = fromByteArray(hash)
            }
            e.text = undefined
            e.inputElementReference = undefined

            return e
        }))
    }
}
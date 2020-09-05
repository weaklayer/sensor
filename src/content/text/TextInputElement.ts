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

export class TextInputElement {

    private readonly element: HTMLTextAreaElement | HTMLInputElement

    private readonly windowLocationEventTimestampProducer: () => number

    private readonly textInputEventConsumer: (e: TextInputEvent) => void

    constructor(element: HTMLTextAreaElement | HTMLInputElement, windowLocationEventTimestampProducer: () => number, textInputEventConsumer: (e: TextInputEvent) => void) {
        this.element = element
        this.windowLocationEventTimestampProducer = windowLocationEventTimestampProducer
        this.textInputEventConsumer = textInputEventConsumer

        element.addEventListener("input", (e) => this.inputChangeHandler())
    }

    private inputChangeHandler(): void {
        const event = createTextInputEvent(this.element.value, this.element.type, this.windowLocationEventTimestampProducer())
        this.textInputEventConsumer(event)
    }
}

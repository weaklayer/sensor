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

import { TextCaptureEvent, createTextCaptureEvent } from '../../../common/events/internal/TextCaptureEvent'
import { getEventTime } from "../../../common/events/Event"

// Filter the input elements that don't take text
const nonTextInputTypesArray = ['button', 'checkbox', 'color', 'file', 'image', 'radio', 'range', 'reset', 'submit']
const nonTextInputTypes: Set<string> = new Set<string>()
nonTextInputTypesArray.forEach(nonTextInputType => {
    nonTextInputTypes.add(nonTextInputType.toLowerCase())
})

export class HTMLInputEventManager {

    private readonly elementReferences: Map<HTMLInputElement | HTMLTextAreaElement, number> = new Map<HTMLInputElement | HTMLTextAreaElement, number>()

    private readonly windowReference: number

    private readonly eventConsumer: (event: TextCaptureEvent) => void

    private readonly windowLocationReferenceSupplier: () => number

    constructor(windowReference: number, windowLocationReferenceSupplier: () => number, eventConsumer: (event: TextCaptureEvent) => void) {
        this.windowReference = windowReference
        this.eventConsumer = eventConsumer
        this.windowLocationReferenceSupplier = windowLocationReferenceSupplier
    }

    trackTextInput(inputEvent: InputEvent) {
        const targetElement = inputEvent.target
        if (targetElement) {
            if ((targetElement instanceof HTMLInputElement && !nonTextInputTypes.has((targetElement.getAttribute('type') || '').toLowerCase())) ||
                targetElement instanceof HTMLTextAreaElement) {

                const textInputElement = targetElement as HTMLInputElement | HTMLTextAreaElement

                let elementReference = this.elementReferences.get(textInputElement)
                if (!elementReference) {
                    elementReference = getEventTime()
                    this.elementReferences.set(textInputElement, elementReference)
                }

                const event = createTextCaptureEvent(textInputElement.value, textInputElement.type, this.windowReference, this.windowLocationReferenceSupplier(), elementReference)
                this.eventConsumer(event)
            }
        }
    }
}

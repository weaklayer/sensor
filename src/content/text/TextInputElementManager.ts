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

import { TextInputElement } from "./TextInputElement"
import { TextInputEvent } from "../../common/events/TextInputEvent"

// Filter on input types that don't take text
// This provides the benefit of new input types being tacked by default
const nonTextInputTypesArray = ['button', 'checkbox', 'color', 'file', 'image', 'radio', 'range', 'reset', 'submit']
const nonTextInputTypes: Set<string> = new Set<string>()
nonTextInputTypesArray.forEach(nonTextInputType => {
    nonTextInputTypes.add(nonTextInputType.toLowerCase())
});

export class TextInputElementManager {
    private readonly listenedElements: Map<HTMLInputElement | HTMLTextAreaElement, TextInputElement> =
        new Map<HTMLInputElement | HTMLTextAreaElement, TextInputElement>()

    private readonly textInputEventConsumer: (e: TextInputEvent) => void
    private readonly windowLocationEventTimestampProducer: () => number

    constructor(windowLocationEventTimestampProducer: () => number, textInputEventConsumer: (e: TextInputEvent) => void) {
        this.textInputEventConsumer = textInputEventConsumer
        this.windowLocationEventTimestampProducer = windowLocationEventTimestampProducer
    }

    processNode(node: Node) {

        if ((node instanceof HTMLInputElement && !nonTextInputTypes.has((node.getAttribute('type') || '').toLowerCase())) ||
            node instanceof HTMLTextAreaElement) {

            const textInput = node as HTMLInputElement | HTMLTextAreaElement

            if (!this.listenedElements.has(textInput)) {
                const elementData: TextInputElement = new TextInputElement(textInput, () => this.windowLocationEventTimestampProducer(), (e) => this.textInputEventConsumer(e))
                this.listenedElements.set(textInput, elementData)
            }
        }
    }
}


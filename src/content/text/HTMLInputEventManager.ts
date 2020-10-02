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

import { ElementRegistry } from "../ElementRegistry"

// Filter the input elements that don't take text
const nonTextInputTypesArray = ['button', 'checkbox', 'color', 'file', 'image', 'radio', 'range', 'reset', 'submit']
const nonTextInputTypes: Set<string> = new Set<string>()
nonTextInputTypesArray.forEach(nonTextInputType => {
    nonTextInputTypes.add(nonTextInputType.toLowerCase())
})

export class HTMLInputEventManager {

    private readonly textConsumerFunc: (text: string, textType: string, targetReference: number) => void

    private readonly elementRegistry: ElementRegistry

    constructor(textConsumerFunc: (text: string, textType: string, targetReference: number) => void, elementRegistry: ElementRegistry) {
        this.textConsumerFunc = textConsumerFunc
        this.elementRegistry = elementRegistry
    }

    handleInputEvent(inputEvent: InputEvent) {
        if (!inputEvent.isTrusted) {
            return
        }

        const targetElement = inputEvent.target
        if (targetElement) {
            if ((targetElement instanceof HTMLInputElement && !nonTextInputTypes.has(targetElement.type.toLowerCase())) ||
                targetElement instanceof HTMLTextAreaElement) {

                const textInputElement = targetElement as HTMLInputElement | HTMLTextAreaElement
                this.textConsumerFunc(textInputElement.value, textInputElement.type, this.elementRegistry.getElementReference(textInputElement))
            }
        }
    }
}

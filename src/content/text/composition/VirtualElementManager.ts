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

import { VirtualTextAreaElement } from "./VirtualTextAreaElement"
import { getEventTime } from "../../../common/events/Event"
import { ElementRegistry } from "../../ElementRegistry"
import { VirtualElementFocus } from "./VirtualElementFocus"

export class VirtualElementManager {
    // This class contains the logic for deciding when to create new virtual elements
    // and deciding which virtual elements to apply composition events to.
    // Currently we apply every event to all virtual elements

    private readonly virtualElements: Array<VirtualTextAreaElement> = new Array<VirtualTextAreaElement>()

    private readonly virtualElementReferences: Map<VirtualTextAreaElement, number> = new Map<VirtualTextAreaElement, number>()

    private readonly virtualElementFocus: VirtualElementFocus

    private readonly textConsumerFunc: (text: string, textType: string, targetReference: number) => void

    constructor(elementRegistry: ElementRegistry, textConsumerFunc: (text: string, textType: string, targetReference: number) => void) {
        this.virtualElementFocus = new VirtualElementFocus(elementRegistry)
        this.textConsumerFunc = textConsumerFunc
    }

    keyboardEvent(event: KeyboardEvent) {
        if (event.isTrusted) {
            this.makeNewElement(event.target)

            for (let element of this.virtualElements) {
                element.keyboard(event)
                this.textConsumerFunc(element.value(), 'composite', this.getVirtualElementReference(element))
            }
        }
    }

    clipboardEvent(event: ClipboardEvent) {
        if (event.isTrusted) {
            this.makeNewElement(event.target)

            for (let element of this.virtualElements) {
                element.clipboard(event)
                this.textConsumerFunc(element.value(), 'composite', this.getVirtualElementReference(element))
            }
        }
    }

    dragEvent(event: DragEvent) {
        if (event.isTrusted) {
            this.makeNewElement(event.target)

            for (let element of this.virtualElements) {
                element.drag(event)
                this.textConsumerFunc(element.value(), 'composite', this.getVirtualElementReference(element))
            }
        }
    }

    private makeNewElement(target: EventTarget | null) {
        if (this.virtualElementFocus.hasFocusChanged(target)) {
            const newElem = new VirtualTextAreaElement()
            this.virtualElements.push(newElem)
            this.virtualElementReferences.set(newElem, getEventTime())
        }
    }

    private getVirtualElementReference(virtualElement: VirtualTextAreaElement): number {
        let reference = this.virtualElementReferences.get(virtualElement)
        if (!reference) {
            reference = getEventTime()
            this.virtualElementReferences.set(virtualElement, reference)
        }
        return reference
    }

}

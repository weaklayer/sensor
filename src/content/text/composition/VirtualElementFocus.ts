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

import { getEventTime } from "../../../common/events/Event"
import { ElementRegistry } from "../../ElementRegistry"

export class VirtualElementFocus {

    private readonly focusAttentionIntervalMicros: number

    private readonly elementRegistry: ElementRegistry

    private lastFocusEventTime: number = 0
    private lastElementReference: number = 0

    constructor(elementRegistry: ElementRegistry, focusAttentionIntervalMicros: number = 5000000) {
        this.focusAttentionIntervalMicros = focusAttentionIntervalMicros
        this.elementRegistry = elementRegistry
    }

    hasFocusChanged(targetElement: EventTarget | null): boolean {
        let hasFocusChangedAnswer = false

        const elementReference = this.getElementReference(targetElement)
        const now = getEventTime()

        const diff = now - this.lastFocusEventTime

        if (diff > this.focusAttentionIntervalMicros || elementReference !== this.lastElementReference) {
            hasFocusChangedAnswer = true
        }
        this.lastFocusEventTime = now
        this.lastElementReference = elementReference

        return hasFocusChangedAnswer
    }

    private getElementReference(targetElement: EventTarget | null): number {
        let elementReference = 0
        if (targetElement) {
            elementReference = this.elementRegistry.getElementReference(targetElement)
        }
        return elementReference
    }
}

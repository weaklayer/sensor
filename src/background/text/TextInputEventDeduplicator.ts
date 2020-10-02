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

import { TextInputEvent } from "../../common/events/TextInputEvent"

export class TextInputEventDeduplicator {

    // When html input elements are used, the same text input events are 
    // generated twice. Once as an input element capture and the other as 
    // a virtual input element capture

    private readonly discardTimers: Map<number, number> = new Map<number, number>()
    private readonly seenHashes: Map<number, Set<string>> = new Map<number, Set<string>>()

    private readonly windowLocationDiscardMillis: number
    private readonly inputEventConsumer: (textInputEvent: TextInputEvent) => void


    constructor(inputEventConsumer: (textInputEvent: TextInputEvent) => void, windowLocationDiscardMillis: number = 10000) {
        this.windowLocationDiscardMillis = windowLocationDiscardMillis
        this.inputEventConsumer = inputEventConsumer
    }

    async processTextInput(event: TextInputEvent): Promise<void> {

        if (event.inputType === 'unknown' || event.inputType === 'composite') {
            // pause and give events of known input type a chance to make it first
            await new Promise(resolve => setTimeout(resolve, 1000))
        }

        const windowLocationReference: number = event.windowLocationReference

        let seenHashes: Set<string> | undefined = this.seenHashes.get(windowLocationReference)
        if (!seenHashes) {
            seenHashes = new Set<string>()
            this.seenHashes.set(windowLocationReference, seenHashes)
        }

        let discardTimer: number | undefined = this.discardTimers.get(windowLocationReference)
        if (discardTimer) {
            window.clearTimeout(discardTimer)
        }
        this.discardTimers.set(windowLocationReference, window.setTimeout(() => this.discard(windowLocationReference), this.windowLocationDiscardMillis))

        if (!seenHashes.has(event.textHash)) {
            seenHashes.add(event.textHash)
            this.inputEventConsumer(event)
        }
    }

    private discard(windowLocationReference: number): void {

        let discardTimer: number | undefined = this.discardTimers.get(windowLocationReference)
        if (discardTimer) {
            window.clearTimeout(discardTimer)
        }

        this.seenHashes.delete(windowLocationReference)
    }
}

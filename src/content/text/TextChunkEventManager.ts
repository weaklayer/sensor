// SPDX-License-Identifier: AGPL-3.0-or-later

import { getEventTime } from "../../common/events/Event"

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

export class TextChunkEventManager {

    // Events that move around text chunks
    // Should be handled in their own right
    // Drags are especially noisy. 
    // They get squelched in here.

    private readonly seenStrings: Set<string> = new Set<string>()

    private readonly textConsumerFunc: (text: string, textType: string, elementReference: number) => void

    constructor(textConsumerFunc: (text: string, textType: string, elementReference: number) => void) {
        this.textConsumerFunc = textConsumerFunc
    }

    handleDragEvent(event: DragEvent) {
        if (!event.isTrusted) {
            return
        }

        const dragText = event.dataTransfer?.getData("text")
        if (dragText) {
            if (event.type === 'drop') {
                this.handle(dragText, TextChunkEventManager.getTextType(event.target))
            } else {
                // We put unknown for the text type of drags (not drops)
                // The fact that text was dragged over a target doesn't indicate the type of text
                // Pasting / dropping into an element does
                this.handle(dragText, 'unknown')
            }
        }
    }

    handlePasteEvent(event: ClipboardEvent) {
        if (!event.isTrusted) {
            return
        }

        const clipboardText = event.clipboardData?.getData("text")
        if (clipboardText) {
            this.handle(clipboardText, TextChunkEventManager.getTextType(event.target))
        }
    }

    private handle(text: string, textType: string) {
        if (!this.seenStrings.has(text)) {
            this.seenStrings.add(text)


            // Also use new element reference because we don't want this capture to be correlated with anything else
            this.textConsumerFunc(text, textType, getEventTime())
        }
    }

    private static getTextType(targetElement: EventTarget | null): string {

        let textType = 'unknown'

        if (targetElement && (targetElement instanceof HTMLInputElement || targetElement instanceof HTMLTextAreaElement)) {
            textType = targetElement.type
        }

        return textType
    }
}